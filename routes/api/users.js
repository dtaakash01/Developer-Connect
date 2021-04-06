const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User')

//@route POST api/users
//@desc  register user
//@access Public
router.post('/',[
    body('name', 'Name is required')
    .not()
    .isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Minimum 6 characters').isLength({min: 6})
    ],async (req,res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json( {errors: errors.array() } )
    }
    
    const {name, email, password} = req.body;

   try {
    
    let user = await User.findOne({email})
    

    //See if user already exists
    if(user) {
        res.status(400).json({ errors: [{ msg: 'User Already exists'}]})
    }

    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm' 
    })

     user = new User({
        name,
        email,
        avatar,
        password
    })

    //Encrypt password

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send("User Registered")
   } catch (err) {
       console.log(err.message);
       res.status(500).send('Server Error')
   }

    
})

module.exports = router;