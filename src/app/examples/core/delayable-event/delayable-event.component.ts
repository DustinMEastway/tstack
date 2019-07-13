import { Component } from '@angular/core';

import { DynamicComponent } from 'app/decorators';

const content = `
import { TskDelayableEvent } from '@tstack/core';
import { Observable, Subject } from 'rxjs';

// the event class can be extended to add additional data to the event
class FormSubmitEvent extends TskDelayableEvent {
	formIsValid: boolean;
}

const eventEmitter = new Subject<FormSubmitEvent>();

// receiving end of the subscription
eventEmitter.subscribe(receivedEvent => {
	if (!receivedEvent.formIsValid) {
		// add a delay, this could be a request to an api or even confirming with the user
		receivedEvent.addDelay(new Observable(subscriber => {
			// this is where you could cancel the event (pipe into 'tap' if you are using an existing observable)
			subscriber.next();
			subscriber.complete();
		}));
	}
});

// emitting end of the subscription
const event = new FormSubmitEvent();
event.formIsValid = false;
eventEmitter.next(event);

// wait for the delays
event.delays.subscribe(() => {
	// confirm that the event is not cancelled
	if (!event.cancelled) {
		alert('Event should continue');
	}
});
`.trim();

@DynamicComponent({ selector: 'examples/core/delayable-event' })
@Component({
	selector: 'app-delayable-event',
	templateUrl: './delayable-event.component.html',
	styleUrls: ['./delayable-event.component.scss']
})
export class DelayableEventComponent {
	get content(): string {
		return content;
	}
}
