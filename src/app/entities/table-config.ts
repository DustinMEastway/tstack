import { ComponentSelector } from './component-selector';

export interface TableColumn {
	componentSelector?: ComponentSelector;
	header?: string;
	id: string;
	property?: string;
}

export interface ITableConfig<RowT = any> {
	columns: TableColumn[];
	rows: RowT[];
}

export class TableConfig<RowT = any> {
	private _columns: TableColumn[] = [];
	private _displayedColumns: string[] = [];
	private _isHeaderDisplayed: boolean;
	private _rows: RowT[] = [];

	/** @property columns used to configure the table's columns */
	get columns(): TableColumn[] {
		return this._columns;
	}
	set columns(columns: TableColumn[]) {
		this._columns = (columns instanceof Array) ? columns : [];
	}

	/** @property displayedColumns columns displayed by the table */
	get displayedColumns(): string[] {
		return this._displayedColumns;
	}
	set displayedColumns(displayedColumns: string[]) {
		this._displayedColumns = (displayedColumns instanceof Array) ? displayedColumns : [];
	}

	/** @property isHeaderDisplayed whether any headers are displayed */
	get isHeaderDisplayed(): boolean {
		return this._isHeaderDisplayed;
	}

	/** @property rows of data to display in the table*/
	get rows(): RowT[] {
		return this._rows;
	}
	set rows(rows: RowT[]) {
		this._rows = (rows instanceof Array) ? rows : [];
	}

	/** assigns the provided object's values to this object */
	assign(data: ITableConfig): TableConfig {
		data = Object.assign({
			columns: [],
			rows: []
		}, data);
		this.columns = data.columns;
		this.displayedColumns = this.columns.map(column => column.id);
		this._isHeaderDisplayed = this.columns.some(column => !!column.header);
		this.rows = data.rows;

		return this;
	}
}
