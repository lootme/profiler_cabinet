var requestHandlers = cms.useModule('requestHandlers');

function route(pathname, request, response) {

	console.log('About to route a request for ' + pathname);
		
	
	var routes = cms.getRoutes(),
		routedPath = false,
		ruleRegex,
		matches;
	routes.every(route => {
		ruleRegex = new RegExp(route.rule);
		if (matches = ruleRegex.exec(pathname + '/')) {
			route.matches.forEach((matchedParameterKey, matchIndex) => {
				request.get[matchedParameterKey] = matches[matchIndex+1];
			});
			routedPath = route.path;
			console.log('Routed path is: ' + routedPath + ' and  request.get:',  request.get);
			return false; // break loop
		}
	});
	var realPath = cms.getPagePath(routedPath)
	/*var realPath = (routes[pathname]) ?
						cms.getPagePath(routes[pathname]) :
							cms.getPagePath();*/

	return requestHandlers.showPage(realPath, request, response);
}

exports.route = route;