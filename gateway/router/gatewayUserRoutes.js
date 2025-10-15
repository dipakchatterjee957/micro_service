import express from "express";
import axios from "axios";
import { generateGatewayJwt } from "../middleware/generateGatewayJwt.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY; // for verifying user's token

// user service base URL (change according to your setup)
const USER_SERVICE_BASE_URL = "http://localhost:6061/dev/user";

// LOGIN API through gateway
router.post("/login", async (req, res) => {
  try {
    // forward login request to user service
    const response = await axios.post(
      `${USER_SERVICE_BASE_URL}/login`,
      req.body
    );

    // send response back to client
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error calling User Service Login:", error.message);
    if (error.response) {
      // Error returned from user service
      return res.status(error.response.status).json(error.response.data);
    }
    // Unknown error
    return res.status(500).json({ message: "Gateway: Internal Server Error" });
  }
});


router.get("/getUserAllList", generateGatewayJwt, async (req, res) => {
  try {
    // use the token set by middleware
    const newToken = req.newToken;

    // forward request to user service
    const userServiceResponse = await axios.get(
      `${USER_SERVICE_BASE_URL}/getUserAllList`,
      {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      }
    );

    return res.status(200).json(userServiceResponse.data);
  } catch (error) {
    console.error("Error calling User Service getUserAllList:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Gateway: Internal Server Error" });
  }
});

export default router;
