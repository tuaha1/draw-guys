import { useEffect, useState } from "react";


function Chat(props) {

    const socket = props.socket;
    const canChat = props.canChat;
    const [message, setMessage] = useState('');
    const [guessMessage, setGuessMessage] = useState([]);

    useEffect(() => {
        socket.on("receive guess", (data) => {
            setGuessMessage(prev => [...prev, data]);
        })
    }, [socket])

    useEffect(() => {
        console.log("can chat", canChat);
        if (canChat) {
            document.getElementById("chatInputID").disabled = true;
        } else {
            document.getElementById("chatInputID").disabled = false;
        }
    }, [canChat])

    useEffect(() => {
        socket.on("user guessed", (data) => {
            console.log("ye print karwana hai ", data, " aur mera socket id ", socket.id);
            if (data === socket.id) {
                console.log("condition met");
                document.getElementById("chatInputID").disabled = true;
            }
        })
    }, [])

    useEffect(() => {
        socket.on("enable chatbox", () => {
            document.getElementById("chatInputID").disabled = false;
        })
    }, [])

    const handleClick = (event) => {
        if (event.key === "Enter") {
            if (message === "") return;
            socket.emit("guess message", { message, id: socket.id });
            setMessage("");
        }
    }

    return <div style={{
        height: "750px", display: "flex", flexDirection: "column", justifyContent: "end", padding: "0px"
    }} className="border rounded">
        <ul className="list-group list-group-flush" style={{ overflow: "auto" }}>
            {guessMessage.map((element, index) => {
                return <li style={{ display: "flex" }} className="list-group-item" key={index}>{element.name}: {element.message}</li>
            })}
        </ul>
        <div style={{ display: "flex" }}>
            <input
                id="chatInputID"
                onKeyDown={handleClick}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                style={{ width: "100%", padding: "10px" }} type="text"></input>
        </div>
    </div>
}

export default Chat;