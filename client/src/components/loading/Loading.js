import Spinner from 'react-bootstrap/Spinner';
import './loadingStyle.scss';

function Loading({ isLoading = true }) {
  if (!isLoading) return null;
  return (
    <div className='loading-container'>
      <Spinner
        animation='border'
        role='status'
        style={{ width: '3rem', height: '3rem' }}
      />
      <p> Loading...</p>
    </div>
  );
}

export default Loading;
