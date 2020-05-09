import { getValue } from '@tstack/core';

/** used for elements like the autocomeplete that display options */
export class TskOption<T> {
	disabled: boolean;
	viewValue: string;
	value: T;

	static createOptions<T>(values: T[], viewProperty: string): TskOption<T>[];
	static createOptions<T>(values: T[], viewValueGetter: (value: T) => string): TskOption<T>[];
	static createOptions<T>(values: T[], viewProperty: string | ((value: T) => string)): TskOption<T>[] {
		if (!(values instanceof Array)) { return []; }

		const viewValueGetter = (typeof viewProperty === 'function')
			? viewProperty
			: (value: T) => getValue(value, viewProperty);

		return values.map((value) => {
			const option = new TskOption<T>();
			option.viewValue = viewValueGetter(value);
			option.value = value;

			return option;
		});
	}
}
