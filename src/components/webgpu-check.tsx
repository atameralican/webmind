"use client";

// WebGPU uyumluluk testi bileşeni — kullanıcının cihazını test eder
// ve hangi modellerin çalışıp çalışmayacağını gösterir

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Monitor,
  Wifi,
  Zap,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { checkWebGPUCapabilities, formatVRAM, type WebGPUCapabilities } from "@/lib/webgpu";
import { cn } from "@/lib/utils";

interface CheckRowProps {
  label: string;
  supported: boolean;
  value?: string;
  icon: React.ReactNode;
}

function CheckRow({ label, supported, value, icon }: CheckRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5 text-sm">
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs text-muted-foreground">{value}</span>}
        {supported ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive" />
        )}
      </div>
    </div>
  );
}

export function WebGPUCheck() {
  const t = useTranslations("webgpu");
  const [caps, setCaps] = useState<WebGPUCapabilities | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde WebGPU kontrolü yap
    checkWebGPUCapabilities().then((result) => {
      setCaps(result);
      setIsChecking(false);
    });
  }, []);

  const isFullySupported = caps?.supported && caps?.webAssemblySupported && caps?.sharedArrayBufferSupported;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl border p-6 transition-all duration-300",
        isChecking
          ? "border-border"
          : isFullySupported
          ? "border-emerald-500/30 bg-emerald-500/5"
          : caps?.webAssemblySupported
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      {/* Başlık */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            {t("title")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>

        {/* Durum badge */}
        {!isChecking && caps && (
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 ml-4",
              isFullySupported
                ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/10"
                : "border-amber-500/50 text-amber-500 bg-amber-500/10"
            )}
          >
            {isFullySupported ? (
              <><CheckCircle2 className="h-3 w-3 mr-1" />{t("supported")}</>
            ) : (
              <><AlertTriangle className="h-3 w-3 mr-1" />{t("notSupported")}</>
            )}
          </Badge>
        )}
      </div>

      {/* Yükleniyor */}
      {isChecking && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          {t("checking")}
        </div>
      )}

      {/* Sonuçlar */}
      {!isChecking && caps && (
        <>
          <div className="space-y-0.5">
            <CheckRow
              label="WebGPU API"
              supported={caps.supported || caps.reasons.includes("noAdapter") === false}
              value={caps.adapterName !== "Unknown" ? caps.adapterName : undefined}
              icon={<Zap className="h-3.5 w-3.5" />}
            />
            <Separator className="opacity-50" />
            <CheckRow
              label={t("wasmSupported")}
              supported={caps.webAssemblySupported}
              icon={<Cpu className="h-3.5 w-3.5" />}
            />
            <Separator className="opacity-50" />
            <CheckRow
              label={t("sharedBuffer")}
              supported={caps.sharedArrayBufferSupported}
              icon={<Monitor className="h-3.5 w-3.5" />}
            />
            <Separator className="opacity-50" />
            <CheckRow
              label="Secure Context (HTTPS)"
              supported={caps.isSecureContext}
              icon={<Wifi className="h-3.5 w-3.5" />}
            />
          </div>

          {/* GPU Detayları */}
          {caps.supported && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GPU Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {caps.vendor !== "Unknown" && (
                  <div>
                    <span className="text-muted-foreground">{t("vendor")}: </span>
                    <span className="font-medium">{caps.vendor}</span>
                  </div>
                )}
                {caps.architecture !== "Unknown" && (
                  <div>
                    <span className="text-muted-foreground">{t("architecture")}: </span>
                    <span className="font-medium">{caps.architecture}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">{t("vramEstimate")}: </span>
                  <span className="font-medium">{formatVRAM(caps.estimatedVRAM)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Hata sebepleri */}
          {caps.reasons.length > 0 && (
            <div className="mt-4 space-y-2">
              {caps.reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3"
                >
                  <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{t(`reasons.${reason}` as Parameters<typeof t>[0])}</span>
                </div>
              ))}
            </div>
          )}

          {/* Öneri */}
          {!isFullySupported && (
            <div className="mt-4 flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{t("recommendation")}</p>
                <p className="text-muted-foreground mt-0.5">{t("recommendationText")}</p>
                {caps.webAssemblySupported && (
                  <p className="mt-1">{t("cpuFallback")}</p>
                )}
              </div>
            </div>
          )}

          {/* Düşük VRAM uyarısı */}
          {caps.supported && caps.estimatedVRAM !== null && caps.estimatedVRAM < 3000 && (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{t("warnLowVram")}</span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
