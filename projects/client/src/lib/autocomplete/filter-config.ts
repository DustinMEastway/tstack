import { TskOption } from '../option';

export interface TskFilterConfig {
	caseSensitive: boolean;
	maxDisplayedOptions: number;
	type: 'contains' | 'startsWith';
	value: string;
}
