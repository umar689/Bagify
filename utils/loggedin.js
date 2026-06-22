const cookieParser = require("cookie-parser");

module.exports =function log(){
    if(req.cookies.token){
        return true;
    }
    return false;
}