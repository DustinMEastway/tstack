import { CustomJsonConfig, CustomJsonType } from './custom-json-type';
import { JsonObject } from './json';
import { jsonConfigSym } from './symbols';

export class ObjectBase implements CustomJsonType {
  /** @inheritdoc */
  [jsonConfigSym]?: CustomJsonConfig;
  /** @inheritdoc */
  toJSON?(): JsonObject;
}