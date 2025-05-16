/**
 * 텍스트 카드 (textCard)
 *
 * @param {string} title // 카드 상단에 표시될 제목 텍스트
 * @param {string} description // 카드 본문
 * @param {Array<Object>} buttons
 * @returns {Object} 챗봇에 응답으로 전달될 TextCard 템플릿
 */
function buildTextCard(title, description, buttons) {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          textCard: {
            ...(title && { title }), // title이 있을 때만 포함
            description,
            buttons
          }
        }
      ]
    }
  };
}

/**
 *
 * 항목카드 + 텍스트카드 (itemCard + textCard)
 *
 * @param {Object} imageTitle - itemCard 상단 타이틀 및 설명
 * @param {string} imageTitle.title - 항목 카드의 타이틀 텍스트
 * @param {string} imageTitle.description - 타이틀 아래에 표시될 설명 텍스트
 *
 *
 * @param {Array<Object>} itemList - 상세 항목 리스트 (예: 결제일시, 차량번호 등)
 * @param {string} itemList[].title - list 제목
 * @param {string} itemList[].description - list 설명
 *
 * @param {string} title - list 밑으로 이어지는 textCard 타이틀
 * @param {string} description - textCard 본문
 *
 * @param {Array<Object>} buttons
 *
 * @returns {Object} 챗봇에 응답으로 전달될 itemCard + textCard 템플릿 객체
 */

function buildItemCard(imageTitle, itemList, title, description, buttons) {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          itemCard: {
            imageTitle,
            itemList,
            itemListAlignment: 'left'
          }
        },
        {
          textCard: {
            title,
            description,
            buttons
          }
        }
      ]
    }
  };
}

/**
 * itemCard 배열로 carousel 응답 생성
 *
 * @param {Array<Object>} items - carousel 내부 itemCard 배열
 * @returns {Object} outputs용 carousel 템플릿 (단일 outputs용)
 */
function buildItemCarousel(items) {
  return {
    carousel: {
      type: 'itemCard',
      items
    }
  };
}

/**
 * 전체 응답 템플릿 래퍼 (outputs + optional quickReplies)
 *
 * @param {Array<Object>} outputs
 * @returns {Object} 카카오 챗봇 응답 템플릿
 */
function buildTemplate(outputs) {
  return {
    version: '2.0',
    template: {
      outputs
    }
  };
}

module.exports = {
  buildTextCard,
  buildItemCard,
  buildItemCarousel,
  buildTemplate
};
