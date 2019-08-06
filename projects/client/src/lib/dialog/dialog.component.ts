import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Type } from '@tstack/core';
import { Observable } from 'rxjs';

import { TskDynamicContentComponent } from '../dynamic-content/dynamic-content.component';

import { TskDialogActionButton } from './dialog-action-button';
import { TskDialogType } from './dialog-type';

/** used within a material dialog to display content */
@Component({
	selector: 'tsk-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss']
})
export class TskDialogComponent<ContentT = any, ResultT = any> {
	@ViewChild(TskDynamicContentComponent, { static: true }) dynamicContent: TskDynamicContentComponent<ContentT>;
	dialogRef: MatDialogRef<TskDialogComponent<ContentT, ResultT>, ResultT>;
	dialogType: TskDialogType;
	title: string;
	protected _actionButtons: TskDialogActionButton<ResultT>[];
	protected _content: ContentT;

	get actionButtons(): TskDialogActionButton<ResultT>[] {
		return this._actionButtons;
	}
	set actionButtons(actions: TskDialogActionButton<ResultT>[]) {
		this._actionButtons = (actions instanceof Array) ? actions : [];
	}

	get afterClose(): Observable<ResultT> {
		return this.dialogRef.afterClosed();
	}

	get content(): ContentT {
		return this._content;
	}

	get isContentString(): boolean {
		return this.content instanceof Array;
	}

	get titleColorClass(): string {
		switch (this.dialogType) {
		 	case 'error':
		 		return 'tsk-warn-background';
		 	case 'warn':
	 			return 'tsk-accent-background';
 			case 'info':
 				return 'tsk-background-20';
		 	default:
		 		return 'tsk-primary-background';
		 }
	}

	get titleIcon(): string {
		switch (this.dialogType) {
		 	case 'error':
		 		return 'error';
		 	case 'warn':
	 			return 'warning';
 			case 'info':
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
	 * @method createContent to fill the center of the dialog
	 * @param content text or component to fill center of dialog with
	 */
	createContent<T extends string[] & ContentT>(content: T): void;
	createContent(content: Type<ContentT>): void;
	createContent<T extends string[] & ContentT>(content: T | Type<ContentT>): void {
		this.dynamicContent.clearContent();

		if (content instanceof Array) {
			this._content = content;
		} else if (content != null) {
			const componentRef = this.dynamicContent.updateContent(content);
			componentRef.changeDetectorRef.detectChanges();
			this._content = componentRef.instance;
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
