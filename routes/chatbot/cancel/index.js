const router = require('express').Router();
const { blockButton } = require('../../../common/buttons/commonButton');
const { buildTextCard } = require('../../../common/templates/commonTemplate');

/** 날짜가 같은지 비교 */
function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/** 분 단위 차이 계산 */
function getDiffInMinutes(date1, date2) {
  return Math.floor((date1 - date2) / 1000 / 60);
}

router.post('/', (req, res) => {
  const item = req.body.action.clientExtra; // 이전블록으로부터 전달받은 data

  const now = new Date();
  const reservationDate = new Date(item.reservation_from);

  const sameDate = isSameDate(now, reservationDate);
  const diffMinute = getDiffInMinutes(reservationDate, now);

  if (sameDate && diffMinute >= 0) {
    // 취소 가능
    const description = `
      • 환불예정금액 : ${item.payment_amount * (0.8).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원 
      \n \n
      • 환불예정포인트 : ${item.point_amount * (0.8).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 포인트
      `;

    const buttons = [
      blockButton('네, 취소합니다.', '65cac04a3b0e65503471a3be', {
        // 블록 이동시 해당 data 함께 넘겨주기
        ...item,
        rate: 80,
        reason: item.reason
      }),
      blockButton('아니오, 챗봇을 종료합니다', '65c030dc3fa61d5020ffb501')
    ];

    return res.send(buildTextCard('위 예약을 취소해드릴까요?', description, buttons));
  } else if (isSameDate && diffMinute < 0) {
    // 당일이지만 취소 불가
    const description =
      '부정주차 또는 공사중/삭선으로 인해 주차가 어려운 상황이시면 환불접수를 도와드릴게요!';

    const buttons = [
      blockButton('환불 접수', '65c030dc3fa61d5020ffb501'),
      blockButton('다시 조회하기', '65d3f5bb7fe6f6372b0ae0c7')
    ];
    return res.send(
      buildTextCard('이용 시작 시간이 초과하여 취소가 불가능합니다.', description, buttons)
    );
  } else {
    // 예약 당일 아님
    const buttons = [
      blockButton('다시 조회하기', '65d3f5bb7fe6f6372b0ae0c7'),
      blockButton('처음으로', '65c030dc3fa61d5020ffb501')
    ];
    return res.send(buildTextCard('예약 당일에만 취소가 가능합니다.', '', buttons));
  }
});

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: 'words unknown uri ${req.path}' });
});

module.exports = router;
