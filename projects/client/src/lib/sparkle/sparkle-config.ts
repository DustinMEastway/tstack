/** configuration for the tskSparkle directive */
export interface TskSparkleConfig {
	/** @prop color (or colors) used to generate sparkles (use 'rainbow' for an assortment of colors) */
	color: string | string[];
	/** @prop number of sparkle particles to create */
	count: number;
	/** @prop number of pixles out of the sparkling component to allow sparkles to be created */
	overlap: number;
	/** @prop whether the component should be sparkling */
	sparkling: boolean;
	/** @prop how fast to fade sparkles in and out */
	speed: number;
}
