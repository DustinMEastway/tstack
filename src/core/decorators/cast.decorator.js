import { getNestedValue, setNestedValue } from '../functions';
/**
 * Property/Accessor decorator that casts input values before setting them (optionally set and id when set is called)
 * @param {T} castType with a cast method used to convert set values to type the needed type
 * @param {CastDecoratorIdConfig} [idConfig] used to set an id when set is called
 */
export function Cast(castType, idConfig) {
    return function (target, propertyKey, descriptor) {
        // stored object casted into the requested type
        let castedObject;
        // object to store the getter & setter on to return
        const propertyObject = {
            enumerable: true,
            configurable: true
        };
        // throw an error if a there is a getter without a setter since they will not be able to access the casted object
        if (descriptor && descriptor.set == null) {
            console.error('Error: property ' + propertyKey + ' is using @Cast with a getter and without a setter');
        }
        // if the descriptor does not have a getter, then use the default (return casted objected), otherwise use the one in the descriptor
        propertyObject.get = (descriptor == null || descriptor.get == null) ? () => { return castedObject; } : descriptor.get;
        propertyObject.set = (value) => {
            // cast object to the needed type
            castedObject = (value != null) ? castType.cast(value) : null;
            // if the ids should be set, then get the getId from the casted object and set it on the target
            if (idConfig != null) {
                setNestedValue(target, getNestedValue(castedObject, idConfig.getId), idConfig.setId);
            }
            // call the existing setter if there was one
            if (descriptor && descriptor.set) {
                descriptor.set(castedObject);
            }
        };
        return propertyObject;
    };
}
