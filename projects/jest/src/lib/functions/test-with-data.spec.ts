import { testWithData } from './test-with-data';

type MockTestRecord = [ number, string, boolean ];
const mockTestRecords: MockTestRecord[] = [
  [ 1, 'foo', false ],
  [ 0, '', true ]
];

let mockTestFn: jest.Mock<Promise<void>, MockTestRecord>;
let mockJestTest: jest.Mock<void, Parameters<jest.It>>;
let _jestTestMethod: jest.It;

beforeEach(() => {
  // mock Jest's `test` method to keep `testWithData` from calling it
  _jestTestMethod = test;
  mockJestTest = jest.fn(fakeTest);
  test = mockJestTest as any;

  // set up a fake test fn that does nothing with the test args
  mockTestFn = jest.fn<Promise<void>, MockTestRecord>(() => Promise.resolve());
});

afterEach(() => {
  // put back Jest's `test` method
  test = _jestTestMethod;
});

test('should error when no test records exist', () => {
  // arrange / act / assert
  expect(() => testWithData('', [], mockTestFn)).toThrowError();
});

test('should call test with each record', () => {
  // arrange / act
  testWithData('', mockTestRecords, mockTestFn);

  // assert
  expect(mockJestTest.mock.calls.length).toEqual(mockTestRecords.length);
});

test('should add data to the test name', () => {
  // arrange
  const baseName = 'fooBar';

  // act
  testWithData(baseName, mockTestRecords, mockTestFn);

  // assert
  mockTestRecords.forEach((mockTestRecord, testIndex) => {
    const expectedName = `${baseName} (${JSON.stringify(mockTestRecord)})`;
    const actualName = mockJestTest.mock.calls[testIndex][0];
    expect(actualName).toEqual(expectedName);
  });
});

test('should pass test fn output to jest test', () => {
  // arrange
  const expectedReturn = Promise.resolve();
  let actualReturn: Promise<void> | null = null;
  mockTestFn.mockReturnValueOnce(expectedReturn);
  mockJestTest.mockImplementation((_, fn) => {
    actualReturn = fn && fn(createFakeDone());
  });

  // act
  testWithData('', [ mockTestRecords[0] ], mockTestFn);

  // assert
  expect(actualReturn).toBe(expectedReturn)
});


/** Fake test method, just calls the test function it is provided. */
function fakeTest(...[ , fn ]: Parameters<jest.It>): void {
  if (fn != null) {
    fn(createFakeDone());
  }
}

/** Fake jest.DoneCallback used to call test functions */
function createFakeDone(): jest.DoneCallback {
  const fakeDone: jest.DoneCallback = () => {
    // intentionally left blank
  };
  fakeDone.fail = () => {
    // intentionally left blank
  };

  return fakeDone;
}