import { upload, isCloudinaryConfigured } from '../config/cloudinary.js';

export const handleSingleUpload = (fieldName) => {
  return (req, res, next) => {
    const single = upload.single(fieldName);
    single(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
        });
      }

      // If file was uploaded to local storage, build static URL
      if (req.file && !isCloudinaryConfigured()) {
        const protocol = req.protocol;
        const host = req.get('host');
        req.file.path = `${protocol}://${host}/uploads/${req.file.filename}`;
      }

      next();
    });
  };
};

export const handleFieldsUpload = (fields) => {
  return (req, res, next) => {
    const multi = upload.fields(fields);
    multi(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error',
        });
      }

      // Adjust local paths if not using Cloudinary
      if (req.files && !isCloudinaryConfigured()) {
        const protocol = req.protocol;
        const host = req.get('host');
        for (const key of Object.keys(req.files)) {
          req.files[key] = req.files[key].map((file) => ({
            ...file,
            path: `${protocol}://${host}/uploads/${file.filename}`,
          }));
        }
      }

      next();
    });
  };
};

