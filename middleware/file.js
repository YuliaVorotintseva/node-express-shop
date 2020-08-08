const multer = require('multer')

const storage = multer.diskStorage({
    destination(request, file, cb) {
        cb(null, 'images')
    },
    filename(request, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (request, file, cb) => {
    if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) cb(null, true)
    else cb(null, false)
}

module.exports = multer({storage, fileFilter})
