const Dgeni = require('dgeni');
const basePackage = require('dgeni-packages/base');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typeScriptPackage = require('dgeni-packages/typescript');
const fileSystem = require('fs');
const path = require('path');

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
		},
		{
			docType: 'directive',
			decorator: 'Directive',
			title: 'Directive(s)',
			order: 1
		},
		{
			docType: 'injectable',
			decorator: 'Injectable',
			title: 'Service(s)',
			order: 1
		}
	];
})
.factory(function FILE_SYSTEM() {
		function canAccessSync(path) {
			try {
				return fileSystem.existsSync(path) && fileSystem.accessSync(path, fileSystem.constants.R_OK) == null;
			} catch {
				return false;
			}
		}
		function isFileSync(path) {
			return canAccessSync(path) && fileSystem.lstatSync(path).isFile();
		}
		function joinPaths(...paths) {
			return path.join(...paths);
		}
		function tryReadFile(path) {
			if (isFileSync(path)) {
				return fileSystem.readFileSync(path, { encoding: 'utf-8' });
			} else {
				return '';
			}
		}
	return {
		canAccessSync,
		isFileSync,
		joinPaths,
		tryReadFile
	};
})
.factory(function TYPESCRIPT_DOC_TYPES_TO_RENDER() {
	return [
		{
			docType: 'module',
			title: 'Module(s)',
			order: 0
		},
		{
			docType: 'class',
			title: 'Class(s)',
			order: 1
		},
		{
			docType: 'interface',
			title: 'Interface(s)',
			order: 1
		},
		{
			docType: 'function',
			title: 'Function(s)',
			order: 10
		}
	];
})
.factory(function DOC_TYPES_TO_RENDER(DECORATOR_TYPES_TO_RENDER, TYPESCRIPT_DOC_TYPES_TO_RENDER) {
	return [].concat(
		DECORATOR_TYPES_TO_RENDER,
		TYPESCRIPT_DOC_TYPES_TO_RENDER
	).sort((docType1, docType2) => docType1.order - docType2.order);
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
.config(function(classProcessor, functionProcessor, tagPartsProcessor, DOC_TYPES_TO_RENDER) {
	tagPartsProcessor.docTypes = tagPartsProcessor.docTypes.concat(
		[ 'member' ].concat(DOC_TYPES_TO_RENDER.map(docTypeToRender => docTypeToRender.docType))
	);
	tagPartsProcessor.tagPreProcessors = tagPartsProcessor.tagPreProcessors.concat([
		classProcessor.preTagPartsProcessor,
		functionProcessor.preTagPartsProcessor
	]);
})
.config(function(getInjectables, parseTagsProcessor) {
	parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat(
		getInjectables([
			require('./tags/call.tag'),
			require('./tags/dynamic-component.tag'),
			require('./tags/title.tag')
		])
	);
})
// configure which decorated type to render
.config(function(decoratorProcessor, DECORATOR_TYPES_TO_RENDER) {
	decoratorProcessor.decoratorTypes = decoratorProcessor.decoratorTypes.concat(
		DECORATOR_TYPES_TO_RENDER.map(decoratorType => decoratorType.decorator)
	);
})
// configure which document types to render
.config(function(filterDocsProcessor, DOC_TYPES_TO_RENDER) {
	filterDocsProcessor.docTypes = filterDocsProcessor.docTypes.concat(
		DOC_TYPES_TO_RENDER.map(docTypeToRender => docTypeToRender.docType)
	);
})
.processor(require('./processors/class.processor'))
.processor(require('./processors/decorator.processor'))
.processor(require('./processors/doc-type.processor'))
.processor(require('./processors/filter-docs.processor'))
.processor(require('./processors/function.processor'))
.processor(require('./processors/module.processor'))
.processor(require('./processors/output-path.processor'))
.processor(require('./processors/tag-part.processor'));

module.exports = tstackDocsPackage;

new Dgeni([ tstackDocsPackage ]).generate();
