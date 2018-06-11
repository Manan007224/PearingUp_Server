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
        userField: 'username',
        passReqToCallback : true 
    },

    function(req, res, email, password, username) {
    	console.log('Reached Here');
        User.find({$or: [{'email': email}, {'username': username}]}, function(err, user) {
            if (err)  {
            	console.log(err, '1');
            	res.status(400).json({err: 'Err with Username or email entering'});
            }
            if (user)
                res.status(400).json({err: 'Email or Username already taken'});
            else {
            	var newUser = new User();
                newUser.email = email;
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err) {console.log('There is an err', err)}
                    console.log('New User');
                    res.status(200).json({success: 'Successfully created the account'});
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
        		User.findOne({ 'email' :  email }, function(err, user) {
            		if (err)  return done(err);
            		if (!user)  return done(null, false, {message: 'The User does not exists'}); 
            		if (!user.validPassword(password)) return done(null, false,{message: 'Wrong Password Entered'});
            		return done(null, user);
        });

    }));
};
