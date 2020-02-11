import blockIfNotLoggedIn from '../middleware/blockIfNotLoggedIn'
import DataUpdate from '../models/dataUpdate.model';
import Movement from '../models/movement.model';
import movementService from '../services/movementTrigger';


var express = require('express');
var router = express.Router();
const url = require('url');


router.get('/graphs',blockIfNotLoggedIn, function(req, res) {
    console.log(req.user);
    res.json({success: req.user});
});

router.post('/update', (req, res) => {
    const result = req.body.data_sets;
    result.forEach((resultSet) => {
        const epoch = resultSet["epoch"];
        const sets = resultSet["data"];
        sets.forEach((set) => {
            const database_data = {"epoch": epoch,
                "sensor_name": set["sensor_name"],
                "temperature": set["temperature"],
                "humidity": set["humidity"],
                "lux": set["lux"],
                "ultraviolet": set["ultraviolet"]};

            DataUpdate.create(database_data, function (error) {
                if (error) {
                    return next(error);
                } else {
                    // return res.end("Success");
                }
            });
        })
        // (new DataUpdate(resultSet)).save();
    });
    res.json({success: true});
});

router.post('/movement', async (req, res) => {
    movementService.instantiateMovementTriggerIfPiNotExists(req.body.pi);
    const newMovement = await (new Movement({
        epoch: req.body.epoch,
        sensor_name: req.body.sensor_name,
        pi: req.body.pi
    }).save());

    console.log('hello i am potat');
    movementService.emitSoundIfTriggerExists(newMovement);
    res.json({success: true});
});

router.get('/graph', function(req, res, next) {
    const queryObject = url.parse(req.url,true).query;


    DataUpdate.getData(queryObject["room"])
        .then(result => {
            // console.log(result);
            res.send(result);
        })
        .catch(err => {
            console.log(err)
        });
});

router.get('/moveGraph',  function(req, res) {
    const queryObject = url.parse(req.url,true).query;

    Movement.getMovement(queryObject["room"])
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err)
        })
});

module.exports = router;