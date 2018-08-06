import { getValue } from '@tstack/core';

export class TskOption<T> {
	disabled: boolean;
	viewValue: string;
	value: T;

	static createOptions<T>(values: T[], viewProperty: string): TskOption<T>[] {
		if (!(values instanceof Array)) { return []; }

		return values.map((value) => {
			const option = new TskOption<T>();
			option.viewValue = getValue(value, viewProperty);
			option.value = value;

			return option;
		});
	}
}
