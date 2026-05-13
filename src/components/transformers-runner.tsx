"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Upload, FileText, ImageIcon, Mic, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InputType } from "@/lib/models/transformers-models";

interface TransformersRunnerProps {
  modelId: string;
  task: string;
  modelName: string;
  inputType: InputType;
  resultType: "labels" | "text" | "boxes" | "embeddings" | "audio";
  isLoaded: boolean;
  pipeline: unknown; // Pipeline page'de oluşturuluyor, çift yükleme yok
}

interface ResultLabel {
  label: string;
  score: number;
}

type RunnerResult = string | ResultLabel[] | null;

// NLLB-200 desteklenen yaygın diller
const NLLB_LANGUAGES = [
  { code: "eng_Latn", label: "English" },
  { code: "tur_Latn", label: "Türkçe" },
  { code: "fra_Latn", label: "Français" },
  { code: "deu_Latn", label: "Deutsch" },
  { code: "spa_Latn", label: "Español" },
  { code: "ita_Latn", label: "Italiano" },
  { code: "por_Latn", label: "Português" },
  { code: "rus_Cyrl", label: "Русский" },
  { code: "arb_Arab", label: "العربية" },
  { code: "zho_Hans", label: "中文 (简体)" },
  { code: "jpn_Jpan", label: "日本語" },
  { code: "kor_Hang", label: "한국어" },
  { code: "nld_Latn", label: "Nederlands" },
  { code: "pol_Latn", label: "Polski" },
  { code: "ukr_Cyrl", label: "Українська" },
];

