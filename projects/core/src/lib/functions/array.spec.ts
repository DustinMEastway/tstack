import { hasDuplicates } from './array';

describe('hasDuplicates', () => {
	it('should return false for a unique array', () => {
		// arrange / act / assert
		expect(hasDuplicates([ 0, 1, 2 ])).toEqual(false);
	});

	it('should return true for an array containing duplicates', () => {
		// arrange / act / assert
		expect(hasDuplicates([ 0, 1, 1 ])).toEqual(true);
	});

	it('should differentiate between falsy values', () => {
		// arrange / act / assert
		expect(hasDuplicates([ false, 0, '', null, undefined, NaN ])).toEqual(false);
	});

	it('should differentiate between truthy values', () => {
		// arrange / act / assert
		expect(hasDuplicates([ true, 1, 'a', [], {}, () => {} ])).toEqual(false);
	});
});
