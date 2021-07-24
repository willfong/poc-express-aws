import express from "express";
import morgan from "morgan";
import { metricIncrement } from "./services/cloudwatch.js";
import { bucketList, objectList, objectPut, objectGet } from "./services/s3.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("combined"));

app.get("/", async (req, res) => {
    metricIncrement("200");
    res.send("Hello World");
});

app.get("/s3/list-buckets", async (req, res) => {
    const buckets = await bucketList();
    res.json(buckets);
});

app.get("/s3/list-objects", async (req, res) => {
    const bucketName = req.query.name;
    if (!bucketName) return res.status(400).send("400: Please provide a bucket name");
    const [err, objects] = await objectList(bucketName);
    if (err) {
        let message;
        switch(err) {
            case 404:
                message = "Cannot find bucket";
                break;
            case 301:
                message = "Redirected"
                break;
        }
        return res.status(err).send(`${err}: ${message}`)
    }
    res.json(objects);
});

app.get("/s3/put-object", async (req, res) => {
    const {bucket, filename, data} = req.query;
    if (!bucket || !filename || !data) return res.status(400).send("400: Missing data");
    const [err, response] = await objectPut(bucket, filename, data);
    res.json(response)
});

app.get("/s3/get-object", async (req, res) => {
    const {bucket, filename} = req.query;
    if (!bucket || !filename) return res.status(400).send("400: Missing data");
    const [err, response] = await objectGet(bucket, filename);
    res.json(response)
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
