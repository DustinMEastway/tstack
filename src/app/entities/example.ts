import { Entity, Type } from '@tstack/core';

export class Example extends Entity {
	contentFile: string;
	name: string;
	private _content: string | Type<any>;

	get content(): string | string[] | Type<any> {
		return this._content;
	}
	set content(content: string | string[] | Type<any>) {
		this._content = (content instanceof Array) ? content.join('\n') : content;
	}

	get contentType(): 'string' | 'function' {
		return typeof this._content as 'string' | 'function';
	}
}
