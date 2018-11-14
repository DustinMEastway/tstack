/* todo:
	* move randomInt and randomItem methods out of the file
*/

import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { TskSparkleConfig } from './sparkle-config';
import { TskSparkleParticle } from './sparkle-particle';

function randomInt(max: number): number {
	return Math.floor(Math.random() * max);
}

function randomItem<T>(items: T[]): T {
	return (items instanceof Array && items.length) ? items[randomInt(items.length)] : null;
}

const encodedSparkles = [
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOm',
	'NvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bn',
	'M6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cm',
	'RmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbn',
	'MuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb2',
	'0veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG',
	'1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4Ni',
	'I+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPS',
	'J4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW',
	'5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5J',
	'ycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0',
	'fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=='
].join('');

/** used to make the component that the directive is attached to sparkle */
@Directive({
	selector: '[tskSparkle]'
})
export class TskSparkleDirective implements OnInit {
	private _animationHandle: number;
	private _canvas: HTMLCanvasElement;
	private _fadeCount: number;
	private _sprite: HTMLImageElement;
	private _sprites: number[];
	private _particles: TskSparkleParticle[];
	private _settings: BehaviorSubject<TskSparkleConfig>;

	@HostBinding('class.tsk-sparkle')
	get addTskSparkle(): boolean {
		return true;
	}

	get overlapChange(): Observable<number> {
		return this._settings.pipe(
			map(settings => settings.overlap),
			distinctUntilChanged());
	}

	@Input('tskSparkle')
	get settings(): TskSparkleConfig {
		return this._settings.value;
	}
	set settings(settings: TskSparkleConfig) {
		this._settings.next(Object.assign(this._settings.value, settings));
	}

	get sparklingChange(): Observable<boolean> {
		return this._settings.pipe(
			map(settings => settings.sparkling),
			distinctUntilChanged());
	}

	private get _nativeElement(): HTMLElement {
		return this._elementRef.nativeElement;
	}

	constructor(private _elementRef: ElementRef) {
		const count = Math.ceil(this._nativeElement.offsetWidth / 30);

		this._settings = new BehaviorSubject<TskSparkleConfig>({
			color: '#FFF',
			count: (count > 5) ? count : 5,
			overlap: 0,
			sparkling: true,
			speed: 1
		});
	}

	ngOnInit(): void {
		// canvas
		this._canvas = document.createElement('canvas');
		this._canvas.classList.add('tsk-sparkle-canvas');
		this._nativeElement.appendChild(this._canvas);

		// sprites
		this._sprites = [0, 6, 13, 20];
		this._sprite = new Image();
		this._sprite.src = encodedSparkles;

		this.overlapChange.subscribe((overlap) => {
			this._canvas.style.top = `-${overlap}px`;
			this._canvas.style.left = `-${overlap}px`;

			this._canvas.height = this._nativeElement.offsetHeight + overlap * 2;
			this._canvas.width = this._nativeElement.offsetWidth + overlap * 2;
		});

		this.createParticles();

		this.sparklingChange.subscribe((sparkling) => {
			if (sparkling) {
				window.cancelAnimationFrame(this._animationHandle);

				this._particles.forEach(particle => particle.opacity = Math.random());

				this._fadeCount = null;
				this.updateCanvas();
			} else {
				this._fadeCount = 100;
			}
		});
	}

	private drawFrame (time: number): void {
		const ctx = this._canvas.getContext('2d');

		ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		this._particles.forEach(particle => {
			if (Math.floor(time) % randomInt(7) === 0) {
				particle.style = randomItem(this._sprites);
			}

			ctx.save();
			ctx.globalAlpha = particle.opacity;
			ctx.drawImage(this._sprite, particle.style, 0, 7, 7, particle.position.x, particle.position.y, 7, 7);

			if (this.settings.color) {
				ctx.globalCompositeOperation = 'source-atop';
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = particle.color;
				ctx.fillRect(particle.position.x, particle.position.y, 7, 7);
			}

			ctx.restore();
		});
	}

	private updateCanvas(): void {
		this._animationHandle = window.requestAnimationFrame((time) => {
			this._particles.forEach(particle => {
				const randX = (Math.random() > Math.random() * 2);
				const randY = (Math.random() > Math.random() * 3);

				if (randX) {
					particle.position.x += ((particle.delta.x * this.settings.speed) / 1500);
				}

				if (!randY) {
					particle.position.y -= ((particle.delta.y * this.settings.speed) / 800);
				}

				if (particle.position.x > this._canvas.width) {
					particle.position.x = -7;
				} else if (particle.position.x < -7) {
					particle.position.x = this._canvas.width;
				}

				if (particle.position.y > this._canvas.height) {
					particle.position.y = -7;
					particle.position.x = randomInt(this._canvas.width);
				} else if (particle.position.y < -7) {
					particle.position.y = this._canvas.height;
					particle.position.x = randomInt(this._canvas.width);
				}

				if (this._fadeCount != null) {
					particle.opacity -= 0.02;
				} else {
					particle.opacity -= 0.005;
				}

				if (particle.opacity <= 0) {
					particle.opacity = (this._fadeCount == null) ? 1 : 0;
				}
			});

			this.drawFrame(time);

			if (this._fadeCount == null) {
				this.updateCanvas();
			} else {
				this._fadeCount -= 1;
				if (this._fadeCount < 0) {
					window.cancelAnimationFrame(this._animationHandle);
				} else {
					this.updateCanvas();
				}
			}
		});
	}

	private createParticles(): void {
		this._particles = [];

		for (let i = 0; i < this.settings.count; ++i) {
			let color = this.settings.color;

			if (color === 'rainbow') {
				color = '#' + ('000000' + randomInt(16777215).toString(16)).slice(-6);
			} else if (color instanceof Array) {
				color = color[i % this.settings.color.length];
			}

			this._particles.push({
				color: color,
				delta: {
					x: randomInt(1000) - 500,
					y: randomInt(1000) - 500
				},
				opacity: undefined,
				position: {
					x: randomInt(this._canvas.width),
					y: randomInt(this._canvas.height)
				},
				style: randomItem(this._sprites),
				size: parseFloat((Math.random() * 2).toFixed(2))
			});
		}
	}
}
