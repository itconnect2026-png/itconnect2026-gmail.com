import React, { useState, useCallback } from 'react';
import { DesignCategory, DesignConfig, DesignState } from './types';
import { generateDesignText, generateDesignImage } from './services/geminiService';
import InputPanel from './components/InputPanel';
import PreviewCanvas from './components/PreviewCanvas';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<DesignState>({
    config: {
      category: DesignCategory.POSTER,
      topic: '',
      mood: '',
    },
    content: null,
    backgroundImage: null,
    isGeneratingText: false,
    isGeneratingImage: false,
    error: null,
  });

  const setConfig = useCallback((updater: React.SetStateAction<DesignConfig>) => {
    setState(prev => {
        const newConfig = typeof updater === 'function' ? updater(prev.config) : updater;
        return { ...prev, config: newConfig };
    });
  }, []);

  const handleGenerateText = async () => {
    if (!state.config.topic) return;
    
    setState(prev => ({ ...prev, isGeneratingText: true, error: null }));
    try {
      const content = await generateDesignText(state.config);
      setState(prev => ({ ...prev, content, isGeneratingText: false }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, error: "Failed to generate text. Please try again.", isGeneratingText: false }));
    }
  };

  const handleGenerateImage = async () => {
    if (!state.config.topic) return;

    setState(prev => ({ ...prev, isGeneratingImage: true, error: null }));
    try {
      const base64Url = await generateDesignImage(state.config);
      setState(prev => ({ 
        ...prev, 
        backgroundImage: { url: base64Url, promptUsed: state.config.topic },
        isGeneratingImage: false 
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, error: "Failed to generate image. Please try again.", isGeneratingImage: false }));
    }
  };

  const handleGenerateAll = () => {
    handleGenerateText();
    handleGenerateImage();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-500">
                <Layout size={24} />
                <h1 className="text-xl font-bold text-white tracking-tight">DesignGenie AI</h1>
            </div>
            <div className="text-xs text-slate-500 hidden sm:block">
                Powered by Google Gemini 2.5
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-7rem)]">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 xl:col-span-3 h-full overflow-y-auto no-scrollbar">
             <InputPanel 
                config={state.config}
                setConfig={setConfig}
                onGenerateAll={handleGenerateAll}
                onGenerateText={handleGenerateText}
                onGenerateImage={handleGenerateImage}
                isGeneratingText={state.isGeneratingText}
                isGeneratingImage={state.isGeneratingImage}
             />
             {state.error && (
                 <div className="mt-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-lg">
                     {state.error}
                 </div>
             )}
          </div>

          {/* Right Panel: Preview */}
          <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col">
            <PreviewCanvas state={state} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;