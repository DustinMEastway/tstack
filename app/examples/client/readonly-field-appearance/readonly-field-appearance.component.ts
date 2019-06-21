import { Component } from '@angular/core';

import { DynamicComponent } from 'app/decorators';

@DynamicComponent({ selector: 'examples/client/readonly-field-appearance' })
@Component({
	selector: 'app-readonly-field-appearance',
	templateUrl: './readonly-field-appearance.component.html',
	styleUrls: ['./readonly-field-appearance.component.scss']
})
export class ReadonlyFieldAppearanceComponent {}
