"use client";

// Model kartı bileşeni — WebLLM ve Transformers.js modelleri için ortak kart
// Disabled state, tooltip açıklaması, badge ve install dialog içerir

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Download, Lock, Star, Sparkles, ChevronDown, ChevronUp,
  HardDrive, Cpu, Building2, Tag, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  name: string;
  company: string;
  companyLogo: string;
  parameters: string;
  sizeMB: number;
  minVramMB: number;
  quantization: string;
  license: string;
  category: string[];
  badge?: "popular" | "new" | "recommended";
  description: string;
  advantages: string[];
  useCases: string[];
  isCompatible: boolean;
  incompatibleReason?: string;
  downloadProgress?: number; // 0-100, undefined = not downloading
  isLoaded?: boolean;
  isLoading?: boolean;
  onInstall: () => void;
  onUnload?: () => void;
}

// MB'ı okunabilir boyuta çevir
function formatSize(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

// Badge renklerini belirle
const badgeConfig = {
  popular: { label: "🔥 Popular", className: "bg-orange-500/10 text-orange-500 border-orange-500/30" },
  new: { label: "✨ New", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
  recommended: { label: "⭐ Recommended", className: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
};

export function ModelCard({
  name, company, companyLogo, parameters, sizeMB, minVramMB,
  quantization, license, category, badge, description, advantages,
  useCases, isCompatible, incompatibleReason, downloadProgress,
  isLoaded, isLoading, onInstall, onUnload,
}: ModelCardProps) {
  const t = useTranslations("models");
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isDownloading = downloadProgress !== undefined && downloadProgress < 100 && isLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border bg-card transition-all duration-300 overflow-hidden group",
        isCompatible
          ? "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          : "opacity-60 grayscale-[30%]",
        isLoaded && "border-emerald-500/50 bg-emerald-500/5"
      )}
    >
      <div className="p-5">
        {/* Üst kısım: logo, isim, badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl bg-muted">
              {companyLogo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm leading-tight">{name}</h3>
                {badge && (
                  <Badge variant="outline" className={cn("text-xs px-1.5 py-0", badgeConfig[badge].className)}>
                    {badgeConfig[badge].label}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{company}</p>
            </div>
          </div>

          {/* Uyumsuz kilit ikonu */}
          {!isCompatible && (
            <Tooltip>
              <TooltipTrigger>
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <Lock className="h-3.5 w-3.5 text-destructive" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-48">
                <p className="text-xs">{incompatibleReason || t("disabledReason")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Yüklendi göstergesi */}
          {isLoaded && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Zap className="h-3 w-3" />
              <span className="text-xs font-medium">{t("ready")}</span>
            </div>
          )}
        </div>

        {/* Meta bilgiler */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3 w-3 shrink-0" />
            <span>{formatSize(sizeMB)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 shrink-0" />
            <span>{parameters} params</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3 shrink-0" />
            <span>{quantization}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 shrink-0" />
            <span>{license}</span>
          </div>
        </div>

        {/* Kategori etiketleri */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {category.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs px-2 py-0 capitalize">
              {cat}
            </Badge>
          ))}
          {minVramMB > 0 && (
            <Badge variant="outline" className="text-xs px-2 py-0 text-muted-foreground">
              {formatSize(minVramMB)} VRAM
            </Badge>
          )}
        </div>

        {/* Açıklama */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{description}</p>

        {/* Genişletilmiş detaylar */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mb-3"
          >
            {/* Avantajlar */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <Star className="h-3 w-3 text-primary" />
                {t("advantages")}
              </p>
              <ul className="space-y-1">
                {advantages.map((adv, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kullanım senaryoları */}
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-primary" />
                {t("useCases")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {useCases.map((uc, i) => (
                  <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                    {uc}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Genişlet/daralt butonu */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1 transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" /> Show less</>
          ) : (
            <><ChevronDown className="h-3 w-3" /> Show more</>
          )}
        </button>

        {/* İndirme progress bar */}
        {isDownloading && downloadProgress !== undefined && (
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("downloading")}</span>
              <span>{downloadProgress.toFixed(0)}%</span>
            </div>
            <Progress value={downloadProgress} className="h-1.5" />
          </div>
        )}

        {/* Butonlar */}
        <div className="mt-4 flex gap-2">
          {isLoaded ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs hover:border-destructive/50 hover:text-destructive"
              onClick={onUnload}
            >
              {t("unload")}
            </Button>
          ) : (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger>
                <Button
                  size="sm"
                  disabled={!isCompatible || isLoading}
                  className={cn(
                    "flex-1 text-xs gap-1.5",
                    !isCompatible && "cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <><div className="h-3 w-3 border border-current border-t-transparent rounded-full animate-spin" />{t("loading")}</>
                  ) : (
                    <><Download className="h-3 w-3" />{t("install")}</>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span className="text-2xl">{companyLogo}</span>
                    {t("installTitle")}
                  </DialogTitle>
                  <DialogDescription className="space-y-2 pt-2">
                    <span className="font-semibold text-foreground">{name}</span>
                    <br />
                    {t("installDescription")} <span className="font-bold text-primary">{formatSize(sizeMB)}</span>
                    <br />
                    <span className="text-amber-500 text-xs">{t("installWarning")}</span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setDialogOpen(false);
                      onInstall();
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t("confirm")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </motion.div>
  );
}
