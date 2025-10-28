// Parisian street background renderer
export class ParisianStreetBackground {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(canvas, groundY, score) {
        // Parisian gray sky (very dull, monochrome)
        const gradient = this.ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
        gradient.addColorStop(0, '#b8b8b8');
        gradient.addColorStop(0.5, '#c8c8c8');
        gradient.addColorStop(1, '#d0d0d0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

        // Very subtle clouds
        this.ctx.fillStyle = 'rgba(160, 160, 160, 0.15)';
        const cloudOffset = (score * 0.1) % 600;
        for (let i = 0; i < 3; i++) {
            const cloudX = i * 300 - cloudOffset;
            this.ctx.beginPath();
            this.ctx.arc(cloudX, 80 + i * 30, 40, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 50, 80 + i * 30, 50, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 100, 80 + i * 30, 45, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Buildings in background (parallax effect)
        const buildingOffset1 = (score * 0.3) % 350;
        const buildingOffset2 = (score * 0.4) % 300;

        // Far Haussmann buildings (light gray stone - pierre de taille)
        this.ctx.fillStyle = '#d8d8d8';
        for (let i = -1; i < canvas.width / 200 + 2; i++) {
            const x = i * 200 - buildingOffset1;
            const height = 160 + (i % 3) * 15; // 6-7 story uniform Haussmann height
            this.ctx.fillRect(x, groundY - 220 - height, 180, height);

            // Zinc roof (typical Paris gray roofs)
            this.ctx.fillStyle = '#909090';
            this.ctx.fillRect(x, groundY - 220 - height - 12, 180, 12);

            // Chimneys on roof
            this.ctx.fillStyle = '#808080';
            for (let c = 0; c < 3; c++) {
                this.ctx.fillRect(x + 40 + c * 50, groundY - 220 - height - 25, 8, 13);
            }

            // Windows (very subtle, aligned)
            this.ctx.fillStyle = '#a0a0a0';
            const seed = i * 7;
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 5; col++) {
                    if ((seed + row * 5 + col) % 13 === 0) {
                        // Tall French windows
                        this.ctx.fillRect(x + 15 + col * 33, groundY - 220 - height + 15 + row * 25, 16, 22);
                    }
                }
            }

            // Subtle balcony railings (fer forgé)
            this.ctx.strokeStyle = '#b0b0b0';
            this.ctx.lineWidth = 1;
            for (let row = 2; row < 6; row++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 10, groundY - 220 - height + 36 + row * 25);
                this.ctx.lineTo(x + 170, groundY - 220 - height + 36 + row * 25);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = '#d8d8d8';
        }

        // Closer Haussmann buildings (medium gray)
        this.ctx.fillStyle = '#c0c0c0';
        for (let i = -1; i < canvas.width / 160 + 2; i++) {
            const x = i * 160 - buildingOffset2;
            const height = 130 + (i % 3) * 12;
            this.ctx.fillRect(x, groundY - 150 - height, 145, height);

            // Zinc roof
            this.ctx.fillStyle = '#787878';
            this.ctx.fillRect(x, groundY - 150 - height - 10, 145, 10);

            // Chimneys
            this.ctx.fillStyle = '#707070';
            for (let c = 0; c < 2; c++) {
                this.ctx.fillRect(x + 35 + c * 60, groundY - 150 - height - 20, 7, 10);
            }

            // Windows (barely visible)
            this.ctx.fillStyle = '#909090';
            const seed = i * 11;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 4; col++) {
                    if ((seed + row * 4 + col) % 11 === 0) {
                        this.ctx.fillRect(x + 15 + col * 30, groundY - 150 - height + 12 + row * 22, 14, 18);
                    }
                }
            }

            // Balconies
            this.ctx.strokeStyle = '#a0a0a0';
            this.ctx.lineWidth = 1;
            for (let row = 2; row < 5; row++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 10, groundY - 150 - height + 30 + row * 22);
                this.ctx.lineTo(x + 135, groundY - 150 - height + 30 + row * 22);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = '#c0c0c0';
        }

        // Parisian street lamps (very subtle)
        const lampOffset = (score * 2) % 250;
        for (let i = 0; i < canvas.width / 250 + 2; i++) {
            const lampX = i * 250 - lampOffset;

            // Base
            this.ctx.fillStyle = '#606060';
            this.ctx.fillRect(lampX - 3, groundY - 20, 6, 5);

            // Post
            this.ctx.strokeStyle = '#707070';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(lampX, groundY - 15);
            this.ctx.lineTo(lampX, groundY - 85);
            this.ctx.stroke();

            // Top
            this.ctx.fillStyle = '#606060';
            this.ctx.beginPath();
            this.ctx.arc(lampX, groundY - 87, 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Lantern
            this.ctx.fillStyle = '#505050';
            this.ctx.fillRect(lampX - 7, groundY - 105, 14, 18);

            // Very dim light
            this.ctx.fillStyle = '#989870';
            this.ctx.fillRect(lampX - 5, groundY - 103, 10, 14);
        }

        // Parisian sidewalk (pavé)
        this.ctx.fillStyle = '#9a9a9a';
        this.ctx.fillRect(0, groundY - 20, canvas.width, 20);

        // Pavé pattern
        this.ctx.fillStyle = '#888888';
        const cobbleOffset = (score * 4) % 20;
        for (let i = 0; i < canvas.width / 10 + 1; i++) {
            const x = i * 10 - cobbleOffset;
            for (let j = 0; j < 2; j++) {
                this.ctx.fillRect(x + (j % 2) * 5, groundY - 20 + j * 10, 4, 9);
            }
        }
    }
}
