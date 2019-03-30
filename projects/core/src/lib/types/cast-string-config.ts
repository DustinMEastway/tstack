/** configuration for castString method */
export interface CastStringConfig {
 	/** @prop case to cast into after converting to string */
	case?: 'lower' | 'same' | 'upper';
	/** @prop trim the string if true */
	trim?: boolean;
}
