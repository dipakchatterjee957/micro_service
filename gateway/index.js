import express from "express";
import dotenv from "dotenv";
import gatewayUserRoutes from "./router/gatewayUserRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// GATEWAY ROUTE
app.use("/dev/user", gatewayUserRoutes);

const PORT = process.env.PORT || 6060;
app.listen(PORT, () => console.log(`🚀 Gateway running on port ${PORT}`));
