/** gets available call(s) (multiple if the function has overloads) */
function getCallDocs(functionDoc) {
	const callDocs = (functionDoc.overloads.length) ? functionDoc.overloads : [ functionDoc ];

	return callDocs.map(callDoc => {
		// TODO: add doc.typeParameters when it is available on overloads
		const parameters = callDoc.parameters.join(', ');

		return `function ${functionDoc.name}(${parameters}): ${callDoc.type}` ;
	});
}

function getDocsFromContent(docId, docContent) {
	const parameterSelectors = [ '@parameter', '@param' ];
	const returnSelectors = [ '@returns', '@return' ];
	const contentPartSelectors = parameterSelectors.concat(returnSelectors);
	const contentParts = splitAndKeepMatches(docContent, new RegExp(contentPartSelectors.join('|')));

	const docsWithoutSelectors = contentParts.filter(contentPart =>
		!contentPartSelectors.some(contentPartSelector => contentPart.startsWith(contentPartSelector))
	);

	const parameterDocs = removeSelectors(contentParts, parameterSelectors).map(splitParameterDocIntoNameAndDescription);

	const returnDocs = removeSelectors(contentParts, returnSelectors);

	if (returnDocs.length > 1) {
		console.warn(`Multiple @returns located in JSDoc for doc ${docId}`);
	}

	return {
		description: docsWithoutSelectors.join('\n'),
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

function splitParameterDocIntoNameAndDescription(description) {
	const parameterNameMatch = /^\[?(\w+)\]?(.*)/.exec(description);
	let name = '';

	if (parameterNameMatch == null) {
		console.warn(`Unable to find a parameter name in doc '${docId}' using description: '${description}'`);
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

module.exports = function functionProcessor() {
	return {
		docTypes: [ 'function' ],
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				const docWithContent = [doc].concat(doc.overloads).find(doc =>
					typeof doc.content === 'string' && doc.content !== ''
				);

				const {
					description,
					parameterDocs,
					returns
				} = getDocsFromContent(doc.id, (docWithContent != null) ? docWithContent.content : '');

				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: description,
					sections: [
						{
							title: 'Calls',
							componentSelector: 'table',
							data: {
								rows: getCallDocs(doc)
							}
						},
						{
							title: 'Parameters',
							componentSelector: 'table',
							data: {
								headers: [ 'Name', 'Description' ],
								rows: parameterDocs.map(parameterDoc => [ parameterDoc.name, parameterDoc.description ])
							}
						},
						{
							title: 'Returns',
							componentSelector: 'markdown',
							display: typeof returns === 'string' && returns != '',
							data: returns
						}
					]
				});
			});
		},
		$runAfter: [ 'filterTypescriptDocsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
}
