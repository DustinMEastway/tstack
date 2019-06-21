const { MethodMemberDoc } = require('dgeni-packages/typescript/api-doc-types/MethodMemberDoc');
const { PropertyMemberDoc } = require('dgeni-packages/typescript/api-doc-types/PropertyMemberDoc');
const { createDecoratorString } = require('../common/functions');
const { callableDocPreTagProcessor, createUsageSections } = require('../common/tag-processors');

function classProcessor(LOGGER) {
	return {
		createSectionsForMembers(doc) {
			const memberSectionConfigs = [
				{ title: 'Properties', type: PropertyMemberDoc },
				{ title: 'Method', type: MethodMemberDoc }
			];

			return memberSectionConfigs.reduce((sections, memberSectionConfig) => {
				const membersOfType = doc.members.filter(member =>
					member.accessibility === 'public' && member instanceof memberSectionConfig.type
				);

				if (membersOfType.length) {
					sections.push({
						title: memberSectionConfig.title,
						componentSelector: 'table',
						data: {
							columns: [
								{
								componentSelector: 'markdown',
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
							rows: membersOfType.map(member => {
								let name = member.name;

								// add decorator to name
								const decoratorsString = createDecoratorString(member.decorators);
								if (decoratorsString) {
									name = `${decoratorsString}\n\n${name}`;
								}

								// add type to name
								name = `${name}: ${member.type}`;

								let description = member.description || member.content || '';

								// remove selector from description
								description = description.replace(/\@\w+\s+/, '');

								// remove name of member if it is at the begining of the description
								if (description.startsWith(member.name)) {
									description = description.substring(member.name.length).trim();
								}

								return { name, description };
							})
						}
					});
				}

				return sections;
			}, []);
		},
		preTagPartsProcessor(doc) {
			// containerDoc
			if (doc.docType === 'member'
				&& !doc.content
				&& doc.containerDoc
				&& classProcessor.docTypes.includes(doc.containerDoc.docType)
				&& doc.accessibility === 'public'
				&& doc instanceof MethodMemberDoc
			) {
				callableDocPreTagProcessor(doc);
			}
		},
		$process: function(docs) {
			docs.filter(doc => classProcessor.docTypes.includes(doc.docType)).forEach(doc => {
				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: doc.description,
					sections: [
						{
							title: 'Decorator(s)',
							componentSelector: 'markdown',
							data: `\`\`\`typescript\n${createDecoratorString(doc.decorators)}\n\`\`\``,
							display: !!doc.decorators
						},
						...this.createSectionsForMembers(doc),
						...createUsageSections(doc.id, LOGGER, doc.tagParts)
					]
				});
			});
		},
		$runAfter: [ 'decoratorProcessor', 'filterDocsProcessor', 'tagPartsProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}

classProcessor.docTypes = [ 'class', 'component', 'directive', 'injectable', 'interface' ];

module.exports = classProcessor;
