import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useNavigate } from 'react-router-dom';

/**
 * 部落格用 Navbars
 * @param {string} brand - 標題
 * @param {string} sideNavTitle - 側邊欄標題
 * @param {Object[]} subPath - 子路徑{ path: '/', title: '', icon: ''}
 * @returns <Navbars />
 */
const Navbars = ({ brand = '', sideNavTitle = '', subPath = [] }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar key='md' expand='md'>
        <Container fluid='lg'>
          <Navbar.Brand href='/'>{brand}</Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-md`}
            onClick={handleShow}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement='end'
            show={show}
            onHide={handleClose}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                {sideNavTitle}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className='justify-content-end flex-grow-1 pe-3'>
                {subPath.map((_subPath, index) => (
                  <Nav.Link
                    // href={_subPath?.path}
                    key={`navbars_subPath_${index}`}
                    onClick={() => {
                      navigate(_subPath?.path);
                      handleClose();
                    }}
                  >
                    {_subPath?.title}
                  </Nav.Link>
                ))}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default Navbars;
