module.exports = (data, onLogicProcessed) => {

		data.user = auth.get();
		
		onLogicProcessed(data);

}