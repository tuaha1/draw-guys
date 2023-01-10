import Modal from "react-modal"

function ScoreModal(props) {

    const displayScore = props.displayScore;
    const userScore = props.userScore;

    return <Modal isOpen={displayScore} style={{
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
        },
        content: {
            width: "30%",
            margin: "auto",
            transition: "all 0.3s ease-out",
        }

    }}>
        <h1 style={{ textAlign: "center" }}>Score Board</h1>
        <ol class="list-group list-group-numbered">
            {userScore.map((element) => {
                return <li class="list-group-item"> {element.nickname}
                    <span class="badge badge-primary badge-pill" style={{ color: "red", backgroundColor: "pink", float: "right" }} >{element.score}</span>
                </li>
            })}
        </ol>
    </Modal>
}

export default ScoreModal;