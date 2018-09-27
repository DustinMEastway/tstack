import { of, Observable } from 'rxjs';
import { zip } from 'rxjs/operators';

import { TskCancellableEvent } from './cancellable-event';

export class TskDelayableEvent extends TskCancellableEvent {
	protected _delays: Observable<any> = of(null);

	get delays(): Observable<never> {
		return this._delays as any;
	}

	addDelay(delay: Observable<any>): void {
		this._delays = this._delays.pipe(zip(delay));
	}

	cancel(): void {
		this._cancelled = true;
	}
}
