const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(process.cwd(), 'public/images');
const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

function imageCleanup() {
  fs.readdir(IMAGE_DIR, (err, files) => {
    if (err) return console.error('이미지 폴더 읽기 실패:', err);

    const now = Date.now();

    files.forEach(file => {
      const match = file.match(/^(\d{8})_\d+_/);
      if (!match) return;

      const dateStr = match[1]; // YYYYMMDD
      const fileDate = new Date(
        Number(dateStr.slice(0, 4)),
        Number(dateStr.slice(4, 6)) - 1,
        Number(dateStr.slice(6, 8))
      );

      const age = now - fileDate.getTime();

      if (age > ONE_MONTH_IN_MS) {
        const filePath = path.join(IMAGE_DIR, file);
        fs.unlink(filePath, err => {
          if (err) console.error('삭제 실패:', file);
          else console.log('삭제 완료:', file);
        });
      }
    });
  });
}

module.exports = { imageCleanup };
