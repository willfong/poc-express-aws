import express from "express";
import morgan from "morgan";
import { metricIncrement } from "./services/cloudwatch.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("combined"));

app.get("/", async (req, res) => {
    metricIncrement("200");
    res.send("Hello World");
});

app.use( async (req, res) => {
    metricIncrement("404");
    res.status(404).send("404: Page Not Found");
});

app.use((error, req, res, next) => {
    res.status(500).send("500: Internal Server Error");
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
