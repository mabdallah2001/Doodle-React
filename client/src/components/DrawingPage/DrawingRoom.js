import React, {useState, useEffect, useRef} from 'react';
import querystring from 'query-string';
import socket from '../socketConfig'

import Chat from './Chat/Chat';
import Users from './Users/Users'
import Canvas from './Canvas/Canvas';

import './DrawingRoom.css';
import InfoBar from './InfoBar/InfoBar';

const DrawingRoom = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
  

    useEffect( () => {
        const data = querystring.parse(location.search);
        const {name, room} = data;
        setName(name);
        setRoom(room);
      
        socket.emit('join', {name,room}, (error) => {
            if(error){
                alert(error);
            }
        })

    }, [location.search]);


    useEffect(()=>{
        socket.on('message', (message) => {

            setMessages(messages => [...messages, message])
        });

        socket.on('usersList', ({ tempUsers }) => {
            setUsers(tempUsers);
        });

        return () => { 
            socket.close();
        }
        
    }, [])


    // Sending Messages function
    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    
    return (
        
        <div>
            <InfoBar className="infoBar" room={room}/>
            <Users className="users" users={users}/>
            <div className="outer-canvas">
                <Canvas name={name} socket={socket}/>
            </div>
            <Chat className="chat" name={name} setMessage={setMessage} message= {message} messages={messages} setMessages={setMessages} sendMessage={sendMessage} />
        </div>
    );
};

export default DrawingRoom;