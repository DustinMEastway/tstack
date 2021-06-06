import { Type } from './type';

class FakeEmptyClass {
  constructor() {
    // intentionally left blank
  }
}

class FakeClassWithParams {
  constructor(public id: number, public name: string) {
    // intentionally left blank
  }
}

test('type without constructor args', () => {
  // arrange
  const fakeType1: Type<any> = FakeEmptyClass;
  const fakeType2: Type<any, []> = FakeEmptyClass;
  const fakeType3: Type<FakeEmptyClass, []> = FakeEmptyClass;

  // act
  const fakeObj1 = new fakeType1();
  const fakeObj2 = new fakeType2();
  const fakeObj3 = new fakeType3();

  // assert
  expect(fakeObj1).toBeInstanceOf(FakeEmptyClass);
  expect(fakeObj2).toBeInstanceOf(FakeEmptyClass);
  expect(fakeObj3).toBeInstanceOf(FakeEmptyClass);
});

test('type with constructor args', () => {
  // arrange
  const params = [ 12, 'Foo' ] as const;
  const fakeType1: Type<any, [ number, string ]> = FakeClassWithParams;
  const fakeType2: Type<FakeClassWithParams, [ number, string ]> = FakeClassWithParams;

  // act
  const fakeObj1 = new fakeType1(...params);
  const fakeObj2 = new fakeType2(...params);

  // assert
  expect(fakeObj1).toBeInstanceOf(FakeClassWithParams);
  expect(fakeObj2).toBeInstanceOf(FakeClassWithParams);
});