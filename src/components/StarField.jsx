import React, { useEffect, useRef } from 'react';

const StarField = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Configuration
        const particleCount = 150;
        const connectionRadius = 120; // Mouse influence radius
        const baseSize = 1.0;
        const hoverSizeScale = 3.0;
        const mouse = { x: -1000, y: -1000 };

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * baseSize + 0.5;
                this.targetSize = this.size;
                this.currentSize = this.size;
                this.baseAlpha = Math.random() * 0.4 + 0.1;
                this.alpha = this.baseAlpha;
                this.targetAlpha = this.baseAlpha;

                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = (Math.random() - 0.5) * 0.15;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionRadius) {
                    const proximity = 1 - (distance / connectionRadius);
                    this.targetAlpha = 0.8 + (proximity * 0.2);
                    this.targetSize = this.size * hoverSizeScale;
                } else {
                    this.targetAlpha = this.baseAlpha;
                    this.targetSize = this.size;
                }

                this.alpha += (this.targetAlpha - this.alpha) * 0.1;
                this.currentSize += (this.targetSize - this.currentSize) * 0.1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleResize = () => {
            resizeCanvas();
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                background: 'transparent'
            }}
        />
    );
};

export default StarField;
