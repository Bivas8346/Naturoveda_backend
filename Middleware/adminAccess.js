exports.onliAdminAccess = (req, res, next) => {
  if (req.user.type ==1) {
    console.log("Welcome Super-Admin");
    next();
  } else {
    console.log("Admin Access Not Permitable");
    res.redirect("/");
  }
};

exports.secondAdminAccess = (req, res, next) => {
    if (req.user.type !==3) {
      console.log("Welcome Sub-admin");
      next();
    } else {
      console.log("Sub-Admin Access Not Permitable");
      res.redirect("/");
    }
  };
  