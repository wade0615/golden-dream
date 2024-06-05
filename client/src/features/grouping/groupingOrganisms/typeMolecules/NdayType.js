import React from 'react';

const _NdayType = {
  consumption: 'yes',
  noConsumption: 'no'
};

function NdayType({ isConsumption = '', numOne = 0, numTwo = 0 }) {
  return (
    <div>
      {isConsumption === _NdayType.consumption && <p>{numOne} 天內有消費</p>}
      {isConsumption === _NdayType.noConsumption && (
        <p>
          {numOne} 天內未消費，且 {Number(numOne) + 1} 天~ {numTwo} 天內有消費
        </p>
      )}
    </div>
  );
}

export default NdayType;
