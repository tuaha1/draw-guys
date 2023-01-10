
function Score(props) {
    const score = props.score;
    return <span class="badge badge-primary badge-pill" style={{ color: "red", backgroundColor: "pink" }} >{score}</span>
}

export default Score;