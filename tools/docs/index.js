const Dgeni = require('dgeni');
const basePackage = require('dgeni-packages/base');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typeScriptPackage = require('dgeni-packages/typescript');

const { Package } = Dgeni;

const { DOCS_OUTPUT_PATH, PROJECTS_PATH, ROOT_PATH, TEMPLATES_PATH } = require('../config');

const tstackDependencies = [
	basePackage,
	nunjucksPackage,
	typeScriptPackage
];

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

// this is the primary package used to generate documentation
var tstackDocsPackage = new Package('tstack-docs', tstackDependencies)
.factory(function TYPESCRIPT_DOC_TYPES_TO_RENDER() {
	return [ 'function', 'module' ];
})
// configure where files are read from
.config(function(readFilesProcessor, readTypeScriptModules, tsParser) {
	tsParser.options.baseUrl = '.';

	readTypeScriptModules.basePath = PROJECTS_PATH;
	readTypeScriptModules.hidePrivateMembers = true;
	readTypeScriptModules.sourceFiles = [
		'client/src/public_api.ts',
		'core/src/public_api.ts',
		'server/src/public_api.ts'
	];

	readFilesProcessor.basePath = ROOT_PATH;
	readFilesProcessor.sourceFiles = [];
})
// configure how & where docs are rendered
.config(function(templateEngine, templateFinder, writeFilesProcessor) {
	writeFilesProcessor.outputFolder = DOCS_OUTPUT_PATH;
	templateFinder.templateFolders = [ TEMPLATES_PATH ];

	templateFinder.templatePatterns = [
		'${ doc.template }',
		'json-doc.json'
	];

	// Nunjucks and Angular conflict in their template bindings so change Nunjucks
	templateEngine.config.tags = { variableStart: '{$', variableEnd: '$}' };
})
.processor(function removeUnusedTypeScriptDocsProcessor(TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	return {
		$process: function(docs) {
			return docs.filter(doc => TYPESCRIPT_DOC_TYPES_TO_RENDER.includes(doc.docType));
		},
		$runAfter: [ 'readTypeScriptModules' ],
		$runBefore: [ 'linkInheritedDocs' ]
	}
})
.processor(function functionProcessor() {
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
		$runAfter: [ 'removeUnusedTypeScriptDocsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	};
});

module.exports = tstackDocsPackage;

new Dgeni([ tstackDocsPackage ]).generate().then(docs => {
	// console.log('docs', docs);
});
