const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User')

//@route GET api/auth
//@desc  Test route
//@access Public
router.get('/',auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id)/* .select('-password') */;
        res.json(user)

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
})

//@route POST api/post
//@desc  Authenticate User & get token
//@access Public
router.post('/',[

    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is Required').exists()
    ],async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array() } )
    }
    
    const {email, password} = req.body;

   try {
    
    let user = await User.findOne({email})
    

    //See if user already exists
    if(!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]})
    }

    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(payload,
    config.get('jwtSecret'),
    { expiresIn: 360000},
    (err, token) => {
        if (err) throw err;
        res.json({token});
    });

   } catch (err) {
       console.log(err.message);
       res.status(500).send('Server Error')
   }

    
})

module.exports = router;