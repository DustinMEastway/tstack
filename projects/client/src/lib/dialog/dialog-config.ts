import { Type } from '@tstack/core';

import { TskDialogActionButton } from './dialog-action-button';
import { TskDialogType } from './dialog-type';

/** cofiguration of a dialog component */
export interface TskDialogConfig<ContentT = any, ResultT = any> {
	/** @prop actionButtons to display at the bottom of the page */
	actionButtons?: (TskDialogActionButton<ResultT> | string)[];
	/** @prop to display in the center of the dialog */
	content?: ContentT;
	/** @prop disables closing the dialog by clicking on the backdrop */
	disableClose?: boolean;
	/** @prop title at the top of the dialog */
	title?: string;
	/** @prop of dialog used to determine the title icon and color */
	type?: TskDialogType;
}
