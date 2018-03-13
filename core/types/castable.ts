export interface Castable {
	cast<ReturnT extends this | Array<this>>(objectToCast: any): ReturnT;
}
