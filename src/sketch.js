const width = 700
const height = 700
const n_py = 50;
const n_px = 50;
const pxw = Math.floor(width / n_px)
const pxh = Math.floor(width / n_py)
let runningRate = 3
const freezeRate = 60

let slider

let grid = new Array(n_py)
for(let i = 0; i < grid.length; i++) {
    grid[i] = new Array(n_py).fill(0)
}

let simulationRunning = false

function setup() {
    createCanvas(width, height)
    frameRate(freezeRate)
    let btn = createButton('Start/Stop')
    btn.mousePressed(() => {
        if(simulationRunning) {
            simulationRunning = false
            frameRate(freezeRate)
        } else {
            simulationRunning = true
            frameRate(runningRate)
        }
    })

    slider = createSlider(1, 60, 3)
}

function draw() {
    runningRate = slider.value()
    frameRate(runningRate)
    if(simulationRunning) {
        updateGrid()
    }
    drawGrid()
}

function updateGrid() {
    let nextGrid = JSON.parse(JSON.stringify(grid))
    for(let y = 0; y < n_py; y++) {
        for(let x = 0; x < n_px; x++) {
            let alive = grid[y][x]
            let nn = 0
            let result = 0
            let minX = Math.max(x - 1, 0)
            let maxX = Math.min(x + 1, n_px - 1)
            let minY = Math.max(y - 1, 0)
            let maxY = Math.min(y + 1, n_py - 1)

            for(let xx = minX; xx <= maxX; xx++) {
                for(let yy = minY; yy <= maxY; yy++) {
                    if(!(x === xx && y === yy)) {
                        nn += grid[yy][xx]
                    }
                }
            }

            if(alive) {
                if(nn === 2 || nn === 3) {
                    result = 1
                }
            } else {
                if(nn === 3) {
                    result = 1
                }
            }

            nextGrid[y][x] = result

        }
    }
    grid = JSON.parse(JSON.stringify(nextGrid))
}

function mousePressed() {
    if((!simulationRunning) && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        let [x, y] = getGridElement(mouseX, mouseY)
        grid[y][x] = (grid[y][x] + 1) % 2
    }
}

function getGridElement(x, y) {
    let gridX = Math.floor(x / pxw)
    let gridY = Math.floor(y / pxh)
    return [constrain(gridX, 0, n_px - 1), constrain(gridY, 0, n_py - 1)]
}

function drawGrid() {
    strokeWeight(1)
    stroke(127)
    for(let x = 0; x < n_px; x++) {
        for(let y = 0; y < n_py; y++) {
            let c = grid[y][x] ? color(0, 255, 0) : color(0)
            fill(c)
            rect(x * pxw, y * pxh, pxw, pxh)
        }
    }
}
