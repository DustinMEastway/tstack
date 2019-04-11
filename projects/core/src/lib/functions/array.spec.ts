import { hasDuplicates } from './array';

class Temp {
	uniqueProp: number;
	duplicateProp: number;
	objProp: {
		deepProp: number;
	};
}

describe('hasDuplicates', () => {
	let baseItems: Temp[];

	beforeEach(() => {
		baseItems = [
			Object.assign(new Temp(), { uniqueProp: 0, duplicateProp: 0, objProp: { deepProp: 3 } }),
			Object.assign(new Temp(), { uniqueProp: 1, duplicateProp: 0, objProp: { deepProp: 5 } }),
			Object.assign(new Temp(), { uniqueProp: 2, duplicateProp: 0, objProp: { deepProp: 1 } }),
		];
	});

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

	it('should return false when values of the given property are not duplicated', () => {
		// arrange / act / asserta
		expect(hasDuplicates(baseItems, { property: 'uniqueProp' })).toEqual(false);
	});

	it('should return true when values of the given property are duplicated', () => {
		// arrange / act / asserta
		expect(hasDuplicates(baseItems, { property: 'duplicateProp' })).toEqual(true);
	});

	it('should allow deep properties to be used to check for duplicates', () => {
		// arrange / act / asserta
		expect(hasDuplicates(baseItems, { property: 'objProp.deepProp' })).toEqual(false);
	});

	it('should accept a comparator that can be used to sort and determine equality', () => {
		// arrange / act / asserta
		expect(hasDuplicates(
			baseItems,
			{
				comparator: (item1, item2) => {
					expect(item1 instanceof Temp).toEqual(true);
					expect(item2 instanceof Temp).toEqual(true);

					return item1.uniqueProp - item2.uniqueProp;
				}
			}
		)).toEqual(false);
	});

	it('should send the comparator the value of the property when one is provided', () => {
		// arrange / act / asserta
		expect(hasDuplicates(
			baseItems,
			{
				comparator: (uniqueValue1, uniqueValue2) => {
					expect(typeof uniqueValue1).toEqual('number');
					expect(typeof uniqueValue2).toEqual('number');

					return uniqueValue1 - uniqueValue2;
				},
				property: 'uniqueProp'
			}
		)).toEqual(false);
	});

	it('should return true when the comparator finds duplicate items', () => {
		// arrange / act / asserta
		expect(hasDuplicates(
			baseItems,
			{ comparator: (item1, item2) => item1.duplicateProp - item2.duplicateProp }
		)).toEqual(true);
	});
});
