import express from "express";
import bodyParser from "body-parser";
import actions from "./actions.js";
const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to subscription handler.");
});
app.post("/subscription", (req, res) => {
  actions(req).then(
    (resolve) => res.json(resolve),
    (error) => {
      console.log("error:", error);
      return res.json({ failed: error });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server up and running on ${PORT}`);
});
