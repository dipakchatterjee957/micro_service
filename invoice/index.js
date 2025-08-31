import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import invoiceRouter from './src/router/invoice.router.js';
import connectDB from "./src/utils/mongoConnection.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(`/${process.env.ENV}/invoice`, invoiceRouter);

app.get('/', (req, res) => {
    res.send(`Invoice Service running on PORT ${PORT}`);
});


app.listen(PORT, () => {
    console.log(`Invoice Server is running on http://localhost:${PORT}`);
});