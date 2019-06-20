const { flattenArray } = require('../common/functions');
const {
	callableDocPreTagProcessor,
	createCallSections,
	createParameterSections,
	createReturnSections,
	createUsageSections
} = require('../common/tag-processors');

module.exports = function functionProcessor(LOGGER) {
	return {
		docTypes: [ 'function' ],
		preTagPartsProcessor(doc) {
			if (doc.docType === 'function' && !doc.content) {
				callableDocPreTagProcessor(doc);
			}
		},
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				const sectionParsers = [
					createCallSections,
					createParameterSections,
					createReturnSections,
					createUsageSections
				];

				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: doc.description,
					sections: flattenArray(sectionParsers.map(sectionParser =>
						sectionParser(doc.id, LOGGER, doc.tagParts)
					))
				});
			});
		},
		$runAfter: [ 'filterDocsProcessor', 'tagPartsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
}
