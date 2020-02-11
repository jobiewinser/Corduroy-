import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let DataUpdateSchema = new Schema({
    epoch: {
        type: Number,
        required: true
    },
    sensor_name: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    lux: {
        type: Number,
        required: true
    },
    ultraviolet: {
        type: Number,
        required: true
    }
});

DataUpdateSchema.statics.getData = function (room_name) {
    return new Promise((resolve, reject) => {
        DataUpdate.find({sensor_name: room_name})
            .then(data =>
            {
                resolve(data)
            })
            .catch(err => {reject(err);
            })
    })
};

let DataUpdate = mongoose.model('DataUpdate', DataUpdateSchema);

export default DataUpdate;