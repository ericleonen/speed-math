

export const drawLine = (context, prev, curr, origin) => {
    if (!prev) {
        return;
    }

    context.moveTo((prev[0]) * 28/300, (prev[1]) * 28/300);
    context.lineTo((curr[0] - origin[0]) * 28/300, (curr[1] - origin[1]) * 28/300);
    context.lineWidth = 1;
    context.lineCap = "round";
    context.stroke();
    context.closePath();
};