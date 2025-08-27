import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './src/router/user.router.js';
import { sequelize } from "./src/models/index.js";  

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(`/${process.env.ENV}/user`, userRouter);

app.get('/', (req, res) => {
    res.send(`User Service running on PORT ${PORT}`);
});

// Start server only after DB connection
const start = async () => {
    try {
        await sequelize.authenticate();   // test DB connection
        console.log("Database connected successfully");

        // If you want Sequelize to create/update tables automatically:
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`User Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

start();
