export interface Type<T, ArgsT extends any[] = []> extends Function {
  new (...args: ArgsT): T;
}