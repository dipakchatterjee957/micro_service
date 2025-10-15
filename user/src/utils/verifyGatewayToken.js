import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export async function verifyGatewayToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const tokenArr = authHeader.split(" ");
   const token = tokenArr.length == 2 ? tokenArr[1] : tokenArr[0];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    // Check that the gateway set the flag
    if (!decoded.jwtToken) {
      return res.status(403).json({ error: 'Request did not come through the gateway' });
    }

    // Optionally attach the decoded payload to req for downstream use
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err, 'error in verifyGatewayToken');
    return res.status(401).json({ error: 'Invalid token, varification failed' });
  }
}
