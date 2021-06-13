/** JSON array. */
export type JsonArray = JsonPrimative[];

/** JSON object. */
export type JsonObject = Record<string, JsonPrimative>;

/** JSON primative. */
export type JsonPrimative = string | number | boolean | null;

/** JSON value. */
export type JsonValue = JsonArray | JsonObject | JsonPrimative;