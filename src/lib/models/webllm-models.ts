// WebLLM model tanımları — MLC AI tarafından desteklenen modeller
export type ModelCategory = "chat" | "code" | "reasoning" | "multilingual";

export interface WebLLMModel {
  id: string;
  name: string;
  company: string;
  companyLogo: string;
  parameters: string;
  sizeMB: number;
  minVramMB: number;
  quantization: string;
  category: ModelCategory[];
  license: string;
  description: { en: string; tr: string };
  advantages: { en: string[]; tr: string[] };
  useCases: { en: string[]; tr: string[] };
  badge?: "popular" | "new" | "recommended";
}

export const webllmModels: WebLLMModel[] = [
  {
    id: "Llama-3.2-1B-Instruct-q4f32_1-MLC",
    name: "Llama 3.2 1B Instruct",
    company: "Meta",
    companyLogo: "🦙",
    parameters: "1B",
    sizeMB: 800,
    minVramMB: 1024,
    quantization: "q4f32",
    category: ["chat"],
    license: "Llama 3.2 Community",
    badge: "popular",
    description: {
      en: "Meta's smallest Llama model. Ideal for devices with limited resources — phones and low-end laptops.",
      tr: "Meta'nın en küçük Llama modeli. Sınırlı kaynaklı cihazlar için ideal — telefonlar ve düşük seviyeli dizüstüler.",
    },
    advantages: { en: ["Ultra-fast inference", "Runs on mobile", "Low memory usage"], tr: ["Ultra hızlı çıkarım", "Mobilde çalışır", "Düşük bellek"] },
    useCases: { en: ["Simple Q&A", "Text completion", "Basic chat"], tr: ["Soru-cevap", "Metin tamamlama", "Sohbet"] },
  },
  {
    id: "Llama-3.2-3B-Instruct-q4f32_1-MLC",
    name: "Llama 3.2 3B Instruct",
    company: "Meta",
    companyLogo: "🦙",
    parameters: "3B",
    sizeMB: 1900,
    minVramMB: 2048,
    quantization: "q4f32",
    category: ["chat"],
    license: "Llama 3.2 Community",
    badge: "recommended",
    description: {
      en: "Sweet spot of the Llama family. Great balance between speed and intelligence.",
      tr: "Llama ailesinin denge noktası. Hız ve zeka arasında mükemmel denge.",
    },
    advantages: { en: ["Better reasoning than 1B", "Fast on most devices", "Multilingual support"], tr: ["1B'den iyi akıl yürütme", "Hızlı", "Çok dilli"] },
    useCases: { en: ["Conversational AI", "Content generation", "Translation"], tr: ["Konuşma YZ", "İçerik üretimi", "Çeviri"] },
  },
  {
    id: "Phi-3.5-mini-instruct-q4f16_1-MLC",
    name: "Phi-3.5 Mini Instruct",
    company: "Microsoft",
    companyLogo: "🪟",
    parameters: "3.8B",
    sizeMB: 2200,
    minVramMB: 2560,
    quantization: "q4f16",
    category: ["chat", "reasoning"],
    license: "MIT",
    badge: "recommended",
    description: {
      en: "Microsoft's surprisingly capable small model. Punches above its weight in reasoning and STEM.",
      tr: "Microsoft'un şaşırtıcı küçük modeli. Akıl yürütme ve STEM'de boyutunun üzerinde performans gösteriyor.",
    },
    advantages: { en: ["Best-in-class for size", "Excellent STEM", "MIT license"], tr: ["Boyutu için en iyi", "STEM'de mükemmel", "MIT lisansı"] },
    useCases: { en: ["Math problems", "Scientific analysis", "Coding tasks"], tr: ["Matematik", "Bilimsel analiz", "Kodlama"] },
  },
  {
    id: "gemma-2-2b-it-q4f32_1-MLC",
    name: "Gemma 2 2B IT",
    company: "Google",
    companyLogo: "🔷",
    parameters: "2B",
    sizeMB: 1500,
    minVramMB: 2048,
    quantization: "q4f32",
    category: ["chat"],
    license: "Gemma Terms of Use",
    description: {
      en: "Google's polished instruction-tuned 2B model. Clean, coherent outputs.",
      tr: "Google'ın işlenmiş 2B modeli. Temiz, tutarlı çıktılar.",
    },
    advantages: { en: ["Google quality tuning", "Great multilingual", "Fast inference"], tr: ["Google kalitesi", "Çok dilli", "Hızlı çıkarım"] },
    useCases: { en: ["Multilingual chat", "Content writing", "Summarization"], tr: ["Çok dilli sohbet", "İçerik yazımı", "Özetleme"] },
  },
  {
    id: "Qwen2.5-1.5B-Instruct-q4f32_1-MLC",
    name: "Qwen 2.5 1.5B Instruct",
    company: "Alibaba",
    companyLogo: "🌐",
    parameters: "1.5B",
    sizeMB: 950,
    minVramMB: 1024,
    quantization: "q4f32",
    category: ["chat", "multilingual"],
    license: "Apache 2.0",
    description: {
      en: "Alibaba's lean multilingual model. Especially strong for Chinese and Asian languages.",
      tr: "Alibaba'nın sade çok dilli modeli. Çince ve Asya dilleri için özellikle güçlü.",
    },
    advantages: { en: ["Multilingual support", "Apache 2.0", "Very compact"], tr: ["Çok dilli destek", "Apache 2.0", "Kompakt"] },
    useCases: { en: ["Multilingual apps", "Translation", "International chatbots"], tr: ["Çok dilli uygulamalar", "Çeviri", "Uluslararası botlar"] },
  },
  {
    id: "Qwen2.5-7B-Instruct-q4f16_1-MLC",
    name: "Qwen 2.5 7B Instruct",
    company: "Alibaba",
    companyLogo: "🌐",
    parameters: "7B",
    sizeMB: 4500,
    minVramMB: 6144,
    quantization: "q4f16",
    category: ["chat", "reasoning", "multilingual"],
    license: "Apache 2.0",
    description: {
      en: "Full-sized Qwen model for powerful devices. Exceptional reasoning and 100+ language support.",
      tr: "Güçlü cihazlar için tam boyutlu Qwen. Olağanüstü akıl yürütme ve 100+ dil desteği.",
    },
    advantages: { en: ["Top-tier reasoning", "100+ languages", "Strong coding"], tr: ["Üst düzey akıl yürütme", "100+ dil", "Güçlü kodlama"] },
    useCases: { en: ["Complex reasoning", "Code generation", "Research"], tr: ["Karmaşık akıl yürütme", "Kod üretimi", "Araştırma"] },
  },
  {
    id: "Mistral-7B-Instruct-v0.3-q4f16_1-MLC",
    name: "Mistral 7B Instruct v0.3",
    company: "Mistral AI",
    companyLogo: "💨",
    parameters: "7B",
    sizeMB: 4300,
    minVramMB: 5120,
    quantization: "q4f16",
    category: ["chat", "reasoning"],
    license: "Apache 2.0",
    description: {
      en: "The model that proved smaller can be better. Outperforms many larger models on benchmarks.",
      tr: "Küçüğün daha iyi olabileceğini kanıtlayan model. Kıyaslamalarda pek çok büyük modeli geçiyor.",
    },
    advantages: { en: ["Outperforms Llama 2 13B", "Sliding window attention", "Fast inference"], tr: ["Llama 2 13B'yi geçiyor", "Kayan pencere dikkati", "Hızlı"] },
    useCases: { en: ["General chat", "Code completion", "Creative writing"], tr: ["Genel sohbet", "Kod tamamlama", "Yaratıcı yazarlık"] },
  },
  {
    id: "SmolLM2-1.7B-Instruct-q4f16_1-MLC",
    name: "SmolLM2 1.7B Instruct",
    company: "Hugging Face",
    companyLogo: "🤗",
    parameters: "1.7B",
    sizeMB: 1100,
    minVramMB: 1536,
    quantization: "q4f16",
    category: ["chat"],
    license: "Apache 2.0",
    badge: "new",
    description: {
      en: "Hugging Face's own model, designed specifically for efficiency in constrained environments.",
      tr: "Hugging Face'in kendi modeli, kısıtlı ortamlarda verimlilik için tasarlandı.",
    },
    advantages: { en: ["Designed for browser", "HF ecosystem", "Excellent efficiency"], tr: ["Tarayıcı için tasarlandı", "HF ekosistemi", "Mükemmel verimlilik"] },
    useCases: { en: ["Browser AI apps", "Mobile AI", "Offline chat"], tr: ["Tarayıcı YZ", "Mobil YZ", "Çevrimdışı sohbet"] },
  },
  {
    id: "DeepSeek-R1-Distill-Qwen-1.5B-q4f32_1-MLC",
    name: "DeepSeek R1 Distill 1.5B",
    company: "DeepSeek",
    companyLogo: "🔬",
    parameters: "1.5B",
    sizeMB: 1000,
    minVramMB: 1024,
    quantization: "q4f32",
    category: ["reasoning"],
    license: "MIT",
    badge: "new",
    description: {
      en: "DeepSeek's distilled reasoning model — brings chain-of-thought to small model sizes.",
      tr: "DeepSeek'in damıtılmış akıl yürütme modeli — küçük modellere zincir düşünce getirir.",
    },
    advantages: { en: ["Chain-of-thought reasoning", "MIT license", "Excels at math & logic"], tr: ["Zincir düşünce", "MIT lisansı", "Matematik ve mantıkta iyi"] },
    useCases: { en: ["Math solving", "Logic puzzles", "Educational AI"], tr: ["Matematik", "Mantık bulmacaları", "Eğitim YZ"] },
  },
];
