

export const drawLine = (context, prev, curr, origin) => {
    if (!prev) {
        return;
    }

    context.moveTo(prev[0], prev[1]);
    context.lineTo(curr[0] - origin[0], curr[1] - origin[1]);
    context.lineWidth = 5;
    context.lineCap = "round";
    context.stroke();
    context.closePath();
};