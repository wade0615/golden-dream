import { memo } from 'react';
import classNames from 'classnames';
import './stateChip.scss';

function StateChip({ state = true, onText = '啟用', offText = '停用' }) {
  return (
    <div className='state-chip'>
      <p
        className={classNames({
          'state-text': true,
          disabled: !state
        })}
      >
        {state ? onText : offText}
      </p>
    </div>
  );
}

export default memo(StateChip);
