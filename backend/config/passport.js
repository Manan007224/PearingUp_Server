var LocalStrategy = require('passport-local').Strategy;
var User = require("../user");

module.exports = function(passport) {

	// Used to serialize the user using genSaltSync
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

	passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },

    function(req, email, password, done) {
    	console.log('Reached Here');
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)  {
            	console.log(err, '1');
            	return done(err);
            }
            if (user) { return done(null, false, {message: 'Message Email Already Taken'});
            } else {
            	var newUser = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) {console.log(err)}
                    return done(null, newUser);
                });
            }
        });
    }));

	passport.use('local-login', new LocalStrategy({
        	usernameField : 'email',
        	passwordField : 'password',
        	passReqToCallback : true
    		},
    		function(req, email, password, done) { 
        		User.findOne({ 'local.email' :  email }, function(err, user) {
            		if (err)  return done(err);
            		if (!user)  return done(null, false, {message: 'The User does not exists'}); 
            		if (!user.validPassword(password)) return done(null, false,{message: 'Wrong Password Entered'});
            		return done(null, user);
        });

    }));
};
