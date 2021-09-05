import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import socket from "../../socketConfig";
import logo from './Doodle-logo.png';
import './InfoBar.css';




const InfoBar = ({ room }) => {
    
    // username drawing

    const [username, setUsername] = useState('');
    let isUserDrawing = false;

    useEffect (() => {
        socket.on('user-drawing-frontend', username => {
            setUsername(username);
        });

    }, []);

    
        if(username != ""){
            isUserDrawing = true;
            
        }
        else{
            isUserDrawing = false;
        }
  

    
    return(
       
            isUserDrawing ? (
                <div className="infoBarContainer">
                    <p className= "room">Room: {room}  </p>
                    <img src={logo} className="logo"/>
                    <p className="userDrawing">{username} is drawing...</p>
                </div>
            )
            :
            (
           
                <div className="infoBarContainer">
                    <p className= "room">Room: {room}  </p>
                    <Link to={`/`}>
                        <img src={logo} className="logo"/>
                    </Link>
                    <p className="userDrawing">...</p>
                </div>
        
         
            )
    )
    
}

export default InfoBar;