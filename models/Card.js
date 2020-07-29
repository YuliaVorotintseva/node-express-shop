'use strict'
const path = require('path')
const fs = require('fs')

const cardPath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
)

class Card {
    static async add(course) {
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id == course.id)
        const candidate = card.courses[index]

        if(candidate) {
            candidate.count++
            card.courses[index] = candidate
        } else {
            course.count = 1
            card.courses.push(course)
        }

        card.price += +course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(
                cardPath,
                JSON.stringify(card),
                error => {
                    if(error) reject(error)
                    else resolve()
                }
            )
        })
    }

    static async delete(id) {
        const card = await Card.fetch()
        const index = card.courses.findIndex(c => c.id == id)
        const course = card.courses[index]

        if(course.count == 1) card.courses = card.courses.filter(c => c.id != id)
        else card.courses[index].count--

        card.price -= course.price
        return new Promise((resolve, reject) => {
            fs.writeFile(
                cardPath,
                JSON.stringify(card),
                error => {
                    if(error) reject(error)
                    else resolve(card)
                }
            )
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                cardPath,
                'utf-8',
                (error, content) => {
                    if(error) reject(error)
                    else resolve(JSON.parse(content))
                }
            )
        })
    }
}

module.exports = Card
