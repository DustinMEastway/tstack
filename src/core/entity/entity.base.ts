export class EntityBase {
	/**
	 * casts an object into type this
	 * @param item to cast into type this
	 * @returns item after being cast
	 */
	static castObject<ThisT extends EntityBase = any>(item: any): ThisT {
		return Object.assign(new this(), item) as any;
	}

	/**
	 * casts an array of objects into type this[]
	 * @param items to cast into type this[]
	 * @returns items after being cast
	 */
	static castArray<ThisT extends EntityBase = any>(items: any[]): ThisT[] {
		return (items instanceof Array) ? items.map((item) => this.castObject(item)) : [];
	}

	/**
	 * casts an object or an array of objects into type this or this[] respectively
	 * @param source to cast into type this or this[] depending on its type
	 * @returns souce after being cast
	 */
	static cast<ReturnT extends EntityBase | EntityBase[] = any>(source: any): ReturnT {
		return (source instanceof Array) ? this.castArray(source) as any : this.castObject(source);
	}

	/**
	 * clones the properties from the source object onto this object
	 * @param source to clone the properties of
	 * @returns this after taking the properties of souce
	 */
	public clone(source: any): this {
		return Object.assign(this, source);
	}
}
