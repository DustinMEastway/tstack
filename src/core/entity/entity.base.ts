export class EntityBase {
	/**
	 * casts an object into type this
	 * @param item to cast into type this
	 * @returns item after being cast
	 */
	static castObject<ThisT extends EntityBase = any>(item: any): ThisT {
		if (item == null) { return null; }

		return Object.assign(new this(), item) as any;;
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
	static cast<ReturnT extends EntityBase | EntityBase[] = any>(source: any): ReturnT {
		// eastwayd: this should be a one line return, but sadly angular-compiler's strictMetadataEmit errors if it is
		const newObjectOrArray: any = (source instanceof Array) ? this.castArray(source) : this.castObject(source);

		return newObjectOrArray;
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
