import { Theme } from './theme';

/** used to group similar themes */
export interface ThemeGroup<ThemeClassesT extends string | '' = any> {
	groupName: string;
	themes: Theme<ThemeClassesT>[];
}
