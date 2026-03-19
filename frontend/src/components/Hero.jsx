import React from 'react';

/**
 * Hero component showcasing the primary value proposition with high-impact typography.
 * Includes a decorative background blur for the luxe aesthetic.
 */
export const Hero = () => (
  <div className="text-center mt-24 mb-16 relative flex flex-col items-center">
    {/* Decorative background glow */}
    <div className="absolute inset-0 -z-10 blur-[120px] scale-150 opacity-20 bg-luxe-gold/30 rounded-full"></div>
    
    <div className="flex flex-col gap-2 md:gap-4"> 
      <h1 className="anton text-[15vw] md:text-[11rem] leading-none uppercase tracking-tighter text-(--text-primary)">
        NO <span className="text-luxe-gold">LIMITS</span>
      </h1>
      <h1 className="anton text-[15vw] md:text-[11rem] leading-none uppercase tracking-tighter text-(--text-primary)">
        NO <span className="text-luxe-gold">WATERMARK</span>
      </h1>
    </div>
    
    <p className="mt-8 text-xs md:text-sm font-black tracking-[0.6em] uppercase opacity-40 max-w-lg leading-relaxed text-(--text-primary)">
      Official High-Fidelity <br className="md:hidden" /> Video Archiver
    </p>
  </div>
);