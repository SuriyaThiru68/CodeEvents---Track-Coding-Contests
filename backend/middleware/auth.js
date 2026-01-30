const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Auth Header:", authHeader); // DEBUG LOG
        if (!authHeader) {
            console.log("No auth header provided");
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.log("Invalid token format");
            return res.status(401).json({ msg: "Invalid token format. Format must be: Bearer <token>" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ msg: "No token found after Bearer" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("User verified:", req.user.id);
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({ msg: "Token is not valid" });
    }
};
