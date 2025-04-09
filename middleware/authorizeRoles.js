const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} can not add task`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
