// s3Routes.js
const express = require('express');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Generate a signed URL for uploading
router.get('/generate-upload-url', async (req, res) => {
  const { fileName } = req.query;

  console.log('here', fileName);

  const params = {
    Bucket: 'shockoe-lab-assets',
    Key: fileName,
    ContentType: 'application/octet-stream',
  };

  try {
    const command = new PutObjectCommand(params);
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.status(200).json({ uploadURL });
  } catch (error) {
    res.status(500).json({ error: 'Error generating signed URL' });
  }
});

// Generate a signed URL for downloading
router.get('/generate-download-url', async (req, res) => {
  const { fileName } = req.query;

  const params = {
    Bucket: 'shockoe-lab-assets',
    Key: `uploads/${fileName}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const downloadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
    res.status(200).json({ downloadURL });
  } catch (error) {
    res.status(500).json({ error: 'Error generating signed URL' });
  }
});

module.exports = router;
