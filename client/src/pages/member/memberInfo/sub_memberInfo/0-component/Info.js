import { memo } from 'react';
import { Stack } from 'react-bootstrap';
import './InfoStyle.scss';

function Info({
  name = '',
  mobile = '',
  chips = [],
  children,
  newLine = false,
  noBorderBottom = false
}) {
  const containerClass = `d-flex justify-content-between ${
    noBorderBottom ? '' : 'px-3 py-4 border-bottom'
  }`;
  const nameMobileClass = `user-info d-flex flex-wrap p-1 ${
    newLine ? 'flex-column' : ''
  }`;
  return (
    <div
      id='log-list-dfd7bbf2-1101-467f-9a57-327ebb225a4b'
      className={containerClass}
    >
      <div className={nameMobileClass}>
        <Stack direction='horizontal' gap={2} className='name-mobile p-2 ps-0'>
          <h5 className='fw-bold'>
            {name}
            {newLine && <br />}
            <span className='ps-1'>{mobile}</span>
          </h5>
        </Stack>
        {!!chips.length && (
          <Stack direction='horizontal' gap={2}>
            {chips.map((chip, index) => {
              if (!chip) return null; // 空字串防呆
              return (
                <div className='chip' key={`${chip}-${index}`}>
                  {chip}
                </div>
              );
            })}
          </Stack>
        )}
      </div>
      <Stack direction='horizontal' gap={2} className='children-content'>
        {children}
      </Stack>
    </div>
  );
}

export default memo(Info);
