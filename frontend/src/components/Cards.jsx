import React from 'react';
import { Download, Video, CheckCircle, MonitorPlay, Play } from 'lucide-react';
import { getDownloadUrl } from '../api/youtube';

export const VideoCard = ({ videoData, qualities, url }) => {
  if (!videoData) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto px-4">
      <div className="bg-black/5 dark:bg-white/3 border-2 border-luxe-gold/20 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl backdrop-blur-3xl">
        
        {/* Left Side: Cinematic Preview */}
        <div className="lg:w-5/12 p-8 md:p-12 flex flex-col border-b lg:border-b-0 lg:border-r border-luxe-gold/10">
          <div className="relative rounded-[2.5rem] overflow-hidden group border-2 border-luxe-gold/10">
            <img 
              src={videoData.thumbnail} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="thumbnail" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
               <div className="p-5 bg-luxe-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                  <Play size={32} className="text-luxe-dark fill-luxe-dark" />
               </div>
            </div>
            {/* High-Fidelity Tag */}
            <div className="absolute top-4 left-4 bg-luxe-gold text-luxe-dark text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <CheckCircle size={12} /> NO WATERMARK
            </div>
          </div>

          <div className="mt-8">
            <h2 className="anton text-3xl md:text-4xl leading-none uppercase tracking-tighter">
              {videoData.title}
            </h2>
            <p className="text-luxe-gold font-black text-[10px] tracking-[0.4em] mt-4 opacity-40 uppercase italic">
              Channel: {videoData.author}
            </p>
          </div>
        </div>

        {/* Right Side: Resolution Matrix */}
        <div className="lg:w-7/12 p-8 md:p-12 bg-luxe-gold/[0.01]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="anton text-xl tracking-widest uppercase flex items-center gap-3 opacity-80">
              <MonitorPlay className="text-luxe-gold" /> SELECT QUALITY
            </h3>
            <span className="text-[9px] font-bold opacity-20 tracking-[0.3em] uppercase hidden md:block">
              Fast Server Link
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-112.5 overflow-y-auto pr-2 custom-scroll">
            {qualities.map((q) => (
              <button 
                key={q.itag}
                onClick={() => window.location.href = getDownloadUrl(url, q.itag)}
                className="group relative flex flex-col p-5 rounded-4xl border border-luxe-gold/10 bg-black/5 dark:bg-white/5 hover:border-luxe-gold transition-all duration-300 text-left active:scale-95"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-luxe-gold/10 text-luxe-gold group-hover:bg-luxe-gold group-hover:text-luxe-dark transition-all duration-300">
                    <Video size={18} />
                  </div>
                  <Download size={18} className="text-luxe-gold opacity-20 group-hover:opacity-100 group-hover:-translate-y-1 transition-all" />
                </div>

                <div>
                  <p className="anton text-xl tracking-tight leading-none group-hover:text-luxe-gold transition-colors">
                    {q.quality}
                  </p>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter mt-1">
                    {q.size} • {q.container}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-luxe-gold/5 text-center">
             <p className="text-[8px] font-black opacity-10 tracking-[0.8em] uppercase">
                Encrypted Secure Download
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};