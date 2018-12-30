import { Type } from '@tstack/core';

import { TskDialogActionButton } from './dialog-action-button';
import { TskDialogType } from './dialog-type';

export interface TskDialogConfig<ContentT = any, ResultT = any> {
	actionButtons: (TskDialogActionButton<ResultT> | string)[];
	content: string | string[] | Type<ContentT>;
	disableClose: boolean;
	title: string;
	type: TskDialogType;
}
