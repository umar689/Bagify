const jwt = require("jsonwebtoken");

module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "User is not logged in");
        return res.status(401).redirect("/");
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        req.flash("error", "Invalid or expired token");
        return res.status(401).redirect("/");
    }
};