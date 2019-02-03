import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Type } from '@tstack/core';

import { TskDialogActionButton } from './dialog-action-button';
import { TskDialogConfig } from './dialog-config';
import { TskDialogComponent } from './dialog.component';

/** service to quickly and easily open dialogs */
@Injectable()
export class TskDialogService {
	private static defaultConfig: TskDialogConfig = {
		actionButtons: [ { viewValue: 'Close', value: null } ],
		disableClose: true
	};

	constructor(private _matDialog: MatDialog) {}

	/**
	 * @method open a new dialog
	 * @param config used to determine what the dialog should look & behave like
	 */
	open<ResultT = any>(config: TskDialogConfig<string | string[], ResultT>): TskDialogComponent<string[], ResultT>;
	open<ContentT = any, ResultT = any>(config: TskDialogConfig<Type<ContentT>, ResultT>): TskDialogComponent<ContentT, ResultT>;
	open<ResultT = any>(config: TskDialogConfig<any, ResultT>): TskDialogComponent<any, ResultT> {
		// set configuration properties over default configuration object
		config = Object.assign({}, TskDialogService.defaultConfig, config);

		const dialogRef = this._matDialog.open<TskDialogComponent<any, ResultT>, any, ResultT>(TskDialogComponent);
		dialogRef.disableClose = config.disableClose;

		const dialog = dialogRef.componentInstance;
		dialog.title = config.title;
		dialog.dialogType = config.type;
		dialog.createContent((typeof config.content === 'string') ? [ config.content ] : config.content);
		dialog.actionButtons = (!(config.actionButtons instanceof Array)) ? [] : config.actionButtons.map(button => {
			if (typeof button === 'string') {
				return {
					value: button,
					viewValue: button
				} as TskDialogActionButton;
			} else {
				return button;
			}
		});

		return dialogRef.componentInstance;
	}
}
