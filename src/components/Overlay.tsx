"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { RefObject } from "react";

export default function Overlay({
  containerRef
}: {
  containerRef: RefObject<HTMLDivElement>
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Section 1: 0% scroll
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Section 2: 30% scroll
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5], [-100, 0, 100]);

  // Section 3: 60% scroll
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.5, 0.6, 0.9], [100, 0, -100]);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8">
        
        {/* Section 1 */}
        <motion.div 
          style={{ opacity: opacity1, y: y1 }}
          className="absolute flex flex-col items-center text-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-4">
            Akanksha.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-medium">Creative Developer.</p>
        </motion.div>

        {/* Section 2 */}
        <motion.div 
          style={{ opacity: opacity2, x: x2 }}
          className="absolute left-[5%] md:left-[15%] text-left max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            I build digital <br/><span className="text-white/50">experiences.</span>
          </h2>
        </motion.div>

        {/* Section 3 */}
        <motion.div 
          style={{ opacity: opacity3, x: x3 }}
          className="absolute right-[5%] md:right-[15%] text-right max-w-2xl"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            Bridging design <br/><span className="text-white/50">and engineering.</span>
          </h2>
        </motion.div>

      </div>
    </div>
  );
}
