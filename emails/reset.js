const keys = require('../keys')

module.exports = (email, token) => ({
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Password recovery',
    html: `
        <h1>Forget your password?</h1>
        <p>If not, then ignore this email</p>
        <p>If so, follow the link below:</p>
        <p><a href=${keys.BASE_URL}/auth/password/${token}></a></p>
        <hr />
        <a href=${keys.BASE_URL}>NODEJS-EXPRESS-SHOP</a>
    `
})
