import { useEffect, useState } from "react";
import Score from "./score";

function UserBoard(props) {

    const socket = props.socket;
    const [users, setUsers] = useState([]);
    const [userId, setUserID] = useState(false);

    useEffect(() => {
        socket.on("receive nicknames", (data) => {
            let userList = data.map((e) => { return { name: e.nickname, score: e.score, id: e.id, guessed: e.hasGuessed } });
            console.log(userList);
            setUsers(userList);
        })

        socket.on("who should draw", (data) => {
            setUserID(data.id);
        })

    }, [socket])

    return <div>
        <ul className="list-group">
            {users.map((elements, index) => {
                return <li style={{ backgroundColor: `${elements.guessed ? '#D7E9B9' : 'white'}` }} class="list-group-item d-flex justify-content-between align-items-center" key={index}>
                    {elements.name}
                    {elements.id === userId && " is drawing"}
                    <Score score={elements.score} />
                </li>
            })}
        </ul>
    </div >
}

export default UserBoard;