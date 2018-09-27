export class TskCancellableEvent {
	protected _cancelled = false;

	get cancelled(): boolean {
		return this._cancelled;
	}

	cancel(): void {
		this._cancelled = true;
	}
}
