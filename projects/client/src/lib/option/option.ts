import { getValue } from '@tstack/core';

export class TskOption<T> {
	disabled: boolean;
	displayValue: string;
	value: T;

	static createOptions<T>(values: T[], displayProperty: string): TskOption<T>[] {
		if (!(values instanceof Array)) { return []; }

		return values.map((value) => {
			const option = new TskOption<T>();
			option.displayValue = getValue(value, displayProperty);
			option.value = value;

			return option;
		});
	}
}
