var ffmpeg = require('fluent-ffmpeg');
ffmpeg({
    source: './Assets/test.mp4'
}).fps(30).size('?x480').autoPad()
.on('progress', function(progress) {
  console.log('Processing: ' + progress.percent + '% done');
})
.on('end', function(stdout, stderr) {
  console.log('Transcoding succeeded !');
}).save('./low.mp4');

ffmpeg.ffprobe('./Assets/test.mp4', function(err, metadata) {
    console.dir(metadata);
});
