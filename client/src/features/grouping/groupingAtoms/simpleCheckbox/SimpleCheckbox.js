import { memo } from 'react';
import { dateOptions, genderOptions } from '../../groupingConfig';
import Form from 'react-bootstrap/Form';

/**
 * Description 分群 checkbox
 * @param {any} {name='simpleCheckbox'
 * @param {any} type=''
 * @param {function} fetchOptions = null
 * @returns {any}
 */

function SimpleCheckbox({
  name = 'simpleCheckbox',
  type = '',
  fetchOptions = null
}) {
  if (!type && !fetchOptions) return;
  if (type === 'gender') {
    return genderOptions.map((ele, i) => (
      <Form.Check type='checkbox' id={ele.value} label={ele.label} />
    ));
  }
  if (type === 'date') {
    return dateOptions.map((ele, i) => (
      <Form.Check type='checkbox' id={ele.value} label={ele.label} />
    ));
  }
}

export default memo(SimpleCheckbox);
