// import Spinner from 'react-bootstrap/Spinner';
import './loadingStyle.scss';

function Loading({ isLoading = true }) {
  if (!isLoading) return null;
  return (
    <div className='loading_container'>
      {/* <Spinner
        animation='border'
        role='status'
        style={{ width: '3rem', height: '3rem' }}
      />
      <p> Loading...</p> */}
      <div class='loader'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Loading;
