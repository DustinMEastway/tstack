module.exports = function apiProcessor() {
	return {
		$process: function(docs) {
			const apiDoc = {
				id: 'api',
				docType: 'api',
				name: 'Api',
				outputPath: 'api.json',
				data: 'title'
			};

			docs.push(apiDoc);

			apiDoc.data = {
				apis: docs.map(doc => ({
					docType: doc.docType,
					name: doc.data.title,
					path: doc.outputPath.replace(/\.\w+$/, '')
				}))
			};
		},
		$runAfter: [
			'classProcessor',
			'constProcessor',
			'filterDocsProcessor',
			'moduleProcessor',
			'ngmoduleProcessor',
			'outputPathProcessor'
		],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}
