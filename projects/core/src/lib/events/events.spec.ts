import { Observable, Subject, Subscriber } from 'rxjs';

import { TskDelayableEvent } from './delayable-event';

describe('events', () => {
	describe('DelayableEvent', () => {
		let cancelled: boolean;
		let complete: boolean;
		let event: TskDelayableEvent;
		let watchEvent: () => void;

		beforeEach(() => {
			complete = false;
			event = new TskDelayableEvent();
			watchEvent = () => {
				event.delays.subscribe(() => {
					complete = true;
					cancelled = event.cancelled;
				});
			};
		});

		it('should complete when no delays are added', () => {
			// arrange / act
			watchEvent();

			// assert
			expect(cancelled).toEqual(false);
			expect(complete).toEqual(true);
		});

		it('should not complete until Subject delay emits', () => {
			// arrange
			const delay = new Subject();
			event.addDelay(delay);

			// act
			watchEvent();

			// assert
			expect(complete).toEqual(false);
			delay.next();
			expect(cancelled).toEqual(false);
			expect(complete).toEqual(true);
		});

		it('should not complete until Observable delay emits', () => {
			// arrange
			let subscriber: Subscriber<void>;
			const delay = new Observable<void>(innerSubscriber => {
				subscriber = innerSubscriber;
			});
			event.addDelay(delay);

			// act
			watchEvent();

			// assert
			expect(complete).toEqual(false);
			subscriber.next();
			expect(cancelled).toEqual(false);
			expect(complete).toEqual(true);
		});

		it('should not complete until Promise delay emits', (done: DoneFn) => {
			// arrange
			let resolve: () => void;
			const delay = new Promise<void>(innerResolve => {
				resolve = innerResolve;
			});
			event.addDelay(delay);

			// act
			watchEvent();

			// assert
			expect(complete).toEqual(false);
			resolve();
			delay.then(() => {
				expect(cancelled).toEqual(false);
				expect(complete).toEqual(true);
				done();
			});
		});

		it('should not complete until multiple delays complete', () => {
			// arrange
			const delay1 = new Subject();
			const delay2 = new Subject();
			event.addDelay(delay1);
			event.addDelay(delay2);

			// act
			watchEvent();

			// assert
			delay1.next();
			expect(complete).toEqual(false);
			delay2.next();
			expect(cancelled).toEqual(false);
			expect(complete).toEqual(true);
		});
	});
});
