
import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { geminiService } from './services/geminiService';
import { AspectRatio, ImageResult } from './types';

const SUGGESTED_PROMPTS = [
  "Add a cinematic sunset glow to this image",
  "Transform this into a vintage 1970s film photo",
  "Remove the background and replace with a futuristic city",
  "Make this look like an oil painting",
  "Add heavy rain and moody lighting",
  "Remove the person in the background"
];

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ImageResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEdit = async () => {
    if (!sourceImage || !prompt) {
      setError("Please upload an image and provide a prompt.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Extract base64 part only
      const base64Data = sourceImage.split(',')[1];
      const resultUrl = await geminiService.editImage(base64Data, mimeType, prompt, aspectRatio);
      
      const newResult: ImageResult = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: aspectRatio,
      };

      setHistory((prev) => [newResult, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSession = () => {
    setSourceImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col selection:bg-blue-500/30">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass rounded-3xl p-6 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Create New
            </h2>

            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 group ${
                sourceImage ? 'border-blue-500/50' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*"
              />
              {sourceImage ? (
                <>
                  <img src={sourceImage} alt="Source" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-3">
                  <div className="p-4 bg-white/5 rounded-full">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">Click to upload base image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Editing Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how to edit the image... e.g., 'Add a retro filter'"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-gray-600 transition-all"
              />
              
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(suggestion)}
                    className="text-[10px] px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 border border-white/5 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Target Aspect Ratio</label>
              <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                disabled={!sourceImage || isGenerating}
                onClick={generateEdit}
                className="flex-grow py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Synthesizing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Edit
                  </>
                )}
              </button>
              <button 
                onClick={clearSession}
                className="p-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl border border-white/5 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Results Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
              Outputs
            </h2>
            <div className="text-xs text-gray-500 font-mono">{history.length} ITEMS GENERATED</div>
          </div>

          {history.length === 0 ? (
            <div className="glass rounded-3xl h-[600px] flex flex-col items-center justify-center text-center p-12 border-dashed border-2 border-white/5">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-400 mb-2">No edits yet</h3>
              <p className="text-gray-600 max-w-sm">Upload an image and provide a prompt to start synthesizing new visual content.</p>
            </div>
          ) : (
            <div className="space-y-8 pb-12">
              {history.map((item) => (
                <div key={item.id} className="glass rounded-3xl overflow-hidden group border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative aspect-auto max-h-[600px] bg-[#000] flex justify-center items-center">
                    <img 
                      src={item.url} 
                      alt={item.prompt} 
                      className="max-w-full max-h-full object-contain shadow-2xl"
                    />
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={item.url} 
                        download={`eh-gen-${item.id}.png`}
                        className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white line-clamp-2 italic">"{item.prompt}"</p>
                        <div className="flex gap-3 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                          <span>Ratio {item.aspectRatio}</span>
                          <span>•</span>
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20 text-[10px] font-bold">
                        GEMINI 2.5
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-8 px-6 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold tracking-widest">EH GEN</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="text-xs text-gray-500">© 2024 AI SYNTHESIS LABS</span>
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-400 transition-colors">API Status</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
