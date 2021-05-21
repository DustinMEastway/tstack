/** Runs the `test` function from Jest for each item in @see dataForTests. */
export function testWithData<T extends any[]>(
  name: string,
  dataForTests: T[],
  testFn: (...params: [ ...T ]) => any
): void {
  if (dataForTests?.length < 1) {
    throw new Error('testWithData: called without any dataForTests');
  }

  dataForTests.forEach(dataForTest => {
    test(
      `${name} (${JSON.stringify(dataForTest)})`,
      () => testFn(...dataForTest)
    );
  });
}