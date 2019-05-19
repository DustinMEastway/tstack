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
.processor(require('./processors/filter-typescript-docs.processor'))
.processor(require('./processors/function.processor'))
.processor(require('./processors/doc-type.processor'))
.processor(require('./processors/output-path.processor'));

module.exports = tstackDocsPackage;

new Dgeni([ tstackDocsPackage ]).generate();
