// @Vendors
const groupBy = require('lodash/groupBy');
const orderBy = require('lodash/orderBy');

const getMdpTime = (innerPoistions, outerPositions) => {
  const mdpPositions = innerPoistions.map(position => ({id: position.id, timestamp: position.timestamp, inner: true}));
  const noMdpPosition = outerPositions.map(position => ({ id: position.id, timestamp: position.timestamp, inner: false}));
  const sortedPositions = orderBy(mdpPositions.concat(noMdpPosition), 'timestamp', 'asc');
  const groupedPositions = groupBy(sortedPositions, position => position.id);
  return Object.keys(groupedPositions).map(vehicle => {
    let acumulatedTime = 0.0;
    let isLastInner = false;
    let enterTime = 0.0;
    groupedPositions[vehicle].forEach(position => {
      if(position.inner && !isLastInner) {
        isLastInner = true;
        enterTime = position.timestamp;
      }
      if(!position.inner && isLastInner) {
        isLastInner = false;
        acumulatedTime += position.timestamp - enterTime;
      }
    });
    return { id: vehicle, acumulatedMdpTime: acumulatedTime };
  });
}

module.exports = {
  getMdpTime
}