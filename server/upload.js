var formidable = require('formidable');
var express = require('express');
var cors = require('cors');
var app = express();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET,
    region: process.env.VUE_APP_AWS_REGION,
});

var s3 = new AWS.S3();

app.use(cors());

app.post('/fileupload', function (req, res, next) {
    var form = new formidable.IncomingForm({
        uploadDir: './tempUploads'
    });
    form.parse(req, function (err, fields, files) {
        if (!files.file || files.file === undefined) {
            return res.sendStatus(403);
        }
        if (!err) {
            console.time('Encoding time:');
            const encodePromise = new Promise((resolve, reject) => {
                ffmpeg({ source: files.file.path })
                .fps(30)
                .size('?x480')
                .videoCodec('libx264')
                .outputOptions([
                    '-tune film',
                    '-preset veryfast',
                ])
                .on('progress', function(progress) {
                    console.log('Processing: ' + progress.percent + '% done');
                    res.write(`${progress.percent},`);
                })
                .on('end', function(stdout, stderr) {
                    console.log('Transcoding succeeded !');
                    console.timeEnd('Encoding time:');
                    resolve();
                }).save('./uploads/low.mp4');
            }).then(
                () => {
                    const upload = new AWS.S3.ManagedUpload({
                        params: {
                            Bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
                            Key: `prototype/${files.file.name}`,
                            Body: fs.createReadStream('./uploads/low.mp4'),
                            ACL: "public-read"
                        }
                    });
                    upload.promise().then(
                        () => {
                            fs.unlink(files.file.path,
                                (err) => {
                                    console.log('Deleted temp file', files.file.path);
                                }
                            );
                            res.end();
                        }
                    );
                }
            );
        }
    });
});

function resolveAfter(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('resolved');
        }, duration);
    });
}

app.get('/getProgress', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    var i = 0;
    for (i = 0; i <= 10; i+=1) {
        await resolveAfter(1000);
        res.write(`${i*10},`);
    }
    res.end();
});

app.listen(3000);
