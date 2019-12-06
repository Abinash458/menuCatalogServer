var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

//the authenticate function is provided by the 'passport-local-mongoose' plugins.
//it adds this method to user schema and the model. this provieds the authentication for the local strategy.
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());