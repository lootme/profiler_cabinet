// main cms functions

var fs = require('fs');
var pug = require('pug');

var React = require("react");
var ReactDOMServer = require('react-dom/server');

module.exports = (config) => {

	if(!config)
	{
		console.error('Error: There is no configuration object!');
		process.exit(1);
	}
	
	var templatePath,
		currentPath,
		siteSectionName = 'guest',
		currentPagePath,
		currentPageViewPath,
		currentUrl,
		redirectPath = false,
		pageError = '',
		stubs = [],
		allowRedirects;
		
	return {
		init : (requestResponseData) => {
			
			allowRedirects = true;
		
			// intercepting API calls
			if(requestResponseData.pathname.match('^\/api\/') != null)
			{
				console.log('API call recieved.');
				
				allowRedirects = false;
				
				return cms.manageAPICall(
					requestResponseData.pathname,
					requestResponseData.request,
					requestResponseData.response
				);
			}
		
			for(var name in config.site_sections) {
				if(requestResponseData.pathname.match('^\/' + name + '\/') != null) {
					siteSectionName = name;
					break;
				}
			}

			// check section permissions
			var sectionPermissions = config.site_sections[siteSectionName].permissions;
			if(sectionPermissions && sectionPermissions.length) {
				for(var i in sectionPermissions) {
					if(!auth.check(sectionPermissions[i])) {
						return cms.outputHtml(requestResponseData.response, 'Not enough permissions to view this section');
					}
				}
			}
			
			currentUrl = requestResponseData.pathname;
			
			var pathname = requestResponseData.pathname.replace(/(.*)\/$/, '$1');
			pathname = pathname.replace('/' + siteSectionName, '/');
			console.log("pathname is ", pathname);
			
			var workDir = "./public/" + siteSectionName;
			templatePath = workDir + '/views/templates/'
				+ config.site_sections[siteSectionName].templateName
					+ '/template.pug';
			
			cms.searchExistingFilePath(workDir + '/pages', pathname, '.js', function(pagePath){
				currentPagePath = pagePath;
				cms.searchExistingFilePath(workDir + '/views/pages', pathname, '.pug', function(pageViewPath){
					currentPageViewPath = pageViewPath;
					
					console.log("currentPagePath is " + currentPagePath);
					console.log("current pathname is " + pathname);
					
					var router = cms.useModule('router');
					router.route(
						pathname,
						requestResponseData.request,
						requestResponseData.response
					);
				});
			});
		},
		
		useModule : (name, init, params) => {
			var init = init || false,
				params = params || false,
				module = require('./' + name);
			return !init ? module : (params ? module(params) : module());
		},
		
		getTemplatePath : () => {
			return templatePath;
		},
		
		getPagePath : (path) => {
			return (!!path) ? './public/' + siteSectionName + '/pages' + path : currentPagePath;
		},
		
		getPageViewPath : (pagePath) => {
			return (!!pagePath) ? pagePath.replace('pages/', 'views/pages/').replace('js', 'pug') : currentPageViewPath;
		},
				
		getRoutes : () => {
			var routesJSON = require('../routes.json');
			return routesJSON.route;
		},
		
		getCurrentUrl : () => {
			return currentUrl;
		},
		
		getSiteSectionName : () => {
			return siteSectionName;
		},
		
		searchExistingFilePath : (searchRoot, fileName, extension, callback) => {
			if(fileName == '/')
				fileName = '/index';
			var searchAttempts = 
			[
				searchRoot + fileName + extension,
				searchRoot + fileName + '/index' + extension,
				searchRoot + fileName + fileName + extension
			];
			var found = false,
				attemptsCount = 0;
			searchAttempts.forEach(searchAttempt => {
				fs.stat(searchAttempt, function(err, stat) {
					attemptsCount++;
					if(!found && (err == null || attemptsCount >= searchAttempts.length)) {
						found = true;
						return callback(searchAttempt);
					}
				});
			});
		},
		
		getDbConnection : () => {
			var db = cms.useModule('db');
			return db(config.dbHost, config.dbName, config.dbUser, config.dbPassword, true);
		},
		
		getModels : () => {
			var models = cms.useModule('db');
			return models(config.dbHost, config.dbName, config.dbUser, config.dbPassword);
		},
		
		getModel : (modelName) => {
			var models = cms.getModels();
			return models[modelName];
		},
		
		getConfig : () => {
			return config;
		},
		
		setRedirectPath : (path) => {
			redirectPath = path;
		},
		
		setPageError : (errorMessage) => {
			pageError = errorMessage;
		},
		
		getPageError : () => {
			return pageError;
		},
		
		registerStub : (funcName) => {
			stubs.push(funcName);
			
			return '#STUB#' + funcName + '#STUB#';
		},
		
		fillStubs : (content) => {
			for(var i in stubs) {
				content = content.replace(
					'#STUB#' + stubs[i] + '#STUB#',
					global.stubs[stubs[i]](true)
				);
			}
			
			return content;
		},
		
		makePageContent : (path, request, onPageProcessed) => {
		
			var helper = cms.useModule('helper');
			var pugOptions = { pretty: true };

			// next object contains data that should be passed to view
			var data = {
				get : request.get,
				post : request.post,
			};
			
			// I N I T I A L   P A G E   L O G I C
			var page = require('../' + path);
			page(data, function(processedData) {
				console.log('processedData:', processedData);
				
				// R E D I R E C T
				if(helper.defined(processedData, "redirect"))
				{
					onPageProcessed({ redirect : processedData.redirect });
					// end
					return false;
				}
				
				helper.extend(pugOptions, { data : processedData });
				
				// T E M P L A T E
				pug.renderFile(
					cms.getTemplatePath(),
					pugOptions,
					function (err, templateHtml) {
						console.log(err);
						
						// B L O C K S   I N   T E M P L A T E
						cms.renderBlocksInHTML(templateHtml, function(renderedTemplateOutput) {
						
							// P A G E
							pug.renderFile(
								cms.getPageViewPath(path),
								pugOptions,
								function (err, contentHtml) {
									console.log(err);
									
									// B L O C K S   O N   P A G E
									cms.renderBlocksInHTML(contentHtml, function(renderedContentOutput) {
									
										// A J A X   R E Q U E S T S   F O R   J S O N
										if(typeof renderedContentOutput == 'object') {
											onPageProcessed({ data : renderedContentOutput });
										} else {
											
											// A F T E R   A L L   R E A D Y   C A L L B A C K
											var processedBundlesCount = 0;
											function onFullPageReady() {
												processedBundlesCount++;
												if(processedBundlesCount < 2)
													return;
												var fullPageHtml = renderedTemplateOutput.replace('#CONTENT_PLACEHOLDER#', renderedContentOutput);
												onPageProcessed(fullPageHtml);
											}
											
											// J S   &   C S S
											var siteSectionName = cms.getSiteSectionName(),
												bundleDir = (config.site_sections[siteSectionName].bundleDir) ? 
													config.site_sections[siteSectionName].bundleDir :
														'./public/' + siteSectionName + '/build',
												jsBundleFileName = (config.site_sections[siteSectionName].jsBundleFileName) ?
												config.site_sections[siteSectionName].jsBundleFileName :
													'app.bundled.js',
												cssBundleFileName = (config.site_sections[siteSectionName].cssBundleFileName) ?
												config.site_sections[siteSectionName].cssBundleFileName :
													'app.bundled.css',
												jsBundlePath = bundleDir + '/' + jsBundleFileName,
												cssBundlePath = bundleDir + '/' + cssBundleFileName;
												
											fs.stat(jsBundlePath, function(err, stat) {
												if(err == null) {
													renderedTemplateOutput = renderedTemplateOutput.replace('</body>', '<script src="' + jsBundlePath.replace('./', '/') + '"></script></body>');
												} else {
													console.log(err);
												}
												onFullPageReady();
											});
											fs.stat(cssBundlePath, function(err, stat) {
												if(err == null) {
													renderedTemplateOutput = renderedTemplateOutput.replace('<head>', '<head><link rel="stylesheet" type="text/css" href="' + cssBundlePath.replace('./', '/') + '">');
												} else {
													console.log(err);
												}
												onFullPageReady();
											});
										}
									});
								}
							);
						});
					}
				);
			});
		},
		
		includeBlock : (blockName, params) => {
		
			var params = params || {};
			return '#INCLUDEBLOCK-' + blockName + '|' + JSON.stringify(params) + '#';
			
		},
		
		renderBlocksInHTML : (html, onAllBlocksRendered) => {
		
			var blockRegex = /\s*#INCLUDEBLOCK-([^|]*)\|([^#]*)#/g;
			var matches, blocks = [];
			while (matches = blockRegex.exec(html)) {
				if (matches) {
					blocks.push({
						placeholder : matches[0],
						name : matches[1],
						params : JSON.parse(matches[2]) 
					});
				}
			}
			
			if(blocks.length) {
				var blocksProcessedCount = 0,
					exited = false,
					helper = cms.useModule('helper'),
					currentBlock = 0;
					
				blocks.forEach(block => {
					
					currentBlock++;

					// check block permissions
					if(helper.defined(block.params, 'permissions')) {
						for(var i in block.params.permissions) {
							if(!auth.check(block.params.permissions[i])) {
								blocksProcessedCount++;
								html = html.replace(block.placeholder, 'Not enough permissions to render block \'' + block.name + '\'');
								if(currentBlock == blocks.length) {
									onAllBlocksRendered(html);
								}
								return;
							}
						}
					}

					var blockPath = './blocks/' + block.name,
						blockModule = require('.' + blockPath + '/module.js'),
						pugOptions = { pretty: true };
								
					blockModule.create(block.params, function(data){
			
						if(false === data) {
							return onAllBlocksRendered('');
						}
						
						if(helper.defined(block.params, 'post', 'datareq')
							&& block.params.post.datareq == 'y') {
							exited = true;
							onAllBlocksRendered(data);
						}
						
						helper.extend(pugOptions, { params : block.params, data : data });
						pug.renderFile(
								blockPath + '/view.pug',
								pugOptions,
								function (err, blockModuleHtml) {
									blocksProcessedCount++;
									if(err == null) {
										html = html.replace(block.placeholder, blockModuleHtml); //////////////// IMPORTANT - IS 'block' is which is needed???
										if(blocksProcessedCount >= blocks.length && !exited)
											onAllBlocksRendered(html);
									} else if(!exited) {
										console.log(err);
										exited = true;
										onAllBlocksRendered(html);
									}
								} 
						);
					
					});
				});
				
			} else {
			
				onAllBlocksRendered(html);
				
			}
		},
		
		includeReactComponent : (componentName, containerId, renderData) => {
				
			var renderData = renderData || {};

			var componentPath = '../react_components/' + componentName + '/' + componentName + '.jsx';
	
			var Component = require(componentPath);

			var renderData = {
				data : renderData, 
				cms : {
					currentUrl : cms.getCurrentUrl()
				}
			};

			var renderedHtml = ReactDOMServer.renderToString(
				React.createElement(Component, renderData)
			);
			var dataContainerHtml = '<script>' +
										'if(!window.reactRenderData)' +
											'window.reactRenderData={};' +
										'window.reactRenderData[\'' + containerId + '\'] = {' +
											'data : \'' + JSON.stringify(renderData.data) + '\','+
											'cms : \'' + JSON.stringify(renderData.cms) + '\'' +
										'}' +
									'</script>';
			return dataContainerHtml + '<div id="' + containerId + '">' + renderedHtml + '</div>';
		},
		
		call : (model, method, params, callback) => {
			model = cms.transformApiCall(model, true);
			method = cms.transformApiCall(method);
			var modelAPI = require('../models/' + model + 'API');
			modelAPI[method](params, callback);
		},
		
		manageAPICall : (path, request, response) => {
		
			var APIRegex = /\/api\/([^\/]*)\/([^\/]*)\//g,
				helper = cms.useModule('helper'),
				params = helper.extend({}, request.get, request.post),
				matches;

			if (matches = APIRegex.exec(path)) {
				if (matches) {
				
					var model = cms.transformApiCall(matches[1], true);
					var method = cms.transformApiCall(matches[2]);
					
					if(model.toLowerCase() == 'tools') {
					
						console.log('API call requires tools method:', method, 'with params: ', params);
						
						var tools = cms.useModule('tools');
						tools[method](params, function(jsonData){
							if(typeof(jsonData) != 'undefined')
								cms.outputJson(response, jsonData);
							else
								cms.outputJson(response, {});
						});
						
					} else {
						console.log('API call requires model:', model, 'and method:', method, 'with params: ', params);
						cms.call(model, method, params, function(jsonData){
							if(typeof(jsonData) != 'undefined')
								cms.outputJson(response, jsonData);
							else
								cms.outputJson(response, {});
						});
					}
					
				}
			}
			
		},
		
		transformApiCall : (input, capitalizeFirstLetter) => {
			var capitalizeFirstLetter = capitalizeFirstLetter || false,
				helper = cms.useModule('helper');
			return input.split('_')
				.map(function(item, index){
					return (capitalizeFirstLetter || index > 0) ? helper.capitalize(item) : item
				})
				.join('');
		},
		
		error : (response, message) => {
			var message = '<div color:"red">CMS ERROR: ' + message + '</div>';
			cms.outputHtml(response, message);
		},
			
		outputHtml : (response, html, status) => {
			if(allowRedirects && redirectPath) {
				response.writeHead(303, { Location : redirectPath });
				response.end();
			} else if(pageError && config.showErrorsManually !== true) {
				var errorMessage = pageError;
				cms.setPageError(false);
				cms.outputHtml(response, errorMessage);
			} else {
				if(!status)
					var status = 200;
				response.writeHead(status, {'Content-Type': 'text/html'});
				response.write(
					cms.fillStubs(html)
				);
				response.end();
			}
		},
		
		outputJson : (response, json, status) => {
			if(allowRedirects && redirectPath) {
				response.writeHead(303, { Location : redirectPath });
				response.end();
			} else {
				if(!status)
					var status = 200;
				if(pageError) {
					console.log(pageError);
					json.error = pageError;
				}
				console.log('sending json:', json);
				response.writeHead(status, {'Content-Type': 'application/json'});
				response.write(JSON.stringify(json));
				response.end();
			}
		}
		
	};
}