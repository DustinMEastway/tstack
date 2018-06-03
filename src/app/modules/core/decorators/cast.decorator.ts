import { getNestedValue, setNestedValue } from '../../core/functions/object';
import { Castable } from '../../core/types/castable';

export interface CastDecoratorIdConfig {
	/** @property {string} getId deepkeyof the set object to get the id property from */
	getId: string;

	/** @property {string} setId deepkeyof the decorated object (target) to set the id property on */
	setId: string;
}

/**
 * Property/Accessor decorator that casts input values before setting them (optionally set and id when set is called)
 * @param castType with a cast method used to convert set values to type the needed type
 * @param [idConfig] used to set an id when set is called
 */
export function Cast<T extends Castable>(castType: T, idConfig?: CastDecoratorIdConfig): any {
	return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
		// stored object casted into the requested type
		let castedObject: T | T[];
		// object to store the getter & setter on to return
		const propertyObject: TypedPropertyDescriptor<T | T[]> = {
			enumerable: true,
			configurable: true
		};

		// throw an error if a there is a getter without a setter since they will not be able to access the casted object
		if (descriptor && descriptor.set == null) {
			console.error('Error: property ' + propertyKey + ' is using @Cast with a getter and without a setter');
		}

		// if the descriptor does not have a getter, then use the default (return casted objected), otherwise use the one in the descriptor
		propertyObject.get = (descriptor == null || descriptor.get == null) ? () => { return castedObject; } : descriptor.get;

		propertyObject.set = (value: any) => {
			// cast object to the needed type
			castedObject = (value != null) ? castType.cast(value) : null;

			// if the ids should be set, then get the getId from the casted object and set it on the target
			if (idConfig != null) {
				setNestedValue(target, getNestedValue(castedObject, idConfig.getId), idConfig.setId);
			}

			// call the existing setter if there was one
			if (descriptor && descriptor.set) { descriptor.set(castedObject); }
		};

		return propertyObject;
	};
}
