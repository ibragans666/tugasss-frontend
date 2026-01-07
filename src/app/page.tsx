'use client';
import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Deteksi Sentimen Depresi (ONNX)</h1>
        
        <textarea
          className="w-full p-4 border rounded-lg mb-4 h-40 focus:ring-2 focus:ring-blue-500 text-black"
          placeholder="Tuliskan apa yang Anda rasakan..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handlePredict}
          disabled={loading || !text}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Menganalisis...' : 'Analisis Teks'}
        </button>

        {result && (
          <div className={`mt-8 p-6 rounded-lg text-center ${result.label === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <p className="text-lg font-medium">Hasil Prediksi:</p>
            <p className="text-3xl font-bold">{result.status}</p>
          </div>
        )}
      </div>
    </main>
  );
}