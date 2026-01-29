const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting checked!");
  const token = "xyzggg";
  const isAdminAuthorized = token == "xyzggg";
  if (!isAdminAuthorized) {
    res.status(404).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting checked!");
  const token = "xyzggg";
  const isAdminAuthorized = token == "xyzggg";
  if (!isAdminAuthorized) {
    res.status(404).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
