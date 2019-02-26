// todo: upgrade ArgT using tuples after upgrade to TypeScript 3+
export type Type<T, ArgT = any> = new (...args: ArgT[]) => T;
