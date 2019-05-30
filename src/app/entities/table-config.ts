export interface TableColumn {
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
	private _rows: RowT[] = [];

	get columns(): TableColumn[] {
		return this._columns;
	}
	set columns(columns: TableColumn[]) {
		this._columns = (columns instanceof Array) ? columns : [];
	}

	get displayedColumns(): string[] {
		return this._displayedColumns;
	}
	set displayedColumns(displayedColumns: string[]) {
		this._displayedColumns = (displayedColumns instanceof Array) ? displayedColumns : [];
	}

	get rows(): RowT[] {
		return this._rows;
	}
	set rows(rows: RowT[]) {
		this._rows = (rows instanceof Array) ? rows : [];
	}

	assign(data: ITableConfig): TableConfig {
		this.columns = data.columns;
		this.displayedColumns = data.columns.map(column => column.id);
		this.rows = data.rows;

		return this;
	}
}
