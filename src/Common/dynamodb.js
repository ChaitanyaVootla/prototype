import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET,
    region: 'ap-southeast-1',
})
// AWS.config.
const db = new AWS.DynamoDB({
    region: 'ap-southeast-1',
});

const getVideoById = (id) => {
    const promise = new Promise(
        (resolve, reject) => {
            db.getItem({
                TableName: 'videos',
                Key: {
                    'id': {
                        S: id
                    },
                }
            }, (error, data) => {
                resolve(data.Item);
            });
        }
    );
    return promise;
}

const getVideos = (id) => {
    const promise = new Promise(
        (resolve, reject) => {
            db.scan({
                TableName: 'videos',
            },
            (err, data) => {
                resolve(data.Items);
            });
        }
    );
    return promise;
}

export { getVideoById, getVideos };
