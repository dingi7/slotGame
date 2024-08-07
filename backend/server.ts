const express = require("express");

import slotRouter from "./routes/slot.route";
import { createServer } from "http";
import cors from "cors";
import * as dotenv from "dotenv";
import { RTPtest } from "./util/RTPtest.util";

dotenv.config();
const app = express();
const server = createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(slotRouter);

server.listen(8000, () => {
  console.log("Server is listening on port 8000");
});


RTPtest()