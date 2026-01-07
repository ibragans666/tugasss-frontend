'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCcw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper untuk tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setText('');
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4"
          >
            <Sparkles size={14} />
            A Space for Emotional Clarity
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Senandika <span className="text-blue-600">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg"
          >
            Understand the echoes of your heart and find clarity in every line you write.
          </motion.p>
        </header>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-2 border border-slate-100"
        >
          <div className="p-6">
            <textarea
              className="w-full h-48 p-4 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-400 text-slate-700"
              placeholder="Ceritakan apa yang sedang Anda pikirkan atau rasakan hari ini..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <button
              onClick={reset}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Reset"
            >
              <RefreshCcw size={20} />
            </button>
            
            <button
              onClick={handlePredict}
              disabled={loading || !text.trim()}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md",
                loading || !text.trim() 
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-200"
              )}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Mulai Analisis <Send size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8"
            >
              <div className={cn(
                "rounded-2xl p-8 border flex flex-col items-center text-center transition-colors shadow-sm",
                result.label === 1 
                  ? "bg-red-50/50 border-red-100 text-red-900" 
                  : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner",
                  result.label === 1 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                )}>
                  {result.label === 1 ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
                </div>
                
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">Analisis Selesai</h3>
                <p className="text-3xl font-bold mb-3 tracking-tight">Terdeteksi: {result.status}</p>
                <p className="text-slate-500 max-w-md leading-relaxed">
                  {result.label === 1 
                    ? "Sistem mendeteksi indikasi beban emosional yang tinggi. Jangan ragu untuk berbagi cerita dengan orang terpercaya atau tenaga profesional." 
                    : "Sistem mendeteksi nada emosional yang stabil. Tetap jaga kesehatan mental Anda dan lakukan aktivitas yang membuat Anda bahagia."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p className="mt-2 italic">Disclaimer: Alat ini bukan pengganti diagnosa medis profesional.</p>
        </footer>
      </div>
    </main>
  );
}