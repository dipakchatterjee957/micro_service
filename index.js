import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/bflp/dev/user', userRouter);
app.get('/', (req, res) => {
    res.send('User Service');
});

app.listen(PORT, () => {
    console.log(`User Server is running on http://localhost:${PORT}`);
});