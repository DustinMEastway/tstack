import { Component, Input } from '@angular/core';

import { TableColumn } from 'app/entities';

@Component({
	selector: 'app-table-header-cell',
	templateUrl: './table-header-cell.component.html',
	styleUrls: ['./table-header-cell.component.scss']
})
export class TableHeaderCellComponent {
	@Input()
	column: TableColumn;
}
