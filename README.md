<div align="center">
  <img src="public/logo.svg" alt="WebMind Logo" width="80" height="80" />

  # WebMind

  **Run powerful AI models directly in your browser — free, private, no server.**

  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![WebGPU](https://img.shields.io/badge/WebGPU-Powered-orange?style=for-the-badge)](https://developer.chrome.com/docs/web-platform/webgpu)
  [![Transformers.js](https://img.shields.io/badge/Transformers.js-Hugging%20Face-yellow?style=for-the-badge)](https://huggingface.co/docs/transformers.js)

</div>

---

## What is WebMind?

WebMind is an open-source platform that lets you run state-of-the-art AI models **directly in your browser** using [WebGPU](https://developer.chrome.com/docs/web-platform/webgpu) acceleration. No server, no cloud, no API keys — your data never leaves your device.

- **WebLLM** — Chat with large language models (Llama, Phi, Gemma, Qwen, Mistral) powered by [MLC AI](https://webllm.mlc.ai)
- **Transformers.js** — Run specialized AI tasks (sentiment analysis, NER, translation, image classification, speech recognition) via [Hugging Face](https://huggingface.co/docs/transformers.js)

> **Privacy first.** All inference happens on your GPU. Zero data is sent to any server.

---

## Features

| Feature | Description |
|---|---|
| 🔒 **100% Private** | All processing happens locally in your browser |
| ⚡ **WebGPU Accelerated** | Direct GPU execution via the WebGPU API |
| 🤖 **9+ LLMs** | Llama 3.2, Phi-3.5, Gemma 2, Qwen 2.5, Mistral 7B and more |
| 🧠 **12+ AI Tasks** | Sentiment, NER, QA, Translation, OCR, ASR, Image Classification |
| 🌐 **Multilingual UI** | English & Turkish interface |
| 🎨 **Dark / Light Theme** | System-aware theme switching |
| 📱 **Responsive** | Works on desktop and mobile browsers |
| 🆓 **Free & Open Source** | MIT licensed, no hidden costs |

---

## Getting Started

### Prerequisites

- **Browser:** Chrome 113+ or Edge 113+ (WebGPU required for LLMs)
- **Node.js:** 18+
- **RAM:** 4 GB+ recommended (8 GB+ for larger models)

### Installation

```bash
# Clone the repository
git clone https://github.com/atameralican/webmind.git
cd webmind

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Supported Models

### WebLLM — Large Language Models

| Model | Size | Category |
|---|---|---|
| Llama 3.2 1B Instruct | ~800 MB | Chat |
| Llama 3.2 3B Instruct | ~1.9 GB | Chat |
| Phi-3.5 Mini Instruct | ~2.2 GB | Chat, Reasoning |
| Gemma 2 2B Instruct | ~1.5 GB | Chat |
| Qwen 2.5 0.5B Instruct | ~400 MB | Chat, Multilingual |
| Mistral 7B Instruct v0.3 | ~4.1 GB | Chat |
| Phi-3.5 MoE Instruct | ~5.4 GB | Reasoning |

### Transformers.js — Specialized AI Tasks

| Model | Task | Size |
|---|---|---|
| DistilBERT Sentiment | Sentiment Analysis | 67 MB |
| BERT NER | Named Entity Recognition | 108 MB |
| DistilBERT QA | Question Answering | 67 MB |
| NLLB-200 | Translation (200 languages) | 369 MB |
| CLIP ViT-B/32 | Image Classification | 155 MB |
| Whisper Base | Speech Recognition | 77 MB |
| DETR ResNet-50 | Object Detection | 166 MB |

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) with App Router + Turbopack
- **LLM Runtime:** [@mlc-ai/web-llm](https://webllm.mlc.ai) — WebGPU LLM inference
- **AI Tasks:** [@huggingface/transformers](https://huggingface.co/docs/transformers.js) — ONNX Runtime Web
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Animations:** [Framer Motion](https://www.framer.com/motion)
- **i18n:** [next-intl](https://next-intl-docs.vercel.app) — EN / TR
- **Deployment:** [Vercel](https://vercel.com)

---

## Project Structure

```
src/
├── app/
│   └── [locale]/              # i18n routes (en / tr)
│       ├── page.tsx            # Home page
│       ├── webllm/             # WebLLM chat interface
│       ├── transformers/       # Transformers.js tasks
│       └── about/              # About page
├── components/
│   ├── webllm-runner.tsx       # LLM chat component
│   ├── transformers-runner.tsx # AI task runner
│   ├── navbar.tsx
│   └── footer.tsx
└── lib/
    ├── models/
    │   ├── webllm-models.ts
    │   └── transformers-models.ts
    └── webgpu.ts               # WebGPU capability detection
```

---

## Browser Compatibility

| Browser | WebGPU (LLMs) | WebAssembly (CPU fallback) |
|---|---|---|
| Chrome 113+ | ✅ | ✅ |
| Edge 113+ | ✅ | ✅ |
| Firefox | ⚠️ Experimental | ✅ |
| Safari | 🔄 In progress | ✅ |

---

## Privacy

- **No server-side inference** — Models run entirely in your browser
- **No data collection** — Prompts and results are never transmitted
- **No account required** — No sign-up, no API keys
- **Open source** — Verify every line of code yourself

---

## Environment Variables

```env
# Optional: Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## License

MIT © [Alican Atamer](https://github.com/atameralican)

---

<div align="center">

**[⭐ Star this repo](https://github.com/atameralican/webmind)** if you find it useful!

Made with ❤️ by [Alican Atamer](https://github.com/atameralican)

</div>
