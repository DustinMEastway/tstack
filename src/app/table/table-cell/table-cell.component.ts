import { Component, Input } from '@angular/core';
import { getValue } from '@tstack/core';

import { TableColumn } from 'app/entities';

@Component({
	selector: 'app-table-cell',
	templateUrl: './table-cell.component.html',
	styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent {
	@Input() column: TableColumn;
	@Input() rowData: any;

	get content(): any {
		return getValue(this.rowData, (this.column) ? this.column.property : '');
	}
}
