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
				const callDocs = (doc.overloads.length)
					? doc.overloads
					: [ doc ];
				const content = doc.overloads.concat(doc).reduce(
					(currentContent, doc) => currentContent || doc.content,
					''
				);

				// get parameter and return docs
				const parameterSelectors = [ '@parameter', '@param' ];
				const returnSelectors = [ '@returns', '@return' ];
				const contentPartSelectors = parameterSelectors.concat(returnSelectors);
				const contentParts = splitAndKeepMatches(content, new RegExp(contentPartSelectors.join('|')));


				const parameterDocs = contentParts.map(contentPart => ({
					content: contentPart,
					selector: parameterSelectors.find(parameterSelector => contentPart.startsWith(parameterSelector))
				})).filter(contentPart =>
					contentPart.selector != null
				).map(contentPart => {
					let contentWithoutSelector = contentPart.content.substring(contentPart.selector.length).trim();
					const parameterNameMatch = /^\[?(\w+)\]?(.*)/.exec(contentWithoutSelector);
					let parameterName = '';

					if (parameterNameMatch == null) {
						console.warn(`Unable to find a parameter name in doc '${doc.id}' using description: '${contentWithoutSelector}'`);
						parameterName = ''
					} else {
						parameterName = parameterNameMatch[1];
						contentWithoutSelector = parameterName + parameterNameMatch[2];
					}

					return {
						name: parameterName,
						description: contentWithoutSelector
					};
				});

				const returnDocs = contentParts.map(contentPart => ({
					content: contentPart,
					selector: returnSelectors.find(returnSelector => contentPart.startsWith(returnSelector))
				})).filter(contentPart =>
					contentPart.selector != null
				).map(contentPart =>
					contentPart.content.substring(contentPart.selector.length).trim()
				);

				if (returnDocs.length > 1) {
					console.warn(`Multiple @returns located in JSDoc for doc ${doc.id}`);
				}

				const returns = returnDocs[0];

				const description = contentParts.filter(contentPart =>
					!contentPartSelectors.some(contentPartSelector => contentPart.startsWith(contentPartSelector))
				).join('\n');

				// create document data object
				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: description,
					sections: [
						{
							title: 'Calls',
							componentSelector: 'table',
							data: {
								rows: callDocs.map(callDoc => {
									// TODO: add doc.typeParameters when it is available on overloads
									const parameters = callDoc.parameters.join(', ');

									return `function ${doc.name}(${parameters}): ${callDoc.type}` ;
								})
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
							display: returns != null,
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
