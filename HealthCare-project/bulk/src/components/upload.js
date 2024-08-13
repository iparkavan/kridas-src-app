var AWS = require('aws-sdk');
const { default: Axios } = require('axios');
var credentials = {
    accessKeyId: 'AKIAXSDOIPFODFFLWIMP',
    secretAccessKey : 'ohtosN4mcCmSneMH0LegyP2UB3XRF2GZH4fQ4dsQ+pVuT'
    // accessKeyId: process.env.S3_ACCESS_KEY,
    // secretAccessKey : process.env.S3_SECRET_KEY
};
AWS.config.update({
    credentials: credentials,
    region: 'us-east-2'//process.env.S3_REGION
});

var s3 = new AWS.S3();

const params = {
    Bucket: 'beats-bulk-payer-mapping-dev',
    Expires: 10000000, //time to expire in seconds

        Fields: {
        key: 'test'
        },
    conditions: [
        {acl: 'private'},
        {success_action_status: "201"},
        ['starts-with', '$key', '']
        ['content-length-range', 0, 100000],
        {'x-amz-algorithm': 'AWS4-HMAC-SHA256'}
    ]
};
exports.generatePresignedURL = function (fileName) {
    params.Fields.key = fileName;
    s3.createPresignedPost(params, function (err, data) {
        if (err) {
            console.log('fail')
        } else {
            console.log('success', data)
            let profilePictureConfig = {
                method: "get",
                url: data.url,
                responseType: 'blob',
                headers: data.fields
              };

            Axios(profilePictureConfig);
        }
    });
};