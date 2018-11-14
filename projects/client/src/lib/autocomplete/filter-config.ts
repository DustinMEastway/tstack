import { TskOption } from '../option';

/** configuration to customize the out of the box behavior for autocomplete filtering */
export interface TskFilterConfig {
	/** @prop whether the filter is case sensitive */
	caseSensitive: boolean;
	/** @prop the maximum number of options to display at a given time */
	maxDisplayedOptions: number;
	/** @prop the type of filter used on the options */
	type: 'contains' | 'startsWith';
	/** @prop the value to filter by */
	value: string;
}
