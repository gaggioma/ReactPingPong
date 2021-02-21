import React, { useState, useEffect, Children } from 'react';

import "./Paddle.css"

export default function Paddle(props){

    const [y, setY] = useState(props.y)

    const [r, setR] = useState(props.r)
    const [l, setL] = useState(props.l)

    //Update y direction
    useEffect(() => {
        setY(props.y)
    }, [props.y])

    //Update left direction
    useEffect(() => {
        setL(props.l)
    }, [props.l])

    //Update right direction
    useEffect(() => {
        setR(props.r)
    }, [props.r])

    return(
        <div className="paddle" style={{top: y + "px", right:  r + "px", left: l + "px", height: props.h + "px", width: props.w + "px" }}>
            {props.children}
        </div>
    )

}