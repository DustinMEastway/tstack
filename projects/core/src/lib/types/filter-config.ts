export interface FilterConfig {
	caseInsensitive: boolean;
	keepMatches: boolean;
	maxReturnSize: number;
	mode: 'contains' | 'equals' | 'startsWith';
	property: string;
}
