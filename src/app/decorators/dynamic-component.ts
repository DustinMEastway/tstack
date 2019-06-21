import { DynamicContentService } from 'app/services';

export function DynamicComponent(config: { selector: string; overwriteExisting?: boolean; }): any {
	config = Object.assign({}, {
		selector: null,
		overwriteExisting: false
	}, config);

	return (type: any) => {
		DynamicContentService.addDynamicComponent(config.selector, type, config.overwriteExisting);
	};
}
