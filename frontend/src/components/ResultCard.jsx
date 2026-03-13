import React, { useState } from 'react';
import { Download, Video, CheckCircle, MonitorPlay, Play, ShieldCheck, Loader2, X } from 'lucide-react';
import { getDownloadUrl } from '../api/youtube';

export const ResultCard = ({ videoData, qualities, url, onClose }) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'processing', 'success'

  if (!videoData) return null;

  const handleDownload = (itag) => {
    // 1. Processing start
    setStatus('processing'); 
    
    const downloadUrl = getDownloadUrl(url, itag);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${videoData.title}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Exactly 6 second delay
    setTimeout(() => {
      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);

    }, 6000); 
  };

  return (
    <div className="max-w-full mx-auto relative group animate-in zoom-in-95 duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute -top-14 right-0 bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full text-white/60 anton text-[10px] tracking-[0.4em] transition-all border border-white/10 flex items-center gap-2 group/close z-3000"
      >
        CLOSE <X size={14} className="group-hover/close:rotate-90 transition-transform" />
      </button>

      <div className="bg-(--bg-primary) border-2 border-luxe-gold/20 rounded-[3rem] md:rounded-[4rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] relative">
        
        {/* Left Side: Thumbnail Preview */}
        <div className="lg:w-5/12 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-luxe-gold/10">
          <div className="relative rounded-4xl md:rounded-[2.5rem] overflow-hidden group border-2 border-luxe-gold/10 shadow-lg aspect-video lg:aspect-square">
            <img 
              src={videoData.thumbnail} 
              className={`w-full h-full object-cover transition-all duration-700 ${status === 'processing' ? 'scale-110 blur-sm' : 'scale-100'}`} 
              alt="thumb" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
               <div className="p-4 bg-luxe-gold rounded-full shadow-xl">
                  {status === 'processing' ? (
                    <Loader2 size={28} className="text-coffee animate-spin" />
                  ) : (
                    <Play size={28} className="text-coffee fill-coffee" />
                  )}
               </div>
            </div>
            <div className="absolute top-4 left-4 bg-luxe-gold text-coffee text-[9px] font-black px-4 py-2 rounded-full flex items-center gap-2">
              <CheckCircle size={10} /> SECURE LINK
            </div>
          </div>
          <div className="mt-6">
            <h2 className="anton text-2xl md:text-3xl leading-none uppercase text-(--text-primary)">{videoData.title}</h2>
            <p className="text-luxe-gold font-black text-[9px] tracking-[0.4em] mt-3 opacity-40 uppercase italic">Source: {videoData.author}</p>
          </div>
        </div>

        {/* Right Side Quality Selection Matrix */}
        <div className="lg:w-7/12 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="anton text-xl tracking-widest uppercase flex items-center gap-3 opacity-80">
                <MonitorPlay className="text-luxe-gold" /> SELECT QUALITY
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-100 pr-2 custom-scroll">
              {qualities.map((q) => (
                <button 
                  key={q.itag}
                  disabled={status === 'processing'}
                  onClick={() => handleDownload(q.itag)}
                  className={`group p-4 rounded-4xl border transition-all text-left cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    ${status === 'processing' ? 'border-luxe-gold/5' : 'border-luxe-gold/10 bg-white/5 hover:border-luxe-gold'}
                  `}
                >
                  <div className="flex justify-between mb-2 items-center">
                    <div className="p-2 rounded-lg bg-luxe-gold/10 text-luxe-gold">
                      {status === 'processing' ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                    </div>
                    <Download size={16} className="text-luxe-gold opacity-30 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="anton text-lg tracking-tight group-hover:text-luxe-gold">{q.quality}</p>
                  <p className="text-[9px] font-bold opacity-30 uppercase">{q.size} • {q.container}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* SUCCESS MESSAGE */}
          <div className={`mt-8 p-5 rounded-3xl border border-green-500/20 bg-green-500/5 flex items-center justify-center gap-4 transition-all duration-700 ${status === 'success' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
            <div className="bg-green-500 rounded-full p-1 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <ShieldCheck className="text-white" size={16} />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] text-green-500 uppercase">
              Video Downloaded Successfully
            </span>
          </div>

          <p className="mt-4 text-center text-[8px] font-black opacity-10 tracking-[0.5em] uppercase">
            {status === 'processing' ? 'Encrypting Stream...' : 'Official High-Fidelity Extraction'}
          </p>
        </div>
      </div>
    </div>
  );
};