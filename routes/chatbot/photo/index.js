const router = require('express').Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');
const { blockButton } = require('../../../common/buttons/commonButton');
const { buildTextCard } = require('../../../common/templates/commonTemplate');

router.post('/', async (req, res) => {
  const item = req.body.action.clientExtra; // // 이전블록으로부터 전달받은 data
  const imageRaw = req.body.action.detailParams.image_url.origin; // 챗봇으로부터 전달받은 증빙 사진

  // base64나 카카오톡 링크 형태일 경우 처리
  const imageArray = imageRaw
    .substring(imageRaw.indexOf('(') + 1, imageRaw.indexOf(')'))
    .split(',');

  // img url
  let urlArray = [];
  // 성공 여부
  let successArray = [];

  for await (const imageUrl of imageArray) {
    const now = new Date();
    const today = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
    const id = uuid.v4();
    // 이미지 이름
    const imgName = `${today}_${now.getSeconds()}_${id}`;
    // 저장 위치
    const savePath = path.join(process.cwd(), 'public', 'images', `${imgName}.jpeg`);

    try {
      const response = await axios({
        url: imageUrl,
        responseType: 'stream'
      });

      if (response.status === 200) {
        const transformer = sharp().resize({ width: 680 }).jpeg({ quality: 30 });
        response.data.pipe(transformer).pipe(fs.createWriteStream(savePath));

        successArray.push(true);
        urlArray.push(`http://localhost:3000/images/${imgName}.jpeg`);
      } else {
        successArray.push(false);
        console.error(`이미지 다운로드 실패: ${imageUrl}`);
      }
    } catch (err) {
      successArray.push(false);
      console.error(`이미지 처리 에러: ${err.message}`);
    }
  }

  if (successArray.includes(false)) {
    // 이미지 저장 실패
    const buttons = [
      blockButton('다시 접수하기', '65a735b907dd0f3f18afe38f'),
      blockButton('챗봇종료', '65c030dc3fa61d5020ffb501')
    ];
    return res.send(buildTextCard('환불 접수에 실패했어요', '', buttons));
  }

  const sql = `
    INSERT INTO refund
      (order_id, refund_type, refund_reason, refund_data_uri)
    VALUES (?, ?, ?, ?)
  `;
  const values = [item.id, item.type, item.reason, urlArray.join(',')];

  conn.query(sql, values, err => {
    if (err) {
      console.error('DB 저장 실패:', err);
      const buttons = [
        blockButton('다시 접수하기', '65a735b907dd0f3f18afe38f'),
        blockButton('챗봇종료', '65c030dc3fa61d5020ffb501')
      ];
      return res.send(buildTextCard('환불 접수에 실패했어요', '', buttons));
    }

    const title = `${item.reason} 환불 접수가 완료되었습니다.`;
    const description = `\n\n▶ 현재 예약지 위치 기반 주차 가능한 주차장을 추천해드릴까요?`;
    const buttons = [
      blockButton('예, 추천해주세요.', '65d7fcd475e8567f26466d99', { ...item }),
      blockButton('아니오, 챗봇을 종료합니다.', '65c030dc3fa61d5020ffb501')
    ];

    return res.send(buildTextCard(title, description, buttons));
  });
});

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: 'chatbot-photo unknown uri ${req.path}' });
});

module.exports = router;
