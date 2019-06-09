module.exports = function outputPathProcessor (LOGGER) {
	return {
		$process: function(docs) {
			docs.forEach(doc => {
				if (!doc.fileInfo) {
					LOGGER.logWarning(`Doc '${doc.id}' does not have a fileInfo which is needed to compute its path`);
					return;
				}

				doc.outputPath = doc.id
					// remove '/src/public_api'
					.replace(/^([\w\/]+?)\/src\/public_api/, "$1")
					// add file extension
					+ '.json';
			});
		},
		$runAfter: [ 'computePathsProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	}
}
