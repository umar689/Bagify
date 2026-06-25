const bcrypt = require("bcrypt");

const hash=async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

module.exports=hash;