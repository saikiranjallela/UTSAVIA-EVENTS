/* ============================================
   UTSAVIA EVENTS — Ultra Premium Cinematic JS
   3D Depth, Particles, Parallax, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ========== LOADING SCREEN ==========
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAllAnimations();
        }, 1500);
    });
    
    // ========== GOLD PARTICLE SYSTEM ==========
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.8 + 0.4;
                this.speedY = -(Math.random() * 0.15 + 0.05); // Slow upward drift
                this.speedX = (Math.random() - 0.5) * 0.1;
                this.opacity = Math.random() * 0.25 + 0.05;
                this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
                this.fadeSpeed = Math.random() * 0.002 + 0.0008;
                this.life = 0;
                this.maxLife = Math.random() * 500 + 300;
                this.swaySpeed = Math.random() * 0.01 + 0.005;
                this.swayWidth = Math.random() * 0.15 + 0.05;
                this.color = [212, 168, 75]; // Luxury Gold
            }
            
            update() {
                this.y += this.speedY;
                // Soft wave sway using sine waves for cinematic feel
                this.x += this.speedX + Math.sin(this.life * this.swaySpeed) * this.swayWidth;
                this.life++;
                
                this.opacity += this.fadeDirection * this.fadeSpeed;
                if (this.opacity > 0.35) this.fadeDirection = -1;
                if (this.opacity < 0.01) this.fadeDirection = 1;
                
                if (this.y < -10 || this.life > this.maxLife) {
                    this.reset();
                    this.y = canvas.height + 10;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
                ctx.fill();
                
                // Add soft glowing halo around slightly larger particles
                if (this.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity * 0.15})`;
                    ctx.fill();
                }
            }
        }
        
        const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // ========== HERO SLIDESHOW ==========
    function initHeroSlideshow() {
        const slides = document.querySelectorAll('.hero-video-slide');
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        setInterval(nextSlide, 7000);
    }
    
    // ========== NAVBAR EFFECT & MOBILE MENU ==========
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile burger drawer interaction
        const navToggle = document.getElementById('nav-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navLinks.classList.toggle('open');
            });
            
            // Close mobile menu when clicking a link
            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navLinks.classList.remove('open');
                });
            });
        }
    }
    
    // ========== SMOOTH CINEMATIC MOUSE PARALLAX ==========
    function initMouseParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        
        const ease = 0.05; // Easing factor
        
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetX = (e.clientX - centerX) / centerX;
            targetY = (e.clientY - centerY) / centerY;
        });
        
        function animateParallax() {
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;
            
            layers.forEach(layer => {
                const depth = parseFloat(layer.dataset.depth) || 0.02;
                const translateX = currentX * depth * 100;
                const translateY = currentY * depth * 100;
                layer.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
            
            requestAnimationFrame(animateParallax);
        }
        animateParallax();
    }
    
    // ========== SCROLL REVEAL ==========
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.anim, .anim-left, .anim-right, .anim-scale');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
    }
    
    // ========== 3D CARD TILT ==========
    function initCardTilt() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -4; // Mild tilt angle
                const rotateY = (x - centerX) / centerX * 4;
                
                card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ========== SMOOTH INTERACTIVE SCROLLING ==========
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const offset = 80; // Account for fixed navbar
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ========== INIT ALL ==========
    function initAllAnimations() {
        initParticles();
        initHeroSlideshow();
        initNavbar();
        initMouseParallax();
        initScrollReveal();
        initCardTilt();
        initSmoothScroll();
    }
    
    // Start particles immediately for loading screen background atmosphere
    initParticles();
});
