const { createUsageSections } = require('../common/tag-processors');

function constProcessor(LOGGER) {
	return {
		docTypes: [ 'const', 'enum' ],
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: doc.description,
					sections: [
						...createUsageSections(doc.id, LOGGER, doc.tagParts)
					]
				});
			});
		},
		$runAfter: [ 'filterDocsProcessor', 'tagPartsProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}

module.exports = constProcessor;
