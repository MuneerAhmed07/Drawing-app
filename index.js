const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img");
ctx = canvas.getContext('2d');

// Global variables width default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillStyle back to the selectedColor, it'll be the brush color
}


window.addEventListener('load', () => {
    // setting canvas width/height.. offsetwidth/height returns viewabel width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Draw Rectangle 

const drawRect = (e) => {
    // if fillColor is not checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating rect according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

// Draw Circle

const drawCircle = (e) => {
    ctx.beginPath();    //creating new path to draw the circle
    // setting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();  // if fillColor checked fill circle else draw border circle
}

// Draw Triangle

const drawTriangle = (e) => {
    ctx.beginPath();    // creating new path to draw the circle
    ctx.moveTo(prevMouseX, prevMouseY); // moving Triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // create bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke();  // if fillColor checked fill Triangle else draw border Triangle
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath(); // start new path to draw
    ctx.lineWidth = brushWidth; // passing brushSize as line width
    ctx.strokeStyle = selectedColor;    // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor;      // passing selectedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoid dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); // adding copied canvas data on to this canvas

    if (selectedTool === "brush" || selectedTool === "eraser"){
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on he existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // create a new line & return x and y coordinate of the mouse pointer
        ctx.stroke(); // drawing/filing line with color
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }

}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {   //adding click event to all tool option
        // removing active class from the previous option and adding on the current clicked option
        document.querySelector('.options .active').classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value) // passing slider value as brushSize

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {   // adding click event to all color button
        // removing active class from the previous option and adding on the current clicked option
        document.querySelector('.options .selected').classList.remove("selected");
        btn.classList.add("selected");

        // passing selected btn background color as seletedColor value
        selectedColor = (window.getComputedStyle(btn).getPropertyValue("background-color"));
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear whole canvas
    setCanvasBackground();
});

saveImage.addEventListener("click", () => {
    const link = document.createElement("a"); // create <a> element
    link.download = `${Date.now()}.jpg`;    // passing current data as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click();   // clicking link to download the image 
});


canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

canvas.addEventListener("touchmove",drawing);
canvas.addEventListener("touchend",()=>isDrawing=false);
canvas.addEventListener("mouseleave",()=>isDrawing=false);
