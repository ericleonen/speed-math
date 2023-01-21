const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node")
const handler = tfn.io.fileSystem("./models/model.json");
const fs = require('fs');
const { generateMathProblem, segmentAndPredict } = require("./utils")

const model = tf.loadLayersModel(handler);

app.use(cors({
    origin: "*"
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/mathProblems/:n", (req, res) => {
    const n = parseInt(req.params.n);
    const problems = [];

    for (let i = 0; i < n; i++) {
        problems.push(generateMathProblem());
    }

    res.send(problems);
});

app.post("/predict", async (req, res) => {
    model.then(async (m) => {
        res.send({
            pred: await segmentAndPredict(m, req.body.dataURL)
        });
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
