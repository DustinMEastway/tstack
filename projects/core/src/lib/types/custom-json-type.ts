import { JsonObject } from './json';
import { jsonConfigSym } from './symbols';

/** Custom configuration used to modify an object's `toJSON` method. */
export interface CustomJsonConfig {
  /** Extra properties to get and add to the ouput JSON. */
  add: string[];
}

/** Type with a configuration that can be used to create a custom `toJSON` method. */
export interface CustomJsonType {
  /** Custom configuration to be used by @see toJSON to modify @see JSON.stringify output. */
  [jsonConfigSym]?: CustomJsonConfig;
  /** Custom method used to modify @see JSON.stringify output. */
  toJSON?: () => JsonObject;
}