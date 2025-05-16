const schedule = require('node-schedule');
const { imageCleanup } = require(imageCleanup);

// 매일 새벽 3시에 실행
schedule.scheduleJob('0 3 * * *', () => {
  imageCleanup();
});
