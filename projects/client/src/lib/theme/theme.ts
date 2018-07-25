export interface Theme<ThemeClassesT extends string | '' = any> {
	displayName: string;
	class: ThemeClassesT;
}
