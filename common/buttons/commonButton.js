/**
 * block 버튼
 *
 * @param {string} label - 버튼에 표시할 텍스트
 * @param {string} blockId - 이동할 블록 ID
 * @param {Object} [extra] - 전달할 추가 데이터
 * @returns {Object} 카카오 block 버튼 객체
 */
function blockButton(label, blockId, extra = undefined) {
  const button = {
    action: 'block',
    label,
    blockId
  };

  if (extra) button.extra = extra;

  return button;
}

module.exports = { blockButton };
