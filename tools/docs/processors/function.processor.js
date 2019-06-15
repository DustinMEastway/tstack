const PartKey = {
	call: 'call',
	example: 'example',
	parameter: 'parameter',
	return: 'return',
	text: 'text'
};

const partConfigs = [
	{
		key: PartKey.example,
		order: 0,
		selectors: [ '@example' ],
		takeUntil: takeUntilNewLine
	},
	{
		key: PartKey.parameter,
		order: -200,
		selectors: [ '@parameter', '@param' ],
		takeUntil: takeUntilNewLine
	},
	{
		key: PartKey.return,
		order: -100,
		selectors: [ '@returns', '@return' ],
		takeUntil: takeUntilNewLine
	}
];

function convertContentPartsIntoSections(docId, LOGGER, contentParts) {
	const sections = [];

	const callContentParts = contentParts.filter(contentPart => contentPart.key === PartKey.call);
	if (callContentParts.length) {
		sections.push({
			title: 'Call(s)',
			componentSelector: 'table',
			data: {
				columns: [ { id: 'call' } ],
				rows: callContentParts.map(contentPart => contentPart.match)
			}
		});
	}

	const parameterContentParts = contentParts.filter(contentPart => contentPart.key === PartKey.parameter);
	if (parameterContentParts.length) {
		sections.push({
			title: 'Parameter(s)',
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
				rows: parameterContentParts.map(contentPart => splitIntoNameAndDescription(docId, contentPart.match, LOGGER))
			}
		});
	}

	const returnContentParts = contentParts.filter(contentPart => contentPart.key === PartKey.return);
	if (returnContentParts.length) {
		if (returnContentParts.length > 1) {
			LOGGER.logWarning(`Multiple return docs provided for document ${docId}`);
		}

		sections.push({
			title: 'Returns',
			componentSelector: 'markdown',
			data: returnContentParts[0].match
		});
	}

	let descriptionTextFound = false;
	contentParts.filter(contentPart =>
		contentPart.key === PartKey.text || contentPart.key === PartKey.example
	).forEach(contentPart => {
		if (contentPart.key === PartKey.example) {
			sections.push({
				componentSelector: contentPart.match
			});
		} else if (!descriptionTextFound) {
			// do not add a section for the first text block since it is the description
			descriptionTextFound = true;
		} else {
			sections.push({
				componentSelector: 'markdown',
				data: contentPart.match
			});
		}
	});

	return sections;
}

function createContentPartConfig(jsDoc, partConfigs) {
	const joinedSelectors = flattenArray(partConfigs.map(selectorConfig => selectorConfig.selectors)).join('|');

	return {
		remainingText: jsDoc,
		partConfigs: partConfigs,
		selectorsRegEx: new RegExp(`(${joinedSelectors})\\s`)
	}
}

function flattenArray(array) {
	return array.reduce((flatArray, item) => {
		return flatArray.concat(item);
	}, []);
}

function getCallContentParts(doc) {
	const callDocs = (doc.overloads.length) ? doc.overloads : [ doc ];

	return callDocs.map(callDoc => {
		// TODO: add doc.typeParameters when it is available on overloads
		const parameters = callDoc.parameters.join(', ');

		return {
			key: PartKey.call,
			match: `function ${doc.name}(${parameters}): ${callDoc.type}`,
			order: -300
		};
	});
}

function parseContentParts(jsDoc) {
	const config = createConfig(jsDoc, partConfigs);

	const contentParts = [];
	while (config.remainingText) {
		const matchedConfig = partConfigs.find(partConfigs =>
			partConfigs.selectors.find(selector => config.remainingText.startsWith(selector))
		);

		config.remainingText = removeLeadingSelector(config);

		const key = (matchedConfig) ? matchedConfig.key : PartKey.text;
		const takeUntil = (matchedConfig) ? matchedConfig.takeUntil : takeUntilSelector;
		let [ match, remainingText ] = takeUntil(config);
		config.remainingText = remainingText;

		if (key !== PartKey.text || match) {
			contentParts.push({
				index: contentParts.length,
				key: key,
				match: match,
				order: (matchedConfig) ? matchedConfig.order : 0
			});
		}
	}

	return contentParts;
}

function removeLeadingSelector(config) {
	const match = config.selectorsRegEx.exec(config.remainingText);

	return config.remainingText.substring((match && match.index === 0) ? match[0].length : 0).trim();
}

function splitString(string, regex) {
	const match = regex.exec(string);
	const index = (match) ? match.index : string.length;

	return [ string.substring(0, index), string.substring(index) ];
}

function splitStringAndTrim(string, regex) {
	const [ match, remainingText ] = splitString(string, regex);

	return [ match.trim(), remainingText.trim() ];
}

function sortContentParts(contentParts) {
	return contentParts.slice().sort((part1, part2) => {
		const part1Order = part1.order;
		const part2Order = part2.order;

		return (part1Order === part2Order)
			? part1.index - part2.index
			: part1Order - part2Order;
	});
}

function splitIntoNameAndDescription(docId, description, LOGGER) {
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

function takeUntilNewLine(config) {
	return splitStringAndTrim(config.remainingText, /\n/);
}

function takeUntilSelector(config) {
	return splitStringAndTrim(config.remainingText, config.selectorsRegEx);
}

module.exports = function functionProcessor(LOGGER) {
	return {
		docTypes: [ 'function' ],
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				const docWithContent = [doc].concat(doc.overloads).find(doc =>
					typeof doc.content === 'string' && doc.content !== ''
				);

				const data = { title: doc.name };

				let contentParts = parseContentParts((docWithContent != null) ? docWithContent.content : '');
				contentParts.concat(getCallContentParts(doc));
				contentParts = sortContentParts(contentParts);
				const descriptionContentPart = contentParts.find(contentPart => contentPart.key === PartKey.text);
				if (descriptionContentPart) {
					data.description = descriptionContentPart.match;
				}
				data.sections = convertContentPartsIntoSections(doc.id, LOGGER, contentParts);

				doc.data = Object.assign({}, doc.data, data);
			});
		},
		$runAfter: [ 'filterDocsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
}
