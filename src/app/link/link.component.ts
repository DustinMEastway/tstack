import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-link',
	templateUrl: './link.component.html',
	styleUrls: ['./link.component.scss']
})
export class LinkComponent {
	@Input() text: string;
	@Input() url: string;

	setData(data: { text: string; url: string; }): void {
		data = Object.assign({ text: '', url: '' }, data);

		this.text = data.text;
		this.url = data.url;
	}
}
