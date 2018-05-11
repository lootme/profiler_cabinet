var fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

module.exports =  {

	readPublicPath : (params, callback) => {
		const dir = './public/' + params.siteSection + '/views/pages' + params.root;
		
		// callback runner for browsing directory
		var curAttemptsCount = 0;
		var runCallback = function(paths){
			curAttemptsCount++;
			
			if(curAttemptsCount == paths.length) {
			
				
				// sorting - first directories, then files
				var sortedPaths = {d : [], f : []};
				Object.keys(paths).map((key) => {
					sortedPaths[paths[key].type].push(paths[key]);
				});
				paths = sortedPaths.d.concat(sortedPaths.f);
			
				callback({type : 'd', paths : paths});
			}
		}

		fs.stat(dir, function(err, stat) {
			if(!err && stat.isFile()) {
			// opening file
				fs.readFile(dir, {encoding: 'utf-8'}, (err, data) => {
					if (err) throw err;

					callback({type : 'f', content : data});
				});
			} else {
			// browsing directory
				fs.readdir(dir, (err, paths) => {
					if(!err && paths.length) {
						if(params.sort) {
							paths = paths.sort();
							if(params.order == 'DESC') {
								paths = paths.reverse();
							}
						}
		
						Object.keys(paths).map((key) => {
							fs.stat(dir + '/' + paths[key], function(err, stat) {
								if (err) throw err;
								paths[key] = {
									name : paths[key],
									type : (stat.isFile()) ? 'f' : 'd'
								};
								runCallback(paths);
							});
						});
					} else {
						callback({type : 'd', paths : []});
					}
					
				});
			}
		});
			
		
	},
	
	savePublicPath : (params, callback) => {
		const dir = './public/' + params.siteSection + '/views/pages' + params.path;
		const content = params.content;
		
		if(typeof(content) == 'string') {
			// is file
			fs.writeFile(dir, content, function(err) {
				if (err) throw err;
				
				callback({success: true});
			});
		} else {
			// is directory
			params.name = params.name || 'new_folder';
			fs.mkdir(dir + '/' + params.name, function(e){
				if(e && e.code === 'EEXIST'){
					var regex = new RegExp(/\((\d+)\)$/),
						found = params.name.match(regex);
					if(found) {
						params.name = params.name.replace(found[0], '(' + (parseInt(found[1])+1) + ')');
					} else {
						params.name = params.name + '(1)'
					}

					var tools = cms.useModule('tools');
					tools.savePublicPath(params, callback);
				} else {
					callback({success: true, newFolderName: params.name});
				}
			});
		}
	},
	
	renamePublicPath : (params, callback) => {
		const dir = './public/' + params.siteSection + '/views/pages';
		
		fs.rename(dir + params.oldPath, dir + params.newPath, function(err) {
			if (err) throw err;
			
			callback({success: true});
		});
	},
	
	deletePublicPaths : (params, callback) => {
		var tools = cms.useModule('tools'),
			sourcePaths = params.paths,
			deletedPathsCount = 0,
			onePathParams = params;
		delete onePathParams.paths;
		for(var pathIndex in sourcePaths) {
			onePathParams.path = sourcePaths[pathIndex];
			tools.deletePublicPath(onePathParams, function(){
				deletedPathsCount++;
				if(deletedPathsCount >= sourcePaths.length) {
					callback({success: true});
				}
			});
		}
	},
	
	deletePublicPath : (params, callback) => {
		var tools = cms.useModule('tools'),
			rootPath = params.rootPath ? params.rootPath : './public/' + params.siteSection + '/views/pages',
			dirPath = params.rootPath ? params.path : rootPath + params.path,
			directoriesCount = params.directoriesCount ? params.directoriesCount : 1;
			
		var store = [],
			pathsCount = 1;
			
		function readDeletingPublicPath (delPath, depth, onReadFinish) {
			store[depth] = [];
			fs.stat(delPath, function(err, stat) {
				if(!err && !stat.isFile()) {
					// DIRECTORY
					
					fs.readdir(delPath, function(err, paths) {
					
						// important to minus pathsCount inside this callback
						store[depth].push({path: delPath, type: 'd'});
						pathsCount--;
					
						pathsCount = pathsCount + paths.length;
						
						if(pathsCount == 0) {
							onReadFinish(); // FINISH
						} else {
							_.each(paths, function(pathsItem) {
								readDeletingPublicPath(delPath + '/' + pathsItem, depth+1, onReadFinish);
							});
						}
					});
				} else {
					// FILE
					store[depth].push({path: delPath, type: 'f'});
					pathsCount--;

					if(pathsCount == 0) {
						onReadFinish(); // FINISH
					}
				}
			});	
		}
		
		function removePaths(curLvl) {
			var removedCount = 0;
			
			_.each(store[curLvl], function(curPath){
				fs[curPath.type == 'd' ? 'rmdir' : 'unlink'](curPath.path, function(err) {
					if(err) throw err;
					
					removedCount++;
					if(removedCount == store[curLvl].length) {
						if(++curLvl != store.length) {
							removePaths(curLvl);
						} else {
							callback({success: true});
							return;
						}
					}
				});
			});
		}
		
		readDeletingPublicPath('./public/' + params.siteSection + '/views/pages' + params.path, 0, function(){
			 
			 // BEGIN PROCESSING
			var curLvlPathsParents,
				nextLvlPaths,
				nextLvlPathParts;
						
			store = store.reverse();
			_.each(store, function(curLvlPaths, curLvl){
				nextLvlPaths = store[curLvl+1];
				if(typeof(nextLvlPaths) == 'object') {
					curLvlPathsParents = [];
					_.each(curLvlPaths, function(curLvlPath){
						curLvlPath = curLvlPath.path.split('/');
						curLvlPathsParents.push(curLvlPath[curLvlPath.length-2]);
					});
					
					_.each(nextLvlPaths, function(nextLvlPath, nextLvlPathIndex){
						if(nextLvlPath) {
							nextLvlPathParts = nextLvlPath.path.split('/');
							if(curLvlPathsParents.indexOf(nextLvlPathParts[nextLvlPathParts.length-1]) == -1) {
								store[curLvl].push(nextLvlPath);
								nextLvlPaths.splice(nextLvlPath, 1);
								//nextLvlPaths[nextLvlPathIndex].ignore = true;
							}
						}
					});
				}
			});
			// FINISH PROCESSING
			
			// BEGIN REMOVING PREPARED PATHS
			removePaths(0);
		});
		return;
	}

}