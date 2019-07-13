import { Component } from '@angular/core';

import { DynamicComponent } from 'app/decorators';

const content = `
import { TskCancellableEvent } from '@tstack/core';
import { Subject } from 'rxjs';

// the event class can be extended to add additional data to the event
class FormSubmitEvent extends TskCancellableEvent {
	formIsValid: boolean;
}

const eventEmitter = new Subject<FormSubmitEvent>();

// receiving end of the subscription
eventEmitter.subscribe(event => {
	if (!event.formIsValid) {
		event.cancel();
	}
});

// emitting end of the subscription
const event = new FormSubmitEvent();
event.formIsValid = false;
eventEmitter.next(event);

if (!event.cancelled) {
	alert('Event should continue');
}
`.trim();

@DynamicComponent({ selector: 'examples/core/cancellable-event' })
@Component({
	selector: 'app-cancellable-event',
	templateUrl: './cancellable-event.component.html',
	styleUrls: ['./cancellable-event.component.scss']
})
export class CancellableEventComponent {
	get content(): string {
		return content;
	}
}
