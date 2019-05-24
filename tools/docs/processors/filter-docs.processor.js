module.exports = function filterDocsProcessor(LOGGER) {
	return {
		docTypes: [],
		$process: function(docs) {
			const removedDocTypes = new Set();
			const docsToRender = docs.filter(doc => {
				if (this.docTypes.includes(doc.docType)) {
					return true;
				}

				removedDocTypes.add(doc.docType);
			});

			LOGGER.logInfo('Filtered out docType(s):');
			Array.from(removedDocTypes).forEach(docType => {
				LOGGER.logInfo(`\t${docType}`);
			});

			return docsToRender;
		},
		$runAfter: [ 'readTypeScriptModules' ],
		$runBefore: [ 'linkInheritedDocs' ]
	}
}
