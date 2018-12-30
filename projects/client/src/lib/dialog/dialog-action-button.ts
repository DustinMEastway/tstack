import { ThemePalette } from '@angular/material';

export interface TskDialogActionButton<ResultT = any> {
	action?: (result: ResultT) => void;
	color?: ThemePalette;
	type?: 'raised' | 'stroked' | undefined;
	viewValue: string;
	value?: ResultT;
}
