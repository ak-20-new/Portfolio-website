"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Overlay from "./Overlay";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  
  // You specified up to roughly 89 frames, so 90 frames (00 to 89).
  const frameCount = 90;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(2, "0");
        // Matches string literal: "frame_00_delay-0.067s.webp"
        img.src = `/sequence/frame_${frameNumber}_delay-0.067s.webp`;
        loadedImages.push(img);
    }
    setImages(loadedImages);
    
    // Attempt drawing frame 0 initially when it loads
    loadedImages[0].onload = () => {
      renderFrame(0);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const renderFrame = (index: number) => {
    if (images.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    if (!img || !img.complete) return;

    // logic for object-fit: cover implementation on canvas
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    // clear the background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the image scaled to cover
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (images.length === 0) return;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.max(0, Math.floor(latest * frameCount))
    );
    renderFrame(frameIndex);
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentFrame = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(scrollYProgress.get() * frameCount))
        );
        renderFrame(currentFrame);
      }
    };
    handleResize(); // set initial sizing
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  return (
    <section ref={containerRef} className="relative h-[500vh] w-full bg-[#121212]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <Overlay containerRef={containerRef} />
    </section>
  );
}
