/** creates a section for a module out of the provided title and docs */
function createModuleSection(sectionTitle, docsInSection) {
	return {
		title: sectionTitle,
		componentSelector: 'table',
		data: {
			columns: [
				{
					id: 'name',
					header: 'Name',
					componentSelector: 'link',
					property: 'name'
				},
				{
					id: 'description',
					header: 'Description',
					property: 'description'
				}
			],
			rows: docsInSection.map(docInSection => {
				const path = docInSection.outputPath.replace(/(.*)\.\w*$/, '$1');
				const nameRow = {
					text: (docInSection.docType === 'module') ? `@tstack/${path}` : docInSection.name,
					url: path
				};
				const descriptionRow = (docInSection.data && docInSection.data.description)
					? docInSection.data.description
					: '';

				return { name: nameRow, description: descriptionRow };
			})
		}
	}
}

module.exports = function moduleProcessor(TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	return {
		docTypes: [ 'module' ],
		$process: function(docs) {
			const moduleDocs = docs.filter(doc => this.docTypes.includes(doc.docType));
			const globalModuleDoc = {
				id: 'public_api',
				docType: 'module',
				name: 'Packages',
				outputPath: 'index.json',
				exports: moduleDocs.slice()
			};

			docs.push(globalModuleDoc);
			moduleDocs.push(globalModuleDoc);

			moduleDocs.forEach(doc => {
				const moduleSections = [];
				TYPESCRIPT_DOC_TYPES_TO_RENDER.forEach(docTypeForSection => {
					const docsInSection = doc.exports.filter(exportedDoc =>
						exportedDoc.docType === docTypeForSection.docType
					);

					if (docsInSection.length > 0) {
						moduleSections.push(createModuleSection(docTypeForSection.title, docsInSection));
					}
				});

				const moduleName = doc.id.replace('/src', '').replace('/public_api', '');

				doc.data = Object.assign({}, doc.data, {
					title: (moduleName === 'public_api') ? '@tstack' : `@tstack/${moduleName}`,
					sections: moduleSections
				});
			});

			return docs;
		},
		$runAfter: [ 'functionProcessor', 'outputPathProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}
