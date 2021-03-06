import React, { useState, useEffect } from 'react';

import "./Game.css"

//components
import Paddle from "./Paddle.js"
import Ball from "./Ball.js"
import Score from "./Score.js"

import useWindowDimensions from "./useWindowDimensions.js"

export default function Game(props) {

    const stepSize = 60;
    const pHeight = 150;
    const pWidth = 20

    //Game ref
    const gameRef = React.createRef();

    //when ball is outside the arena, game finish
    const [finish, setFinish] = useState(false)

    //Game start
    const [start, setStart] = useState(false)

    //Every ballSpeed ms ball increase of ballStepSize pixel
    const [ballStepSize, setBallStepSize] = useState(7);
    
    //time to refresh ball position in ms
    const [ballSpeed, setBallSpeed] = useState(10)

    //Ball dimensions
    const ballH = 40;
    const ballW = 40;

    //Window dimension
    //const { height, width } = useWindowDimensions();

    //Game dimension
    const [gameDim, setGameDim] = useState()
    useEffect(() => {
        const width = gameRef.current.clientWidth;
        const height = gameRef.current.clientHeight;
        setGameDim({
            width: width,
            height: height
        })
        setStart(true)
    }, [useWindowDimensions()])

    //position right paddle
    const [y1, setY1] = useState(150);
    const [r1, setR1] = useState(0);
    const [outside1Up, setOutside1Up] = useState(false);
    const [outside1Down, setOutside1Down] = useState(false);
    const [leftPaddleAutoPilot, setLeftPaddleAutoPilot] = useState(false);

    //Position left paddle
    const [y2, setY2] = useState(150);
    const [l2, setL2] = useState(0);
    const [outside2Up, setOutside2Up] = useState(false);
    const [outside2Down, setOutside2Down] = useState(false);
    const [rightPaddleAutoPilot, setRightPaddleAutoPilot] = useState(true);

    //Ball position
    const [ballPosition, setBallPosition] = useState({
        left: 200,
        top: 200
    });
    
    //Ball sign x: 1->right, -1->left
    const [signx, setSignX] = useState(1)

    //Ball y direction. 1->up, -1->down
    const [signy, setSignY] = useState(1)

    //Ball step size y
    const [ballStepY, setBallStepY] = useState(2)

    //Score
    const [scoreLeft, setScoreLeft] = useState(0)
    const [scoreRight, setScoreRight] = useState(0)

    //Move ball
    useEffect(()=> {

        if(start){

            //Auto pilot
            //if(rightPaddleAutoPilot){
                setY1(ballPosition.top + ballStepY * signy + pHeight >= gameDim.height ? gameDim.height - pHeight : ballPosition.top + ballStepY * signy)
            //}

            if(leftPaddleAutoPilot){
                //setY2(ballPosition.top + ballStepY * signy + pHeight >= gameDim.height ? gameDim.height - pHeight : ballPosition.top + ballStepY * signy)
            }

            const timer = setTimeout(()=>{

                //overflow top change sign on top
                if(isOutsideUp(ballPosition.top + ballStepY * signy, ballH)){                
                    setSignY(signy == 1 ? -1 : 1);
                }

                else if(isOutsideDown(ballPosition.top + ballStepY * signy, ballH)){
                    setSignY(signy == 1 ? -1 : 1);
                }

                //Overflow left change sign of left
                else if(isOutsideLeft(ballPosition.left + ballStepSize * signx, ballW)){

                    //Ball is in paddle left
                    if(ballPosition.top >=  y2 && ballPosition.top <= y2 + pHeight){

                        //Increase speed
                        setBallStepSize(ballStepSize + 1); 

                        //Random angle
                        setBallStepY(Math.floor(Math.random() * 6) + 3); 
                        
                        //Invert direction
                        setSignX(signx == 1 ? -1 : 1);

                        //disable auto pilot left and enable right
                        setRightPaddleAutoPilot(true)
                        setLeftPaddleAutoPilot(false);

                    }else{
                        setScoreRight(scoreRight + 1)
                        //setFinish(true)
                        resetGame()
                    }
                }  
                else if(isOutsideRight(ballPosition.left + ballStepSize * signx, ballW)){

                    //Ball is in paddle right
                    if(ballPosition.top >=  y1 && ballPosition.top <= y1 + pHeight){

                        //Increase speed
                        setBallStepSize(ballStepSize + 1);  

                        //Random angle
                        setBallStepY(Math.floor(Math.random() * 6) + 3);

                        //Invert direction
                        setSignX(signx == 1 ? -1 : 1);

                        //disable auto pilot right and enable left
                        setRightPaddleAutoPilot(false)
                        setLeftPaddleAutoPilot(true);

                    }else{
                        //setFinish(true)
                        setScoreLeft(scoreLeft + 1)
                        resetGame()
                    }
                }
                else{

                    var target = {}
                    Object.assign(target, ballPosition);
                    target.left =  target.left + ballStepSize * signx;
                    target.top =  target.top + ballStepY * signy;          
                    setBallPosition(target)
                }
                
            }, ballSpeed);

        }
                    
    }, [ballPosition])

    useEffect(() => {

        var target = {}
        Object.assign(target, ballPosition);
        target.left =  target.left + ballStepSize * signx;
        target.top =  target.top + ballStepY * signy; 
        setBallPosition(target)
        
    }, [signx, signy])

    useEffect(() => {
        if(start){
            setOutside1Up(isOutsideUp(y1, pHeight))
            setOutside1Down(isOutsideDown(y1, pHeight))
        }
    }, [y1])

    useEffect(() => {
        if(start){
            setOutside2Up(isOutsideUp(y2, pHeight))
            setOutside2Down(isOutsideDown(y2, pHeight))
        }
    }, [y2])

    const resetGame = () =>{

        setBallStepSize(7)
        setSignY(1)
        setSignX(1)

        setStart(false)
        const timer = setTimeout(()=>{
            setStart(true)
            //Restart game
            setBallPosition({
                left: 200,
                top: 200
            })
          
        }, 3000)
        
    }

    //Check if paddle is ouside
    const isOutsideUp = (y, h) => {
        return y < 0 ? true : false;
    }
    const isOutsideDown = (y, h) => {
        return y + h > gameDim.height ? true : false;
    }

    const isOutsideLeft = (x, w) => {
        return x < 0 ? true : false;
    }

    const isOutsideRight = (x, w) => {
        return x + w > gameDim.width ? true : false;
    }

    //Paddle direction command
    const onKeyPressed = (event) => {
        event.preventDefault()
        if(event.code == "ArrowUp" && !outside1Up && !outside2Up){
            setY2(y2 - stepSize < 0 ? 0 : y2 - stepSize);
        } else if(event.code == "ArrowDown" && !outside1Down && !outside2Down){
            setY2(y2 + stepSize + pHeight >= gameDim.height ? gameDim.height - pHeight : y2 + stepSize);
        }        
    }

    const onMouseWheel = (event) => {
        
        if( event.deltaY < 0 && !outside1Up && !outside2Up){
            setY2(y2 - stepSize < 0 ? 0 : y2 - stepSize);
        } else if(event.deltaY > 0 && !outside1Down && !outside2Down){
            setY2(y2 + stepSize + pHeight >= gameDim.height ? gameDim.height - pHeight : y2 + stepSize);
        }    else{
            //console.log(event)
        }
    }
    return(

    <div className="GameContainer">

        <div ref={gameRef} className="Game"
        onKeyDown={onKeyPressed}
        onWheel = {onMouseWheel}
        tabIndex="0"
        >
            {/*
            <div style={{color: "white"}} >
            width: {width} ~ height: {height}
            </div>
            {gameDim ?
            <div style={{color: "white"}} >
            width: {gameDim.width} ~ height: {gameDim.height}
            </div>
            :
            null
            }
            */

            }
            
            <div className="midlineClass"></div>

            

            {
                outside2Down ? 
                <div style={{color: "white"}} >
                outside
                </div>
                : null

            }
           



            <Paddle
            y={y1}
            r={r1}
            h={pHeight}
            w={pWidth}
            >    
            </Paddle>

            <Paddle
            y={y2}
            l={l2}
            h={pHeight}
            w={pWidth}
            >   
            </Paddle>

            <Ball
            w={ballW}
            h={ballH}
            position={ballPosition}>
            </Ball>

            <Score
                score={scoreLeft}
                style={{top: "10%", left: "23%"}}>
            </Score>

            
            <Score
                score={scoreRight}
                style={{top: "10%", right: "23%"}}>
            </Score>
            

        </div>
    </div>
    );

}