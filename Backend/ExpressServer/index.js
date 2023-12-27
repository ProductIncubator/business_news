import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {res.send("Home PAge");});

app.get("/about", (req, res) => {res.send("<h1>About Me ?</h1>");});

app.get("/contact", (req, res) => {res.send("<h1>How Contact With Me ?</h1>");});

app.post("/register", (req, res) => { res.sendStatus(201); });

app.put("/user/ismats", (req, res) => { res.sendStatus(200); });

app.patch("/user/ismats", (req, res) => { res.sendStatus(200); });

app.delete("/user/ismats", (req, res) => { res.sendStatus(200); });

app.listen(port, () => { console.log(`Server running on ${port}`); })