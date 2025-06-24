import DataUriParser from 'datauri/parser.js';
import path from 'path';

interface MulterFileCompatible {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

const parser = new DataUriParser();

const getDataUri = (file: MulterFileCompatible): string => {
  if (!file.buffer) {
    throw new Error('File buffer is undefined. Ensure multer is configured with memoryStorage.');
  }

  const extName = path.extname(file.originalname).toString();
  const dataUri = parser.format(extName, file.buffer);
  
  if (!dataUri.content) {
    throw new Error('Failed to convert file to data URI: content is null/undefined.');
  }
  
  return dataUri.content;
};

export default getDataUri;
