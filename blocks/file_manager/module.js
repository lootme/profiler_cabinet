var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {siteSection : params.siteSection, root : params.root};
			
			var tools = cms.useModule('tools');
			tools.readPublicPath(result, function(pathResult) {

				result.pathItems = pathResult.paths;
				onLogicProcessed(result);
				
			});
			
		}
}