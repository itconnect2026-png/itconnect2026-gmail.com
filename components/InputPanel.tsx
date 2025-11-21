import React from 'react';
import { DesignCategory, DesignConfig } from '../types';
import { Wand2, Image as ImageIcon, Type as TypeIcon, Loader2 } from 'lucide-react';

interface InputPanelProps {
  config: DesignConfig;
  setConfig: React.Dispatch<React.SetStateAction<DesignConfig>>;
  onGenerateAll: () => void;
  onGenerateText: () => void;
  onGenerateImage: () => void;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({
  config,
  setConfig,
  onGenerateAll,
  onGenerateText,
  onGenerateImage,
  isGeneratingText,
  isGeneratingImage
}) => {
  
  const categories = Object.values(DesignCategory);

  const handleCategoryChange = (cat: DesignCategory) => {
    setConfig(prev => ({ ...prev, category: cat }));
  };

  const isBusy = isGeneratingText || isGeneratingImage;

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 h-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Wand2 className="text-purple-400" /> Design Studio
        </h2>
        
        {/* Category Selector */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`p-2 text-sm rounded-lg transition-all ${
                config.category === cat
                  ? 'bg-purple-600 text-white font-medium'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Topic / Brand Name</label>
            <input
              type="text"
              value={config.topic}
              onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
              placeholder="e.g., Coffee Shop, Tech Conference, Sale"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mood / Style</label>
            <input
              type="text"
              value={config.mood}
              onChange={(e) => setConfig(prev => ({ ...prev, mood: e.target.value }))}
              placeholder="e.g., Minimalist, Cyberpunk, Elegant"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <button
          onClick={onGenerateAll}
          disabled={isBusy || !config.topic}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isBusy ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
          Generate Design
        </button>
        
        <div className="grid grid-cols-2 gap-3">
           <button
            onClick={onGenerateText}
            disabled={isBusy || !config.topic}
            className="py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGeneratingText ? <Loader2 className="animate-spin w-4 h-4" /> : <TypeIcon size={16} />}
            Remix Text
          </button>
           <button
            onClick={onGenerateImage}
            disabled={isBusy || !config.topic}
            className="py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isGeneratingImage ? <Loader2 className="animate-spin w-4 h-4" /> : <ImageIcon size={16} />}
            Remix Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;