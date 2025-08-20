// config/fileConstraints.js
const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10);
const ALLOWED_MIME = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

module.exports = {
  MAX_FILE_SIZE_MB,
  ALLOWED_MIME
};
// This file defines constraints for file uploads, including maximum size and allowed MIME types.