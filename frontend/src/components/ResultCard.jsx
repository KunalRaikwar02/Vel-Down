import React, { useState } from 'react';
import { Download, Video, MonitorPlay, Play, Loader2, X, ShieldCheck } from 'lucide-react';

export const ResultCard = ({ videoData, qualities, url, onClose }) => {
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [activeItag, setActiveItag] = useState(null);

  /**
   * Handles high fidelity background download via Blob.
   * Prevents new tab opening and provides real-time feedback.
   */
  const handleDownload = async (itag) => {
    setActiveItag(itag);
    setStatus('processing');

    try {
      const downloadUrl = `http://localhost:5000/api/youtube/download?url=${encodeURIComponent(url)}&itag=${itag}`;
      
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      
      // Sanitize title for file compatibility
      const fileName = videoData.title.replace(/[^\w\s]/gi, '').substring(0, 30);
      a.download = `VelDown_${fileName}.mp4`;
      document.body.appendChild(a);
      a.click();
      
      // Memory cleanup
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);

      setStatus('success');
      
      // Reset state after UI feedback duration
      setTimeout(() => {
        setStatus('idle');
        setActiveItag(null);
      }, 4000);

    } catch (err) {
      console.error("Download Error:", err);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
        setActiveItag(null);
      }, 3000);
    }
  };

  if (!videoData) return null;

  return (
    <div className="max-w-full mx-auto relative mt-10 animate-in fade-in zoom-in-95 duration-700">
      
      {/* UI Navigation: Close Component */}
      <button 
        onClick={onClose} 
        className="absolute -top-12 right-0 bg-transparent text-[#1A120B] dark:text-[#F4ECE1] px-4 py-2 text-[11px] font-black tracking-[0.5em] border-none flex items-center gap-2 hover:opacity-50 transition-all z-50 uppercase group"
      >
        <span className="opacity-40 group-hover:opacity-100">[ CLOSE </span>
        <X size={14} className="opacity-40 group-hover:opacity-100" />
        <span className="opacity-40 group-hover:opacity-100"> ]</span>
      </button>

      {/* Primary Card Architecture */}
      <div className="bg-[#FFFDF9] dark:bg-[#1A120B] border border-[#1A120B]/10 dark:border-[#F4ECE1]/20 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row relative shadow-[0_40px_100px_rgba(0,0,0,0.08)] dark:shadow-2xl transition-colors duration-500">
        
        {/* Visual Asset: Video Thumbnail & Status Overlays */}
        <div className="lg:w-1/2 p-10 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1A120B]/5 dark:border-[#F4ECE1]/10">
          <div className="relative rounded-4xl overflow-hidden border border-[#1A120B]/5 dark:border-[#F4ECE1]/20 aspect-video lg:aspect-square group/thumb">
            <img 
              src={videoData.thumbnail} 
              className={`w-full h-full object-cover transition-all duration-1000 ${status === 'processing' ? 'scale-105 blur-md' : 'group-hover/thumb:scale-105'}`} 
              alt="thumbnail" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
               <div className="p-5 border border-white/40 backdrop-blur-md rounded-full shadow-xl">
                {status === 'processing' ? (
                  <Loader2 size={24} className="text-white animate-spin" />
                ) : status === 'success' ? (
                  <ShieldCheck size={24} className="text-green-500 animate-bounce" />
                ) : (
                  <Play size={24} className="text-white fill-white" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="anton text-2xl md:text-4xl leading-[1.1] uppercase text-[#1A120B] dark:text-[#F4ECE1] tracking-tight">
              {videoData.title}
            </h2>
            <p className="text-[#D4AF37] font-black text-[9px] tracking-[0.4em] mt-5 opacity-60 uppercase italic">
              Source: {videoData.author || "Official Content"}
            </p>
          </div>
        </div>

        {/* Interaction Layer: Quality Matrix Selection */}
        <div className="lg:w-1/2 p-10 flex flex-col justify-start bg-[#1A120B]/2 dark:bg-transparent">
          <h3 className="anton text-xl tracking-[0.2em] uppercase flex items-center gap-3 text-[#1A120B] dark:text-[#F4ECE1] mb-10 opacity-80">
            <MonitorPlay size={20} className="text-[#D4AF37]" /> Select Quality
          </h3>
          
          <div className="space-y-4 max-h-125 overflow-y-auto custom-scroll pr-4">
            {qualities && qualities.map((q) => (
              <button 
                key={q.itag} 
                disabled={status === 'processing'}
                onClick={() => handleDownload(q.itag)} 
                className={`group w-full p-6 rounded-[1.8rem] border transition-all text-left relative overflow-hidden flex items-center justify-between ${
                  activeItag === q.itag 
                  ? (status === 'success' ? 'border-green-500 bg-green-500/5' : 'border-[#D4AF37] bg-[#D4AF37]/5 scale-[0.98]') 
                  : 'border-[#1A120B]/10 dark:border-[#F4ECE1]/10 bg-white/60 dark:bg-[#F4ECE1]/5 hover:border-[#D4AF37] hover:shadow-md'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <Video size={16} className={`${activeItag === q.itag && status === 'success' ? 'text-green-500' : 'text-[#D4AF37]'} opacity-80`} />
                    <span className={`anton text-2xl ${activeItag === q.itag && status === 'success' ? 'text-green-500' : 'text-[#1A120B] dark:text-[#F4ECE1]'}`}>
                      {q.quality}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold opacity-40 text-[#1A120B] dark:text-[#F4ECE1] tracking-widest uppercase">
                    {q.size} • {q.container}
                  </span>
                </div>

                <div className={`p-3 border rounded-xl transition-all ${
                  activeItag === q.itag && status === 'success' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-[#1A120B]/10 dark:border-[#F4ECE1]/10 group-hover:border-[#D4AF37]/40'
                }`}>
                  {activeItag === q.itag && status === 'processing' ? (
                    <Loader2 size={18} className="text-[#D4AF37] animate-spin" />
                  ) : activeItag === q.itag && status === 'success' ? (
                    <ShieldCheck size={18} className="text-green-500" />
                  ) : (
                    <Download size={18} className="text-[#D4AF37] opacity-40 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                {/* Status Indicator for Active Processing */}
                {activeItag === q.itag && status === 'processing' && (
                  <div className="absolute bottom-0 left-0 h-[2.5px] bg-[#D4AF37] animate-loading-bar w-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-10 text-center opacity-30">
             <span className="text-[8px] font-black tracking-[0.6em] text-[#1A120B] dark:text-[#F4ECE1] uppercase">
                Official High-Fidelity Extraction
             </span>
          </div>
        </div>
      </div>

      {/* Component Specific Keyframes and Custom Styling */}
      <style>{`
        @keyframes loading-bar { from { width: 0%; } to { width: 100%; } }
        .animate-loading-bar { animation: loading-bar 4s linear forwards; }
        .custom-scroll::-webkit-scrollbar { width: 2px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #D4AF37; opacity: 0.5; border-radius: 10px; }
      `}</style>
    </div>
  );
};