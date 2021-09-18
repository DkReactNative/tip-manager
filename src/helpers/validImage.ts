
var ValidImage = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb({ mesage: 'Only .png, .jpg and .jpeg format allowed!', file: file });
    }
}
export default ValidImage