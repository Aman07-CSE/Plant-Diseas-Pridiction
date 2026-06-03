import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, Send, Loader2, Bot, User, MessageSquarePlus,
  Stethoscope, Sparkles, Trash2, MessageCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage } from "../services/api";

const SUGGESTIONS = [
  "What causes tomato leaf blight?",
  "How to treat powdery mildew?",
  "How often should I water pepper plants?",
  "Signs of root rot in crops?",
  "Best fertiliser for healthy leaves?",
  "How do I prevent plant diseases?",
];

const WELCOME_TEXT =
  "Hello! I am **PlantDoc AI**, your plant health assistant.\n\nI can help you with:\n- Disease identification and symptoms\n- Treatment plans and remedies\n- Crop care and prevention strategies\n\nAsk me anything about your plants!";

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.1, repeat: Infinity, delay, ease: "easeInOut" }}
          className="h-2 w-2 rounded-full bg-primary-light"
        />
      ))}
    </div>
  );
}

export default function ChatbotSection() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME_TEXT, time: getTime() },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef         = useRef(null);
  const inputRef               = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg = { role: "user", content: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map(({ role, content }) => ({ role, content }));
      const data    = await sendChatMessage(msg, history);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Sorry, I could not generate a response.",
          time: getTime(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to connect to the AI server. Please make sure the backend is running and try again.",
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const clearChat = () =>
    setMessages([{ role: "assistant", content: WELCOME_TEXT, time: getTime() }]);

  const showSuggestions = messages.length <= 1;

  return (
    <div className="mx-auto w-full">

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <div className="tag-badge mx-auto mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          AI Plant Expert
        </div>
        <h2 className="section-heading">Ask anything about your plants</h2>
        <p className="section-sub mx-auto mt-4 max-w-xl">
          Chat with our Gemini-powered plant assistant for disease advice, treatment plans, and crop care guidance.
        </p>
      </motion.div>

      {/* Feature chips */}
      <div className="mb-14 grid gap-5 md:grid-cols-3 md:gap-5">
        {[
          { icon: MessageSquarePlus, title: "Smart Suggestions",  desc: "Starter prompts help you get answers instantly." },
          { icon: Stethoscope,       title: "Disease Expertise",  desc: "Deep knowledge across 38+ crop disease classes." },
          { icon: Sparkles,          title: "Gemini-Powered",     desc: "Backed by Google Gemini for accurate plant science." },
        ].map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            className="panel-card rounded-[22px] p-6 text-center md:min-h-[170px]"
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary-light ring-1 ring-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="panel-card flex h-[75vh] min-h-[520px] max-h-[760px] flex-col overflow-hidden rounded-[28px] sm:h-[640px] sm:rounded-[32px]"
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-border/60 px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary shadow-lg shadow-primary/25">
              <Bot className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-dark-card bg-success" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-text-primary">PlantDoc AI</h3>
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [1, 0.35, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-success"
                />
                <span className="text-[11px] text-text-muted">Online - Powered by Gemini LLM's</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-dark-border/60 bg-dark-surface/60 px-3 py-1 text-[11px] text-text-muted sm:block">
              {messages.length - 1} messages
            </span>
            <motion.button
              whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}
              onClick={clearChat}
              title="Clear conversation"
              className="flex items-center gap-1.5 rounded-xl border border-dark-border/60 bg-dark-surface/60 px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-danger/35 hover:text-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6 gap-1">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={"flex w-full items-end gap-3 " + (msg.role === "user" ? "flex-row-reverse" : "")}
              >
                {/* Avatar */}
                <div className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-xl " + (
                  msg.role === "user"
                    ? "bg-primary/22 text-primary-light"
                    : "bg-gradient-to-br from-primary-light to-primary text-white shadow-sm shadow-primary/25"
                )}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Leaf className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={"group flex max-w-[90%] flex-col gap-1 sm:max-w-[82%] " + (msg.role === "user" ? "items-end" : "items-start")}>
                  <div className={"rounded-2xl px-4 py-3 text-sm leading-relaxed " + (
                    msg.role === "user"
                      ? "chat-bubble-user rounded-br-sm text-text-primary"
                      : "chat-bubble-ai rounded-bl-sm text-text-secondary"
                  )}>
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                  <span className={"px-1 text-[10px] text-text-muted opacity-0 transition-opacity group-hover:opacity-100 " + (
                    msg.role === "user" ? "self-end" : "self-start"
                  )}>
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-end gap-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary text-white shadow-sm">
                  <Leaf className="h-4 w-4" />
                </div>
                <div className="chat-bubble-ai rounded-2xl rounded-bl-sm">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-dark-border/40 px-4 py-3 md:px-6"
            >
              <p className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-text-muted">
                <MessageCircle className="h-3 w-3" /> Try asking
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.055 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSend(s)}
                    className="cursor-pointer rounded-full border border-primary/28 bg-primary/9 px-3 py-1.5 text-xs font-medium text-primary-light transition-all hover:border-primary/55 hover:bg-primary/18"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div className="border-t border-dark-border/60 px-4 py-4 md:px-6">
          <div className="flex items-end gap-3">
            <div className="relative flex-1 rounded-2xl border border-dark-border/60 bg-dark-surface/70 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about plant diseases, treatment, care tips..."
                rows={1}
                className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none"
                style={{ maxHeight: "110px" }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 0 24px rgba(22,163,74,0.38)" }}
              whileTap={{ scale: 0.90 }}
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="cta-button flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white shadow-md shadow-primary/20 transition-all disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </motion.button>
          </div>
          <p className="mt-2 text-center text-[10px] text-text-muted">
            Press Enter to send - Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
}