"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu, Info, HardDrive, Zap, Download, Star, ChevronRight,
  CheckCircle2, AlertTriangle, XCircle, Monitor, Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { WebLLMRunner } from "@/components/webllm-runner";
import { webllmModels, type WebLLMModel } from "@/lib/models/webllm-models";
import { checkWebGPUCapabilities, formatVRAM, type WebGPUCapabilities } from "@/lib/webgpu";
import { cn } from "@/lib/utils";

type FilterType = "all" | "small" | "medium" | "code" | "chat" | "reasoning";

interface ModelState {
  downloadProgress: number | undefined;
  isLoading: boolean;
  isLoaded: boolean;
}

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function CompactWebGPUStatus({ caps }: { caps: WebGPUCapabilities | null }) {
  if (!caps) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div className="h-3 w-3 border border-primary border-t-transparent rounded-full animate-spin" />
        Checking WebGPU...
      </div>
    );
  }
  const ok = caps.supported && caps.webAssemblySupported && caps.sharedArrayBufferSupported;
  return (
    <div className="flex items-center gap-4 text-xs">
      <div className={cn("flex items-center gap-1.5 font-medium", ok ? "text-emerald-500" : "text-amber-500")}>
        {ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
        {ok ? "WebGPU Ready" : "WebGPU Limited"}
      </div>
      {caps.supported && caps.adapterName !== "Unknown" && (
        <span className="text-muted-foreground hidden sm:block">{caps.adapterName}</span>
      )}
      {caps.supported && caps.estimatedVRAM !== null && (
        <span className="text-muted-foreground hidden md:block">{formatVRAM(caps.estimatedVRAM)} VRAM</span>
      )}
      {!caps.supported && (
        <span className="text-muted-foreground">CPU fallback (WebAssembly)</span>
      )}
    </div>
  );
}

