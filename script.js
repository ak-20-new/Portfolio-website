document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. SCROLLY CANVAS SEQUENCE LOGIC
    // ==========================================
    const canvas = document.getElementById("hero-canvas");
    const context = canvas.getContext("2d");
    const section = document.querySelector(".hero-sequence");
    
    // Configuration details mapped to actual folder content
    const frameCount = 120; // Actual total frames in sequence folder
    const currentFrame = index => {
        // Files are named frame_000_delay-0.066s.webp to frame_119_delay-0.066s.webp (0-indexed)
        const frameNumber = index.toString().padStart(3, "0"); 
        return `./sequence/frame_${frameNumber}_delay-0.066s.webp`;
    };

    const images = [];

    // Canvas scaling logic allowing object-fit: cover rendering
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(lastDrawnIndex); // Redraw maintaining scale
    };

    window.addEventListener("resize", resizeCanvas);

    let lastDrawnIndex = 0;
    const renderFrame = (index) => {
        if (!images[index] || !images[index].complete) return;
        lastDrawnIndex = index;
        
        const img = images[index];
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Exact mathematical equivalent of 'object-fit: cover'
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
        
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Preload loop ensuring seamless animation state
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            // Draw immediately if it's the very first frame to prevent blank screen
            if (i === 0) {
                resizeCanvas(); 
                renderFrame(0);
            }
        };
        images.push(img);
    }


    // ==========================================
    // 2. PARALLAX OVERLAY CALCULATION
    // ==========================================
    const section1 = document.getElementById("section-1");
    const section2 = document.getElementById("section-2");
    const section3 = document.getElementById("section-3");

    // Math function to interpolate smoothly between defined values
    const mapRange = (val, inMin, inMax, outMin, outMax) => {
        if (val <= inMin) return outMin;
        if (val >= inMax) return outMax;
        return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    };

    const updateParallax = (progress) => {
        // Animation helper for clean Parallax logic
        const computeSection = (prog, inStart, inEnd, outStart, outEnd, axis, dir) => {
            let op = 0;
            let trans = dir * 100;
            
            if (prog > inStart && prog < inEnd) {
                op = mapRange(prog, inStart, inEnd, 0, 1);
                trans = mapRange(prog, inStart, inEnd, dir * 100, 0);
            } else if (prog >= inEnd && prog <= outStart) {
                op = 1;
                trans = 0;
            } else if (prog > outStart && prog < outEnd) {
                op = mapRange(prog, outStart, outEnd, 1, 0);
                trans = mapRange(prog, outStart, outEnd, 0, -dir * 100);
            } else if (prog <= inStart) {
                op = 0;
                trans = dir * 100;
            } else {
                op = 0;
                trans = -dir * 100;
            }
            return { opacity: op, transform: `${axis}(${trans}px)` };
        };

        // Section 1 (Center): 20% scroll
        // In: 5%-15%, Peak holding: 15%-25%, Out: 25%-35%
        const s1 = computeSection(progress, 0.05, 0.15, 0.25, 0.35, 'translateY', 1);
        section1.style.opacity = s1.opacity;
        section1.style.transform = s1.transform;

        // Section 2 (Left): 40% scroll
        // In: 25%-35%, Peak holding: 35%-45%, Out: 45%-55%
        const s2 = computeSection(progress, 0.25, 0.35, 0.45, 0.55, 'translateX', -1);
        section2.style.opacity = s2.opacity;
        section2.style.transform = s2.transform;

        // Section 3 (Right): 80% scroll
        // In: 65%-75%, Peak holding: 75%-85%, Out: 85%-95%
        const s3 = computeSection(progress, 0.65, 0.75, 0.85, 0.95, 'translateX', 1);
        section3.style.opacity = s3.opacity;
        section3.style.transform = s3.transform;
    };

    // Setup initial overlay placements
    updateParallax(0);

    // Primary Core Loop driving the exact framer-motion equivalent 
    window.addEventListener("scroll", () => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollOffset = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculating precisely progress mapped 0 to 1 based on sticky component physics
        const totalScrollRange = sectionHeight - windowHeight;
        
        let rawProgress = (scrollOffset - sectionTop) / totalScrollRange;
        const progress = Math.min(Math.max(rawProgress, 0), 1);

        // Hardware accelerated execution
        requestAnimationFrame(() => {
            const frameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
            // Trigger 1 -> Write frame to canvas
            renderFrame(frameIndex);
            
            // Trigger 2 -> Push typography matrices
            updateParallax(progress);
        });
    }, { passive: true });

    
    // ==========================================
    // 3. PROJECTS GRID INTERSECTION REVEALS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Prevents re-animation when scrolling back up
            }
        });
    }, { 
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    // ==========================================
    // 4. 3D TILT INTERACTIVITY FOR SKILL CARDS
    // ==========================================
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            // Get mouse position relative to the card center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize to -1 to 1 based on center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
            const rotateY = ((x - centerX) / centerX) * 12;  // Max 12deg tilt
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `${-rotateY}px ${rotateX}px 40px rgba(0, 255, 255, 0.15)`;
            card.style.transition = 'none'; // remove transition for seamless tracking
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.boxShadow = `0 10px 40px rgba(0, 255, 255, 0)`;
            card.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        card.addEventListener('mouseenter', () => {
             card.style.transition = 'all 0.1s cubic-bezier(0.23, 1, 0.32, 1)';
        });
    });

    // ==========================================
    // 5. FUTURISTIC NEON WAVE GRID (CANVAS)
    // ==========================================
    const bgCanvas = document.getElementById("bg-canvas");
    if (bgCanvas) {
        const ctx = bgCanvas.getContext("2d");
        let cw, ch;
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let time = 0;

        function resizeBg() {
            cw = window.innerWidth;
            ch = window.innerHeight;
            bgCanvas.width = cw;
            bgCanvas.height = ch;
        }
        window.addEventListener('resize', resizeBg);
        resizeBg();

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Add Parallax Stars
        const stars = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight * 5, // Spread vertically
                z: Math.random() * 2,
                speed: Math.random() * 0.2 + 0.05
            });
        }

        const spacing = 50; 

        function renderGrid() {
            ctx.clearRect(0, 0, cw, ch);
            
            // Draw flowing wave mesh
            time += 0.02;
            const scrollY = window.scrollY;
            
            // Draw background stars
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            stars.forEach((star) => {
                // Modulo math for infinite starfield wrapping
                let py = (star.y - (scrollY * star.speed)) % ch;
                if (py < 0) py += ch;
                
                ctx.beginPath();
                ctx.arc(star.x, py, star.z, 0, Math.PI * 2);
                ctx.fill();
            });

            const cols = Math.ceil(cw / spacing) + 2;
            const rows = Math.ceil(ch / spacing) + 3; // +3 for vertical scrolling buffer

            const nodes = [];
            for (let i = 0; i < cols; i++) {
                nodes[i] = [];
                for (let j = 0; j < rows; j++) {
                    let bx = (i * spacing) - spacing;
                    
                    // Shift rows based on scroll for infinite parallax grid
                    let scrollOffset = (scrollY * 0.15) % spacing;
                    let by = (j * spacing) - spacing - scrollOffset;

                    // Compute organic wave
                    let waveSeedX = i * 0.2 + time;
                    let waveSeedY = j * 0.3 + time + (scrollY * 0.001);
                    let wave = Math.sin(waveSeedX) * Math.cos(waveSeedY) * 40;
                    
                    let realY = by + wave;

                    // Mouse Interaction (Distortion + Glow)
                    let dx = mouseX - bx;
                    let dy = mouseY - realY;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Repel nodes outward from cursor smoothly
                    let distortion = Math.max(0, 200 - dist) / 200; 
                    let nx = bx - (dx * distortion * 0.5); 
                    let ny = realY - (dy * distortion * 0.5);
                    
                    nodes[i][j] = { x: nx, y: ny, dist };
                }
            }

            // Draw glowing connections
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let node = nodes[i][j];
                    if (i < cols - 1) drawLine(node, nodes[i+1][j]);
                    if (j < rows - 1) drawLine(node, nodes[i][j+1]);
                }
            }

            function drawLine(n1, n2) {
                // Minimum distance of either point to the cursor determines line glow
                let glowDist = Math.min(n1.dist, n2.dist);
                
                // Base minimal premium style
                let opacity = 0.06;
                let color = `rgba(130, 80, 230, ${opacity})`; // deep tech purple
                let width = 1;

                // Mouse hover proximity glow logic
                if (glowDist < 250) {
                    let intensity = 1 - (glowDist / 250);
                    // Fade into pink/blue core
                    opacity = 0.06 + (intensity * 0.6);
                    width = 1 + intensity * 1.5;
                    
                    // Mix from Purple (130, 80, 230) to Hot Pink (236, 72, 153) to Cyan (0, 255, 255)
                    let r = Math.floor(130 + (intensity * 106)); 
                    let g = Math.floor(80 - (intensity * 8)); 
                    let b = Math.floor(230 - (intensity * 77)); 
                    
                    color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                }

                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                
                // Pure HTML5 Canvas neon glow
                if (glowDist < 180) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = color;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.stroke();
            }

            requestAnimationFrame(renderGrid);
        }
        renderGrid();
    }
});
