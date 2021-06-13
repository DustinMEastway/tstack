/** Type constructor that creates an instance of type @see T using @see ArgsT constructor arguments. */
export interface Type<T, ArgsT extends any[] = []> extends Function {
  new (...args: ArgsT): T;
}