const router = require("express").Router();
const {catchErrors} = require("../handlers/errorHandlers");
const userController = require("../controllers/userController");
const multer  = require('multer')
// const { v4: uuidv4 } = require('uuid');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        // null as first argument means no error
        cb(null, uuidv4() + '.' + file.originalname.split(".")[1] )
    }
})

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif']

    // Check allowed extensions
    let isAllowedExt = fileExts.includes(file.originalname.split('.')[1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowedExt && isAllowedMimeType) {
        // const baseFile = `uploads/${uuidv4()}.${req.file.filename.split(".")[1]}`
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },

    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }

}).single('avatar')

const auth = require("../middlewares/auth");
const {v4: uuidv4} = require("uuid");

router.post("/login", catchErrors(userController.login));
router.post("/register", catchErrors(userController.register));
router.post("/profile", auth, upload, userController.uploadProfilePic);
router.get("/getUsers", auth, catchErrors(userController.getAllUsers));
router.get("/get_me", auth, catchErrors(userController.getMe));

module.exports = router;