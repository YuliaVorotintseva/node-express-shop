'use strict'

//const uuid = require('uuid/v5')
const fs = require('fs')
const path = require('path')

class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = Math.random()
    }

    toJSON = () => ({
        title: this.title,
        price: this.price,
        img: this.img,
        id: this.id
    })

    save = async () => {
        const courses = await Course.getAllCourses()
        courses.push(this.toJSON())
        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                JSON.stringify(courses),
                error => {
                    if(error) reject(error)
                    else resolve()
                }
            )
        })
    }

    static getAllCourses() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8',
                (error, content) => {
                    if(error) reject(error)
                    else resolve(JSON.parse(content))
                }
            )
        })
    }

    static async getCourseById(id) {
        const courses = await Course.getAllCourses()
        return courses.find(course => course.id == id)
    }
}

module.exports = Course
