import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TskDynamicContentComponent, TskReadonlyFieldComponent } from '@tstack/client';
import { getValue } from '@tstack/core';
import { BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs/operators';

import { TableColumn } from 'app/entities';
import { DynamicContentService } from 'app/services';

@Component({
	selector: 'app-table-cell',
	templateUrl: './table-cell.component.html',
	styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {
	@ViewChild(TskDynamicContentComponent) dynamicContent: TskDynamicContentComponent;
	private _column$ = new BehaviorSubject<TableColumn>(null);
	private _rowData$ = new BehaviorSubject<any>(null);

	@Input()
	get column(): TableColumn {
		return this._column$.value;
	}
	set column(column: TableColumn) {
		this._column$.next(column);
	}

	@Input()
	get rowData(): any {
		return this._rowData$.value;
	}
	set rowData(rowData: any) {
		this._rowData$.next(rowData);
	}

	constructor(private _dynamicContentService: DynamicContentService) {}

	ngOnInit(): void {
		this._column$.pipe(combineLatest(this._rowData$)).subscribe(([column, rowData]) => {
			if (column.componentSelector) {
				this._dynamicContentService.setComponentBySelector(
					this.dynamicContent,
					column.componentSelector,
					getValue(rowData, column.property)
				);
			} else {
				const component = this.dynamicContent.updateContent(TskReadonlyFieldComponent).instance;
				component.value = rowData;
				component.displayWith = column.property;
			}
		});
	}
}
