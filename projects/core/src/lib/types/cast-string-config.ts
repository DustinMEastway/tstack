/**
 * configuration for castString method
 * @property {'lower'|'same'|'upper'} [case] to cast into after converting to string
 * @property {boolean} [trim] the string if true
 */
export interface CastStringConfig {
	case?: 'lower' | 'same' | 'upper';
	trim?: boolean;
}
