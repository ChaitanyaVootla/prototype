import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET,
    region: process.env.VUE_APP_AWS_REGION,
})
// AWS.config.
const db = new AWS.DynamoDB({
    region: process.env.VUE_APP_AWS_REGION,
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
                if (err) {
                    console.err(err);
                }
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
                if (err) {
                    console.err(err);
                }
                resolve(data.Items);
            });
        }
    );
    return promise;
}

export { getVideoById, getVideos };
