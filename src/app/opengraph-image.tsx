import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WebMind — Run AI Models in Your Browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Arka plan accent dairesi */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 999,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
          <span style={{ color: "#a5b4fc", fontSize: 18, fontWeight: 600 }}>
            100% In-Browser AI
          </span>
        </div>

        {/* Başlık */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            background: "linear-gradient(90deg, #a5b4fc, #818cf8, #6366f1)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 20,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          WebMind
        </div>

        {/* Alt başlık */}
        <div
          style={{
            fontSize: 28,
            color: "#e2e8f0",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Run AI Models Directly in Your Browser
        </div>

        {/* Açıklama */}
        <div
          style={{
            fontSize: 18,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          WebGPU-powered • No Server • No Cloud • Complete Privacy
        </div>

        {/* Teknoloji badge'leri */}
        <div style={{ display: "flex", gap: 16 }}>
          {["WebLLM", "Transformers.js", "WebGPU"].map((tech) => (
            <div
              key={tech}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "10px 20px",
                color: "#cbd5e1",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
