const S3 = require('aws-sdk/clients/s3')
const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

//upload
const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}

/**
 * Method to delete s3 file
 * @param {file} doc 
 */
const deleteS3File = async (doc) => {
    const { key } = doc
    let params = {
        Bucket: bucketName,
        Key: key
    };
    await s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else return data;           // successful respons
    });
}

module.exports = {
    uploadFile,
    deleteS3File

};