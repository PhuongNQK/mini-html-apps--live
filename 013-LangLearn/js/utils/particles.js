export class ParticleSystem {
    constructor() {
        this.colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF'];
    }

    burst(x, y) {
        const count = 30;
        const container = document.body;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            p.style.left = x + 'px';
            p.style.top = y + 'px';

            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            container.appendChild(p);

            let opacity = 1;
            let posX = x;
            let posY = y;

            const animate = () => {
                posX += vx;
                posY += vy + 2; // Gravity
                opacity -= 0.02;

                p.style.left = posX + 'px';
                p.style.top = posY + 'px';
                p.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    p.remove();
                }
            };
            requestAnimationFrame(animate);
        }
    }
}
