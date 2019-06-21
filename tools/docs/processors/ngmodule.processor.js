module.exports = function ngmoduleProcessor() {
	return {
		docTypes: [ 'ngmodule' ],
		createSections(docs, doc) {
			const ngModuleArguments = doc.matchedDecorator.argumentInfo[0];
			const sectionConfigs = [
				{
					title: 'Declaration(s)',
					items: ngModuleArguments.declarations
				},
				{
					title: 'Provider(s)',
					items: ngModuleArguments.providers
				}
			];

			const localImportFiles = Array.from(doc.declaration.parent.resolvedModules.values()).filter(resolvedModule =>
				!resolvedModule.isExternalLibraryImport
			).map(resolvedModule =>
				resolvedModule.resolvedFileName
			);

			return sectionConfigs.reduce((sections, sectionConfig) => {
				if (!sectionConfig.items || !sectionConfig.items.length) {
					return sections;
				}

				sections.push({
					title: sectionConfig.title,
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
						rows: sectionConfig.items.map(itemName => {
							let path = null;
							let description = '';
							// doc with the same name with a path that was imported
							const matchingDocs = docs.filter(doc =>
								doc.name === itemName && localImportFiles.includes(doc.declaration.parent.originalFileName)
							);

							if (matchingDocs.length === 1) {
								const matchingDoc = matchingDocs[0];
								path = `\/${matchingDoc.outputPath.replace(/(.*)\.\w*$/, '$1')}`;
								description = matchingDoc.description;
							}

							return {
								description: description,
								name: {
									text: itemName,
									url: path
								}
							};
						})
					}
				});

				return sections;
			}, []);
		},
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: doc.description,
					sections: [
						...this.createSections(docs, doc)
					]
				});
			});
		},
		$runAfter: [ 'decoratorProcessor', 'filterDocsProcessor', 'outputPathProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}
