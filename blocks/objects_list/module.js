module.exports = {
		create: (params, onLogicProcessed) => {
		
			var result = {};
			
			// logic start
			
			// working with db
			result.formDb = { objects : ["object1", "object2", "object3"]};
			
			// logic end

			onLogicProcessed(result);

		}
}