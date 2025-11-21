import React from 'react';
import { DesignCategory, DesignState } from '../types';
import { Download } from 'lucide-react';

interface PreviewCanvasProps {
  state: DesignState;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ state }) => {
  const { config, content, backgroundImage } = state;

  // Aspect Ratio Calculator
  const getAspectRatio = () => {
    switch (config.category) {
      case DesignCategory.BUSINESS_CARD: return 'aspect-[1.75/1]'; // Standard 3.5 x 2
      case DesignCategory.POSTER: return 'aspect-[2/3]';
      case DesignCategory.SOCIAL_MEDIA: return 'aspect-square';
      case DesignCategory.BANNER: return 'aspect-[4/1]';
      case DesignCategory.WALLPAPER: return 'aspect-[16/9]';
      default: return 'aspect-square';
    }
  };

  // Font Calculator
  const getFontFamily = () => {
    if (!content) return 'font-sans';
    switch (content.fontPairing) {
      case 'classic': return 'font-serif';
      case 'playful': return 'font-[Prompt]'; // Using Prompt as playful/modern
      case 'modern': default: return 'font-sans';
    }
  };

  if (!content && !backgroundImage) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-700">
        <p>Enter a topic and click Generate to start</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Preview: {config.category}</h3>
            {content && (
                <button className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <Download size={14} /> Download (Mock)
                </button>
            )}
        </div>

      <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-xl overflow-hidden p-4 sm:p-8">
        <div 
          id="design-canvas"
          className={`relative w-full max-w-2xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden rounded-sm ${getAspectRatio()} ${getFontFamily()}`}
          style={{
            backgroundColor: content?.primaryColor || '#1e293b',
            color: content?.secondaryColor || '#f8fafc',
          }}
        >
          {/* Background Image Layer */}
          {backgroundImage && (
            <div className="absolute inset-0 z-0">
               <img 
                 src={backgroundImage.url} 
                 alt="Generated Background" 
                 className="w-full h-full object-cover opacity-60 mix-blend-overlay"
               />
               {/* Gradient Overlay for readability */}
               <div 
                className="absolute inset-0" 
                style={{ 
                    background: `linear-gradient(to bottom right, ${content?.primaryColor || '#000'}CC, ${content?.primaryColor || '#000'}40)` 
                }} 
               />
            </div>
          )}

          {/* Content Layer */}
          {content ? (
             <div className="relative z-10 h-full w-full flex flex-col p-8 sm:p-12">
                {/* Layout varies slightly based on category logic could go here, keeping it general for now */}
                
                <div className="flex-1 flex flex-col justify-center items-start">
                    <span 
                        className="text-xs sm:text-sm uppercase tracking-widest font-bold mb-4 px-2 py-1 rounded"
                        style={{ backgroundColor: content.accentColor, color: content.primaryColor }}
                    >
                        {content.tagline}
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                        {content.headline}
                    </h1>
                    <div 
                        className="w-24 h-2 mb-6 rounded-full" 
                        style={{ backgroundColor: content.accentColor }}
                    ></div>
                </div>

                <div className="mt-auto">
                    <p className="text-sm sm:text-lg opacity-90 font-light max-w-lg leading-relaxed">
                        {content.bodyText}
                    </p>
                </div>

                {/* Decorative elements based on colors */}
                <div 
                    className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 rounded-bl-full opacity-20"
                    style={{ backgroundColor: content.secondaryColor }}
                />
             </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center h-full">
                <p className="animate-pulse text-white/50">Generating content...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Color Palette Preview */}
      {content && (
        <div className="mt-6 flex gap-4 items-center justify-center p-4 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase">Palette</span>
            <div className="flex gap-2">
                <div title="Primary" className="w-8 h-8 rounded-full border border-slate-500 shadow-sm" style={{ backgroundColor: content.primaryColor }}></div>
                <div title="Secondary" className="w-8 h-8 rounded-full border border-slate-500 shadow-sm" style={{ backgroundColor: content.secondaryColor }}></div>
                <div title="Accent" className="w-8 h-8 rounded-full border border-slate-500 shadow-sm" style={{ backgroundColor: content.accentColor }}></div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCanvas;