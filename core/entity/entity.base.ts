export class EntityBase {
	static castObject<ReturnT = any>(sourceObject: any): ReturnT {
		return (sourceObject == null) ? sourceObject : Object.assign(new this(), sourceObject) as any;
	}

	static castArray<ReturnT = any>(sourceObject: Array<any>): Array<ReturnT> {
		return (sourceObject == null) ? sourceObject : sourceObject.map(this.castObject);
	}

	static cast<ReturnT = any>(sourceObject: any): ReturnT {
		return (sourceObject instanceof Array) ? this.castArray(sourceObject) as any : this.castObject(sourceObject);
	}
}
