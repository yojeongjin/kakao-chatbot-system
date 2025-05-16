const router = require('express').Router();
const { blockButton } = require('../../../buttons/commonButton');
const { buildTextCard, buildItemCarousel } = require('../../../templates/commonTemplate');

router.post('/', async (req, res) => {
  const carNo = req.body.action.detailParams.car_no.origin.trim(); // 챗봇으로부터 넘어오는 차량번호
  const phoneNo = req.body.action.detailParams.phone_no.origin; // 챗봇으로부터 넘어오는 핸드폰번호

  // sql 데이터 조회
  const sql = `
    SELECT
      Porder.id, Plot.name, Porder.ticket, Porder.car_number, Porder.phone_number,
      Porder.reservation_from, Porder.reservation_to, 
      Porder.payment_amount, Porder.point_amount, Porder.parkingitem_status,
    FROM order AS Porder
    JOIN parking_lot AS Plot ON Porder.parkinglot_id = Plot.parkinglot_id
    WHERE 
      Porder.phone_number LIKE ?
      AND Porder.car_number LIKE ?
    ORDER BY Porder.id DESC
  `;
  const values = [`%${phoneNo}%`, `%${carNo}%`];

  conn.query(sql, values, async (err, rows) => {
    if (err) throw err;

    if (rows.length === 0) {
      // 예약 데이터 x
      const buttons = [
        blockButton('다시 조회하기', '65d3f5bb7fe6f6372b0ae0c7'),
        blockButton('처음으로', '65c030dc3fa61d5020ffb501')
      ];
      return res.send(buildTextCard('예약 정보가 없습니다.', '', buttons));
    }

    // 캐러셀 형식으로 출력
    const carouselItems = rows.map(item => {
      return {
        imageTitle: {
          title: item.name,
          description: item.ticket
        },
        itemList: [
          {
            title: '예약일시',
            description: `${item.reservation_from} - ${item.reservation_to}`
          },
          {
            title: '차량번호',
            description: item.car_number
          },
          {
            title: '결제금액',
            description: `${item.payment_amount} 원`
          },
          {
            title: '사용포인트',
            description: `${item.point_amount} 포인트`
          },
          {
            title: '이용상태',
            description: item.status
          }
        ],
        itemListAlignment: 'left',
        buttons: [
          {
            action: 'block',
            label: '예약 취소',
            blockId: '65d3fdce33bd5d4acbcbc8ad',
            extra: {
              // 블록 이동시 해당 data 함께 넘겨주기
              ...item
            }
          }
        ]
      };
    });

    return res.send(buildTemplate([buildItemCarousel(carouselItems)]));
  });
});

router.all('*', (req, res) => {
  res.status(404).send({ success: false, msg: 'chatbot-inquiry unknown uri ${req.path}' });
});

module.exports = router;
