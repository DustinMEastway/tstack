/* todo:
	* allow for nested menus
*/

export interface TskNavMenuConfig {
	name: string;
	value: string;
	items?: {
		name: string;
		value: string;
	}[];
}
