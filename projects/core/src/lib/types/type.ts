// todo: upgrade ArgT using tuples after upgrade to TypeScript 3+
export interface Type<T, ArgT = any> extends Function {
	new (...args: ArgT[]): T;
}
