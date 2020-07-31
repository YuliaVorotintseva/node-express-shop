const {Schema, model} = require('mongoose')

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            count: {
                type: Number,
                required: true,
                default: 1
            },
            courseId: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        }]
    }
})

user.methods.addToCart = function(course) {
    const items = [...this.cart.items]
    const index = items.findIndex(c => c.courseId.toString() === course._id.toString())

    if(index >= 0) ++items[index].count
    else items.push({
        count: 1,
        courseId: course._id
    })

    this.cart = {items}
    return this.save()
}

user.methods.removeFromCart = function(courseId) {
    let items = [...this.cart.items]
    const index = items.findIndex(c => c.courseId.toString() === courseId.toString())

    if(items[index].count === 1) items = items.filter(c => c.courseId.toString() != courseId.toString())
    else --items[index].count

    this.cart = {items}
    return this.save()
}

module.exports = model('User', user)
