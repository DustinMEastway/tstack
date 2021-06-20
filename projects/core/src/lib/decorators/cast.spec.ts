import { Cast, ObjectBase } from '@tstack/core';

class FakePropertyClass extends ObjectBase {
  @Cast(FakePropertyClass)
  inner?: FakePropertyClass;
}

class FakeClass extends ObjectBase {
  @Cast(FakePropertyClass)
  castProperty?: FakePropertyClass;
}

let fakeCastObj: FakeClass;

beforeEach(() => {
  fakeCastObj = new FakeClass();
  fakeCastObj.castProperty = new FakePropertyClass();
  fakeCastObj.castProperty.inner = new FakePropertyClass();
});

test('casting inner properties when assigning new from JSON', () => {
  // arrange
  const json = JSON.parse(JSON.stringify(fakeCastObj));

  // act
  const copiedObj = Object.assign(new FakeClass(), json);

  // assert
  expect(copiedObj).toBeInstanceOf(FakeClass);
  expect(copiedObj.castProperty).toBeInstanceOf(FakePropertyClass);
  expect(copiedObj.castProperty.inner).toBeInstanceOf(FakePropertyClass);
});