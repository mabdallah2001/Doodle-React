import io from 'socket.io-client';

const ENDPOINT = 'https://doodle-react.herokuapp.com/';
// const ENDPOINT = 'localhost:5000';

const socket = io(ENDPOINT);

export default socket;