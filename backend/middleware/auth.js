const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Invalid token format. Format must be: Bearer <token>" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "No token found after Bearer" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
