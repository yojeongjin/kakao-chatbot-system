const router = require('express').Router();
const { blockButton } = require('../../../buttons/commonButton');
const { buildTextCard } = require('../../../templates/commonTemplate');

router.post('/', (req, res) => {
  const description = `
  ＜개인·위치정보 수집 및 이용 동의>
  \n\n
  챗봇서비스는 고객님과의 상담 진행을 위해 개인정보보호법 제 15조 1항 및 제 24조 1 항, 위치정보법 제 19조에 따라 아래의 내용에 대하여 고객님의 동의가 필요합니다. 
  \n\n
  ① 개인·위치정보의 수집, 이용목적\n: 챗봇서비스 및 예약관련 이용
  \n\n
  ② 수집하는 개인·위치정보의 항목\n: 차량번호, 휴대폰번호, 예약한 주차장 위치
  \n\n
  ③ 개인·위치정보의 보유 및 이용 기간\n: 위 개인·위치정보는 수집·이용에 관한 동의일로부터 처리 종료일까지 위 이용목적을 위하여 보유 및 이용됩니다.
  \n\n
  ④ 고객님은 개인·위치정보 수집 및 이용을 거부할 권리가 있으며 권리 행사 시 상담이 거부될 수 있습니다.
  \n\n
  (필수) 개인·위치정보 수집 및 이용에 대하여 동의하시나요?
  `;

  const buttons = [
    blockButton('네, 동의합니다', '65d3f46a7a912907bcfa595e'),
    blockButton('아니오, 챗봇을 종료합니다', '65c030dc3fa61d5020ffb501')
  ];

  return res.send(buildTextCard(null, description, buttons));
});

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: 'words unknown uri ${req.path}' });
});

module.exports = router;
