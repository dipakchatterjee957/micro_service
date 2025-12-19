import express from "express";
import axios from "axios";
import { generateGatewayJwt } from "../middleware/generateGatewayJwt.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// user service base URL (change according to your setup)
const USER_SERVICE_BASE_URL = "http://user:6061/dev/user";

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
    console.log(error)
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


router.get("/getUserListByBranch/:branch_master_id", generateGatewayJwt, async (req, res) => {
  try {
    // 1. Extract the ID from the incoming Gateway request parameters
    const { branch_master_id } = req.params;
    // use the token set by middleware
    const newToken = req.newToken;

    // forward request to user service
    const userServiceResponse = await axios.get(
      `${USER_SERVICE_BASE_URL}/getUserListByBranch/${branch_master_id}`,
      {
        headers: {
          Authorization: `Bearer ${newToken}`,
        },
      }
    );

    return res.status(200).json(userServiceResponse.data);
  } catch (error) {
    console.error("Error calling User Service getUserListByBranch:", error);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Gateway: Internal Server Error" });
  }
});

export default router;
