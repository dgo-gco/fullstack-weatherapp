import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/users'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const port = process.env.PORT || 4000;

main().catch(err => console.log(err));

async function main() {
    //telling TS (!) that the var exists in the .env
  await mongoose.connect(process.env.MONGODB_URL!);
  console.log('db successfully connected');
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("your on the homepage");
});

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
