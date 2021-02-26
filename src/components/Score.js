import React, { useState, useEffect } from 'react';

import "./Score.css"

export default function Score(props){

    const [score, setScore] = useState(props.score)

    useEffect(() => {
        setScore(props.score)
    }, [props.score])
    
    return(
        <div className="scoreClass" style={props.style}>
            {score}
        </div>
    )

}