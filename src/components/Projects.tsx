"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Project Alpha",
    category: "Web App",
    description: "A high-performance digital presence with smooth interactions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Beta Experience",
    category: "E-Commerce",
    description: "Redefining digital shopping with rich motion elements.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Gamma Concept",
    category: "Experimental",
    description: "Pushing the boundaries of web creative tech.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Delta Interface",
    category: "UI/UX",
    description: "A clean, functional motion-heavy design system.",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80"
  }
];

export default function Projects() {
  return (
    <section className="relative w-full min-h-screen bg-[#121212] py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-16 tracking-tighter">
            Selected Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.08] backdrop-blur-md p-6 hover:bg-white/[0.04] transition-colors duration-500 hover:border-white/[0.15] cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] mb-6 rounded-xl overflow-hidden bg-white/5">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale transition-all duration-[800ms] ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-end">
                <div className="pr-4">
                  <p className="text-xs text-white/50 mb-3 uppercase tracking-[0.2em] font-medium">
                    {project.category}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-2 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-sm">
                    {project.description}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-500 ease-out">
                  <svg className="w-5 h-5 ml-1 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19L19 5M19 5v10M19 5H9"></path></svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
