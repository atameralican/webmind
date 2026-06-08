"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Info, HardDrive, Cpu, Download, Star, ChevronRight,
  FileText, ImageIcon, Mic, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TransformersRunner } from "@/components/transformers-runner";
import { transformersModels, type TransformersModel } from "@/lib/models/transformers-models";
import { cn } from "@/lib/utils";

type FilterType = "all" | "nlp" | "vision" | "audio" | "multimodal";

interface ModelState {
  downloadProgress: number | undefined;
  isLoading: boolean;
  isLoaded: boolean;
}

function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

const categoryIcons: Record<string, React.ReactNode> = {
  nlp: <FileText className="h-3 w-3" />,
  vision: <ImageIcon className="h-3 w-3" />,
  audio: <Mic className="h-3 w-3" />,
  multimodal: <Layers className="h-3 w-3" />,
};

export default function TransformersPage() {
  const t = useTranslations("transformers");
  const mt = useTranslations("models");
  const locale = useLocale();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [modelStates, setModelStates] = useState<Record<string, ModelState>>({});
  const [pipelines, setPipelines] = useState<Record<string, unknown>>({});
  const [activeModelId, setActiveModelId] = useState<string | null>(null);

  const filteredModels = transformersModels.filter((m) => {
    if (activeFilter === "all") return true;
    return m.category === activeFilter;
  });

  const handleInstall = useCallback(async (model: TransformersModel) => {
    setModelStates((prev) => ({
      ...prev,
      [model.id]: { downloadProgress: 0, isLoading: true, isLoaded: false },
    }));
    try {
      const { pipeline } = await import("@huggingface/transformers");
      // @ts-expect-error — runtime dynamic type
      const pipe = await pipeline(model.task, model.id, {
        progress_callback: (progress: { status: string; loaded?: number; total?: number }) => {
          if (progress.loaded && progress.total) {
            setModelStates((prev) => ({
              ...prev,
              [model.id]: { downloadProgress: (progress.loaded! / progress.total!) * 100, isLoading: true, isLoaded: false },
            }));
          }
        },
      });
      setPipelines((prev) => ({ ...prev, [model.id]: pipe }));
      setModelStates((prev) => ({
        ...prev,
        [model.id]: { downloadProgress: 100, isLoading: false, isLoaded: true },
      }));
      setActiveModelId(model.id);
    } catch (err) {
      console.error("Pipeline load failed:", err);
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
    setPipelines((prev) => {
      const next = { ...prev };
      delete next[modelId];
      return next;
    });
    if (activeModelId === modelId) setActiveModelId(null);
  }, [activeModelId]);

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: t("filterAll"), icon: <Layers className="h-3 w-3" /> },
    { key: "nlp", label: t("filterNlp"), icon: <FileText className="h-3 w-3" /> },
    { key: "vision", label: t("filterVision"), icon: <ImageIcon className="h-3 w-3" /> },
    { key: "audio", label: t("filterAudio"), icon: <Mic className="h-3 w-3" /> },
    { key: "multimodal", label: t("filterMultimodal"), icon: <Zap className="h-3 w-3" /> },
  ];

  const activeModel = transformersModels.find((m) => m.id === activeModelId);
  const activeState = activeModelId ? modelStates[activeModelId] : undefined;

  return (
    <div className="min-h-screen">
      {/* ── Top: Page header ── */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Zap className="h-3 w-3" />
              Transformers.js · Hugging Face
            </Badge>
            <h1 className="font-bold text-lg gradient-text">{t("title")}</h1>
          </div>
        </div>
      </div>

      {/* ── Main 2-column layout ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">

          {/* ── Left: Model list sidebar ── */}
          <aside className="w-full lg:w-64 xl:w-72 lg:shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">
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
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150",
                      activeFilter === f.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-2 font-medium">
              {filteredModels.length} {locale === "tr" ? "model" : "models"}
            </p>

            {/* AnimatedList model items */}
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {filteredModels.map((model, i) => {
                const state = modelStates[model.id];
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
                      "shrink-0 w-44 lg:w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200",
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-card border-border hover:border-primary/30 hover:bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{model.companyLogo}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold truncate", isSelected ? "text-primary" : "")}>
                          {model.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                          {categoryIcons[model.category]}
                          <span className="truncate">{locale === "tr" ? model.taskLabel.tr : model.taskLabel.en}</span>
                          <span className="px-1.5 py-0 rounded bg-muted text-muted-foreground font-medium shrink-0">
                            {formatSize(model.sizeMB)}
                          </span>
                        </div>
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

          {/* ── Right: Model detail / Runner ── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeModel && activeState?.isLoaded ? (
                /* ── Model runner ── */
                <motion.div
                  key={`runner-${activeModel.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50 flex-wrap">
                    <span className="text-3xl shrink-0">{activeModel.companyLogo}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-lg leading-tight truncate">{activeModel.name}</h2>
                      <p className="text-xs text-muted-foreground truncate">
                        {activeModel.company} · {locale === "tr" ? activeModel.taskLabel.tr : activeModel.taskLabel.en}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto shrink-0 text-xs hover:border-destructive/50 hover:text-destructive transition-colors"
                      onClick={() => handleUnload(activeModel.id)}
                    >
                      {mt("unload")}
                    </Button>
                  </div>
                  <div className="rounded-2xl border bg-card p-5">
                    <TransformersRunner
                      modelId={activeModel.id}
                      task={activeModel.task}
                      modelName={activeModel.name}
                      inputType={activeModel.inputType}
                      resultType={activeModel.resultType}
                      isLoaded={true}
                      pipeline={pipelines[activeModel.id] ?? null}
                    />
                  </div>
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
                          <Badge variant="secondary" className="text-xs capitalize">{activeModel.category}</Badge>
                          <Badge variant="outline" className="text-xs">{locale === "tr" ? activeModel.taskLabel.tr : activeModel.taskLabel.en}</Badge>
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
                        { icon: <Cpu className="h-4 w-4" />, label: locale === "tr" ? "Görev" : "Task", value: activeModel.category },
                        { icon: <Zap className="h-4 w-4" />, label: "VRAM", value: activeModel.minVramMB === 0 ? "CPU" : formatSize(activeModel.minVramMB) },
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
                      </div>
                    ) : (
                      <Button
                        className="w-full gap-2 h-10"
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
                    ⚡
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 gradient-text">
                    {locale === "tr" ? "Bir model seçin" : "Select a model"}
                  </h2>
                  <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                    {locale === "tr"
                      ? "Listeden bir Transformers.js modeli seçin. NLP, görsel, ses ve çok modlu görevler desteklenir."
                      : "Pick a Transformers.js model from the list. NLP, vision, audio and multimodal tasks supported."}
                  </p>
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-md">
                    {[
                      { icon: <FileText className="h-4 w-4" />, text: "NLP" },
                      { icon: <ImageIcon className="h-4 w-4" />, text: locale === "tr" ? "Görsel" : "Vision" },
                      { icon: <Mic className="h-4 w-4" />, text: locale === "tr" ? "Ses" : "Audio" },
                      { icon: <Layers className="h-4 w-4" />, text: locale === "tr" ? "Çok Modlu" : "Multimodal" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="glass rounded-xl p-3 text-center border border-border"
                      >
                        <div className="flex justify-center mb-1 text-primary">{item.icon}</div>
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
