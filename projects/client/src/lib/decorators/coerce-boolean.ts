import { coerceBooleanProperty} from '@angular/cdk/coercion';

/**
 * Property/Accessor decorator that casts input values before setting them (optionally set and id when set is called)
 * @param castType with a cast method used to convert set values to type the needed type
 * @param [idConfig] used to set an id when set is called
 */
 // TODO: fix how property is set so that getters and setters of the decorated property can access the proper 'this'
export function CoerceBoolean(): any {
	return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
		// stored object coerced into a boolean value
		let coercedValue: boolean;
		// object to store the getter & setter on to return
		const propertyObject: TypedPropertyDescriptor<boolean> = {
			enumerable: true,
			configurable: true
		};

		// throw an error if a there is a getter without a setter since they will not be able to access the casted object
		if (descriptor && descriptor.set == null) {
			console.error('Error: property ' + propertyKey + ' is using @BooleanInput with a getter and without a setter');
		}

		// if the property has a descriptor, then use its get, otherwise return coerced objected
		propertyObject.get = (descriptor == null) ? () => { return coercedValue; } : descriptor.get;

		propertyObject.set = (value: any) => {
			// cast object to the needed type
			coercedValue = coerceBooleanProperty(value);

			// call the existing setter if there was one
			if (descriptor && descriptor.set) { descriptor.set(coercedValue); }
		};

		return propertyObject;
	};
}
