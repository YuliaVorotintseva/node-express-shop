const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.regValidators = [
    body('email', 'Write correct email').isEmail()
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if(user) return Promise.reject('There is already a user with this email')
            } catch(error) {
                console.log(error)
            }
        }),

    body('password', 'The password must contain at least 6 characters')
        .isLength({min: 6, max: 56}).trim(),

    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) throw new Error('Passwords must match')
            return true
        }).trim(),

    body('name', 'Name must contain at least 3 characters').isLength({min: 3}).trim()
]

exports.logValidators = [
    body('email', 'Write correct email').isEmail()
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if(!user) return Promise.reject('The user does not exist')
            } catch(error) {
                console.log(error)
            }
        }),

    body('password', 'The password must contain at least 6 characters')
        .custom(async (value, {req}) => {
            const user = await User.findOne({email: req.body.email})
            const areSame = await bcrypt.compare(value, user.password)
            if(areSame) {
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save(error => {
                    if(error) throw error
                })
                return true
            } else return Promise.reject('Wrong password')
        })
        .isLength({min: 6, max: 56}).trim(),
]
