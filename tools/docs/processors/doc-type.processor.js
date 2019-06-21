module.exports = function docTypeProcessor() {
	return {
		$process: function(docs) {
			docs.forEach(doc => {
				doc.data = Object.assign({}, doc.data, {
					docType: doc.docType
				});
			});
		},
		$runAfter: [ 'moduleProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	}
}
