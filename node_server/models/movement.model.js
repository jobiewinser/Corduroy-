import mongoose from 'mongoose';
import DataUpdate from "./dataUpdate.model";

const Schema = mongoose.Schema;

let MovementSchema = new Schema({
    epoch: {
        type: Number,
        required: true
    },
    sensor_name: {
        type: String,
        required: true
    },
    pi: {
        type: Number,
        required: true
    }
});

MovementSchema.statics.getMovement = function (room_name) {
    return new Promise((resolve, reject) => {
        Movement.find({sensor_name: room_name})
            .then(data =>
            {
                resolve(data)
            })
            .catch(err => {reject(err);
            })
    })
};

let Movement = mongoose.model('Movement', MovementSchema);


export default Movement;