export function TransformersRunner({
  task, inputType, isLoaded, pipeline
}: TransformersRunnerProps) {
  const t = useTranslations("transformers");
  const errT = useTranslations("errors");

  // Genel girdi state'leri
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Görev-özel state'ler
  const [questionInput, setQuestionInput] = useState(""); // question-answering: soru
  const [contextInput, setContextInput] = useState("");   // question-answering: bağlam
  const [labelsInput, setLabelsInput] = useState("");     // zero-shot: aday etiketler
  const [srcLang, setSrcLang] = useState("eng_Latn");     // translation: kaynak dil
  const [tgtLang, setTgtLang] = useState("tur_Latn");     // translation: hedef dil

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<RunnerResult>(null);
  const [error, setError] = useState<string | null>(null);

  const runModel = async () => {
    if (!pipeline) {
      setError("Model is not loaded yet. Please wait.");
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const pipe = pipeline;
      let output: RunnerResult = null;

      // Her görev tipi için ayrı handler
      if (task === "question-answering") {
        if (!questionInput.trim() || !contextInput.trim()) {
          setError("Please enter both a question and a context passage.");
          setIsRunning(false);
          return;
        }
        // @ts-expect-error — runtime call
        const rawOutput = await pipe({ question: questionInput.trim(), context: contextInput.trim() });
        output = (rawOutput as { answer?: string }).answer ?? JSON.stringify(rawOutput);

      } else if (task === "translation") {
        if (!textInput.trim()) {
          setError("Please enter text to translate.");
          setIsRunning(false);
          return;
        }
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(textInput.trim(), { src_lang: srcLang, tgt_lang: tgtLang });
        output = Array.isArray(rawOutput)
          ? ((rawOutput[0] as { translation_text?: string })?.translation_text ?? JSON.stringify(rawOutput))
          : JSON.stringify(rawOutput);

      } else if (task === "zero-shot-classification") {
        if (!textInput.trim()) {
          setError("Please enter text.");
          setIsRunning(false);
          return;
        }
        const labels = labelsInput.split(",").map((s) => s.trim()).filter(Boolean);
        if (labels.length === 0) {
          setError("Please enter at least one candidate label (comma-separated).");
          setIsRunning(false);
          return;
        }
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(textInput.trim(), labels);
        if (rawOutput && typeof rawOutput === "object" && "labels" in rawOutput && "scores" in rawOutput) {
          const { labels: rLabels, scores } = rawOutput as { labels: string[]; scores: number[] };
          output = rLabels.map((label, i) => ({ label, score: scores[i] })) as ResultLabel[];
        } else {
          output = JSON.stringify(rawOutput, null, 2);
        }

      } else if (task === "zero-shot-image-classification") {
        // CLIP: görüntü + metin etiketler
        if (!imageFile) {
          setError("Please upload an image.");
          setIsRunning(false);
          return;
        }
        const labels = textInput.split(",").map((s) => s.trim()).filter(Boolean);
        if (labels.length === 0) {
          setError("Please enter candidate labels (comma-separated).");
          setIsRunning(false);
          return;
        }
        const imageUrl = URL.createObjectURL(imageFile);
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(imageUrl, labels);
        URL.revokeObjectURL(imageUrl);
        output = Array.isArray(rawOutput) ? (rawOutput as ResultLabel[]) : JSON.stringify(rawOutput, null, 2);

      } else if (task === "automatic-speech-recognition") {
        // Whisper: AudioContext ile düzgün decode
        if (!audioFile) {
          setError("Please upload an audio file.");
          setIsRunning(false);
          return;
        }
        const arrayBuffer = await audioFile.arrayBuffer();
        const audioCtx = new AudioContext({ sampleRate: 16000 });
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        const audioData = decoded.getChannelData(0); // Float32Array PCM
        await audioCtx.close();
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(audioData);
        output = typeof rawOutput === "string"
          ? rawOutput
          : (rawOutput as { text?: string })?.text ?? JSON.stringify(rawOutput);

      } else if (inputType === "image") {
        // image-classification, object-detection, depth-estimation
        if (!imageFile) {
          setError("Please upload an image.");
          setIsRunning(false);
          return;
        }
        const imageUrl = URL.createObjectURL(imageFile);
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(imageUrl);
        URL.revokeObjectURL(imageUrl);
        if (Array.isArray(rawOutput)) {
          // object-detection'da {label, score, box} formatı var — normalize et
          output = (rawOutput as Array<{ label?: string; score?: number; entity?: string }>).map((item) => ({
            label: item.label ?? item.entity ?? "?",
            score: item.score ?? 0,
          })) as ResultLabel[];
        } else {
          output = JSON.stringify(rawOutput, null, 2);
        }

      } else {
        // Genel metin görevleri: sentiment-analysis, summarization, token-classification, text2text-generation
        if (!textInput.trim()) {
          setError("Please enter some text.");
          setIsRunning(false);
          return;
        }
        // @ts-expect-error — runtime call
        const rawOutput = await pipe(textInput.trim());

        if (Array.isArray(rawOutput)) {
          const first = rawOutput[0];
          if (typeof first === "object" && first !== null) {
            if ("label" in first && "score" in first) {
              output = rawOutput as ResultLabel[];
            } else if ("entity" in first) {
              // NER token-classification
              output = (rawOutput as Array<{ entity: string; score: number; word?: string }>).map((item) => ({
                label: `${item.entity}${item.word ? `: ${item.word}` : ""}`,
                score: item.score,
              })) as ResultLabel[];
            } else if ("generated_text" in first) {
              output = (first as { generated_text: string }).generated_text;
            } else if ("summary_text" in first) {
              output = (first as { summary_text: string }).summary_text;
            } else if ("translation_text" in first) {
              output = (first as { translation_text: string }).translation_text;
            } else {
              output = JSON.stringify(rawOutput, null, 2);
            }
          } else {
            output = JSON.stringify(rawOutput, null, 2);
          }
        } else if (typeof rawOutput === "string") {
          output = rawOutput;
        } else {
          output = JSON.stringify(rawOutput, null, 2);
        }
      }

      setResult(output);
    } catch (err) {
      console.error("Inference hatası:", err);
      setError(errT("inference"));
    } finally {
      setIsRunning(false);
    }
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError(errT("fileSize")); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, [errT]);

  const handleAudioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
  }, []);

  // Hangi UI bölümleri gösterilecek
  const isQA = task === "question-answering";
  const isTranslation = task === "translation";
  const isZeroShotText = task === "zero-shot-classification";
  const isZeroShotImage = task === "zero-shot-image-classification"; // CLIP
  const needsText = !isQA && (inputType === "text" || isZeroShotImage);
  const needsImage = inputType === "image" || isZeroShotImage;
  const needsAudio = inputType === "audio";

  // Çalıştır butonunun disabled durumu
  const canRun = (() => {
    if (isQA) return questionInput.trim().length > 0 && contextInput.trim().length > 0;
    if (isZeroShotImage) return imageFile !== null && textInput.trim().length > 0;
    if (needsAudio) return audioFile !== null;
    if (needsImage) return imageFile !== null;
    return textInput.trim().length > 0;
  })();

  if (!isLoaded || !pipeline) {
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
        Model yükleniyor…
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Question-Answering: iki ayrı alan */}
      {isQA && (
        <>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Question
            </label>
            <textarea
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              placeholder="What do you want to know?"
              rows={2}
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Context (passage to search)
            </label>
            <textarea
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Paste the text passage here…"
              rows={5}
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* Translation: dil seçicileri + metin */}
      {isTranslation && (
        <>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <Languages className="h-3 w-3" />
                Source Language
              </label>
              <select
                value={srcLang}
                onChange={(e) => setSrcLang(e.target.value)}
                disabled={isRunning}
                className="w-full rounded-xl border bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              >
                {NLLB_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                <Languages className="h-3 w-3" />
                Target Language
              </label>
              <select
                value={tgtLang}
                onChange={(e) => setTgtLang(e.target.value)}
                disabled={isRunning}
                className="w-full rounded-xl border bg-muted/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              >
                {NLLB_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {t("inputText")}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={4}
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* Zero-shot classification: metin + aday etiketler */}
      {isZeroShotText && (
        <>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {t("inputText")}
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t("inputPlaceholder")}
              rows={3}
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Candidate Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="news, sports, technology, politics…"
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* CLIP (zero-shot-image-classification): görüntü + etiket metni */}
      {isZeroShotImage && (
        <>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {t("inputImage")}
            </label>
            <label className={cn(
              "flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
              imageFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isRunning} />
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="h-6 w-6 opacity-50" />
                  <span className="text-xs">{t("uploadImage")}</span>
                </div>
              )}
            </label>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Candidate Labels (comma-separated)
            </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="cat, dog, person, car, tree…"
              disabled={isRunning}
              className="w-full rounded-xl border bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </>
      )}

      {/* Genel metin girişi */}
      {needsText && !isZeroShotImage && !isZeroShotText && !isTranslation && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {t("inputText")}
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={4}
            disabled={isRunning}
            className="w-full rounded-xl border bg-muted/50 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>
      )}

      {/* Görüntü yükleme (genel — CLIP harici) */}
      {needsImage && !isZeroShotImage && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {t("inputImage")}
          </label>
          <label className={cn(
            "flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            imageFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/50"
          )}>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isRunning} />
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-6 w-6 opacity-50" />
                <span className="text-xs">{t("uploadImage")}</span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Ses yükleme — Whisper AudioContext ile decode edilecek */}
      {needsAudio && (
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Mic className="h-3 w-3" />
            {t("inputAudio")}
          </label>
          <label className={cn(
            "flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            audioFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
          )}>
            <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" disabled={isRunning} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Mic className={cn("h-6 w-6", audioFile ? "text-primary" : "opacity-50")} />
              <span className="text-xs">{audioFile ? audioFile.name : t("uploadAudio")}</span>
            </div>
          </label>
          <p className="text-xs text-muted-foreground mt-1.5 opacity-70">
            Audio is decoded locally via AudioContext at 16 kHz — no data sent anywhere.
          </p>
        </div>
      )}

      {/* Hata */}
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Çalıştır butonu */}
      <Button
        onClick={runModel}
        disabled={isRunning || !canRun}
        className="w-full gap-2"
        size="sm"
      >
        {isRunning ? (
          <><div className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />{t("running")}</>
        ) : (
          <><Play className="h-3.5 w-3.5" />{t("run")}</>
        )}
      </Button>

      {/* Sonuçlar */}
      <AnimatePresence>
        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-muted-foreground">{t("results")}</p>

            {Array.isArray(result) ? (
              <div className="space-y-2">
                {(result as ResultLabel[]).slice(0, 8).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs shrink-0 min-w-0 max-w-[180px] truncate">
                      {item.label}
                    </Badge>
                    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.score * 100).toFixed(0)}%` }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 w-12 text-right">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-muted/50 border p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
