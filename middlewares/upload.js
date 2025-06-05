const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // guarda en public/uploads
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    // evita nombres duplicados
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

module.exports = multer({ storage });
