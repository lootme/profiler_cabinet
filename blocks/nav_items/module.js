var helper = cms.useModule('helper');
module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {items : {}};
			
			var path = cms.getCurrentUrl(),
				pathItems = path.split('/').filter(function(el) {return el.length != 0}),
				curPathItem,
				curPathItemUrl;
			for(var i in pathItems) {
				curPathItem = pathItems[i].replace(/-.*/, '');
				curPathItemUrl = '/' + pathItems.slice(0, parseInt(i)+1).join('/') + '/';

				result.items[i] = {
					name: curPathItem,
					url: pathItems[parseInt(i)+1] ? curPathItemUrl : ''
				}
			}
			
			onLogicProcessed(result);
			
		}
}