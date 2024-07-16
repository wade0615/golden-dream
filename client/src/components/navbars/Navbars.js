import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

/**
 * 部落格用 Navbars
 * @param {string} brand - 標題
 * @param {string} sideNavTitle - 側邊欄標題
 * @param {Object[]} subPath - 子路徑{ path: '/', title: '', icon: ''}
 * @returns <Navbars />
 */
const Navbars = ({ brand = '', sideNavTitle = '', subPath = [] }) => {
  return (
    <>
      <Navbar key='md' expand='md' className='bg-body-tertiary'>
        <Container fluid>
          <Navbar.Brand href='/'>{brand}</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement='end'
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
                    key={`navbars_subPath_${index}`}
                    href={_subPath?.path}
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
