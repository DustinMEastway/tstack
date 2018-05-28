export class EntityBase {
    /**
     * casts an object into type this
     * @param {any} item to cast into type this
     * @returns {this} item after being cast
     */
    static castObject(item) {
        return Object.assign(new this(), item);
    }
    /**
     * casts an array of objects into type this[]
     * @param {any[]} items to cast into type this[]
     * @returns {this[]} items after being cast
     */
    static castArray(items) {
        return (items instanceof Array) ? items.map((item) => this.castObject(item)) : [];
    }
    /**
     * casts an object or an array of objects into type this or this[] respectively
     * @param {any|any[]} source to cast into type this or this[] depending on its type
     * @returns {this|this[]} souce after being cast
     */
    static cast(source) {
        return (source instanceof Array) ? this.castArray(source) : this.castObject(source);
    }
    /**
     * clones the properties from the source object onto this object
     */
    clone(source) {
        return Object.assign(this, source);
    }
}
