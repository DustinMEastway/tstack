import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ITableConfig, TableColumn, TableConfig } from 'app/entities';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent<RowDataT = any> {
	private _tableConfig$ = new BehaviorSubject<TableConfig<RowDataT>>(new TableConfig<RowDataT>());

	get columns(): TableColumn[] {
		return this.tableConfig.columns;
	}
	set columns(columns: TableColumn[]) {
		this.tableConfig.columns = columns;
		this._tableConfig$.next(this.tableConfig);
	}

	get displayedColumns(): string[] {
		return this.tableConfig.displayedColumns;
	}
	set displayedColumns(displayedColumns: string[]) {
		this.tableConfig.displayedColumns = displayedColumns;
		this._tableConfig$.next(this.tableConfig);
	}

	get rows(): RowDataT[] {
		return this.tableConfig.rows;
	}
	set rows(rows: RowDataT[]) {
		this.tableConfig.rows = rows;
		this._tableConfig$.next(this.tableConfig);
	}

	get tableConfig(): TableConfig<RowDataT> {
		return this._tableConfig$.value;
	}

	setData(data: ITableConfig): void {
		this._tableConfig$.next(this.tableConfig.assign(data));
	}
}
