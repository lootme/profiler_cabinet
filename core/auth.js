// this module adds passport middleware

var bcrypt = require('bcrypt');
module.exports = (app) => {

	if(!app)
	{
		console.error('Cms: Auth Module: Error: There is no app object!');
		process.exit(1);
	}
	
	var passport = require('passport');
	var LocalStrategy  = require('passport-local').Strategy;
	
	app.use(passport.initialize());
	app.use(passport.session());
	
	passport.use(new LocalStrategy({
		usernameField: 'login',
		passwordField: 'psswd'
	}, function(username, password, done){
	
		var User = cms.getModel('User');
		User.findOne({ where: {username: username} }).then(function(user) {
			if(user) {
					bcrypt.compare(password, user.dataValues.password_hash, function(err, res) {
						if(res) {
							console.log("AFTER AUTH:", user);
							// getting user roles
							cms.call('User', 'getUserRoles', { id : user.id }, function(roles) {

								var userRoles = {};
								for(var i in roles) {
									userRoles[roles[i].dataValues.id] = roles[i].dataValues.name;
								}
								
								// getting user role actions
								cms.call('UserRole', 'get_user_role_actions', { roles : userRoles }, function(actions) {
									
									user.dataValues.actions = actions;
									
									return done(null, user);
								});
							});
						}
						else {
							return done(null, false, { message: 'Incorrect password.' })
						}
					});
			} else {
					return done(null, false, { message: 'Incorrect username.' })
			}
		});
		
	}));
	
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});
	
	var req, res, next, authPage;
	
	return {
		
		init : (requestResponseData, config) => {
			req = requestResponseData.request;
			res = requestResponseData.response;
			next = requestResponseData.next;
			authPage = config.authPage;
			
			// next 2 lines important to make passport.js working with connect without express
			req.query = req.get;
			req.body = req.post;
		},
		
		get : () => {
			return req.user ? req.user : false;
		},
		
		tryLogin : (callback) => {
			passport.authenticate('local', callback)(req, res, next);
		},
		
		login : (user, callback) => {		
			req.logIn(user, function(err) {
				if (err) return next(err);

				callback();
			});
		},
		
		logout : () => {
			req.logout();
		},
		
		encrypt : (password, onHashReady) => {
			const saltRounds = 10;
			bcrypt.genSalt(saltRounds, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					onHashReady(hash);
				});
			});
		},
		
		check : (actionCode, noError) => {

			var user = auth.get(),
				noError = noError || false;
			
			if(!actionCode && !user){
				
				if(!noError) {
					// show error
					cms.setPageError('Please <a href="/auth/">authorize</a> to view this content!');
				}
				return false;
			}

			if(user && user.actions){
				if(user.actions.indexOf(actionCode) < 0) {
					if(!noError) {
						// show error
						cms.setPageError('Not enough permissions (' + actionCode + ') to perform operation!');
					}
					return false;
				}
			} else {
				if(!noError) {
					// redirect
					 // important to set error for cases when redirects are not allowed
					cms.setPageError('Not enough permissions to perform operation!');
					
					cms.setRedirectPath(authPage);
				}
				return false;
			}
			
			return true;
		}
		
	}
	
}