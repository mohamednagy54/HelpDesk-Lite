const roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized for this role',
        data: null
      });
    }
    next();
  };
};

module.exports = { roleCheck };
