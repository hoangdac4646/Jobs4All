module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.isAuthenticated = true;
      res.locals.role = req.user.role;
      res.locals.authUser = req.user;
  }
  next();
};
