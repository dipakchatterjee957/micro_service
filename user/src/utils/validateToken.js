import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import utils from './utils.js';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export async function validateToken(req, res, next) {
    let token =
   req.body?.token ||
    req.query?.token ||
    req.headers["x-access-token"] ||
    req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }
    const tokenArr = token.split(" ");
    token = tokenArr.length == 2 ? tokenArr[1] : tokenArr[0];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        if(decoded) { next();}
        else { return utils.sendResponse(res, null, false,'Invalid token'); }
    } catch (error) {
        console.log('Token verification failed:', error);
        return utils.sendResponse(res, null, false,'Error Invalid token');
    }
}