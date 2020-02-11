import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let MovementTrigger = new Schema({
    pi: {
        type: Number,
        required: true
    },
    movement_trigger: {
        type: [String],
        required: true
    }
})

export default mongoose.model('MovementTrigger', MovementTrigger);