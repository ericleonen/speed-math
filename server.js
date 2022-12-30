const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node")
const handler = tfn.io.fileSystem("./models/model.json");
const fs = require('fs');


const model = tf.loadLayersModel(handler);

app.use(cors({
    origin: "*"
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/predict", async (req, res) => {
    const data = req.body.dataURL.split(",")[1];
    const buffer = Buffer.from(data, 'base64');
    
    let img = tfn.node.decodeImage(buffer);
    img = tf.image.sum(2)
        .expandDims(0)
        .expandDims(-1);

    model.then(predictor => {
        const pred = predictor.predict(img);
        console.log(pred.argMax(1).dataSync());
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
