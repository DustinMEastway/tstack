import { Injectable } from '@angular/core';
import { MatDialog, } from '@angular/material';

import { TskDialogConfig } from './dialog-config';
import { TskDialogComponent } from './dialog.component';

/** service to quickly and easily open dialogs */
@Injectable()
export class TskDialogService {
	private static defaultConfig: Partial<TskDialogConfig> = {
		actionButtons: [ { viewValue: 'Close', value: null } ],
		disableClose: true
	};

	constructor(private _matDialog: MatDialog) {}

	/**
	 * @method open a new dialog
	 * @param config used to determine what the dialog should look & behave like
	 */
	open<ContentT = any, ResultT = any>(config: Partial<TskDialogConfig<ContentT, ResultT>>): TskDialogComponent<ContentT, ResultT> {
		// set configuration properties over default configuration object
		config = Object.assign({}, TskDialogService.defaultConfig, config);

		const dialogRef = this._matDialog.open<TskDialogComponent<ContentT, ResultT>, any, ResultT>(TskDialogComponent);
		dialogRef.componentInstance.configure(dialogRef, config as TskDialogConfig<ContentT, ResultT>);

		return dialogRef.componentInstance;
	}
}
