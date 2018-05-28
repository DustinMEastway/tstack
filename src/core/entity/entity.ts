import { EntityBase } from './entity.base';

export abstract class Entity extends EntityBase {
	protected abstract _idProperties: string[];

	/** idProperties array of properties used to compare two objects of this type */
	get idProperties(): Array<string> {
		return this._idProperties;
	}
}
