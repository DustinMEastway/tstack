export interface TskNavMenuConfig {
	name: string;
	value: string;
	items?: {
		// TODO: allow for nested menus
		name: string;
		value: string;
	}[];
}
