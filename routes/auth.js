const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const User = require('../models/User')

const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.API_KEY}
}))

router.get('/login', (request, response) => {
    response.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: request.flash('loginError'),
        registrationError: request.flash('registrationError')
    })
})

router.get('/logout', (request, response) => {
    request.session.destroy(() => response.redirect('/auth/login#login'))
})

router.get('/reset', (request, response) => {
    response.render('auth/reset', {
        title: 'Reset password',
        error: request.flash('error')
    })
})

router.get('/password/:token', async (request, response) => {
    if(!request.params.token) return response.redirect('auth/login')

    try {
        const user = await User.findOne({
            resetToken: request.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(!user) response.redirect('auth/login')
        else {
            response.render('auth/password', {
                title: 'Recovery password',
                error: request.flash('error'),
                userId: user._id.toString(),
                token: request.params.token
            })
        }
    } catch(error) {
        console.log(error)
    }
})

router.post('/password', async (request, response) => {
    try {
        const user = await User.findOne({
            _id: request.body.userId,
            resetToken: request.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(user) {
            user.password = bcrypt.hash(request.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            response.redirect('auth/login')
        } else {
            request.flash('loginError', 'The user is not found')
            response.redirect('auth/login')
        }
    } catch(error) {
        console.log(error)
    }
})

router.post('/reset', (request, response) => {
    try {
        crypto.randomBytes(32, async (error, buffer) => {
            if(error) {
                request.flash('error', 'Something went wrong, try again later')
                response.redirect('auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: request.body.email})

            if(candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 3600*1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                response.redirect('/auth/login')
            } else {
                request.flash('error', 'There is no such user')
                response.redirect('/auth/reset')
            }
        })
    } catch(error) {
        console.log(error)
    }
})

router.post('/login', async (request, response) => {
    try {
        const {email, password} = request.body
        const candidate = await User.findOne({email})

        if(candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)
            if(areSame) {
                request.session.user = candidate
                request.session.isAuthenticated = true
                request.session.save(error => {
                    if(error) throw error
                    response.redirect('/')
                })
            } else {
                request.flash('loginError', 'Wrong password')
                response.redirect('/auth/login#login')
            }
        } else {
            request.flash('loginError', 'The user does not exist')
            response.redirect('/auth/login#login')
        }
    } catch(error) {
        console.log(error)
    }
})

router.post('/registration', async (request, response) => {
    try {
        const {name, email, password, confirm} = request.body
        const candidate = await User.findOne({email})

        if(candidate) {
            request.flash('registrationError', 'There is already a user with this email')
            response.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                name,
                email,
                password: hashPassword,
                cart: {items: []}
            })
            await user.save()
            response.redirect('/auth/login#login')
            await transporter.sendMail(regEmail(email))
        }
    } catch(error) {
        console.log(error)
    }
})

module.exports = router
