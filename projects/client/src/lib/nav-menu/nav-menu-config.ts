/* todo:
	* allow for nested menus
*/

/** menu configuration for the tsk-nav-menu component */
export interface TskNavMenuConfig {
	name: string;
	value: string;
	items?: {
		name: string;
		value: string;
	}[];
}
