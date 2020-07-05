import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET,
    region: process.env.VUE_APP_AWS_REGION,
});

const s3 = new AWS.S3({
    region: process.env.VUE_APP_AWS_REGION,
});

const getFiles = () => {
    const promise = new Promise(
        (resolve, reject) => {
            s3.listObjectsV2({
                Bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
            },
            (err, data) => {
                if (err) {
                    console.log(err);
                }
                resolve(data);
            });
        }
    );
    return promise;
}

const downloadObject = () => {
    const promise = new Promise(
        (resolve, reject) => {
            s3.getObject({
                Bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
                Key: 'prototype/dance'
            },
            (err, data) => {
                if (err) {
                    console.log(err);
                }
                resolve(data);
            });
        }
    );
    return promise;
}

const uploadObject = (file) => {
    console.log(AWS.config);
    const upload = new AWS.S3.ManagedUpload({
        params: {
            Bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
            Key: `prototype/${file.name}`,
            Body: file,
            ACL: "public-read"
        }
    });
    return upload.promise();
}

const deleteObject = (key) => {
    const promise = new Promise(
        (resolve, reject) => {
            s3.deleteObject({
                Bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
                Key: key
            },
            (err, data) => {
                if (err) {
                    console.log(err);
                }
                resolve(data);
            });
        }
    );
    return promise;
}

export { getFiles, downloadObject, uploadObject, deleteObject };
