import React from 'react';
import { Table as BTable } from 'react-bootstrap';
import './tableStyle.scss';
import {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFoot,
  TableHeadCell,
  Actions,
  TableNail
} from './sub_table';
import Tag from 'components/tag/Tag';

function Table({ children, size = '', ...rest }) {
  return (
    <BTable className='table' hover size={size} {...rest}>
      {children}
    </BTable>
  );
}

Table.Head = TableHead;
Table.Th = TableHeadCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Td = TableCell;
Table.Foot = TableFoot;
Table.Tag = Tag;
Table.Nail = TableNail;
export { Actions };

export default Table;
