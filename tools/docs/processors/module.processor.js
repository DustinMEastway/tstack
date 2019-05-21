/** creates a section for a module out of the provided title and docs */
function createModuleSection(sectionTitle, docsInSection) {
	return {
		title: sectionTitle,
		componentSelector: 'table',
		data: {
			rows: docsInSection.map(docInSection => {
				const nameCell = {
					componentSelector: 'link',
					data: {
						text: docInSection.name,
						url: docInSection.outputPath.replace(/(.*)\.\w*$/, '$1')
					}
				};
				const descriptionCell = (docInSection.data && docInSection.data.description) ? docInSection.data.description : '';

				return [ nameCell, descriptionCell ];
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

				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					sections: moduleSections
				});
			});

			return docs;
		},
		$runAfter: [ 'functionProcessor', 'outputPathProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}
