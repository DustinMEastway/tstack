import { IsBetweenConfig } from '../types/is-between-config';
import { isBetween } from './object';

class Temp {
	id: number;
}

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
});
