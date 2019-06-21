module.exports = function decoratorProcessor() {
	return {
		decoratorTypes: [],
		$process: function(docs) {
			docs.forEach(doc => {
				// look for a decorator that matches one of the decorator types
				const matchedDecorator = (doc.decorators || []).find(decorator =>
					this.decoratorTypes.includes(decorator.name)
				);

				if (matchedDecorator) {
					doc.docType = matchedDecorator.name.toLowerCase();
					doc.matchedDecorator = matchedDecorator;
				}
			});
		},
		$runAfter: [ 'readTypeScriptModules' ],
		$runBefore: [ 'filterDocsProcessor' ]
	};
}
