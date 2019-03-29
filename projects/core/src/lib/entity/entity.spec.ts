import { Entity } from './entity';

class TestEntity extends Entity {
	firstName: string;
	lastName: string;

	constructor() {
		super();
	}

	getFullName(): string {
		if (this.firstName && this.lastName) {
			return `${this.firstName} ${this.lastName}`;
		}

		return this.firstName || this.lastName || '';
	}
}

describe('Entity', () => {
	let entity: TestEntity;
	const jsonObject = {
		firstName: 'Foo',
		lastName: 'Bar'
	};

	beforeEach(() => {
		entity = new TestEntity();
	});

	describe('clone', () => {
		it('should assign values from a JSON object', () => {
			// arrange
			expect(entity.getFullName()).toEqual('');

			// act
			entity.clone(jsonObject);

			// assert
			expect(entity.getFullName()).toEqual('Foo Bar');
		});
	});

	describe('castObject', () => {
		it('should cast a JSON object into the entity type', () => {
			// arrange
			expect(jsonObject instanceof TestEntity).toBe(false);

			// act
			const castObject = TestEntity.castObject(jsonObject);

			// assert
			expect(castObject instanceof TestEntity).toBe(true);
		});

		it('should cast null into null', () => {
			// arrange / act
			const castObject = TestEntity.castObject<TestEntity>(null);

			// assert
			expect(castObject).toBeNull();
		});
	});

	describe('castArray', () => {
		it('should map an array of json objects using castObject', () => {
			// arrange
			const jsonObjects: Object[] = [ { firstName: 'foo1' }, { firstName: 'foo2' }, { firstName: 'foo3' } ];
			const recievedItems: Object[] = [];
			const sentItems: TestEntity[] = [];
			spyOn(TestEntity, 'castObject').and.callFake((recievedItem: Object) => {
				recievedItems.push(recievedItem);
				const sentItem = Object.assign(new TestEntity(), recievedItem);
				sentItems.push(sentItem);

				return sentItem;
			});

			// act
			const result = TestEntity.castArray(jsonObjects);

			// assert
			expect(recievedItems.length).toEqual(jsonObjects.length);
			expect(recievedItems.every((recievedItem, index) => recievedItem === jsonObjects[index])).toEqual(true);
			expect(sentItems.length).toEqual(result.length);
			expect(sentItems.every((sentItem, index) => sentItem === result[index]));
		});

		it('should map null to null', () => {
			// arrange / act / assert
			expect(TestEntity.castArray(null)).toBeNull();
		});

		it('should throw an error if a non-null value is provided that is not an array', () => {
			// arrange / act / assert
			expect(() => TestEntity.castArray(4 as any)).toThrow(Error('EntityBase.castArray: called with a non-array type'));
		});
	});

	describe('cast', () => {
		it('should call castObject for non-array values', () => {
			// arrange
			spyOn(TestEntity, 'castObject').and.returnValue(jsonObject);

			// act
			const result = TestEntity.cast({});

			// assert
			expect(result).toBe(jsonObject);
		});

		it('should call castArray for array values', () => {
			// arrange
			const mockReturnValue = [ { firstName: 'Test' } ];
			spyOn(TestEntity, 'castArray').and.returnValue(mockReturnValue);

			// act
			const result = TestEntity.cast([]);

			// assert
			expect(result).toBe(mockReturnValue);
		});

		it('should call castObject for null values', () => {
			// arrange
			spyOn(TestEntity, 'castObject').and.returnValue(jsonObject);

			// act
			const result = TestEntity.cast(null);

			// assert
			expect(result).toBe(jsonObject);
		});
	});
});
