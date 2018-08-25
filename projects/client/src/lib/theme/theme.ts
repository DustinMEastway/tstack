/** used to store themes in the theme selection service as well as displaying them in the theme select component */
export interface Theme<ThemeClassesT extends string | '' = any> {
	displayName: string;
	class: ThemeClassesT;
}
