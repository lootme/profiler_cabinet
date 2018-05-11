var fs = require('fs');

function showPage(path, request, response) {
	console.log('in RequestHandlers path is' + path);
	fs.stat(path, function(err, stat) {
		if(err == null) {
			cms.makePageContent(path, request, function(resultOutput){
				if(typeof resultOutput == 'object') {
					var result = resultOutput;
					var helper = cms.useModule('helper');
					if(helper.defined(result, "redirect")) {
						response.writeHead(302, {
						  'Location': result.redirect
						});
						response.end();
					}
					else if(helper.defined(result, "data")) {
						cms.outputJson(response, result.data);
					} else {
						cms.outputHtml(response, '404 Sorry, page is not found!', 404);
					}
				} else {
					cms.outputHtml(response, resultOutput);
				}
			})
		} else {
			console.log(err);
			cms.outputHtml(response, '404 Sorry, page is not found!', 404);
		}
	});
	
	return;
	
}

exports.showPage = showPage;
