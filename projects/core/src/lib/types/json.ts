/** JSON array. */
export type JsonArray = JsonValue[];

/** JSON object. */
export type JsonObject = { [key: string]: JsonValue; };

/** JSON primative. */
export type JsonPrimative = string | number | boolean | null | undefined;

/** JSON value. */
export type JsonValue = JsonArray | JsonObject | JsonPrimative;