const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

course.method('toClient', function() {
    const c = this.toObject()
    c.id = c._id
    delete c._id
    return c
})

module.exports = model('Course', course)
