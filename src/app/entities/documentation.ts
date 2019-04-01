import { Entity } from '@tstack/core';

import { Example } from './example';

export class Documentation extends Entity {
	description: string;
	name: string;
	private _examples: Example[];

	get examples(): Example[] {
		return this._examples;
	}
	set examples(examples: Example[]) {
		this._examples = Example.cast<Example[]>(examples);
	}
}
