const { TagKey } = require('../tags/tag-key');

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

module.exports = {
	createCallSections(docId, LOGGER, tagParts) {
		const callTagParts = tagParts.filter(tagPart => tagPart.key === TagKey.call);

		return (!callTagParts.length) ? [] : [
			{
				title: 'Call(s)',
				componentSelector: 'table',
				data: {
					columns: [ { id: 'call' } ],
					rows: callTagParts.map(tagPart => tagPart.match)
				}
			}
		];
	},
	createParameterSections(docId, LOGGER, tagParts) {
		const parameterTagParts = tagParts.filter(tagPart => tagPart.key === TagKey.parameter);

		return (!parameterTagParts.length) ? [] : [
			{
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
					rows: parameterTagParts.map(tagPart => splitIntoNameAndDescription(docId, tagPart.match, LOGGER))
				}
			}
		];
	},
	createReturnSections(docId, LOGGER, tagParts) {
		const returnTagParts = tagParts.filter(tagPart => tagPart.key === TagKey.return);
		if (returnTagParts.length > 1) {
			LOGGER.logWarning(`Multiple return docs provided for document ${docId}`);
		}

		return (!returnTagParts.length) ? [] : [
			{
				title: 'Returns',
				componentSelector: 'markdown',
				data: returnTagParts[0].match
			}
		];
	},
	createUsageSections(docId, LOGGER, tagParts) {
		let descriptionTextFound = false;
		return tagParts.filter(tagPart =>
			[ TagKey.dynamicComponent, TagKey.text, TagKey.title ].includes(tagPart.key)
		).reduce((sections, tagPart) => {
			if (tagPart.key === TagKey.dynamicComponent) {
				sections.push({
					componentSelector: tagPart.match
				});
			} else if (tagPart.key === TagKey.title) {
				sections.push({ title: tagPart.match });
			} else if (!descriptionTextFound) {
				// do not add a section for the first text block since it is the description
				descriptionTextFound = true;
			} else {
				sections.push({
					componentSelector: 'markdown',
					data: tagPart.match
				});
			}

			return sections;
		}, []);
	}
};