export default function WebLLMPage() {
  const t = useTranslations("webllm");
  const mt = useTranslations("models");
  const locale = useLocale();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [modelStates, setModelStates] = useState<Record<string, ModelState>>({});
  const [engines, setEngines] = useState<Record<string, unknown>>({});
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [webgpuCaps, setWebgpuCaps] = useState<WebGPUCapabilities | null>(null);
  const [webgpuSupported, setWebgpuSupported] = useState<boolean | null>(null);

  useEffect(() => {
    checkWebGPUCapabilities().then((caps) => {
      setWebgpuCaps(caps);
      setWebgpuSupported(
        caps.supported && caps.webAssemblySupported && caps.sharedArrayBufferSupported
      );
    });
  }, []);

  const filteredModels = webllmModels.filter((model) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "small") return model.sizeMB < 2000;
    if (activeFilter === "medium") return model.sizeMB >= 2000 && model.sizeMB < 5000;
    if (activeFilter === "code") return model.category.includes("code");
    if (activeFilter === "chat") return model.category.includes("chat");
    if (activeFilter === "reasoning") return model.category.includes("reasoning");
    return true;
  });

  const isModelCompatible = useCallback((model: WebLLMModel) => {
    if (webgpuSupported === false && model.minVramMB > 2048) {
      return { compatible: false, reason: "WebGPU not available." };
    }
    return { compatible: true };
  }, [webgpuSupported]);

  const handleInstall = useCallback(async (model: WebLLMModel) => {
    setModelStates((prev) => ({
      ...prev,
      [model.id]: { downloadProgress: 0, isLoading: true, isLoaded: false },
    }));
    try {
      const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
      const engine = await CreateMLCEngine(model.id, {
        initProgressCallback: (progress: { progress: number }) => {
          setModelStates((prev) => ({
            ...prev,
            [model.id]: { downloadProgress: progress.progress * 100, isLoading: true, isLoaded: false },
          }));
        },
      });
      setEngines((prev) => ({ ...prev, [model.id]: engine }));
      setModelStates((prev) => ({
        ...prev,
        [model.id]: { downloadProgress: 100, isLoading: false, isLoaded: true },
      }));
      setActiveModelId(model.id);
    } catch (err) {
      console.error("Model load failed:", err);
      setModelStates((prev) => ({
        ...prev,
        [model.id]: { downloadProgress: undefined, isLoading: false, isLoaded: false },
      }));
    }
  }, []);

  const handleUnload = useCallback((modelId: string) => {
    setModelStates((prev) => ({
      ...prev,
      [modelId]: { downloadProgress: undefined, isLoading: false, isLoaded: false },
    }));
    setEngines((prev) => {
      const next = { ...prev };
      delete next[modelId];
      return next;
    });
    if (activeModelId === modelId) setActiveModelId(null);
  }, [activeModelId]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "small", label: t("filterSmall") },
    { key: "medium", label: t("filterMedium") },
    { key: "chat", label: t("filterChat") },
    { key: "code", label: t("filterCode") },
    { key: "reasoning", label: "Reasoning" },
  ];

  const activeModel = webllmModels.find((m) => m.id === activeModelId);
  const activeState = activeModelId ? modelStates[activeModelId] : undefined;

  return (
    <div className="min-h-screen">
      {/* ── Top: Page header ── */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
                <Cpu className="h-3 w-3" />
                WebLLM · MLC AI
              </Badge>
              <h1 className="font-bold text-lg hidden sm:block gradient-text">{t("title")}</h1>
            </div>
            <CompactWebGPUStatus caps={webgpuCaps} />
          </div>
        </div>
      </div>

      {/* ── Top: Device specs bar ── */}
      {webgpuCaps && (
        <div className="border-b border-border/30 bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-6 flex-wrap text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                <span className="font-medium">WebGPU:</span>
                {webgpuCaps.supported
                  ? <span className="text-emerald-500">{locale === "tr" ? "Destekleniyor" : "Supported"}</span>
                  : <span className="text-amber-500">{locale === "tr" ? "Desteklenmiyor" : "Not Supported"}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                <Monitor className="h-3 w-3" />
                <span className="font-medium">VRAM:</span>
                <span>{webgpuCaps.estimatedVRAM !== null ? formatVRAM(webgpuCaps.estimatedVRAM) : "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3 w-3" />
                <span className="font-medium">GPU:</span>
                <span>{webgpuCaps.adapterName !== "Unknown" ? webgpuCaps.adapterName : "—"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="h-3 w-3" />
                <span className="font-medium">SharedArrayBuffer:</span>
                {webgpuCaps.sharedArrayBufferSupported
                  ? <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  : <XCircle className="h-3 w-3 text-destructive" />}
              </div>
              {webgpuCaps.vendor !== "Unknown" && (
                <div className="flex items-center gap-1.5">
                  <HardDrive className="h-3 w-3" />
                  <span className="font-medium">Vendor:</span>
                  <span>{webgpuCaps.vendor}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Main 2-column layout ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Left: Model list sidebar ── */}
          <aside className="w-64 xl:w-72 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
            {/* Filter pills */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {locale === "tr" ? "Filtrele" : "Filter"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150",
                      activeFilter === f.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model count */}
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              {filteredModels.length} {locale === "tr" ? "model" : "models"}
            </p>

            {/* AnimatedList model items */}
            <div className="space-y-1.5">
              {filteredModels.map((model, i) => {
                const state = modelStates[model.id];
                const compat = isModelCompatible(model);
                const isSelected = activeModelId === model.id;
                const isLoaded = state?.isLoaded ?? false;
                const isLoading = state?.isLoading ?? false;

                return (
                  <motion.button
                    key={model.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.035, duration: 0.25, ease: "easeOut" }}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                    onClick={() => setActiveModelId(model.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-card border-border hover:border-primary/30 hover:bg-primary/5",
                      !compat.compatible && "opacity-50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{model.companyLogo}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold truncate", isSelected ? "text-primary" : "")}>
                          {model.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatSize(model.sizeMB)}</p>
                      </div>
                      <div className="shrink-0 ml-auto">
                        {isLoaded && <span className="w-2 h-2 rounded-full bg-emerald-500 block" />}
                        {isLoading && <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />}
                        {!isLoaded && !isLoading && isSelected && (
                          <ChevronRight className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </div>
                    {isLoading && state?.downloadProgress !== undefined && (
                      <Progress value={state.downloadProgress} className="h-0.5 mt-1.5" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </aside>

          {/* ── Right: Model detail / Chat ── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeModel && activeState?.isLoaded ? (
                /* ── Chat interface ── */
                <motion.div
                  key={`chat-${activeModel.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
                    <span className="text-3xl">{activeModel.companyLogo}</span>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">{activeModel.name}</h2>
                      <p className="text-xs text-muted-foreground">{activeModel.company} · {activeModel.parameters} · {activeModel.quantization}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto text-xs hover:border-destructive/50 hover:text-destructive transition-colors"
                      onClick={() => handleUnload(activeModel.id)}
                    >
                      {mt("unload")}
                    </Button>
                  </div>
                  <WebLLMRunner
                    modelId={activeModel.id}
                    modelName={activeModel.name}
                    isLoaded={true}
                    engine={engines[activeModel.id] ?? null}
                  />
                </motion.div>

              ) : activeModel ? (
                /* ── Model detail card (not yet loaded) ── */
                <motion.div
                  key={`detail-${activeModel.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Model header card */}
                  <div className="rounded-2xl border bg-card p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-2xl bg-muted shrink-0">
                        {activeModel.companyLogo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h2 className="font-bold text-xl leading-tight mb-0.5">{activeModel.name}</h2>
                            <p className="text-sm text-muted-foreground">{activeModel.company}</p>
                          </div>
                          {activeModel.badge && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {activeModel.badge === "popular" ? "🔥 Popular" : activeModel.badge === "new" ? "✨ New" : "⭐ Recommended"}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {activeModel.category.map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs capitalize">{cat}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {locale === "tr" ? activeModel.description.tr : activeModel.description.en}
                    </p>

                    {/* Specs grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        { icon: <HardDrive className="h-4 w-4" />, label: locale === "tr" ? "Boyut" : "Size", value: formatSize(activeModel.sizeMB) },
                        { icon: <Cpu className="h-4 w-4" />, label: locale === "tr" ? "Parametre" : "Params", value: activeModel.parameters },
                        { icon: <Zap className="h-4 w-4" />, label: "VRAM", value: formatSize(activeModel.minVramMB) },
                        { icon: <Info className="h-4 w-4" />, label: "License", value: activeModel.license },
                      ].map((spec, idx) => (
                        <div key={idx} className="bg-muted/40 rounded-xl p-3 text-center border border-border/30 hover:border-primary/20 transition-colors">
                          <div className="flex justify-center mb-1 text-primary">{spec.icon}</div>
                          <p className="text-xs text-muted-foreground">{spec.label}</p>
                          <p className="text-xs font-semibold mt-0.5 truncate" title={spec.value}>{spec.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Advantages */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-foreground">
                        <Star className="h-3.5 w-3.5 text-primary" />
                        {locale === "tr" ? "Avantajlar" : "Advantages"}
                      </p>
                      <ul className="space-y-1">
                        {(locale === "tr" ? activeModel.advantages.tr : activeModel.advantages.en).map((adv, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5 shrink-0">•</span>
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Use cases */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold mb-2 text-foreground">
                        {locale === "tr" ? "Kullanım Alanları" : "Use Cases"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(locale === "tr" ? activeModel.useCases.tr : activeModel.useCases.en).map((uc, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{uc}</span>
                        ))}
                      </div>
                    </div>

                    {/* Install / Progress */}
                    {activeState?.isLoading ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{mt("downloading")}</span>
                          <span>{(activeState.downloadProgress ?? 0).toFixed(0)}%</span>
                        </div>
                        <Progress value={activeState.downloadProgress ?? 0} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">{mt("installWarning")}</p>
                      </div>
                    ) : (
                      <Button
                        className="w-full gap-2 h-10"
                        disabled={!isModelCompatible(activeModel).compatible}
                        onClick={() => handleInstall(activeModel)}
                      >
                        <Download className="h-4 w-4" />
                        {mt("install")} ({formatSize(activeModel.sizeMB)})
                      </Button>
                    )}
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2.5 text-sm bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-primary">{t("about")}: </span>
                      <span className="text-muted-foreground text-xs">{t("aboutText")}</span>
                    </div>
                  </div>
                </motion.div>

              ) : (
                /* ── Welcome / empty state ── */
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[480px] text-center px-4"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl mb-6"
                  >
                    🤖
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 gradient-text">
                    {locale === "tr" ? "Bir model seçin" : "Select a model"}
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                    {locale === "tr"
                      ? "Soldaki listeden bir model seçin, ardından indirip tarayıcınızda çalıştırın. Sunucu gerekmez."
                      : "Pick a model from the list on the left, then download and run it in your browser. No server needed."}
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
                    {[
                      { emoji: "🔒", text: locale === "tr" ? "Tam Gizlilik" : "Full Privacy" },
                      { emoji: "⚡", text: locale === "tr" ? "WebGPU Hızı" : "WebGPU Speed" },
                      { emoji: "🌐", text: locale === "tr" ? "Açık Kaynak" : "Open Source" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="glass rounded-xl p-3 text-center border border-border"
                      >
                        <div className="text-xl mb-1">{item.emoji}</div>
                        <p className="text-xs font-medium">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
