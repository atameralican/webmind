// WebGPU donanım uyumluluk testi için yardımcı fonksiyonlar
// Bu modül, kullanıcının cihazının WebGPU destekleyip desteklemediğini kontrol eder

export interface WebGPUCapabilities {
  supported: boolean;
  adapter: unknown;
  adapterName: string;
  vendor: string;
  architecture: string;
  device: string;
  estimatedVRAM: number | null; // MB cinsinden
  webAssemblySupported: boolean;
  sharedArrayBufferSupported: boolean;
  reasons: string[];
  isSecureContext: boolean;
}

/**
 * Kullanıcının cihazındaki VRAM'i adapter limits üzerinden tahmin eder.
 * Not: Bu kesin bir değer değil, heuristic bir tahmindir.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function estimateVRAM(adapter: any): number | null {
  try {
    const maxBuffer = adapter.limits?.maxBufferSize;
    if (maxBuffer && maxBuffer > 0) {
      return Math.round(maxBuffer / (1024 * 1024));
    }
  } catch {
    // Bazı tarayıcılar bu bilgiyi paylaşmayabilir
  }
  return null;
}

/**
 * Ana WebGPU uyumluluk kontrol fonksiyonu.
 * Tarayıcı, GPU adaptörü ve gerekli API'leri kontrol eder.
 */
export async function checkWebGPUCapabilities(): Promise<WebGPUCapabilities> {
  const reasons: string[] = [];

  // Güvenli bağlam kontrolü (HTTPS zorunlu)
  const isSecureContext = typeof window !== "undefined" && window.isSecureContext;
  if (!isSecureContext) {
    reasons.push("https");
  }

  // WebAssembly kontrolü
  const webAssemblySupported = typeof WebAssembly !== "undefined";
  if (!webAssemblySupported) {
    reasons.push("noWasm");
  }

  // SharedArrayBuffer kontrolü (çok iş parçacıklı işlemler için)
  const sharedArrayBufferSupported = typeof SharedArrayBuffer !== "undefined";
  if (!sharedArrayBufferSupported) {
    reasons.push("noSharedBuffer");
  }

  // WebGPU API kontrolü
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    reasons.push("noGpu");
    return {
      supported: false,
      adapter: null,
      adapterName: "Unknown",
      vendor: "Unknown",
      architecture: "Unknown",
      device: "Unknown",
      estimatedVRAM: null,
      webAssemblySupported,
      sharedArrayBufferSupported,
      reasons,
      isSecureContext,
    };
  }

  try {
    // GPU adaptörünü talep et
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance", // Yüksek performanslı GPU tercih et
    });

    if (!adapter) {
      reasons.push("noAdapter");
      return {
        supported: false,
        adapter: null,
        adapterName: "No Adapter Found",
        vendor: "Unknown",
        architecture: "Unknown",
        device: "Unknown",
        estimatedVRAM: null,
        webAssemblySupported,
        sharedArrayBufferSupported,
        reasons,
        isSecureContext,
      };
    }

    // Adaptör bilgilerini al (yeni spec: adapter.info, eski: requestAdapterInfo)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = (adapter as any).info || {};
    const estimatedVRAM = estimateVRAM(adapter);

    // Tüm kontroller başarılı
    return {
      supported: reasons.length === 0,
      adapter: info,
      adapterName: info.device || info.vendor || "GPU Detected",
      vendor: info.vendor || "Unknown",
      architecture: info.architecture || "Unknown",
      device: info.device || "Unknown",
      estimatedVRAM,
      webAssemblySupported,
      sharedArrayBufferSupported,
      reasons,
      isSecureContext,
    };
  } catch {
    reasons.push("noAdapter");
    return {
      supported: false,
      adapter: null,
      adapterName: "Error",
      vendor: "Unknown",
      architecture: "Unknown",
      device: "Unknown",
      estimatedVRAM: null,
      webAssemblySupported,
      sharedArrayBufferSupported,
      reasons,
      isSecureContext,
    };
  }
}

/**
 * Bir modelin kullanıcının cihazıyla uyumlu olup olmadığını kontrol eder.
 * @param minVramMB - Modelin gerektirdiği minimum VRAM (MB)
 * @param capabilities - checkWebGPUCapabilities() sonucu
 */
export function isModelCompatible(
  minVramMB: number,
  capabilities: WebGPUCapabilities
): { compatible: boolean; reason?: string } {
  if (!capabilities.supported) {
    return { compatible: false, reason: "webgpu_not_supported" };
  }

  if (capabilities.estimatedVRAM !== null && capabilities.estimatedVRAM < minVramMB) {
    return { compatible: false, reason: "insufficient_vram" };
  }

  return { compatible: true };
}

/**
 * Tahmini VRAM'i okunabilir string'e çevirir
 */
export function formatVRAM(vramMB: number | null): string {
  if (vramMB === null) return "Unknown";
  if (vramMB >= 1024) return `${(vramMB / 1024).toFixed(1)} GB`;
  return `${vramMB} MB`;
}
