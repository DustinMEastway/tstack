/**
 * used to cancel a process synchronously by emitting the event, then checking the `cancelled` property before proceeding
 *
 * @title Example(s)
 * @dynamicComponent examples/core/cancellable-event
 */
export class TskCancellableEvent {
	protected _cancelled = false;

	/** @property whether the event is cancelled */
	get cancelled(): boolean {
		return this._cancelled;
	}

	/** cancels the event */
	cancel(): void {
		this._cancelled = true;
	}
}
