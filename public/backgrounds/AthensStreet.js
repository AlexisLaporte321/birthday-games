// Athens street background renderer with Acropolis
export class AthensStreetBackground {
    constructor(ctx) {
        this.ctx = ctx;
    }

    draw(canvas, groundY, score) {
        // Mediterranean blue sky
        const gradient = this.ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.5, '#74b3e2');
        gradient.addColorStop(1, '#a8d5f2');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

        // Sun
        this.ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(canvas.width - 150, 100, 50, 0, Math.PI * 2);
        this.ctx.fill();

        // Light clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        const cloudOffset = (score * 0.1) % 600;
        for (let i = 0; i < 3; i++) {
            const cloudX = i * 350 - cloudOffset;
            this.ctx.beginPath();
            this.ctx.arc(cloudX, 80 + i * 40, 35, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 40, 80 + i * 40, 45, 0, Math.PI * 2);
            this.ctx.arc(cloudX + 80, 80 + i * 40, 40, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Acropolis/Parthenon in far background (parallax)
        const acropolisOffset = (score * 0.15) % 800;
        this.ctx.fillStyle = '#e8e8e8';
        const acropolisX = canvas.width / 2 - 200 - acropolisOffset;
        const acropolisY = groundY - 350;

        // Parthenon platform
        this.ctx.fillRect(acropolisX, acropolisY + 80, 400, 20);

        // Parthenon columns
        for (let i = 0; i < 8; i++) {
            const colX = acropolisX + 50 + i * 45;
            // Column base
            this.ctx.fillRect(colX, acropolisY + 100, 12, 3);
            // Column
            this.ctx.fillRect(colX + 1, acropolisY + 30, 10, 70);
            // Column capital
            this.ctx.fillRect(colX - 2, acropolisY + 25, 16, 5);
        }

        // Parthenon roof
        this.ctx.fillRect(acropolisX + 45, acropolisY + 20, 320, 5);
        // Triangular pediment
        this.ctx.beginPath();
        this.ctx.moveTo(acropolisX + 40, acropolisY + 20);
        this.ctx.lineTo(acropolisX + 205, acropolisY - 15);
        this.ctx.lineTo(acropolisX + 370, acropolisY + 20);
        this.ctx.closePath();
        this.ctx.fill();

        // Buildings in background (parallax effect)
        const buildingOffset1 = (score * 0.3) % 350;
        const buildingOffset2 = (score * 0.4) % 300;

        // Far neoclassical buildings (white stone)
        this.ctx.fillStyle = '#f5f5f5';
        for (let i = -1; i < canvas.width / 200 + 2; i++) {
            const x = i * 200 - buildingOffset1;
            const height = 140 + (i % 3) * 20;
            this.ctx.fillRect(x, groundY - 200 - height, 180, height);

            // Flat roof with parapet
            this.ctx.fillStyle = '#e8e8e8';
            this.ctx.fillRect(x, groundY - 200 - height - 8, 180, 8);

            // Columns on facade
            this.ctx.fillStyle = '#fff';
            for (let c = 0; c < 4; c++) {
                this.ctx.fillRect(x + 25 + c * 40, groundY - 200 - height + 20, 8, height - 30);
            }

            // Windows (tall, arched at top)
            this.ctx.fillStyle = '#4a90e2';
            const seed = i * 7;
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 3; col++) {
                    if ((seed + row * 3 + col) % 11 === 0) {
                        const winX = x + 20 + col * 55;
                        const winY = groundY - 200 - height + 30 + row * 30;
                        // Window
                        this.ctx.fillRect(winX, winY, 20, 25);
                        // Arch top
                        this.ctx.beginPath();
                        this.ctx.arc(winX + 10, winY, 10, Math.PI, 0);
                        this.ctx.fill();
                    }
                }
            }

            // Balconies with iron railings
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            for (let row = 1; row < 4; row++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 15, groundY - 200 - height + 55 + row * 30);
                this.ctx.lineTo(x + 165, groundY - 200 - height + 55 + row * 30);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = '#f5f5f5';
        }

