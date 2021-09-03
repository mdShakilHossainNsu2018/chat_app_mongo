const jwt = require("jwt-then")

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "Forbidden! ";
        const token = req.headers.authorization.split(" ")[1];
        req.payload = await jwt.verify(token, process.env.SECRET);
        next();
    } catch (e) {
        res.status(401).json({
            message: "Forbidden! ⛔"
        })
    }


}