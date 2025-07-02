// src/middlewares/multer.ts
import multer from 'multer';
import { Request } from 'express'; // Import Request for clearer typing in fileFilter

// Define a local interface for the file, compatible with Multer's memoryStorage output
// This interface should be identical to the one in express.d.ts
interface MulterFileCompatible {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const storage = multer.memoryStorage();

const multerInstance = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 1 // Limit to 1 file
  },
  fileFilter: (req: Request, file: MulterFileCompatible, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      // Corrected: Pass the error directly without the 'false' argument
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const uploadProfilePicture = multerInstance.single('profilePicture');
export default multerInstance; // Export the instance itself for other uses like .single('image')
