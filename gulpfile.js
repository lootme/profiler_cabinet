var fs = require('fs'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	glob = require('glob'),
	es = require('event-stream'),
	babelify = require('babelify'),
	path = require('path'),
	config = require('./config'),
	cmsModule = require('./core/cms.js'),
	cms = cmsModule(config),
	helper = cms.useModule('helper');


var defaultJsBundleName = 'app.bundled.js',
	defaultCssBundleName = 'app.bundled.css';

// tasks
gulp.task('default', ['build'], function(done) {
	done();
});

gulp.task('build', ['buildCss', 'buildReactRenders', 'buildJs'], function() {
	console.log('Application was built succesfully.');
});

gulp.task('buildCss', function() {
	for(var name in config.site_sections) {
		var bundleDir = (config.site_sections[name].bundleDir) ? 
			config.site_sections[name].bundleDir :
				'./public/' + name + '/build';
				
		var cssBundleFileName = (config.site_sections[name].cssBundleFileName) ?
			config.site_sections[name].cssBundleFileName :
				defaultCssBundleName;
				
		gulp.src(bundleDir + '/src/sass/*.scss')
			.pipe(concat(cssBundleFileName))
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(bundleDir));
	}
});

gulp.task('buildReactRenders', function() {
	
	function collectFromPages(files) {
		var usedBlocks = [],
			usedReactComponents = [];
		files.forEach(file => {
			if(path.extname(file) != '.pug')
				return;
			var contents = fs.readFileSync(file);
			while ( (result = regexBlocks.exec(contents)) ) {
				usedBlocks.push(result[1]);
			}
			while ( (result = regexReactComponents.exec(contents)) ) {
				usedReactComponents.push({ name : result[1], blockId : result[2] });
			}
		});
		return { usedBlocks : usedBlocks, usedReactComponents : usedReactComponents };
	};
	
	function addReactComponentsFromBlocks(usedBlocks, reactComponents) {
		usedBlocks.forEach(usedBlock => {
			var contents = fs.readFileSync('./blocks/' + usedBlock + '/view.pug');
			while ( (result = regexReactComponents.exec(contents)) ) {
				reactComponents.push({ name : result[1], blockId : result[2] });
			}
		});
		return reactComponents;
	}
	
	function buildFileContent(usedReactComponents, pathToReactComponents) {
		var reactRendersJs = 'var React = require(\'react\');window.React = React;';
		reactRendersJs += 'var ReactDOM = require(\'react-dom\');window.ReactDOM = ReactDOM;';
		var componentIndex = 1;
		usedReactComponents.forEach(usedReactComponent => {
			var reactComponentVarName = 'ReactComponentInstance' + componentIndex;
			var renderDataHolder = 'reactRenderData[\'' + usedReactComponent.blockId + '\']';
			reactRendersJs += 'if(typeof(reactRenderData) != \'undefined\' && typeof(' + renderDataHolder + ') != \'undefined\') {' +
								'var ' + reactComponentVarName + ' = require(\'' + pathToReactComponents + 'react_components/' + usedReactComponent.name + '/' + usedReactComponent.name + '.jsx\');' +
								'ReactDOM.render(' +
									'<' + reactComponentVarName + ' data={JSON.parse(' + renderDataHolder + '.data)} cms={JSON.parse(' + renderDataHolder + '.cms)}/>,' +
									'document.getElementById(\'' + usedReactComponent.blockId + '\')' +
								');' +
							'} else {' +
								'console.log("CMS: React component ' + usedReactComponent.name + ' was not rendered, because it\'s render data is not defined!");' +
							'}';
			componentIndex++;
		});
		return reactRendersJs;
	}
	
	for(var name in config.site_sections) {
		var files = helper.readdirSyncR('./public/' + name + '/views/pages/'),
			
			regexBlocks = /cms\.includeBlock\('([^']*)'.*\)/gi,
			regexReactComponents = /cms\.includeReactComponent\('([^']*)'[^']*'([^']*)'.*\)/gi,
			
			collectedFromPages = collectFromPages(files),
			usedBlocks = helper.objectUnique(collectedFromPages.usedBlocks),
			usedReactComponents = addReactComponentsFromBlocks(usedBlocks, collectedFromPages.usedReactComponents),
			
			result;
		
		

		console.log(
			"usedBlocks:", usedBlocks,
			"usedReactComponents:", usedReactComponents
		);
		
		var bundleDir = (config.site_sections[name].bundleDir) ? 
			config.site_sections[name].bundleDir :
				'./public/' + name + '/build';
							
		fs.writeFileSync(bundleDir + '/src/js/reactRenders.js', buildFileContent(usedReactComponents, '../../../../../'));
	}
});

gulp.task('buildJs', function(done) {
	"use strict";
	var donePartsCount = 0;
	function donePart() {
		donePartsCount++;
		if(donePartsCount >= helper.getLength(config.site_sections))
			done();
	}
	for(var name in config.site_sections) {
		let bundleDir = (config.site_sections[name].bundleDir) ? 
				config.site_sections[name].bundleDir :
					'./public/' + name + '/build';
						
		let jsBundleFileName = (config.site_sections[name].jsBundleFileName) ?
			config.site_sections[name].jsBundleFileName :
				defaultJsBundleName;
		
		glob(bundleDir + '/src/js/*.js', function(err, files) {
			var tasks = files.map(function(entry) {
				return browserify({ entries: [entry] })
					.transform(babelify, {presets: ["es2015", "react"]})
					.bundle()
					.pipe(source(jsBundleFileName))
					.pipe(gulp.dest(bundleDir));
				});
			es.merge(tasks).on('end', donePart);
		});
	}
});