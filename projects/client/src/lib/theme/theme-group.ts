import { Theme } from './theme';

export interface ThemeGroup<ThemeClassesT extends string | '' = any> {
	groupName: string;
	themes: Theme<ThemeClassesT>[];
}
