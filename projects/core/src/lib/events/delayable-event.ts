import { zip, Observable } from 'rxjs';

import { TskCancellableEvent } from './cancellable-event';

export class TskDelayableEvent extends TskCancellableEvent {
	protected _delays: Observable<any>[] = [];

	get delays(): Observable<never> {
		return zip(...this._delays) as Observable<never>;
	}

	addDelay(delay: Observable<any>): void {
		if (delay instanceof Observable) {
			this._delays.push(delay);
		} else if (delay != null) {
			console.error('TskDelayableEvent.addDelay: Non-observable delay was added to a delayable event');
			console.error(delay);
		}
	}

	cancel(): void {
		this._cancelled = true;
	}
}
