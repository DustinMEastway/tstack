import { IsBetweenConfig } from '../types/is-between-config';
import { getValue, isBetween } from './object';

class Temp {
	id: number;
}

describe('getValue', () => {
	const value = { foo: { fooId: 1, bar: { barId: 123, barProp: 'FooBar' } } };
	let property = 'foo';

	it('should get the full input if property is undefined', () => {
		// arrange
		property = undefined;

		// act / assert
		expect(getValue(value, property)).toBe(value);
	});

	it('should get the full input if property is null', () => {
		// arrange
		property = null;

		// act / assert
		expect(getValue(value, property)).toBe(value);
	});

	it('should get the full input if property is an empty string', () => {
		// arrange
		property = '';

		// act / assert
		expect(getValue(value, property)).toBe(value);
	});
});

describe('isBetween', () => {
	const min = 0;
	const max = 5;

	it('should return true for a value between min and max', () => {
		// arrange / act / assert
		expect(isBetween((min + max) / 2, min, max)).toEqual(true);
	});

	it('should return true for a value equal to min', () => {
		// arrange / act / assert
		expect(isBetween(min, min, max)).toEqual(true);
	});

	it('should return true for a value equal to max', () => {
		// arrange / act / assert
		expect(isBetween(max, min, max)).toEqual(true);
	});

	it('should return false for a value under min', () => {
		// arrange / act / assert
		expect(isBetween(min - 1, min, max)).toEqual(false);
	});

	it('should return false for a value over max', () => {
		// arrange / act / assert
		expect(isBetween(max + 1, min, max)).toEqual(false);
	});

	it('should return true when value is equal to min which is equal to max', () => {
		// arrange / act / assert
		expect(isBetween(min, min, min)).toEqual(true);
	});

	describe('config.comparator', () => {
		const minObj: Temp = { id: min };
		const maxObj: Temp = { id: max };
		const config: IsBetweenConfig<Temp> = {
			comparator: (item1, item2) => item1.id - item2.id
		};

		it('should return true for a value between min and max', () => {
			// arrange / act / assert
			expect(isBetween({ id: (minObj.id + maxObj.id) / 2 }, minObj, maxObj, config)).toEqual(true);
		});

		it('should return true for a value equal to min', () => {
			// arrange / act / assert
			expect(isBetween(minObj, minObj, maxObj, config)).toEqual(true);
		});

		it('should return true for a value equal to max', () => {
			// arrange / act / assert
			expect(isBetween(maxObj, minObj, maxObj, config)).toEqual(true);
		});

		it('should return false for a value under min', () => {
			// arrange / act / assert
			expect(isBetween({ id: minObj.id - 1 }, minObj, maxObj, config)).toEqual(false);
		});

		it('should return false for a value over max', () => {
			// arrange / act / assert
			expect(isBetween({ id: maxObj.id + 1 }, minObj, maxObj, config)).toEqual(false);
		});
	});

	describe('config.endpoints=min', () => {
		const config: IsBetweenConfig = {
			endpoints: 'min'
		};

		it('should return true for a value between min and max', () => {
			// arrange / act / assert
			expect(isBetween((min + max) / 2, min, max, config)).toEqual(true);
		});

		it('should return true for a value equal to min', () => {
			// arrange / act / assert
			expect(isBetween(min, min, max, config)).toEqual(true);
		});

		it('should return false for a value equal to max', () => {
			// arrange / act / assert
			expect(isBetween(max, min, max, config)).toEqual(false);
		});

		it('should return false for a value under min', () => {
			// arrange / act / assert
			expect(isBetween(min - 1, min, max, config)).toEqual(false);
		});

		it('should return false for a value over max', () => {
			// arrange / act / assert
			expect(isBetween(max + 1, min, max, config)).toEqual(false);
		});
	});

	describe('config.endpoints=max', () => {
		const config: IsBetweenConfig = {
			endpoints: 'max'
		};

		it('should return true for a value between min and max', () => {
			// arrange / act / assert
			expect(isBetween((min + max) / 2, min, max, config)).toEqual(true);
		});

		it('should return false for a value equal to min', () => {
			// arrange / act / assert
			expect(isBetween(min, min, max, config)).toEqual(false);
		});

		it('should return true for a value equal to max', () => {
			// arrange / act / assert
			expect(isBetween(max, min, max, config)).toEqual(true);
		});

		it('should return false for a value under min', () => {
			// arrange / act / assert
			expect(isBetween(min - 1, min, max, config)).toEqual(false);
		});

		it('should return false for a value over max', () => {
			// arrange / act / assert
			expect(isBetween(max + 1, min, max, config)).toEqual(false);
		});
	});

	describe('config.endpoints=neither', () => {
		const config: IsBetweenConfig = {
			endpoints: 'neither'
		};

		it('should return true for a value between min and max', () => {
			// arrange / act / assert
			expect(isBetween((min + max) / 2, min, max, config)).toEqual(true);
		});

		it('should return false for a value equal to min', () => {
			// arrange / act / assert
			expect(isBetween(min, min, max, config)).toEqual(false);
		});

		it('should return false for a value equal to max', () => {
			// arrange / act / assert
			expect(isBetween(max, min, max, config)).toEqual(false);
		});

		it('should return false for a value under min', () => {
			// arrange / act / assert
			expect(isBetween(min - 1, min, max, config)).toEqual(false);
		});

		it('should return false for a value over max', () => {
			// arrange / act / assert
			expect(isBetween(max + 1, min, max, config)).toEqual(false);
		});
	});

	describe('swapped min and max', () => {
		it('should return true when value is between min and max', () => {
			// arrange / act / assert
			expect(isBetween((min + max) / 2, max, min)).toEqual(true);
		});

		it('should return false when value is under min', () => {
			// arrange / act / assert
			expect(isBetween(min - 1, max, min)).toEqual(false);
		});

		it('should return false when value is over max', () => {
			// arrange / act / assert
			expect(isBetween(max + 1, max, min)).toEqual(false);
		});
	});
});
