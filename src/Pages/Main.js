import io from "socket.io-client"
import CanvasBoard from "../components/CanvasBoard";
import 'bootstrap/dist/css/bootstrap.css';
import UserBoard from "../components/UserBoard";
import Timer from "../components/Timer";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GuessTimer from "../components/GuessTimer";
import Chat from "../components/Chat";
import ScoreModal from "../components/ScoreModal";

const port = "https://draw-guys-server.onrender.com";

const socket = io.connect(port);

function Main() {

    const location = useLocation();
    const nickname = location.state.nickname;

    useEffect(() => {
        socket.emit("nickname", nickname);
    }, [])

    const [isDrawing, setIsDrawing] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [word, setWord] = useState('');
    const [guess, setGuess] = useState([]);

    const [displayScore, setDisplayScore] = useState(false);
    const [userScore, setUserScore] = useState([]);
    const [round, setRound] = useState(0);
    const [nextPlayer, setNextPlayer] = useState(false);

    useEffect(() => {
        socket.on("who should draw", (data) => {

            setNextPlayer(false);
            console.log("data: ", data.id, data.word);
            setWord(data.word);

            if (data.word === "wait for some users to join") {
                setShowTimer(false);
                setIsDrawing(true);
            } else if (data.id === socket.id) {
                setIsDrawing(true);
                setShowTimer(true)
            } else {
                setShowTimer(false);
                setIsDrawing(false);
            }

            let guessList = [];
            for (let i = 0; i < data.word.length; i++) {
                guessList.push(<h5 style={{ margin: "0px 2px" }}>_</h5>);
            }
            setGuess(guessList);
        })

        socket.on("round finished", (data) => {
            console.log("round hogya be");
            setUserScore(data);
            setDisplayScore(true);
        })

        socket.on("round start", () => {
            setDisplayScore(false);
        })

        socket.on("round setter", data => {
            setRound(data);
        })

        socket.on("next player", (data) => {
            setNextPlayer(true);
        })

    }, [socket])


    return (
        <div className="container-fluid" style={{ padding: "2%" }}>

            <ScoreModal displayScore={displayScore} userScore={userScore} />

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div>
                    <h5>Round {round} of 3</h5>
                </div>
                <div style={{ margin: "auto" }}>
                    {isDrawing ? <h5> {word} </h5> : <div style={{ display: "flex" }}>{[...guess]}</div>}
                </div>
            </div>

            <div className="mt-1 mb-2 border rounded">
                {showTimer ? <Timer socket={socket} nextPlayer={nextPlayer} /> : <GuessTimer socket={socket} />}
            </div>

            <div className="row">
                <div className="col-sm" style={{ border: "1px solid white", borderRadius: "0px", overflow: "auto", height: "750px" }}>
                    <UserBoard socket={socket} />
                </div>
                <div className="col-sm">
                    <CanvasBoard socket={socket} shouldDraw={isDrawing} />
                </div>
                <div className="col-sm">
                    <Chat socket={socket} canChat={isDrawing} />
                </div>
            </div>
        </div >
    );
}

export default Main;