        // Closer neoclassical buildings
        this.ctx.fillStyle = '#ffffff';
        for (let i = -1; i < canvas.width / 160 + 2; i++) {
            const x = i * 160 - buildingOffset2;
            const height = 120 + (i % 3) * 15;
            this.ctx.fillRect(x, groundY - 140 - height, 145, height);

            // Roof
            this.ctx.fillStyle = '#e8e8e8';
            this.ctx.fillRect(x, groundY - 140 - height - 6, 145, 6);

            // Columns
            this.ctx.fillStyle = '#fff';
            for (let c = 0; c < 3; c++) {
                this.ctx.fillRect(x + 25 + c * 45, groundY - 140 - height + 15, 7, height - 25);
            }

            // Windows
            this.ctx.fillStyle = '#4a90e2';
            const seed = i * 11;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if ((seed + row * 3 + col) % 9 === 0) {
                        const winX = x + 20 + col * 40;
                        const winY = groundY - 140 - height + 20 + row * 30;
                        this.ctx.fillRect(winX, winY, 16, 22);
                        this.ctx.beginPath();
                        this.ctx.arc(winX + 8, winY, 8, Math.PI, 0);
                        this.ctx.fill();
                    }
                }
            }

            // Balconies
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            for (let row = 1; row < 3; row++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x + 10, groundY - 140 - height + 42 + row * 30);
                this.ctx.lineTo(x + 135, groundY - 140 - height + 42 + row * 30);
                this.ctx.stroke();
            }

            this.ctx.fillStyle = '#ffffff';
        }

        // Greek flag decorations
        const flagOffset = (score * 2) % 300;
        for (let i = 0; i < canvas.width / 300 + 2; i++) {
            const flagX = i * 300 - flagOffset;
            const flagY = groundY - 50;

            // Flag pole
            this.ctx.fillStyle = '#666';
            this.ctx.fillRect(flagX, flagY - 60, 2, 60);

            // Greek flag (blue and white stripes)
            this.ctx.fillStyle = '#4a90e2';
            this.ctx.fillRect(flagX + 2, flagY - 55, 20, 3);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(flagX + 2, flagY - 52, 20, 3);
            this.ctx.fillStyle = '#4a90e2';
            this.ctx.fillRect(flagX + 2, flagY - 49, 20, 3);
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(flagX + 2, flagY - 46, 20, 3);
            this.ctx.fillStyle = '#4a90e2';
            this.ctx.fillRect(flagX + 2, flagY - 43, 20, 3);
        }

        // Olive trees
        const treeOffset = (score * 1.5) % 200;
        for (let i = 0; i < canvas.width / 200 + 2; i++) {
            const treeX = i * 200 - treeOffset;
            const treeY = groundY - 45;

            // Trunk
            this.ctx.fillStyle = '#8b4513';
            this.ctx.fillRect(treeX - 3, treeY - 25, 6, 25);

            // Foliage (olive green)
            this.ctx.fillStyle = '#808000';
            this.ctx.beginPath();
            this.ctx.arc(treeX - 8, treeY - 25, 12, 0, Math.PI * 2);
            this.ctx.arc(treeX + 8, treeY - 25, 12, 0, Math.PI * 2);
            this.ctx.arc(treeX, treeY - 35, 14, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Stone pavement (marble-like)
        this.ctx.fillStyle = '#d3d3d3';
        this.ctx.fillRect(0, groundY - 20, canvas.width, 20);

        // Marble pattern
        this.ctx.fillStyle = '#c0c0c0';
        const marbleOffset = (score * 3) % 30;
        for (let i = 0; i < canvas.width / 30 + 1; i++) {
            const x = i * 30 - marbleOffset;
            for (let j = 0; j < 2; j++) {
                this.ctx.fillRect(x + (j % 2) * 15, groundY - 20 + j * 10, 13, 9);
            }
        }
    }
}
