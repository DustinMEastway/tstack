import { EntityBase } from './entity.base';

/**
 * Entity is a class that can be extended by classes that you use to represent data being pulled from your database.
 *
 * Entity contains methods to get json data into your application with the correct type.
 */
export abstract class Entity extends EntityBase {}
