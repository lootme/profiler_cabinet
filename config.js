// /**/ - required
var config = {

	/**/site_sections : {
		admin : {
			/**/templateName : 'v1.0',
			bundleDir : './public/admin/build',
			jsBundleFileName : 'app.bundled.js',
			cssBundleFileName : 'app.bundled.css',
		},
		guest : {
			/**/templateName : 'first-template',
			bundleDir : './public/guest/build',
			jsBundleFileName : 'app.bundled.js',
			cssBundleFileName : 'app.bundled.css',
		},
	},
	
	/**/dbHost: 'postgres',
	/**/dbName: 'nodejs_cms',
	/**/dbUser: 'postgres',
	/**/dbPassword: 'marionetka99',
	
	/**/ authPage: '/auth/',
	
	// next line for showing cms errors manually anywhere on the site
	showErrorsManually: true,
	
};
module.exports = config;