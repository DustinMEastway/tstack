import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-link',
	templateUrl: './link.component.html',
	styleUrls: ['./link.component.scss']
})
export class LinkComponent {
	@Input() color: string;
	@Input() text: string;
	@Input() url: string;

	setData(data: { color?: string, text: string; url: string; }): void {
		data = Object.assign({ color: 'primary', text: '', url: '' }, data);

		this.color = data.color;
		this.text = data.text;
		this.url = data.url;
	}
}
