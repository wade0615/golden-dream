import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Error404Style.scss';

function Error404() {
  const navigate = useNavigate();
  return (
    <div id='error404'>
      <div className='error'>404</div>
      <br />
      <br />
      <span className='info'>Page not found</span>
      <br />
      <br />
      <p className='go_back'>
        Try to <span onClick={() => navigate('/')}>[Go Back]</span> or
        <span onClick={() => navigate('/')}>[Return to the Home Page]</span>
      </p>
    </div>
  );
}

export default Error404;
