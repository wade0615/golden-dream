import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './NonAccessStyle.scss';

function NonAccess() {
  const navigate = useNavigate();
  return (
    <div className='Wrapper'>
      <div className='Text'>哎呀，您目前沒有權限唷！</div>
      <Button size='dense2' type='button' onClick={() => navigate(-1)}>
        回上一頁
      </Button>
    </div>
  );
}

export default NonAccess;
