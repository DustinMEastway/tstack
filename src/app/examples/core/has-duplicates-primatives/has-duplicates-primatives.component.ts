import { Component } from '@angular/core';
import { DynamicComponent } from 'app/decorators';

const content = `
import { hasDuplicates } from '@tstack/core';

// outputs: false
console.log(hasDuplicates([ 0, 1, 2 ]));

// outputs: true
console.log(hasDuplicates([ 0, 1, 0 ]));
`.trim();

@DynamicComponent({ selector: 'examples/core/has-duplicates-primatives' })
@Component({
	selector: 'app-has-duplicates-primatives',
	templateUrl: './has-duplicates-primatives.component.html',
	styleUrls: ['./has-duplicates-primatives.component.scss']
})
export class HasDuplicatesPrimativesComponent {
	get content(): string {
		return content;
	}
}
