import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const Home = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const host_id = useRef(makeid(5));

   
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join Room!</h1>
                <div><input placeholder="Name" className="joinInput" type="text" onChange={ (event) => setName(event.target.value)} /> </div>

                {/* Join a Room */}

                <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={ (event) => setRoom(event.target.value)} /> </div> 
                <Link onClick={event => (!name || !room) ? event.preventDefault() : null } to={`/drawingRoom?name=${name}&room=${room}`}>
                    <button className="button mt-20 signIn" type="submit">Sign In</button>
                </Link>


                <div className="v1"></div>



                {/* Create a Room */}
                <Link onClick={event => (!name) ? event.preventDefault() : null } to={`/drawingRoom?name=${name}&room=${host_id.current}`}>
                    <button className="button newRoom" type="submit">Create A New Room</button>
                </Link>
                
            </div>
        </div>
        
    );
};

export default Home;