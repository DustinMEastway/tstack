/**
 * mapProperties<TargetT>: gets each property from the source and sets them on the target
 * @param {any} source
 * @param {TargetT} target
 * @param {boolean} overwrite
 * @returns {TargetT} target object after the mapping has occurred
 */
export function mapProperties<TargetT>(source: any, target: TargetT, overwrite: boolean): TargetT {
	for (const property in target) {
		// set the properties value on the target from the source if the source property is getable and the target property is setable
		if ((!Object.getOwnPropertyDescriptor(target, property) || Object.getOwnPropertyDescriptor(target, property).set)
			&& (!Object.getOwnPropertyDescriptor(source, property) || Object.getOwnPropertyDescriptor(source, property).get)) {
			target[property] = source[property];
		}
	}
	return target;
}
