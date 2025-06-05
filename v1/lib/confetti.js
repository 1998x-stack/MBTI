// 第三方confetti库 (简化版)
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.confetti = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    const defaults = {
        particleCount: 50,
        angle: 90,
        spread: 45,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1,
        drift: 0,
        ticks: 200,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
        shapes: ['circle', 'square'],
        scalar: 1,
        zIndex: 100,
        disableForReducedMotion: false
    };

    function confetti(args) {
        const end = Date.now() + (args.ticks || defaults.ticks);
        const canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let particles = [];
        let raf;

        canvas.width = width;
        canvas.height = height;
        canvas.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            pointer-events:none;
            z-index:${args.zIndex || defaults.zIndex};
        `;
        document.body.appendChild(canvas);

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        function createParticle() {
            const angle = args.angle || defaults.angle;
            const spread = args.spread || defaults.spread;
            const startVelocity = args.startVelocity || defaults.startVelocity;
            const color = args.colors[Math.floor(Math.random() * args.colors.length)];
            const shape = args.shapes[Math.floor(Math.random() * args.shapes.length)];
            const x = width * (args.origin.x || defaults.origin.x);
            const y = height * (args.origin.y || defaults.origin.y);
            
            return {
                x,
                y,
                wobble: Math.random() * 10,
                wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
                velocity: startVelocity * 0.5 + Math.random() * startVelocity,
                angle2D: -angle + (0.5 * spread - Math.random() * spread),
                tiltAngle: Math.random() * Math.PI,
                color,
                shape,
                tick: 0,
                totalTicks: args.ticks || defaults.ticks,
                decay: args.decay || defaults.decay,
                gravity: args.gravity || defaults.gravity,
                drift: args.drift || defaults.drift,
                scalar: args.scalar || defaults.scalar
            };
        }

        function updateParticle(particle, progress, now) {
            particle.tick = now;
            particle.x += Math.cos(particle.angle2D) * particle.velocity + particle.drift;
            particle.y += Math.sin(particle.angle2D) * particle.velocity + particle.gravity;
            particle.wobble += particle.wobbleSpeed;
            particle.velocity *= particle.decay;
            particle.tiltAngle += 0.1;
        }

        function drawParticle(particle) {
            context.save();
            const x = particle.x + 10 * Math.sin(particle.wobble);
            const y = particle.y + 10 * Math.cos(particle.wobble);
            const tilt = Math.cos(particle.tiltAngle) * particle.scalar;
            
            context.translate(x, y);
            context.rotate(particle.tiltAngle);
            context.fillStyle = particle.color;
            
            if (particle.shape === 'square') {
                context.fillRect(-5, -5, 10, 10);
            } else {
                context.beginPath();
                context.arc(0, 0, 5, 0, Math.PI * 2);
                context.fill();
            }
            
            context.restore();
        }

        function tick(now) {
            const progress = (end - now) / (defaults.ticks);
            
            if (now > end) {
                document.body.removeChild(canvas);
                return cancelAnimationFrame(raf);
            }
            
            context.clearRect(0, 0, width, height);
            
            while (particles.length < (args.particleCount || defaults.particleCount)) {
                particles.push(createParticle());
            }
            
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];
                
                if (particle.y > height || particle.tick > particle.totalTicks) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }
                
                updateParticle(particle, progress, now);
                drawParticle(particle);
            }
            
            raf = requestAnimationFrame(tick);
        }
        
        raf = requestAnimationFrame(tick);
    }

    return confetti;
}));