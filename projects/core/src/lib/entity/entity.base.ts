export class EntityBase {
	/**
	 * casts an object into type this
	 * @param item to cast into type this
	 * @returns item after being cast
	 */
	static castObject<ThisT extends EntityBase = any>(item: any): ThisT {
		if (item == null) { return null; }

		return Object.assign(new this(), item) as any;
	}

	/**
	 * casts an array of objects into type this[]
	 * @param items to cast into type this[]
	 * @returns items after being cast
	 */
	static castArray<ThisT extends EntityBase = any>(items: any[]): ThisT[] {
		if (!(items == null || items instanceof Array)) { throw Error('EntityBase.castArray: called with a non-array type'); }

		return (items != null) ? items.map((item) => this.castObject(item)) : null;
	}

	/**
	 * casts an object or an array of objects into type this or this[] respectively
	 * @param source to cast into type this or this[] depending on its type
	 * @returns souce after being cast
	 */
 	static cast<ThisT extends EntityBase = any>(source: null | undefined): ThisT;
 	static cast<ThisT extends EntityBase = any>(source: any[]): ThisT[];
 	static cast<ReturnT extends EntityBase | EntityBase[] = any>(source: any): ReturnT;
	static cast<ThisT extends EntityBase = any>(source: any): ThisT | ThisT[] {
		return (source instanceof Array) ? this.castArray<ThisT>(source) : this.castObject<ThisT>(source);
	}

	/**
	 * assigns the properties from the source object onto this object
	 * @param source to clone the properties of
	 * @returns this after taking the properties of souce
	 */
	assign<T = any>(source: Partial<T>): this {
		return Object.assign(this, source);
	}

	/**
	 * clones the properties from the source object onto this object
	 * @param source to clone the properties of
	 * @returns this after taking the properties of souce
	 *
	 * @depricated use assign
	 */
	clone(source: any): this {
		console.warn('EntityBase.clone is depricated, please use EntityBase.assign instead');
		return this.assign(source);
	}
}
