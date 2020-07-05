import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET,
    region: 'ap-southeast-1',
});

const s3 = new AWS.S3({
    region: 'ap-southeast-1',
});

const getFiles = () => {
    const promise = new Promise(
        (resolve, reject) => {
            s3.listObjectsV2({
                Bucket: 'jambalakadipamba.prototype',
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
                Bucket: 'jambalakadipamba.prototype',
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
            Bucket: 'jambalakadipamba.prototype',
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
                Bucket: 'jambalakadipamba.prototype',
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
