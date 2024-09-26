const AWS = require("aws-sdk");
const Multer = require("multer");
const {
  AWS_S3_BUCKET_ACCESS_KEY_ID,
  AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
} = require("../config/env");
const path = require("path");

const getFileName = (mimetype, type) => {
  if (type === "image") {
    const allowedTypes = /jpeg|jpg|png|heic/;
    const mimeTypeCheck = allowedTypes.test(mimetype);
    if (mimeTypeCheck) {
      const type = mimetype.split("/").slice(-1)[0];
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${type}`;
      return { status: true, message: uniqueName };
    } else {
      return {
        status: false,
        message:
          "Invalid file type. Only JPEG, JPG, PNG, and HEIC are allowed.",
      };
    }
  } else if (type === "video") {
    const allowedTypes = /mp4|mpeg|odp|mpkg/;
    const mimeTypeCheck = allowedTypes.test(mimetype);
    if (mimeTypeCheck) {
      const type = mimetype.split("/").slice(-1)[0];
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${type}`;
      return { status: true, message: uniqueName };
    } else {
      return {
        status: false,
        message:
          "Invalid file type. Only MP4, MPEG, ODP, and MPKG are allowed.",
      };
    }
  } else if (type === "doc") {
    const type = mimetype.split("/").slice(-1)[0];
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${type}`;
    return { status: true, message: uniqueName };
  } else if (type === "voice") {
    const type = mimetype.split("/").slice(-1)[0];
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${type}`;
    return { status: true, message: uniqueName };
  }
};

const getFileNameFromUrl = (url) => {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const fileName = path.basename(pathname);
  return fileName;
};

const uploadImageMiddleware = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, // 1024 * 1024 * 10 = 10mb max size,
  },
});

const uploadVideoMiddleware = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 50, // 50mb max size,
  },
});

const uploadDocMiddleware = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 25, // 25mb max size,
  },
});

const uploadVoiceMiddleware = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 20, // 20mb max size,
  },
});

class AwsService {
  constructor() {
    this.s3bucket = new AWS.S3({
      accessKeyId: AWS_S3_BUCKET_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_BUCKET_SECRET_ACCESS_KEY,
    });
  }

  async save(file, type) {
    const fileName = getFileName(file.mimetype, type);

    if (fileName.status) {
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileName.message,
        Body: file.buffer,
      };
      const result = await this.s3bucket.upload(params).promise();
      return { status: true, message: result };
    } else {
      return { status: false, message: fileName.message };
    }
  }

  async remove(url) {
    try {
      const fileName = getFileNameFromUrl(url);
      const params = {
        Key: fileName,
        Bucket: AWS_S3_BUCKET_NAME,
      };
      const result = this.s3bucket.deleteObject(params).promise();
      return result;
    } catch (err) {
      console.log("removeerr::", err.message);
    }
  }
}

module.exports = {
  AwsService,
  uploadImageMiddleware,
  uploadVideoMiddleware,
  uploadDocMiddleware,
  uploadVoiceMiddleware,
};
