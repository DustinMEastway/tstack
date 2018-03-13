/**
 * Property/Accessor decorator that casts input values before setting them (optionally set and id when set is called)
 * @param {Type<T>} castType - type with a cast method used to convert set values to type T
 * @param {Object?} idConfiguration - used to set an id when set is called
 * @param {keyof(T)} idConfiguration.getId - propertyKey to get off of the the input value when set is called
 * @param {string} idConfiguration.setId - propertyKey to set on target when set is called
 */
export function Cast<T>(castType: { cast(source: any): T }, idConfiguration?: { getId: keyof(T), setId: string }) {
	return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
		let castedObject: T;
		const propertyObject: TypedPropertyDescriptor<T> = {
			enumerable: true,
			configurable: true
		};

		// make sure that there is not a getter without a setter
		if (descriptor && descriptor.set == null) {
			console.error('Error: property ' + propertyKey + ' is using @Cast with a getter and without a setter');
		}

		// if descriptor is null then, there isn't a getter or setter so use the default getter
		if (descriptor == null) {
			propertyObject.get = () => { return castedObject; };
		// if the descriptor has a getter then use it
		} else if (descriptor.get) {
			propertyObject.get = descriptor.get;
		}

		propertyObject.set = (value: T) => {
			castedObject = (value != null) ? castType.cast(value) : null;
			// if the idConfiguration exists the set the target's id to the casted object's id
			if (idConfiguration != null && castedObject != null) { target[idConfiguration.setId] = castedObject[idConfiguration.getId]; }
			// call the existing setter if there was one
			if (descriptor && descriptor.set) { descriptor.set(castedObject); }
		};

		return propertyObject;
	};
}
