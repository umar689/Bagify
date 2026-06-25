const jwt = require("jsonwebtoken");

module.exports=function isOwnerLoggedIn(req,res,next){
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("Please login first");
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_OWNER
        );

        req.user = decoded; // token ka data store kar diya

        next();

    } catch (err) {
        return res.status(401).send(err);
    }
}