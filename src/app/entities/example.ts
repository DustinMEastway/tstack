import { Entity } from '@tstack/core';

export class Example extends Entity {
	private _content: string;
	name: string;

	get content(): string | string[] {
		return this._content;
	}
	set content(content: string | string[]) {
		this._content = (content instanceof Array) ? content.join('\n') : content;
	}
}
