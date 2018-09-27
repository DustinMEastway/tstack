import { Subscription } from 'rxjs';

export function unsubscribe(subscriptions: Subscription | Subscription[]): void {
	if (subscriptions == null) {
		return;
	} else if (subscriptions instanceof Array) {
		subscriptions.forEach(subscription => { subscription.unsubscribe(); });
	} else {
		subscriptions.unsubscribe();
	}
}
