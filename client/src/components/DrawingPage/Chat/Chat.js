import React, {useState, useEffect} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message'
import './Chat.css';



const Chat = ({message, setMessage, sendMessage, messages, name}) => {

 
 
    return (
        <div className="chatContainer">
            
            <ScrollToBottom className="scroll">
                {messages.map( (message, index) => <div key={index}><Message message={message} name={name}/></div>)}
            </ScrollToBottom>
            <input type="text" placeholder="Enter message here..." id="chatbox" value={message} onChange={(event)=>setMessage(event.target.value)} onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null} />
           
        </div>
    );
};

export default Chat;