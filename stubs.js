// stub functions

module.exports = () => {

	return {
		
		getPageError : (execute) => {
			
			var execute = execute || false;
			
			return execute ? cms.getPageError() : cms.registerStub('getPageError');
			
		},
		
	}
}