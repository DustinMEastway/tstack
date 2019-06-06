module.exports = function componentProcessor() {
	return {
		docTypes: [ 'component' ],
		$process: function(docs) {
			docs.filter(doc => this.docTypes.includes(doc.docType)).forEach(doc => {
				doc.data = Object.assign({}, doc.data, {
					title: doc.name,
					description: doc.description,
					sections: [
						{
							title: 'Members',
							componentSelector: 'table',
							data: {
								columns: [
									{
										header: 'Name',
										id: 'name',
										property: 'name'
									},
									{
										header: 'Description',
										id: 'description',
										property: 'description'
									}
								],
								rows: doc.members.filter(member => member.accessibility === 'public').map(member => ({
									name: member.name,
									description: member.content
								}))
							}
						}
					]
				});
			});
		},
		$runAfter: [ 'filterDocsProcessor' ],
		$runBefore: [ 'renderDocsProcessor' ]
	};
}

