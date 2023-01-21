const tfn = require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");

// generate math problem
const generateMathProblem = () => {
    const r = Math.floor(Math.random() * 4);

    if (r < 2) {
        // addition or subtraction
        const addend1 = Math.floor(Math.random() * 10);
        const addent2 = Math.floor(Math.random() * 10);
        const sum = addend1 + addent2;

        if (r == 0) {
            // addition
            return {
                question: `${addend1} + ${addent2} = `,
                answer: sum
            };
        }
        else {
            // subtraction
            return {
                question: `${sum} - ${addend1} = `,
                answer: addent2
            };
        }
    }
    else {
        // multiplication or division
        const multiplicand = Math.floor(Math.random() * 10);
        const multiplier = Math.floor(Math.random() * 9) + 1; 
        const product = multiplicand * multiplier;

        if (r == 2) {
            // multiplication
            return {
                question: `${multiplicand} × ${multiplier} = `,
                answer: product
            };
        }
        else {
            // division
            return {
                question: `${product} ÷ ${multiplier} = `,
                answer: multiplicand
            };
        }
    }
}

// segment searching and reading
const decodeDataUrl = dataUrl => {
    const data = dataUrl.split(",")[1];
    const buffer = Buffer.from(data, 'base64');
    
    const img = tfn.node.decodeImage(buffer);
    
    return img.sum(2).div([255]);
};

const searchSegment = (arr, row, col, segmentInfo) => {
    if (!segmentInfo) {
        segmentInfo = {
            minRow: arr.length,
            minCol: arr[0].length,
            maxRow: 0,
            maxCol: 0
        }
    }

    if (
        row < 0 || row >= arr.length ||
        col < 0 || col >= arr[0].length ||
        arr[row][col] <= 0
    ) {
        return;
    }
    else {
        segmentInfo.minRow = Math.min(segmentInfo.minRow, row);
        segmentInfo.minCol = Math.min(segmentInfo.minCol, col);
        segmentInfo.maxRow = Math.max(segmentInfo.maxRow, row);
        segmentInfo.maxCol = Math.max(segmentInfo.maxCol, col);

        arr[row][col] = 0;

        searchSegment(arr, row + 1, col, segmentInfo);
        searchSegment(arr, row - 1, col, segmentInfo);
        searchSegment(arr, row, col + 1, segmentInfo);
        searchSegment(arr, row, col - 1, segmentInfo);
    }

    return segmentInfo;
};

const produceSegments = async (pixels) => {
    const segments = [];
    
    const arr = await pixels.array();

    for (let col = 0; col < arr[0].length; col++) {
        for (let row = 0; row < arr.length; row++) {
            if (arr[row][col] === -1) {
                continue;
            }
            else if (arr[row][col] > 0) {
                segments.push(searchSegment(arr, row, col, null));
            }
        }
    }

    return segments;
};

const normalizeSegments = (img, segments) => {
    return segments.map(({ minRow, minCol, maxRow, maxCol }) => {
        let sliced = tf.slice2d(img, [minRow, minCol], [maxRow - minRow, maxCol - minCol]);
        const halfDiff = Math.abs((sliced.shape[0] - sliced.shape[1]) / 2);

        if (sliced.shape[0] > sliced.shape[1]) {
            sliced = sliced.pad([[0, 0], [Math.floor(halfDiff), Math.ceil(halfDiff)]]);
            
            const eighthExta = sliced.shape[0] / 8;
            sliced = sliced.pad(
                [
                    [Math.floor(eighthExta), Math.ceil(eighthExta)],
                    [Math.floor(eighthExta), Math.ceil(eighthExta)]
                ]
            );
        }
        else if (sliced.shape[0] < sliced.shape[1]) {
            sliced = sliced.pad([[Math.floor(halfDiff), Math.ceil(halfDiff)], [0, 0]])
        
            const eighthExta = sliced.shape[1] / 8;
            sliced = sliced.pad(
                [
                    [Math.floor(eighthExta), Math.ceil(eighthExta)],
                    [Math.floor(eighthExta), Math.ceil(eighthExta)]
                ]
            );
        }

        return tf.image.resizeBilinear(
            sliced.expandDims(0).expandDims(-1), 
            [28, 28], 
            true
        );
    });
};

const predict = (model, segments) => {
    let result = 0;

    segments.forEach(segment => {
        const guess = model.predict(segment).argMax(-1).dataSync();
        result = result * 10 + guess[0];
    });

    return result;
}

const segmentAndPredict = async (model, dataUrl) => {
    const decoded = decodeDataUrl(dataUrl);
    let segments = await produceSegments(decoded);
    segments = normalizeSegments(decoded, segments);

    return predict(model, segments);
};


module.exports = {
    segmentAndPredict,
    generateMathProblem
};