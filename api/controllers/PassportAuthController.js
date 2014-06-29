// Credit:
// @theangryangel https://gist.github.com/theangryangel/5060446
// @Mantish https://gist.github.com/Mantish/6366642
// @anhnt https://gist.github.com/anhnt/8297229

var passport = require('passport');

var PassportAuthController = {

  login: function (req,res) {
    res.view({ message: req.flash('error') });
  },

  loginProcess: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.view('passportauth/login', {
          username: req.body.username,
          message: info.message
        });
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/protected');
      });
    })(req, res, next);
  },

  loginProcessJSON: function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.send({
          status: 'failed',
          username: req.body.username,
          message: info.message
        });
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        if(!user.loginCount){
          user.loginCount = 1;
        }else{
          user.loginCount +=1;
        }
        user.lastLogin = new Date();
        delete user.password;
        user.save(function(err){
           if (err) console.log(err);
        });
        return res.send({status:'success',user_info:user});
      });
    })(req, res, next);
  },

  logout: function(req,res) {
    req.logout();
    res.send({status:"loggedOut"});
    //res.redirect('/');
  },

  protected: function(req, res) {
    res.view();
  },

  getStatus: function(req,res) {
    if(req.session.passport.user){
      User.findOne(req.session.passport.user).done(function(err, user) {
        res.send({status:"loggedIn", userInfo: user});
      });
    }else{
      res.send({status:'loggedOut'});
    }
  },

  adminUsers: function(req,res){
    res.view();
  },

  userList : function(req,res){
    User.find().exec(function(err,users){
      if (err) return next(err);
      res.send(users);
    });
  }


};

module.exports = PassportAuthController;