// Particle animation for login page
class ParticleSystem {
    constructor(containerId, count = 100) {
        this.container = document.getElementById(containerId);
        this.count = count;
        this.particles = [];
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.count; i++) {
            this.createParticle();
        }
        this.animate();
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove and recreate after animation
        particle.addEventListener('animationend', () => {
            particle.remove();
            this.createParticle();
        });
    }
    
    animate() {
        // Additional animation logic if needed
    }
}

// Initialize particles when DOM is ready
if (document.getElementById('particles')) {
    new ParticleSystem('particles', 150);
}