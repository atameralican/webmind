"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Bot, User, Zap, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  tokensPerSec?: number;
}

interface WebLLMRunnerProps {
  modelId: string;
  modelName: string;
  isLoaded: boolean;
  engine: unknown; // Engine page'de oluşturuluyor, çift yükleme yok
}

export function WebLLMRunner({ modelName, isLoaded, engine }: WebLLMRunnerProps) {
  const t = useTranslations("webllm");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant running locally in the browser.");
  const [showSystem, setShowSystem] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    if (!input.trim() || !engine || isGenerating) return;

    const userMessage = input.trim();
    setInput("");
    setIsGenerating(true);

    const newMessages: Message[] = [
      ...messages,
      { role: "user" as const, content: userMessage },
    ];
    setMessages(newMessages);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      // @ts-expect-error — runtime type
      const completion = await engine.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...newMessages.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      });

      let fullContent = "";
      const startTime = Date.now();
      let tokenCount = 0;

      for await (const chunk of completion) {
        const delta = chunk.choices[0]?.delta?.content || "";
        fullContent += delta;
        tokenCount++;

        const elapsed = (Date.now() - startTime) / 1000;
        const tps = tokenCount / elapsed;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullContent,
            tokensPerSec: tps,
          };
          return updated;
        });
      }
    } catch (err) {
      console.error("Çıkarım hatası:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "An error occurred. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isLoaded || !engine) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Bot className="h-10 w-10 opacity-30" />
        <p className="text-sm text-center max-w-xs">{t("noModelLoaded")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border bg-card overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium">{modelName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowSystem(!showSystem)}
            title="System prompt"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:text-destructive"
            onClick={() => setMessages([])}
            title={t("clear")}
            disabled={messages.length === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* System prompt */}
      <AnimatePresence>
        {showSystem && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b overflow-hidden"
          >
            <div className="p-3 bg-muted/20">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">{t("system")}</p>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder={t("systemPlaceholder")}
                rows={2}
                className="w-full text-xs bg-background rounded-lg border px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mesaj listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Bot className="h-8 w-8 opacity-30" />
            <p className="text-sm">{t("chatPlaceholder")}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}

            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted rounded-tl-sm"
            )}>
              {msg.content || (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map((j) => (
                      <motion.div
                        key={j}
                        className="h-1.5 w-1.5 rounded-full bg-current"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: j * 0.1, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  {t("thinking")}
                </span>
              )}

              {msg.role === "assistant" && msg.tokensPerSec && msg.tokensPerSec > 0 && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                  <Zap className="h-2.5 w-2.5" />
                  {msg.tokensPerSec.toFixed(1)} {t("tokensPerSec")}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <Separator />

      {/* Girdi */}
      <div className="p-3 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("chatPlaceholder")}
          rows={1}
          disabled={isGenerating || !engine}
          className="flex-1 resize-none bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary max-h-32 min-h-[40px] disabled:opacity-50"
        />
        <Button
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
          onClick={sendMessage}
          disabled={!input.trim() || isGenerating || !engine}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
