import MovementTrigger from '../models/movementTrigger.model';
import io from '../middleware/io'
import config from '../config/server.config'

const emitSoundIfTriggerExists = async (movement) => {
    const result = await MovementTrigger.findOne({movement_trigger: movement.sensor_name});
    if (result) {
        io.emit('playSounds', config.youtubeUrl);
    }
}

const instantiateMovementTriggerIfPiNotExists = (pi) => {
    MovementTrigger.count({pi}, (err, count) => { 
        if(!count>0){
            new MovementTrigger({
                pi,
                movement_trigger: ['kitchen']
            }).save();
        }
    });
}


export default {emitSoundIfTriggerExists, instantiateMovementTriggerIfPiNotExists};