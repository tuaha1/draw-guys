import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm"
import io from "socket.io-client"
import 'bootstrap/dist/css/bootstrap.css';

const socket = io.connect("http://localhost:3001");
const generator = rough.generator();

function createElement(x1, y1, x2, y2, type) {
    const roughElement = type === "line" ? generator.line(x1, y1, x2, y2) : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    return { x1, y1, x2, y2, roughElement };
}

const users = ['taha', 'talha']

function Main() {
    const [elements, setElements] = useState([]);
    const [isDrawing, setDrawing] = useState(false);
    const [elementType, setElementType] = useState('line');

    useLayoutEffect(() => {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);
        elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
    }, [elements])

    useEffect(() => {
        socket.on("receiveDrawingData", (data) => {
            setElements(data.elements);
        })

        socket.on("users", (data) => {
            console.log(data);
        })
    }, [socket])

    const handleMouseDown = (e) => {
        setDrawing(true);
        const { clientX, clientY } = e;
        const element = createElement(clientX, clientY, clientX, clientY, elementType);
        setElements(prevState => [...prevState, element]);
        socket.emit("sendDrawingData", { elements });
    }

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const { clientX, clientY } = e;
        const index = elements.length - 1;
        const { x1, y1 } = elements[index];
        const updatedElement = createElement(x1, y1, clientX, clientY, elementType);

        const elementCopy = [...elements];
        elementCopy[index] = updatedElement;
        setElements(elementCopy);
        socket.emit("sendDrawingData", { elements });
    }

    const handleMouseUp = (e) => {
        setDrawing(false);
    }

    return (
        <div>
            <div style={{ position: "fixed", backgroundColor: "#DFD3C3", width: "100%", textAlign: "center", padding: "5px" }}>
                <input
                    type="radio"
                    id="line"
                    checked={elementType === "line"}
                    onChange={() => {
                        setElementType("line")
                    }} />
                <label>line</label>
                <input
                    type="radio"
                    id="Rectangle"
                    checked={elementType === "rectangle"}
                    onChange={() => {
                        setElementType("rectangle")
                    }} />
                <label>rectangle</label>
            </div>
            <div style={{ display: "flex", border: "1px solid red" }}>
                <canvas
                    width={window.innerWidth * 0.8}
                    height={window.innerHeight}
                    style={{ backgroundColor: "grey", padding: "0%", margin: "0%" }}
                    id={"myCanvas"}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                </canvas>
                <div style={{ backgroundColor: "white", paddingTop: "2%", width: "100%" }}>
                    {users.map((elements, index) => {
                        return <p key={index}>{elements}</p>
                    })}
                </div>
            </div>
        </div>
    );
}

export default Main;