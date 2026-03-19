import React, { useState } from 'react';
import { Download, Video, CheckCircle, MonitorPlay, Play, Loader2, ShieldCheck } from 'lucide-react';

export const VideoCard = ({ videoData, qualities, url }) => {
  const [downloadingItag, setDownloadingItag] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, loading, success

  // Executes background download via Blob to prevent new tabs
  const handleDownload = async (itag, quality) => {
    setDownloadingItag(itag);
    setDownloadStatus('loading');

    try {
      const downloadUrl = `http://localhost:5000/api/youtube/download?url=${encodeURIComponent(url)}&itag=${itag}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.body.appendChild(document.createElement('a'));
      a.href = blobUrl;
      a.download = `VelDown_${quality}_${videoData.title.substring(0, 15)}.mp4`;
      a.click();
      
      window.URL.revokeObjectURL(blobUrl);
      a.remove();

      setDownloadStatus('success');
      setTimeout(() => {
        setDownloadStatus('idle');
        setDownloadingItag(null);
      }, 4000);
    } catch (err) {
      setDownloadStatus('idle');
      setDownloadingItag(null);
    }
  };

  if (!videoData) return null;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto px-4">
      <div className="bg-black/5 dark:bg-white/3 border-2 border-luxe-gold/20 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl backdrop-blur-3xl transition-colors duration-500">
        
        {/* Cinematic Preview */}
        <div className="lg:w-5/12 p-8 md:p-12 flex flex-col border-b lg:border-b-0 lg:border-r border-luxe-gold/10">
          <div className="relative rounded-[2.5rem] overflow-hidden group border-2 border-luxe-gold/10">
            <img 
              src={videoData.thumbnail} 
              className={`w-full h-full object-cover transition-all duration-1000 ${downloadStatus === 'loading' ? 'blur-md scale-110' : 'group-hover:scale-110'}`} 
              alt="thumbnail" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
               <div className="p-5 bg-luxe-gold rounded-full shadow-lg">
                  {downloadStatus === 'loading' ? <Loader2 className="animate-spin text-luxe-dark" size={32} /> : <Play size={32} className="text-luxe-dark fill-luxe-dark" />}
               </div>
            </div>
            <div className="absolute top-4 left-4 bg-luxe-gold text-luxe-dark text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2">
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

        {/* Quality Selection Matrix */}
        <div className="lg:w-7/12 p-8 md:p-12 bg-luxe-gold/[0.01]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="anton text-xl tracking-widest uppercase flex items-center gap-3 opacity-80">
              <MonitorPlay className="text-luxe-gold" /> SELECT QUALITY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-112.5 overflow-y-auto pr-2 custom-scroll">
            {qualities.map((q) => (
              <button 
                key={q.itag}
                disabled={downloadStatus === 'loading'}
                onClick={() => handleDownload(q.itag, q.quality)}
                className={`group relative flex flex-col p-5 rounded-4xl border transition-all duration-300 text-left active:scale-95 ${downloadingItag === q.itag && downloadStatus === 'success' ? 'border-green-500 bg-green-500/5' : 'border-luxe-gold/10 bg-black/5 dark:bg-white/5 hover:border-luxe-gold'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl transition-all ${downloadingItag === q.itag && downloadStatus === 'success' ? 'bg-green-500 text-white' : 'bg-luxe-gold/10 text-luxe-gold group-hover:bg-luxe-gold group-hover:text-luxe-dark'}`}>
                    <Video size={18} />
                  </div>
                  {downloadingItag === q.itag && downloadStatus === 'loading' ? <Loader2 size={18} className="animate-spin text-luxe-gold" /> : downloadingItag === q.itag && downloadStatus === 'success' ? <ShieldCheck size={18} className="text-green-500" /> : <Download size={18} className="text-luxe-gold opacity-20 group-hover:opacity-100" />}
                </div>

                <div>
                  <p className={`anton text-xl tracking-tight leading-none transition-colors ${downloadingItag === q.itag && downloadStatus === 'success' ? 'text-green-500' : 'group-hover:text-luxe-gold'}`}>
                    {q.quality}
                  </p>
                  <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter mt-1">
                    {downloadingItag === q.itag && downloadStatus === 'success' ? 'COMPLETED' : `${q.size} • ${q.container}`}
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