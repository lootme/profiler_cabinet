var AppDispatcher = require('../react_actions/dispatcher');
var AppConstants = require('../react_actions/constants');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

// Define initial data points
var _pathItems = [],
	_sortField = '',
	_sortOrder = '',
	_selectedItems = [],
	_currentDir = [],
	_openedFileEditingData = {name: false, content: false},
	_nameEditingData = {oldPath: false, newPath: false};

function loadPathItems(callback) {

	var form = new FormData();

	form.append('siteSection', PathItemsStore.siteSection);
	form.append('root', PathItemsStore.root + _currentDir.join('/'));
	form.append('sort', _sortField);
	form.append('order', _sortOrder);
	
	fetch('/api/tools/read_public_path/', {
		method: 'post',
		body: form
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(result) {
		if(result.type == 'd') {
			_pathItems = result.paths;
		} else {
			_openedFileEditingData.name = _currentDir[_currentDir.length-1];
			_openedFileEditingData.content = result.content;
		}

		callback();
	});
}
function savePathItem(callback, isDir) {
	
	var isDir = isDir || false,
		fullPath = PathItemsStore.root + _currentDir.join('/');
	
	var form = new FormData();
		
	form.append('siteSection', PathItemsStore.siteSection);
	
	if(isDir) {
		form.append('path', fullPath);
	} else {
		form.append('path', fullPath.replace(/[^\/]*$/, _openedFileEditingData.name));
		form.append('content', _openedFileEditingData.content);
	}
	
	fetch('/api/tools/save_public_path/', {
		method: 'post',
		body: form
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(result) {
		if(!isDir)
			setCurrentPath(false); // exit file
		
		callback(result);
	});
}

function renamePath(callback) {

	var form = new FormData();
		
	form.append('siteSection', PathItemsStore.siteSection);
	
	var currentDir = _currentDir.join('/');
	if(currentDir.length)
		currentDir += '/';
	form.append('oldPath', PathItemsStore.root + currentDir + _nameEditingData.oldPath);
	form.append('newPath', PathItemsStore.root + currentDir + _nameEditingData.newPath);

	
	fetch('/api/tools/rename_public_path/', {
		method: 'post',
		body: form
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(result) {
		// exit rename mode
		_nameEditingData = {oldPath: false, newPath: false};
		loadPathItems(callback);
	});
}

function addPathItem(type, callback) {
	if(type == 'f') {
		var newFileName = 'new_page.pug';
		_currentDir.push(newFileName);
		_openedFileEditingData = {name: newFileName, content: ''};
		callback();
	} else { // type - d
		savePathItem(function(result){ // add directory 'new_folder'
			setEditingData({oldPath: result.newFolderName}, function(){ // enter renaming mode
				loadPathItems(callback);
			});
		}, true);
	}
}

function deletePathItems(path, callback) {
	console.log('store deletePathItems _currentDir & path: ', _currentDir, path);
	var form = new FormData(),
		apiMethod = 'delete_public_path',
		cleanSelected = false;

	form.append('siteSection', PathItemsStore.siteSection);
	
	var currentDir = _currentDir.join('/');
	if(currentDir.length)
		currentDir += '/';
		
	if(!path && _selectedItems.length == 1) {
		path = _selectedItems[0];
		cleanSelected = true;
	}
		
	if(path) {
		form.append('path', PathItemsStore.root + currentDir + path);
	} else {
		for(var pathIndex in _selectedItems) {
			form.append('paths', PathItemsStore.root + currentDir + _selectedItems[pathIndex]);
		}
		cleanSelected = true;
		apiMethod = 'delete_public_paths';
	}
	
	fetch('/api/tools/' + apiMethod + '/', {
		method: 'post',
		body: form
	})
	.then(function(response) {
		return response.json();
	})
	.then(function(result) {
		if(cleanSelected)
			_selectedItems = [];
		loadPathItems(callback);
	});
}

function setOrder(order) {
		order = order.split('-');
		_sortField = order[0];
		_sortOrder = order[1].toUpperCase();
}

function setSelected(data) {
		var isSelected = data.isSelected || false,
			itemIndex = _selectedItems.indexOf(data.item);
		if(itemIndex >= 0 && !data.isSelected)
			_selectedItems.splice(itemIndex, 1);
		else if(data.isSelected)
			_selectedItems.push(data.item);
}

function setCurrentPath(params) {
	_selectedItems = []; // reset selected items
	
	if (!params){
		_currentDir.splice(_currentDir.length-1, 1); // go up on 1 level
		_openedFileEditingData = {name: false, content: false}; // clean file data
	}
	else if(params.level) {
			_currentDir.splice(parseInt(params.level)); // go up to 'exactLvl'
	} else if (params.dir) {
		_currentDir.push(params.dir);
	}
}

function setEditingData(data, callback) {
	if(data.oldPath) {
		// rename mode
		_nameEditingData = {oldPath: data.oldPath, newPath: data.oldPath};
	} else if(typeof(data.newPath) == 'string') {
		_nameEditingData.newPath = data.newPath;
	} else if(data) {
		// editing file
		_openedFileEditingData.name = data.name;
		_openedFileEditingData.content = data.content;
	} else {
		renamePath(callback);
		return;
	}
	callback();
}

var PathItemsStore = _.extend({}, EventEmitter.prototype, {

	init: function(siteSection, root, items) {
		this.siteSection = siteSection;
		this.root = root;
		
		_pathItems = items;
	},
	
	getPathItems: function() {
		return _pathItems;
	},
	
	getOrder: function(order) {
		return _sortField + '-' + _sortOrder.toLowerCase();
	},
	
	getSelected: function() {
		return _selectedItems;
	},
	
	getCurrentDir: function() {
		return _currentDir;
	},
	
	getFileEditingData: function() {
		return _openedFileEditingData;
	},
		
	getNameEditingData: function() {
		return _nameEditingData;
	},

	// Emit Change event
	emitChange: function() {
		this.emit('change');
	},


	// Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}

});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
	var action = payload.action;
	var text;

	switch(action.actionType) {

		case AppConstants.RECEIVE_DATA:
			loadPathItems(function(){
				PathItemsStore.emitChange();
			});
			break;
			
		case AppConstants.SET_ORDER:
			setOrder(action.data);
			PathItemsStore.emitChange();
			break;
			
		case AppConstants.SET_SELECTED:
			setSelected(action.data);
			PathItemsStore.emitChange();
			break;
			
		case AppConstants.SET_CURRENT:
			setCurrentPath(action.data);
			loadPathItems(function(){
				PathItemsStore.emitChange();
			});
			break;
			
		case AppConstants.SET_EDITING_DATA:
			setEditingData(action.data, function(){
				PathItemsStore.emitChange();
			});
			break;	
			
		case AppConstants.UPDATE_DATA:
			savePathItem(function(){
				loadPathItems(function(){
					PathItemsStore.emitChange();
				});
			});
			break;
			
		case AppConstants.ADD_DATA:
			addPathItem(action.data, function(){
				PathItemsStore.emitChange();
			});
			break;
			
		case AppConstants.DELETE_DATA:
			deletePathItems(action.data, function(){
				PathItemsStore.emitChange();
			});
			break;

		default:
			return true;
			
	}

	return true;

});

module.exports = PathItemsStore;