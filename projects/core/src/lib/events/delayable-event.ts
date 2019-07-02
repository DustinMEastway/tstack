import { zip, Observable } from 'rxjs';

import { TskCancellableEvent } from './cancellable-event';

/**
 * used to delay the action of an event, or cancel it asynchronously
 *
 * @title Description
 * To delay the event use `addDelay` in the method listening for the event and subscribe to
 * `delays` prior to proceeding on the emitting end.
 *
 * To cancel the event asynchronously, add delays as stated above and cancel the event prior to the
 * delays ending.
 *
 * @title Example(s)
 * @dynamicComponent examples/core/delayable-event
 */
export class TskDelayableEvent extends TskCancellableEvent {
	protected _delays: Observable<any>[] = [];

	/** @property observable that emits after all delays emit */
	get delays(): Observable<never> {
		return zip(...this._delays) as Observable<never>;
	}

	/**
	 * add a delay to the event
	 * @param delay to wait for prior to continuing with the event
	 */
	addDelay(delay: Observable<any>): void {
		if (delay instanceof Observable) {
			this._delays.push(delay);
		} else if (delay != null) {
			console.error('TskDelayableEvent.addDelay: Non-observable delay was added to a delayable event');
			console.error(delay);
		}
	}
}
