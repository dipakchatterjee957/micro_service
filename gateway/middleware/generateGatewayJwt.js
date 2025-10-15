import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY; 

export async function generateGatewayJwt(req, res, next) {
  try {
    const authHeader =
      req.body?.token ||
      req.query?.token ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const parts = authHeader.trim().split(" ");
    const token = parts.length === 2 ? parts[1] : parts[0];

    // Step 1: verify user's access token using SECRET_KEY
    const decoded = jwt.verify(token, SECRET_KEY);

    // Step 2: create new payload with flag
    const { exp, iat, ...rest } = decoded;
    const payload = { ...rest, jwtToken: true };

    // Step 3: sign new gateway token
    const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

    // Step 4: attach token to req
    req.newToken = newToken;

    // Continue to next handler
    next();
  } catch (err) {
    console.error("JWT generation failed in gateway:", err.message);
    return res.status(401).json({ error: "Invalid or expired user token" });
  }
}
