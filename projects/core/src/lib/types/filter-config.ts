// standard configuration for the filter function
export type FilterConfig = {
	keepMatches: boolean;
	maxReturnSize: number;
	mode: 'equals';
}
// string filter mode configuration for the filter function
| {
	caseInsensitive: boolean;
	keepMatches: boolean;
	maxReturnSize: number;
	mode: 'contains' | 'startsWith';
};
