import multer, { Multer } from 'multer';
import { memoryStorage } from 'multer';

// Define the Multer upload configuration with TypeScript types
const upload: Multer = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit (adjust as needed)
    files: 1 // Limit to 1 file (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Add your file filtering logic here if needed
    // Example: only allow certain file types
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export default upload;