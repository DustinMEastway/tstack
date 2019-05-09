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

				doc.data = Object.assign({}, doc.data, {
					calls: callDocs.map(callDoc => {
						// TODO: add doc.typeParameters when it is available on overloads
						const parameters = callDoc.parameters.join(', ');

						return `function ${doc.name}(${parameters}): ${callDoc.type}`
					}),
					title: doc.name
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
