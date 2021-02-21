import React, { useState, useEffect } from 'react';

import "./Ball.css"

export default function Ball(props)  {

    const [position, setPosition] = useState(props.position)

    useEffect(() => {
        setPosition(props.position)
    }, [props.position])

    return(
        <div className="ball" style={{height: props.h + "px", width: props.w + "px", left: position.left + "px", top:position.top + "px"}}>
            {
                props.children
            }
        </div>
    )
}