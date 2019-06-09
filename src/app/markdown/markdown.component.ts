import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { parse } from 'marked';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'app-markdown',
	templateUrl: './markdown.component.html',
	styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements OnInit {
	@ViewChild('markdownContainer') element: ElementRef<HTMLDivElement>;
	private _content = new BehaviorSubject<string>('');

	@Input()
	get content(): string {
		return this._content.value;
	}
	set content(content: string) {
		this._content.next(content);
	}

	ngOnInit(): void {
		this._content.subscribe(content => {
			parse(content, (error, result) => {
				if (error) {
					console.error(error);
					result = '';
				}

				this.element.nativeElement.innerHTML = result;
			});
		});
	}

	setData(data: string): void {
		this.content = data;
	}
}
