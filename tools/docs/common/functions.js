function createDecoratorString(decorators) {
	return (decorators || []).map(decorator => {
		const arguments = decorator.arguments.map(argument =>
			JSON.stringify(argument).replace(/^"|"$/g, '').replace(/\\n/g, '\n')
		).join(', ') || ' ';

		return `@${decorator.name}(${arguments})`
	}).join('\n');
}

function flattenArray(array) {
	return array.reduce((flatArray, item) => {
		return flatArray.concat(item);
	}, []);
}

function splitString(string, regex) {
	const match = regex.exec(string);
	const index = (match) ? match.index : string.length;

	return [ string.substring(0, index), string.substring(index) ];
}

function splitStringAndTrim(string, regex) {
	const [ match, remainingText ] = splitString(string, regex);

	return [ match.trim(), remainingText.trim() ];
}

module.exports = {
	createDecoratorString,
	flattenArray,
	splitString,
	splitStringAndTrim
};
