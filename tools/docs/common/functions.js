function splitString(string, regex) {
	const match = regex.exec(string);
	const index = (match) ? match.index : string.length;

	return [ string.substring(0, index), string.substring(index) ];
}

function splitStringAndTrim(string, regex) {
	const [ match, remainingText ] = splitString(string, regex);

	return [ match.trim(), remainingText.trim() ];
}

function flattenArray(array) {
	return array.reduce((flatArray, item) => {
		return flatArray.concat(item);
	}, []);
}

module.exports = {
	splitString,
	splitStringAndTrim,
	flattenArray
};
