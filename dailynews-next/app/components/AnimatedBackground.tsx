"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let particles: Particle[] = [];

		// Configuration
		const particleCount = 50;
		const connectionDistance = 150;
		const mouseDistance = 200;

		let mouseX = -1000;
		let mouseY = -1000;

		class Particle {
			x: number;
			y: number;
			vx: number;
			vy: number;
			size: number;
			color: string;

			constructor(width: number, height: number) {
				this.x = Math.random() * width;
				this.y = Math.random() * height;
				this.vx = (Math.random() - 0.5) * 0.5;
				this.vy = (Math.random() - 0.5) * 0.5;
				this.size = Math.random() * 2 + 1;
				// Subtle gray color
				this.color = `rgba(150, 150, 150, ${Math.random() * 0.3 + 0.1})`;
			}

			update(width: number, height: number) {
				this.x += this.vx;
				this.y += this.vy;

				// Bounce off edges
				if (this.x < 0 || this.x > width) this.vx *= -1;
				if (this.y < 0 || this.y > height) this.vy *= -1;

				// Mouse interaction
				const dx = mouseX - this.x;
				const dy = mouseY - this.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < mouseDistance) {
					const forceDirectionX = dx / distance;
					const forceDirectionY = dy / distance;
					const force = (mouseDistance - distance) / mouseDistance;
					const directionX = forceDirectionX * force * 0.05;
					const directionY = forceDirectionY * force * 0.05;

					this.vx += directionX;
					this.vy += directionY;
				}
			}

			draw(ctx: CanvasRenderingContext2D) {
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fillStyle = this.color;
				ctx.fill();
			}
		}

		const init = () => {
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push(new Particle(canvas.width, canvas.height));
			}
		};

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((particle) => {
				particle.update(canvas.width, canvas.height);
				particle.draw(ctx);
			});

			// Draw connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < connectionDistance) {
						ctx.beginPath();
						ctx.strokeStyle = `rgba(150, 150, 150, ${0.1 * (1 - distance / connectionDistance)})`;
						ctx.lineWidth = 1;
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			init();
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("mousemove", handleMouseMove);

		handleResize();
		animate();

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]" style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />;
}
