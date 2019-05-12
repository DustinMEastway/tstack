module.exports = function filterTypescriptDocsProcessor(TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	return {
		$process: function(docs) {
			return docs.filter(doc => TYPESCRIPT_DOC_TYPES_TO_RENDER.includes(doc.docType));
		},
		$runAfter: [ 'readTypeScriptModules' ],
		$runBefore: [ 'linkInheritedDocs' ]
	}
}
