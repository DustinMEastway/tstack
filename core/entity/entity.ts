import { EntityBase } from 'dme-modules/core';

export abstract class Entity extends EntityBase {
	/**
	 * [_idProperties array of properties used to compare two objects of this type]
	 * technically type Array<string> because nested properties seperated by '.' characters are allowed
	 * @type {Array<keyof(this)>}
	 */
	protected abstract _idProperties: Array<string>;

	/**
	 * [idProperties array of properties used to compare two objects of this type]
	 * technically type Array<string> because nested properties seperated by '.' characters are allowed
	 * @type {Array<keyof(this)>}
	 */
	get idProperties(): Array<string> {
		return this._idProperties;
	}
}
