import { Stack } from 'react-bootstrap';
import { insertComma } from 'utils/commonUtil';
import './billBoardStyle.scss';

/**
 * 包含数据对象的数组。
 * @typedef {Object} DataObject
 * @property {string} number - 數字的字符串表示。
 * @property {string} text - 文字的字符串表示。
 */

function BillBoard({ data }) {
  if (!data?.length) return;
  return (
    <div className='billBoard'>
      {data.map((item, idx) => (
        <Stack key={idx} className='align-items-center billBoard__item'>
          <p className='h4 text-info'>{insertComma(item.number)}</p>
          <p className='body'>{item?.text}</p>
        </Stack>
      ))}
    </div>
  );
}

export default BillBoard;
