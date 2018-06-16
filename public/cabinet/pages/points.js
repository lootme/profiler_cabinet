module.exports = (data, onLogicProcessed) => {
	
	data.instanceManagmentSettings = {
		name : 'point',
		title : 'Checkpoints'
	};

	onLogicProcessed(data);
}