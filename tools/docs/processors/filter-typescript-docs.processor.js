module.exports = function filterTypescriptDocsProcessor(LOGGER, TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	return {
		$process: function(docs) {
			const removedDocTypes = new Set();
			const docsToRender = docs.filter(doc => {
				if (TYPESCRIPT_DOC_TYPES_TO_RENDER.includes(doc.docType)) {
					return true;
				}

				removedDocTypes.add(doc.docType);
			});

			LOGGER.logInfo('Removed docType(s):');
			Array.from(removedDocTypes).forEach(docType => {
				LOGGER.logInfo(`\t${docType}`);
			});

			return docsToRender;
		},
		$runAfter: [ 'readTypeScriptModules' ],
		$runBefore: [ 'linkInheritedDocs' ]
	}
}
