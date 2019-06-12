module.exports = (req, res, next) => {
  if (!req.user) {
      res.locals.registermessage = "You must log in first";
      res.redirect('/login');
  } else next();
}
