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
.factory(function DECORATOR_TYPES_TO_RENDER() {
	return [
		{
			docType: 'component',
			decorator: 'Component',
			title: 'Component(s)',
			order: 1
		}
	];
})
.factory(function TYPESCRIPT_DOC_TYPES_TO_RENDER() {
	return [
		{
			docType: 'module',
			title: 'Module(s)',
			order: 0
		},
		{
			docType: 'function',
			title: 'Function(s)',
			order: 10
		}
	].sort((docType1, docType2) => docType1.order - docType2.order);
})
.factory(function LOGGER () {
	const LOGGING_LEVEL_NONE = 0;
	const LOGGING_LEVEL_ERROR = 1;
	const LOGGING_LEVEL_WARNING = 2;
	const LOGGING_LEVEL_INFO = 3;

	return {
		get LOGGING_LEVEL_NONE() {
			return LOGGING_LEVEL_NONE;
		},
		get LOGGING_LEVEL_ERROR() {
			return LOGGING_LEVEL_ERROR;
		},
		get LOGGING_LEVEL_WARNING() {
			return LOGGING_LEVEL_WARNING;
		},
		get LOGGING_LEVEL_INFO() {
			return LOGGING_LEVEL_INFO;
		},
		/** @prop loggingLevel determines which messages are important enough to display */
		loggingLevel: LOGGING_LEVEL_WARNING,
		logError(message) {
			if (this.loggingLevel >= LOGGING_LEVEL_ERROR) {
				console.error(message);
			}
		},
		logWarning(message) {
			if (this.loggingLevel >= LOGGING_LEVEL_WARNING) {
				console.warn(message);
			}
		},
		logInfo(message) {
			if (this.loggingLevel >= LOGGING_LEVEL_INFO) {
				console.log(message);
			}
		}
	}
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
.config(function(computePathsProcessor, templateEngine, templateFinder, writeFilesProcessor, DECORATOR_TYPES_TO_RENDER) {
	writeFilesProcessor.outputFolder = DOCS_OUTPUT_PATH;
	templateFinder.templateFolders = [ TEMPLATES_PATH ];

	templateFinder.templatePatterns = [
		'${ doc.template }',
		'json-doc.json'
	];

	// Nunjucks and Angular conflict in their template bindings so change Nunjucks
	templateEngine.config.tags = { variableStart: '{$', variableEnd: '$}' };


	const classPathTemplate = computePathsProcessor.pathTemplates.find(pathTemplate =>
		pathTemplate.docTypes.includes('class')
	);
	computePathsProcessor.pathTemplates = computePathsProcessor.pathTemplates.concat([
		// copy the class path template for decorated types
		Object.assign({}, classPathTemplate, {
			docTypes: DECORATOR_TYPES_TO_RENDER.map(decoratorType => decoratorType.docType)
		})
	]);
})
// configure which decorated type to render
.config(function(decoratorProcessor, DECORATOR_TYPES_TO_RENDER) {
	decoratorProcessor.decoratorTypes = decoratorProcessor.decoratorTypes.concat(
		DECORATOR_TYPES_TO_RENDER.map(decoratorType => decoratorType.decorator)
	);
})
// configure which document types to render
.config(function(filterDocsProcessor, DECORATOR_TYPES_TO_RENDER, TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	filterDocsProcessor.docTypes = filterDocsProcessor.docTypes.concat(
		TYPESCRIPT_DOC_TYPES_TO_RENDER.map(docTypeToRender => docTypeToRender.docType),
		DECORATOR_TYPES_TO_RENDER.map(docTypeToRender => docTypeToRender.docType)
	);
})
.processor(require('./processors/decorator.processor'))
.processor(require('./processors/doc-type.processor'))
.processor(require('./processors/filter-docs.processor'))
.processor(require('./processors/function.processor'))
.processor(require('./processors/module.processor'))
.processor(require('./processors/output-path.processor'));

module.exports = tstackDocsPackage;

new Dgeni([ tstackDocsPackage ]).generate();
