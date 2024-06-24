const express = require("express");

import slotRouter from "./routes/slot.route";
import { createServer } from "http";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const server = createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN_1 as string],
  })
);

app.use(slotRouter);

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
