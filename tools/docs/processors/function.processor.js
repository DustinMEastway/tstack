const { flattenArray } = require('../common/functions');
const {
	createCallSections,
	createParameterSections,
	createReturnSections,
	createUsageSections
} = require('../common/tag-processors');
const { TagKey } = require('../tags/tag-key');

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
				const data = { title: doc.name };
				const tagParts = doc.tagParts || [];
				const firstTextTag = tagParts.find(contentPart => contentPart.key === TagKey.text);

				if (firstTextTag) {
					data.description = firstTextTag.match;
				}

				const sectionParsers = [
					createCallSections,
					createParameterSections,
					createReturnSections,
					createUsageSections
				];

				data.sections = flattenArray(sectionParsers.map(sectionParser => sectionParser(doc.id, LOGGER, tagParts)));

				doc.data = Object.assign({}, doc.data, data);
			});
		},
		$runAfter: [ 'filterDocsProcessor', 'tagPartsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
}
