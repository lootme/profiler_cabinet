var db = cms.getDbConnection();
var addContent = function(title, text) {
	if(!title || !text)
		return;
	db.query('INSERT INTO content (title, text) VALUES ($1, $2);', [title, text], function (err, result) {
		if (err)
			throw err;
	});
}

exports.addContent = addContent;


