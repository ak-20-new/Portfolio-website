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
            let trans = dir * 50; // Use 50px for a soft cinematic upward motion
            
            if (prog > inStart && prog < inEnd) {
                op = mapRange(prog, inStart, inEnd, 0, 1);
                trans = mapRange(prog, inStart, inEnd, dir * 50, 0);
            } else if (prog >= inEnd && prog <= outStart) {
                op = 1;
                trans = 0;
            } else if (prog > outStart && prog < outEnd) {
                op = mapRange(prog, outStart, outEnd, 1, 0);
                trans = mapRange(prog, outStart, outEnd, 0, -dir * 50);
            } else if (prog <= inStart) {
                op = 0;
                trans = dir * 50;
            } else {
                op = 0;
                trans = -dir * 50;
            }
            return { opacity: op, transform: `${axis}(${trans}px)` };
        };

        // Section 1 (Aakanksha, UI/UX Designer): Appears at 25%, fades out and disappears after 50%
        const s1 = computeSection(progress, 0.25, 0.35, 0.40, 0.50, 'translateY', 1);
        if (section1) {
            section1.style.opacity = s1.opacity;
            section1.style.transform = s1.transform;
        }

        // Section 2 (Designing Future Experiences): Appears at 60%, fades out and disappears after 90%
        const s2 = computeSection(progress, 0.60, 0.70, 0.80, 0.90, 'translateY', 1);
        if (section2) {
            section2.style.opacity = s2.opacity;
            section2.style.transform = s2.transform;
        }
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
    // 5. FUTURISTIC ANTI-GRAVITY CANVAS
    // ==========================================
    const bgCanvas = document.getElementById("bg-canvas");
    if (bgCanvas) {
        const ctx = bgCanvas.getContext("2d");
        let cw, ch;
        // Offscreen default
        let mouseX = -1000;
        let mouseY = -1000;
        let targetMouseX = -1000;
        let targetMouseY = -1000;

        function resizeBg() {
            cw = window.innerWidth;
            ch = window.innerHeight;
            bgCanvas.width = cw;
            bgCanvas.height = ch;
        }
        window.addEventListener('resize', resizeBg);
        resizeBg();

        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            targetMouseX = -1000;
            targetMouseY = -1000;
        });

        const elements = [];
        const colors = [
            'rgba(147, 51, 234, 0.8)', // Purple
            'rgba(59, 130, 246, 0.8)', // Blue
            'rgba(236, 72, 153, 0.8)', // Pink
            'rgba(0, 255, 255, 0.8)'   // Cyan
        ];

        // 1. Cards
        for (let i = 0; i < 7; i++) {
            elements.push({
                type: 'card',
                x: Math.random() * cw,
                y: Math.random() * ch,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 30 + 50,
                mass: 2,
                z: Math.random() * 0.6 + 0.4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.01
            });
        }

        // 2. Rings / Icons
        for (let i = 0; i < 15; i++) {
            elements.push({
                type: Math.random() > 0.5 ? 'ring' : 'poly',
                x: Math.random() * cw,
                y: Math.random() * ch,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 15 + 15,
                mass: 1,
                z: Math.random() * 0.8 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.03
            });
        }

        // 3. Particles
        for (let i = 0; i < 60; i++) {
            elements.push({
                type: 'particle',
                x: Math.random() * cw,
                y: Math.random() * ch,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                radius: Math.random() * 2 + 1,
                mass: 0.1,
                z: Math.random() * 1 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: 0,
                vRot: 0
            });
        }

        function roundRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        let lastScrollY = window.scrollY;

        function updatePhysics() {
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            let scrollY = window.scrollY;
            let scrollDelta = scrollY - lastScrollY;
            lastScrollY = scrollY;

            const friction = 0.995;
            
            for (let i = 0; i < elements.length; i++) {
                let el = elements[i];

                el.x += el.vx;
                el.y += el.vy;
                el.y -= scrollDelta * el.z * 0.6; // Scroll parallax physical application
                el.rotation += el.vRot;

                el.vx *= friction;
                el.vy *= friction;

                // Maintain some base movement
                if (Math.abs(el.vx) < 0.2 && Math.abs(el.vy) < 0.2) {
                    el.vx += (Math.random() - 0.5) * 0.05;
                    el.vy += (Math.random() - 0.5) * 0.05;
                }

                // Physical Wrap
                if (el.x < -200) el.x += cw + 400;
                if (el.x > cw + 200) el.x -= cw + 400;
                if (el.y < -300) el.y += ch + 600;
                if (el.y > ch + 300) el.y -= ch + 600;

                // Mouse Repulsion
                let dxMouse = el.x - mouseX;
                let dyMouse = el.y - mouseY;
                let distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
                let repelRadius = 300 * Math.max(0.2, el.z); 

                if (distMouseSq < repelRadius * repelRadius && targetMouseX > -500) {
                    let distMouse = Math.sqrt(distMouseSq);
                    if(distMouse === 0) distMouse = 0.01;
                    let force = (repelRadius - distMouse) / repelRadius;
                    let accel = force * 0.8 / el.mass;
                    el.vx += (dxMouse / distMouse) * accel;
                    el.vy += (dyMouse / distMouse) * accel;
                }

                // Collisions (only between larger elements for perf, ignore particles)
                if (el.type !== 'particle') {
                    for (let j = i + 1; j < elements.length; j++) {
                        let el2 = elements[j];
                        if (el2.type === 'particle') continue;
                        
                        let dx = el2.x - el.x;
                        let dy = el2.y - el.y;
                        let distSq = dx * dx + dy * dy;
                        let minDist = (el.radius + el2.radius) * 0.85;

                        if (distSq < minDist * minDist) {
                            let dist = Math.sqrt(distSq);
                            if (dist === 0) dist = 0.01;
                            let overlap = minDist - dist;
                            let nx = dx / dist;
                            let ny = dy / dist;

                            let separationX = nx * (overlap / 2);
                            let separationY = ny * (overlap / 2);
                            
                            el.x -= separationX;
                            el.y -= separationY;
                            el2.x += separationX;
                            el2.y += separationY;

                            let kx = (el.vx - el2.vx);
                            let ky = (el.vy - el2.vy);
                            let p = 2 * (nx * kx + ny * ky) / (el.mass + el2.mass);
                            
                            el.vx -= p * el2.mass * nx * 0.4;
                            el.vy -= p * el2.mass * ny * 0.4;
                            el2.vx += p * el.mass * nx * 0.4;
                            el2.vy += p * el.mass * ny * 0.4;
                            
                            el.vRot += (Math.random() - 0.5) * 0.02;
                            el2.vRot += (Math.random() - 0.5) * 0.02;
                        }
                    }
                }
            }
        }

        function renderScene() {
            ctx.clearRect(0, 0, cw, ch);
            updatePhysics();

            let scrollY = window.scrollY;

            // Render Back to Front
            elements.sort((a,b) => a.z - b.z).forEach(el => {
                ctx.save();
                
                // Visual Parallax Translation
                let px = el.x - (mouseX - cw/2) * (el.z * 0.05);
                let py = el.y - (mouseY - ch/2) * (el.z * 0.05);

                ctx.translate(px, py);
                ctx.scale(el.z, el.z);
                ctx.rotate(el.rotation);
                
                ctx.globalAlpha = Math.max(0.15, el.z);

                if (el.type === 'particle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, el.radius, 0, Math.PI * 2);
                    ctx.fillStyle = el.color;
                    ctx.shadowColor = el.color;
                    ctx.shadowBlur = 10;
                    ctx.fill();
                } else if (el.type === 'card') {
                    let w = el.radius * 1.5;
                    let h = el.radius * 2;
                    
                    // Shadow / Glow
                    ctx.shadowColor = el.color.replace('0.8', '0.3');
                    ctx.shadowBlur = 40 * el.z;
                    
                    // Glass Card Base
                    ctx.fillStyle = 'rgba(26, 26, 26, 0.6)';
                    roundRect(ctx, -w/2, -h/2, w, h, 15);
                    ctx.fill();
                    
                    ctx.shadowBlur = 0; // Turn off shadow for inner drawing
                    
                    // Glass highlight
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    
                    // Mock UI Elements inside Card - Soft gradients
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    // Header rect
                    roundRect(ctx, -w/2 + 15, -h/2 + 15, w - 30, 20, 6);
                    ctx.fill();
                    // Lines
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    roundRect(ctx, -w/2 + 15, -h/2 + 50, w * 0.7, 8, 4);
                    ctx.fill();
                    roundRect(ctx, -w/2 + 15, -h/2 + 65, w * 0.5, 8, 4);
                    ctx.fill();
                    
                    // Accent color block
                    ctx.fillStyle = el.color.replace('0.8', '0.5');
                    roundRect(ctx, -w/2 + 15, h/2 - 30, w - 30, 15, 6);
                    ctx.fill();
                    
                } else if (el.type === 'ring') {
                    ctx.beginPath();
                    ctx.arc(0, 0, el.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = el.color;
                    ctx.lineWidth = 3;
                    ctx.shadowColor = el.color;
                    ctx.shadowBlur = 15;
                    ctx.stroke();
                    
                    // Inner geometric details
                    ctx.beginPath();
                    ctx.arc(0, 0, el.radius * 0.7, 0, Math.PI * 0.5);
                    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (el.type === 'poly') {
                    // Draw a futuristic diamond
                    ctx.beginPath();
                    ctx.moveTo(0, -el.radius);
                    ctx.lineTo(el.radius * 0.7, 0);
                    ctx.lineTo(0, el.radius);
                    ctx.lineTo(-el.radius * 0.7, 0);
                    ctx.closePath();
                    
                    ctx.fillStyle = el.color.replace('0.8', '0.08');
                    ctx.fill();
                    
                    ctx.strokeStyle = el.color.replace('0.8', '0.6');
                    ctx.lineWidth = 2;
                    ctx.shadowColor = el.color;
                    ctx.shadowBlur = 20;
                    ctx.stroke();
                    
                    // Center geometric dot
                    ctx.beginPath();
                    ctx.arc(0, 0, 3, 0, Math.PI*2);
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.fill();
                }

                ctx.restore();
            });

            requestAnimationFrame(renderScene);
        }
        renderScene();
    }

    // ==========================================
    // 6. NAVBAR ACTIVE STATE HIGHLIGHTING
    // ==========================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const updateActiveNav = () => {
        let current = "";
        const scrollY = window.scrollY;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a 200px offset to trigger earlier when scrolling down
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav(); // Initial call
});
