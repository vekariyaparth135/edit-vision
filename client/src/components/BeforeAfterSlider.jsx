import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  rawImage,
  editedImage,
  title = 'Raw Log vs Color Graded Master',
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="w-full select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-gold/30 bg-black cursor-ew-resize group"
      >
        {/* Background Image: Edited / Graded (Full) */}
        <img
          src={editedImage}
          alt="Edited Master"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Foreground Image: Raw / Log (Clipped by sliderPosition) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={rawImage}
            alt="Raw Flat Log"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Slider Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold-light to-gold shadow-gold-lg"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Central Handle Button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-black border-2 border-gold flex items-center justify-center text-gold shadow-gold-md hover:scale-110 active:scale-95 transition-transform">
            <SlidersHorizontal className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-gray-300 border border-white/10">
            Raw Footage / LOG
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold/90 backdrop-blur-md text-black font-bold shadow-gold-sm">
            Graded & Edited
          </span>
        </div>

        {/* Drag Hint at Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase bg-black/60 backdrop-blur-md text-gold border border-gold/30">
            Drag slider left or right
          </span>
        </div>
      </div>
    </div>
  );
}

