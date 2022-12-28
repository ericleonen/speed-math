const express = require("express");
const app = express();
const cors = require("cors");

const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node")
const handler = tfn.io.fileSystem("./models/model.json");

const model = tf.loadLayersModel(handler);

app.use(cors({
    origin: "*"
}));

app.get("/readImage", (req, res) => {
    const dataURL = req.query.data;
    const buffer = Buffer.from(dataURL, "base64");

    const input = tfn.node.decodeImage(buffer);

    res.send(input);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
