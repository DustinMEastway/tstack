import { CastIntConfig } from '../types/cast-int-config';
import { CastStringConfig } from '../types/cast-string-config';
import { CompareProperty } from '../types/compare-property';

/**
 * converts the case of the given string into camel case
 * @param item to convert to camel case
 * @returns a camel case version of the input string
 */
export function camelCase(item: string): string {
	if (typeof item !== 'string') {
		return item;
	} else if (item.length < 2) {
		return item.toLowerCase();
	}

	// lower the first character, then upper case anything following a space, underscore or dash
	return item.substr(0, 1).toLowerCase() + item.substr(1).replace(/[\s_-]+(.)/g, (match) => {
		return match.substr(1).toUpperCase();
	});
}

/**
 * casts the given item into a boolean, empty strings and are concidered true which is needed for attribute to work property
 * @param value to cast into a boolean
 * @param defaultValue to use if value is null or undefined
 * @returns a boolean value of the given item
 */
export function castBoolean(value: any, defaultValue: boolean = false): boolean {
	if ((value && value !== 'false') || value === '') {
		return true;
	} else if (value == null && defaultValue !== false) {
		return  defaultValue;
	}

	return false;
}

/**
 * casts the given item into an int
 * @param value to cast into an int
 * @param config options to determine how to cast the item into an int
 * @returns an int value of the given item (default value or null if item is NaN)
 */
export function castInt(item: any, config?: CastIntConfig): number {
	config = Object.assign<CastIntConfig, CastIntConfig>({ defaultValue: null, radix: 10 }, config);
	item = parseInt(item, config.radix);

	return isNaN(item) ? config.defaultValue : item;
}

/**
 * casts the given item into a string if possible, if not, an empty string is returned
 * @param item to cast into a string
 * @param [config] options to apply to the string after it has been cast
 * @returns a string value of the given item
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
 * compares two items to determine which item is larger
 * @param item1 to compare
 * @param item2 to compare
 * @param compareProperties array of properties that will be used to compare the two items. Set @see CompareProperty.ascending to false for
 * a descending sort on a property
 * @returns
 */
export function compareItems<T = any>(item1: T, item2: T, ...compareProperties: (string | CompareProperty)[]): -1 | 0 | 1 {
	if (item1 === item2) { return 0; }

	// if there are not any compare properties, then compare the full items
	if (compareProperties.length < 1) { compareProperties = [ '' ]; }

	let returnValue: -1 | 0 | 1 = 0;
	for (const compareProperty of compareProperties) {
		// get the values of each item for the current compare property
		const property = (typeof compareProperty === 'string') ? compareProperty : compareProperty.property;
		const value1 = getValue(item1, property);
		const value2 = getValue(item2, property);

		if (value1 === value2) {
			// if the values are the same, then continue to the next property
			continue;
		} else if (value1 === undefined) {
			// undefined goes at the end of the array (based on JavaScript's default sort)
			returnValue = 1;
		} else if (value1 === null) {
			// null goes after everything other than undefined
			returnValue = (value2 === undefined) ? -1 : 1;
		} else if (value2 == null) {
			// if value1 is not null or undefined and value2 is, then value2 goes after value1
			returnValue = -1;
		} else {
			// if value1 and value2 are not equal or null, then return which one is larger
			returnValue = (value1 > value2) ? 1 : -1;
		}

		// swap the return value if the compare property has ascending set to false
		return (typeof compareProperty === 'string' || compareProperty.ascending) ? returnValue : returnValue * -1 as -1 | 1;
	}

	return 0;
}

/**
 * create a copy of the given item (resulting object will be a json object without methods)
 * @param item to copy
 * @returns a copy of the provided item
 */
export function deepCopy<T>(item: any): T;
export function deepCopy(item: any): any;
export function deepCopy(item: any): any {
	return JSON.parse(JSON.stringify(item));
}

/**
 * gets a value without throwing an error if the property is not on the item
 * @param item to get the value from
 * @param property to get
 * @returns value of property pulled from the source object
 */
export function getValue<T, K extends keyof(T)>(item: T, propertyToGet: K): T[K];
export function getValue<ReturnT = any, ItemT = any>(item: ItemT, propertyToGet?: string): ReturnT;
export function getValue<ReturnT = any, ItemT = any>(item: ItemT, propertyToGet: string = ''): ReturnT {
	const properties = propertyToGet.split(/[\.\[\]]/);
	let valueToReturn: any = item;

	for (const property of properties) {
		if (valueToReturn != null && property.trim() !== '') {
			valueToReturn = (isNaN(parseInt(property, 10))) ? valueToReturn[property] : valueToReturn[parseInt(property, 10)];
		} else {
			break;
		}
	}

	return valueToReturn;
}

/**
 * gets the values of all of the keys on the given item
 * @param item to pull values from
 * @returns values of each property on the item
 */
export function values<T, K extends keyof(T)>(item: T): T[K][];
export function values<T = any>(item: any): T[];
export function values<T, K extends keyof(T)>(item: T): T[K][] {
	return (item == null) ? [] : Object.keys(item).map(key => item[key as K]);
}

/**
 * gets each property from the source and sets them on the target
 * @param target object to map values to
 * @param source object to get values from
 * @param overwrite non-null values of target it true
 * @returns target object after the mapping has occurred
 */
export function mapProperties<TargetT>(target: TargetT, source: any, overwrite: boolean = true): TargetT {
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
 * sets a value without thowing an error if the property is not on the item
 * @param item to set a value on
 * @param value to set the property on item to
 * @param property to set on the item
 * @returns item after the property has been set to the given value
 */
export function setValue<ItemT>(item: ItemT, value: any, property: string): ItemT {
	const properties = (typeof property === 'string') ? property.trim().split(/[\.\[\]]/) : [];

	// get the last property in the list that is not an empty string to set
	let propertyToSet: string;
	while ((typeof propertyToSet !== 'string' || propertyToSet.trim() === '') && properties.length > 0) {
		propertyToSet = properties.pop();
	}

	// join the remaining properties to get the object to set the property on
	const objectToSet = getValue(item, properties.join('.'));
	if (objectToSet) {
		objectToSet[propertyToSet] = value;
	}

	return item;
}
