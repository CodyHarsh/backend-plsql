const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateJWT;
