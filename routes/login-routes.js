const path = require("path");
const passport = require("passport");
const db = require("../models");

module.exports = function(app) {
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login.html" }),
    function(req, res) {
      res.redirect("/taskCard.html");
    }
  );

  app.post("/signup", function(req, res) {
    db.User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullname: req.body.fullname
    }).then(function(dbUser) {
      res.redirect("/index.html");
    });
  });

  app.post("/auth", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      db.User.findOne({
        where: {
          username: username,
          password: password
        }
      }).then(function(response) {
        if (response) {
          req.session.loggedin = true;
          req.session.username = username;
          // THIS IS WHERE THE CHANGE HAPPENED!
          res.redirect("/taskCard.html");
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      });
    } else {
      res.send("Please enter Username and Password!");
      res.end();
    }
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/index.html");
  });
};
