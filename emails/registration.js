const keys = require('../keys')

module.exports = email => ({
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration was successful',
    html: `
        <h1>Welcome to NODEJS-EXPRESS-SHOP</h1>
        <p>Your account was created successfully - ${email}</p>
        <hr />
        <a href=${keys.BASE_URL}>NODEJS-EXPRESS-SHOP</a>
    `
})
