import passport from 'passport';
import blockIfNotLoggedIn from '../middleware/blockIfNotLoggedIn';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

var express = require('express');
var router = express.Router();


router.post('/login', passport.authenticate('local'), function(req, res) {
    res.json({success: req.user});
});

//todo: remember to remove this later
router.get('/test',blockIfNotLoggedIn, function(req, res) {
    console.log(req.user);
    res.json({success: req.user});
});

router.post('/register', async (req, res) => {
    const user = await User.find({username: req.body.username});
    if (user.length === 0) {
        const hash = bcrypt.hashSync(req.body.password);
        await (new User({
            username: req.body.username,
            password: hash
        }).save());
        res.json({success:true});
    }
    else {
        res.status(422).json({success: false});
    }
    
})

router.post('/logout', (req, res) => {
    req.logOut();
    res.json({success: true});
})

module.exports = router;
