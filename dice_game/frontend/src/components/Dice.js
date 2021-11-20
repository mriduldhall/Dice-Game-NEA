import React, {useState, useEffect} from 'react'
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

export default function Dice(props) {
    let [reactDice, setReactDice] = useState(null);

    useEffect(() => {
        {(reactDice !== null) ? rollAll() : null}
    }, [props.diceValues])

    function rollAll() {
        reactDice.rollAll(props.diceValues);
    }

    return (
        <div>
            <ReactDice
                numDice={2}
                disableIndividual={true}
                rollDone={props.rollDoneCallback}
                ref={dice => setReactDice(dice)}
            />
        </div>
    );
}


Dice.defaultProps = {
    'diceValues': [6, 6],
    'rollDoneCallback': () => {}
}
