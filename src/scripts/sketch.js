let capture;
let height = window.innerHeight;
function setup() {
    let canvas = createCanvas(1400, 750);
    canvas.parent('mirrorimage');
    capture = createCapture(VIDEO);
    capture.size(1400, 750);
    capture.hide();
}

function draw() {
    background(255);
    image(capture, 0, 0, 1400, 1050);
}