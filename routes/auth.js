const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const router = Router()

router.get('/login', async (request, response) => {
    response.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: request.flash('loginError'),
        registrationError: request.flash('registrationError')
    })
})

router.get('/logout', async (request, response) => {
    request.session.destroy(() => response.redirect('/auth/login#login'))
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
        }
    } catch(error) {
        console.log(error)
    }
})

module.exports = router
