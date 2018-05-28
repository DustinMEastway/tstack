/**
 * configuration for castString method
 * @property {'lower'|'same'|'upper'} [case] to cast into after converting to string
 * @property {boolean} [trim] the string if true
 */
export interface CastStringConfig {
	case?: 'lower' | 'same' | 'upper';
	trim?: boolean;
}

/**
 * casts the given item into a string if possible, if not, an empty string is returned
 * @param item to cast into a string
 * @param [config] options to apply to the string after it has been cast
 */
export function castString(item: any, config?: CastStringConfig): string {
	if (item == null || (typeof item !== 'string' && typeof item.toString !== 'function')) { return ''; }

	// try casting into a string
	let stringValue: string = item.toString();
	if (typeof stringValue !== 'string') { return ''; }

	if (config) {
		// trim string
		if (config.trim) {
			stringValue = stringValue.trim();
		}
		// convert string to proper case
		if (config.case === 'lower') {
			stringValue = stringValue.toLowerCase();
		} else if (config.case === 'upper') {
			stringValue = stringValue.toUpperCase();
		}
	}

	return stringValue;
}

/**
 * gets a nested value without throwing an error if the nested property is not on the item
 * @param item to get the value from
 * @param nestedProperty to get
 * @returns value of nestedProperty pulled from the source object
 */
export function getNestedValue<ReturnT = any, ItemT = any>(item: ItemT, nestedProperty = ''): ReturnT {
	const properties = nestedProperty.split(/[\.\[\]]/);
	let valueToReturn: any = item;

	for (const property of properties) {
		if (valueToReturn != null && property.trim() !== '') {
			valueToReturn = (parseInt(property, 10) === NaN) ? valueToReturn[property] : valueToReturn[parseInt(property, 10)];
		} else {
			break;
		}
	}

	return valueToReturn;
}

/**
 * gets each property from the source and sets them on the target
 * @param target object to map values to
 * @param source object to get values from
 * @param overwrite non-null values of target it true
 * @returns target object after the mapping has occurred
 */
export function mapProperties<TargetT>(target: TargetT, source: any, overwrite = true): TargetT {
	for (const property in target) {
		// set the properties value on the target from the source if the source property is getable and the target property is setable
		if ((!Object.getOwnPropertyDescriptor(target, property) || Object.getOwnPropertyDescriptor(target, property).set)
			&& (!Object.getOwnPropertyDescriptor(source, property) || Object.getOwnPropertyDescriptor(source, property).get)
			&& (target[property] == null || overwrite)) {
			target[property] = source[property];
		}
	}

	return target;
}

/**
 * sets a nested value without thowing an error if the nested property is not on the item
 * @param item to set a value on
 * @param value to set the property on item to
 * @param nestedProperty to set on the item
 * @returns item after the property has been set to the given value
 */
export function setNestedValue<ItemT>(item: ItemT, value: any, nestedProperty: string): ItemT {
	const properties = (typeof nestedProperty === 'string') ? nestedProperty.trim().split(/[\.\[\]]/) : [];

	// get the last property in the list that is not an empty string to set
	let propertyToSet: string;
	while ((typeof propertyToSet !== 'string' || propertyToSet.trim() === '') && properties.length > 0) {
		propertyToSet = properties.pop();
	}

	// join the remaining properties to get the object to set the property on
	const objectToSet = getNestedValue(item, properties.join('.'));
	if (objectToSet) {
		objectToSet[propertyToSet] = value;
	}

	return item;
}
