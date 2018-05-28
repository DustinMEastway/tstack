import { EntityBase } from './entity.base';
export class Entity extends EntityBase {
    /**
     * idProperties array of properties used to compare two objects of this type
     * @type {Array<keyof(this)>}
     */
    get idProperties() {
        return this._idProperties;
    }
}
