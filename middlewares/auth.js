

function isLoggedIn(req, res, next) {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  res.redirect('/login');
}

module.exports = { isLoggedIn };
