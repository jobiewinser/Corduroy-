import openSocket from 'socket.io-client';
import serverConfig from '../config/server.config';

const socket = openSocket(serverConfig.serverUrl);

const onPlaySounds = (callback) => {
    socket.on('playSounds', message => callback(message))
};

export { onPlaySounds };