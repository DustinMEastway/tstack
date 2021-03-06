/** object used to track a sparkle particle on the screen */
export interface TskSparkleParticle {
	color: string;
	delta: {
		x: number;
		y: number;
	};
	opacity: number;
	position: {
		x: number;
		y: number;
	};
	style: number;
	size: number;
}
