const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan('combined'));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use((req, res) => {
    res.status(404).send("404: Page Not Found");
});

app.use((error, req, res, next) => {
    res.status(500).send("500: Internal Server Error");
});

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
