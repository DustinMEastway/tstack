import { Injectable } from '@angular/core';
import { MatDialog, } from '@angular/material';

import { TskDialogConfig } from './dialog-config';
import { TskDialogComponent } from './dialog.component';

@Injectable()
export class TskDialogService {
	static get defaultConfig(): Partial<TskDialogConfig> {
		return {
			actionButtons: [ { viewValue: 'Close', value: null } ],
			disableClose: true
		};
	}

	constructor(private _matDialog: MatDialog) {}

	open<ContentT = any, ResultT = any>(config: Partial<TskDialogConfig<ContentT, ResultT>>): TskDialogComponent<ContentT, ResultT> {
		// set configuration properties over default configuration object
		config = Object.assign({}, TskDialogService.defaultConfig, config);

		const dialogRef = this._matDialog.open<TskDialogComponent<ContentT, ResultT>, any, ResultT>(TskDialogComponent);
		dialogRef.componentInstance.configure(dialogRef, config as TskDialogConfig<ContentT, ResultT>);

		return dialogRef.componentInstance;
	}
}
