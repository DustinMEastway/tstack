import { Component, Input, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Type } from '@tstack/core';
import { Observable } from 'rxjs';

import { TskDynamicContentComponent } from '../dynamic-content/dynamic-content.component';
import { TskOption } from '../option/option';

import { TskDialogActionButton } from './dialog-action-button';
import { TskDialogConfig } from './dialog-config';
import { TskDialogType } from './dialog-type';

@Component({
	selector: 'tsk-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class TskDialogComponent<ContentT = any, ResultT = any> {
	@Input() title: string;
	@ViewChild(TskDynamicContentComponent) dynamicContent: TskDynamicContentComponent<ContentT>;
	private _actionButtons: TskDialogActionButton<ResultT>[];
	private _content: string[] | ContentT;
	private _dialogRef: MatDialogRef<TskDialogComponent<ContentT, ResultT>, ResultT>;
	private _dialogType: TskDialogType;

	get actionButtons(): (TskDialogActionButton<ResultT> | TskOption<ResultT> | string)[] {
		return this._actionButtons;
	}
	set actionButtons(actions: (TskDialogActionButton<ResultT> | TskOption<ResultT> | string)[]) {
		if (actions instanceof Array) {
			this._actionButtons = actions.map(action => {
				// convert string actions to options
				if (typeof action === 'string') {
					return {
						value: action,
						viewValue: action
					} as TskDialogActionButton<any>;
				} else {
					return action as TskDialogActionButton<any>;
				}
			});
		} else {
			this._actionButtons = [];
		}
	}

	get afterClose(): Observable<ResultT> {
		return this.dialogRef.afterClosed();
	}

	get content(): string[] | ContentT {
		return this._content;
	}

	get dialogRef(): MatDialogRef<TskDialogComponent<ContentT, ResultT>, ResultT> {
		return this._dialogRef;
	}

	get isContentString(): boolean {
		return this.content instanceof Array;
	}

	get titleColorClass(): string {
		switch (this._dialogType) {
		 	case TskDialogType.Error:
		 		return 'tsk-warn';
		 	case TskDialogType.Warn:
	 			return 'tsk-accent';
 			case TskDialogType.Info:
 				return 'tsk-background-20';
		 	default:
		 		return 'tsk-primary';
		 }
	}

	get titleIcon(): string {
		switch (this._dialogType) {
		 	case TskDialogType.Error:
		 		return 'error';
		 	case TskDialogType.Warn:
	 			return 'warning';
 			case TskDialogType.Info:
 				return 'info';
		 	default:
		 		return '';
		 }
	}

	/**
	 * @method close dialog using associated dialog reference
	 * @param result of the dialog
	 */
	close(result?: ResultT): void {
		if (this.dialogRef) {
			this.dialogRef.close(result);
		}
	}

	/**
	 * @method configure dialog component based on a provided dialog reference and config
	 * @param dialogRef to attach this component to
	 * @param config to configure this component with
	 */
	configure(dialogRef: MatDialogRef<TskDialogComponent<ContentT, ResultT>, ResultT>, config: TskDialogConfig<ContentT, ResultT>): void {
		dialogRef.disableClose = config.disableClose;
		this.actionButtons = config.actionButtons;
		this.createContent(config.content);
		this._dialogRef = dialogRef;
		this.title = config.title;
		this._dialogType = config.type;
	}

	/**
	 * @method createContent to fill the center of the dialog
	 * @param content text or component to fill center of dialog with
	 */
	createContent(content: string | string[] | Type<ContentT>): void {
		this.dynamicContent.clearContent();

		if (typeof content === 'string') {
			this._content = [ content ];
		} else if (content instanceof Array) {
			this._content = content;
		} else if (content != null) {
			this._content = this.dynamicContent.updateContent(content).instance;
		}
	}

	/**
	 * @method onActionClick performs the associated action for the selected action button
	 * @param actionButton to perform the action of (closes the dialog by default)
	 */
	onActionClick(actionButton: TskDialogActionButton<ResultT> = null): void {
		if (actionButton && typeof actionButton.action === 'function') {
			actionButton.action(actionButton.value);
		} else {
			this.close(actionButton ? actionButton.value : null);
		}
	}
}
