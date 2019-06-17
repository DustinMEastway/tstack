const { flattenArray, splitStringAndTrim } = require('../common/functions');
const { TagKey } = require('../tags/tag-key');

function splitOnNewLine(config) {
	return splitStringAndTrim(config.remainingText, /\n/);
}

function splitOnSelector(config) {
	return splitStringAndTrim(config.remainingText, config.selectorsRegEx);
}

module.exports = function tagPartsProcessor() {
	return {
		docTypes: [],
		tagConfigs: [
			{
				key: TagKey.call,
				order: -300,
				selectors: [ '@call' ],
				splitOn: splitOnNewLine
			},
			{
				key: TagKey.parameter,
				order: -200,
				selectors: [ '@parameter', '@param' ],
				splitOn: splitOnNewLine
			},
			{
				key: TagKey.return,
				order: -100,
				selectors: [ '@returns', '@return' ],
				splitOn: splitOnNewLine
			},
			{
				key: TagKey.dynamicComponent,
				order: 0,
				selectors: [ '@dynamicComponent' ],
				splitOn: splitOnNewLine
			},
			{
				key: TagKey.title,
				order: 0,
				selectors: [ '@title' ],
				splitOn: splitOnNewLine
			}
		],
		tagPreProcessors: [],
		createInitialConfig() {
			const joinedSelectors = flattenArray(this.tagConfigs.map(selectorConfig => selectorConfig.selectors)).join('|');

			return {
				remainingText: null,
				selectorsRegEx: new RegExp(`(${joinedSelectors})\\s`),
				tagConfigs: this.tagConfigs
			}
		},
		preParseTagParts(doc) {
			this.tagPreProcessors.forEach(tagPreProcessor => tagPreProcessor(doc));
		},
		parseTagParts(config) {
			const tagParts = [];
			while (config.remainingText) {
				const matchedConfig = config.tagConfigs.find(tagConfigs =>
					tagConfigs.selectors.find(selector => config.remainingText.startsWith(selector))
				);

				config.remainingText = this.removeLeadingSelector(config);

				const key = (matchedConfig) ? matchedConfig.key : TagKey.text;
				const splitOn = (matchedConfig) ? matchedConfig.splitOn : splitOnSelector;
				let [ match, remainingText ] = splitOn(config);
				config.remainingText = remainingText;

				if (key !== TagKey.text || match) {
					tagParts.push({
						index: tagParts.length,
						key: key,
						match: match,
						order: (matchedConfig) ? matchedConfig.order : 0
					});
				}
			}

			return tagParts;
		},
		removeLeadingSelector(config) {
			const match = config.selectorsRegEx.exec(config.remainingText);

			return config.remainingText.substring((match && match.index === 0) ? match[0].length : 0).trim();
		},
		sortTagParts(tagParts) {
			return tagParts.slice().sort((part1, part2) =>
				part1.order - part2.order || part1.index - part2.index
			);
		},
		$process(docs) {
			const config = this.createInitialConfig();
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				this.preParseTagParts(doc);

				if (doc.content) {
					config.remainingText = doc.content;
					doc.tagParts = this.parseTagParts(config);
				}
			});
		},
		$runAfter: [ 'filterDocsProcessor' ],
		$runBefore: [ 'linkInheritedDocs' ]
	}
}
