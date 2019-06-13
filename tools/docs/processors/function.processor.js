const parameterSelectors = [ '@parameter', '@param' ];
const returnSelectors = [ '@returns', '@return' ];
const exampleSelector = '@example';

/** gets available call(s) (multiple if the function has overloads) */
function getCallDocs(functionDoc) {
	const callDocs = (functionDoc.overloads.length) ? functionDoc.overloads : [ functionDoc ];

	return callDocs.map(callDoc => {
		// TODO: add doc.typeParameters when it is available on overloads
		const parameters = callDoc.parameters.join(', ');

		return `function ${functionDoc.name}(${parameters}): ${callDoc.type}` ;
	});
}

function createDescriptionSections(descriptionContentParts) {
	return (descriptionContentParts || []).map(descriptionContentPart => {
		if (descriptionContentPart.startsWith(exampleSelector)) {
			return {
				componentSelector: removeSelectors([ descriptionContentPart ], [ exampleSelector ])[0]
			};
		} else {
			return {
				componentSelector: 'markdown',
				data: descriptionContentPart
			}
		}
	});
}

function getDocsFromContent(docId, docContent, LOGGER) {
	const contentPartSelectors = parameterSelectors.concat(returnSelectors, exampleSelector);
	const contentParts = splitAndKeepMatches(docContent, new RegExp(contentPartSelectors.join('|')));

	const descriptionContentParts = contentParts.filter(contentPart =>
		contentPart.startsWith(exampleSelector) || !contentPartSelectors.some(contentPartSelector => contentPart.startsWith(contentPartSelector))
	);

	const parameterDocs = removeSelectors(contentParts, parameterSelectors).map(paramContent =>
		splitParameterDocIntoNameAndDescription(docId, paramContent, LOGGER)
	);

	const returnDocs = removeSelectors(contentParts, returnSelectors);

	if (returnDocs.length > 1) {
		LOGGER.logWarning(`Multiple @returns located in JSDoc for doc ${docId}`);
	}

	return {
		descriptionSections: createDescriptionSections(descriptionContentParts),
		parameterDocs,
		returns: returnDocs[0]
	};
}

function removeSelectors(contentParts, selectors) {
	return (contentParts || []).map(contentPart => ({
		content: contentPart,
		selector: selectors.find(selector => contentPart.startsWith(selector))
	})).filter(contentPart =>
		contentPart.selector != null
	).map(contentPart =>
		contentPart.content.substring(contentPart.selector.length).trim()
	);
}

function splitParameterDocIntoNameAndDescription(docId, description, LOGGER) {
	const parameterNameMatch = /^\[?(\w+)\]?(.*)/.exec(description);
	let name = '';

	if (parameterNameMatch == null) {
		LOGGER.logWarning(`Unable to find a parameter name in doc '${docId}' using description: '${description}'`);
		name = ''
	} else {
		name = parameterNameMatch[1];
		description = name + parameterNameMatch[2];
	}

	return { name, description };
}

/** splits a string using a regular expression at the beginning of each match */
function splitAndKeepMatches(searchString, regex) {
	if (typeof searchString !== 'string') {
		return [];
	}

	let lastMatchText = '';
	const splitParts = [];

	do {
		let match = regex.exec(searchString);

		// if no match was found, then add the rest of the search string
		if (match == null) {
			match = Object.assign([ '' ], { index: searchString.length });
		}

		splitParts.push(lastMatchText + searchString.substring(0, match.index));
		lastMatchText = match[0];

		// lastMatchText is added to the beginning of the next match so that the same match is not found over and over
		searchString = searchString.substring(match.index + ((lastMatchText.length !== 0) ? lastMatchText.length : 1));
	} while (searchString !== '');

	return splitParts;
}

module.exports = function functionProcessor(LOGGER) {
	return {
		docTypes: [ 'function' ],
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				const docWithContent = [doc].concat(doc.overloads).find(doc =>
					typeof doc.content === 'string' && doc.content !== ''
				);

				const {
					descriptionSections,
					parameterDocs,
					returns
				} = getDocsFromContent(doc.id, (docWithContent != null) ? docWithContent.content : '', LOGGER);

				const firstDescriptionSection = descriptionSections.shift();

				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: firstDescriptionSection.data,
					sections: [
						{
							title: 'Calls',
							componentSelector: 'table',
							data: {
								columns: [ { id: 'call' } ],
								rows: getCallDocs(doc)
							}
						},
						{
							title: 'Parameters',
							componentSelector: 'table',
							data: {
								columns: [
									{
										header: 'Name',
										id: 'name',
										property: 'name'
									},
									{
										header: 'Description',
										id: 'description',
										property: 'description'
									}
								],
								rows: parameterDocs
							}
						},
						{
							title: 'Returns',
							componentSelector: 'markdown',
							display: typeof returns === 'string' && returns != '',
							data: returns
						},
						...descriptionSections
					]
				});
			});
		},
		$runAfter: [ 'filterDocsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
}
