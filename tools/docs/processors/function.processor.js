const { flattenArray } = require('../common/functions');
const {
	createCallSections,
	createParameterSections,
	createReturnSections,
	createUsageSections
} = require('../common/tag-processors');

module.exports = function functionProcessor(LOGGER) {
	return {
		docTypes: [ 'function' ],
		tagPreProcessor(doc) {
			if (doc.docType === 'function' && !doc.content) {
				// get content from an overload if needed
				const docWithContent = [doc].concat(doc.overloads).find(doc =>
					typeof doc.content === 'string' && doc.content.trim() !== ''
				);

				doc.content = (docWithContent && docWithContent.content) || '';

				// add calls to content
				const callDocs = (doc.overloads.length) ? doc.overloads : [ doc ];
				doc.content += callDocs.map(callDoc => {
					// TODO: add doc.typeParameters when it is available on overloads
					const parameters = callDoc.parameters.join(', ');

					return `\n@call function ${doc.name}(${parameters}): ${callDoc.type}`;
				});
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
