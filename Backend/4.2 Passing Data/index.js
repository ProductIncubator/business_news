import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to calculate and log the length of the names
function getNameLength(req, res, next) {
  let fName = req.body['fName'];
  let lName = req.body['lName'];
  let lengths = fName.length + lName.length;
  console.log(`Total length of names: ${lengths}`);
  next(); // Call next to move to the next middleware
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/submit", getNameLength, (req, res) => {

  res.send("Form submitted successfully!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
