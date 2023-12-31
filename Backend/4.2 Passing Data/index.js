// Import required modules
import express from "express";
import bodyParser from "body-parser";
import path from "path";

// Create an Express application
const app = express();
const port = 3000;

// Define __filename and __dirname in ES module scope
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the root endpoint
app.get("/", (req, res) => {
  res.render("index");
});

// Define a route for handling POST requests to "/submit"
app.post("/submit", (req, res) => {
  // Access data from the submitted form
  const { fName, lName } = req.body;

  // Calculate the length of the full name
  const fullName = `${fName} ${lName}`;
  const fullNameLength = fullName.length;

  // Render the result using the "result.ejs" template
  res.render("result", { fullNameLength });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
