import React from 'react';
import './Message.css';


const Message = ({message:{user,text}, name}) => {

    let sentByAdminJoin = false;
    let sentByAdminLeft = false;

    
    if (user === 'adminJoin'){
        sentByAdminJoin = true;
    }
    if (user === 'adminLeft'){
        sentByAdminLeft = true;
    }

    return (
           
        sentByAdminJoin
        ?
        (
            <div className="messageContainer justifyStart">
                <p className="pr-10 adminJoin">{text}</p>
            </div>
            
        )
        :
        (
           
            sentByAdminLeft
            ?
            (
                <div className="messageContainer justifyStart">
                <p className="pr-10 adminLeft">{text}</p>
                </div>
            )
            :
            (
                <div className="messageContainer justifyStart">
                <p className="pr-10 messageText"><span className="sentText">{user}</span>: {text}</p>
                </div>
            )
        )
       
        
           
        
    )

}

export default Message;

