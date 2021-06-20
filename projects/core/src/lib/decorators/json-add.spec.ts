import { JsonAdd, JsonObject, JsonValue, ObjectBase } from '@tstack/core';

describe('basic object', () => {
  class FakeClass extends ObjectBase {
    @JsonAdd()
    field = 'foo';
    propertyValue = 'bar';

    @JsonAdd()
    get getterProperty(): string {
      return this.propertyValue;
    }

    @JsonAdd()
    get getSetProperty(): string {
      return this.propertyValue;
    }
    set getSetProperty(getSet: string) {
      this.propertyValue = getSet;
    }
  }

  let fakeObj: FakeClass;
  let jsonObj: Record<keyof(FakeClass), JsonValue>;

  beforeEach(() => {
    fakeObj = new FakeClass();
    jsonObj = JSON.parse(JSON.stringify(fakeObj));
  });

  test('adding a field', () => {
    // arrange / act / assert
    expect(jsonObj.field).toBe(fakeObj.field);
  });

  test('adding a getter property', () => {
    // arrange / act / assert
    expect(jsonObj.getterProperty).toBe(fakeObj.getterProperty);
  });

  test('adding a getter/setter property', () => {
    // arrange / act / assert
    expect(jsonObj.getSetProperty).toBe(fakeObj.getSetProperty);
  });
});

describe('custom toJSON object', () => {
  class FakeClassWithToJson extends ObjectBase {
    static readonly additionalName = 'temp';

    @JsonAdd()
    get getterProperty(): number {
      return 12;
    }

    /** @inheritdoc */
    toJSON(): JsonObject {
      return { additionalName: FakeClassWithToJson.additionalName };
    }
  }

  let fakeObj: FakeClassWithToJson;
  let jsonObj: Record<keyof(FakeClassWithToJson) | 'additionalName', JsonValue>;

  beforeEach(() => {
    fakeObj = new FakeClassWithToJson();
    jsonObj = JSON.parse(JSON.stringify(fakeObj));
  });

  test('adding a getter property', () => {
    // arrange / act / assert
    expect(jsonObj.getterProperty).toBe(fakeObj.getterProperty);
    expect(jsonObj.additionalName).toBe(FakeClassWithToJson.additionalName);
  });
});