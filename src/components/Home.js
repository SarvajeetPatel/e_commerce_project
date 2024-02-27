import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import './Home.css'
import { useDispatch } from 'react-redux';
import { setTokens } from './ProductSlice';

function Home() {

    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogOut = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("currentUser")
        dispatch(setTokens(""));
        Navigate("/login");
    }

    return (
        <>
            <Container fluid>
                <Row className='rootRow' >
                    <Col >
                        <img style={{ height: '60px', width: '80px', padding: '4px' }} src='https://www.pngitem.com/pimgs/m/226-2260470_transparent-admin-icon-png-admin-logo-png-png.png' alt='not found' />
                    </Col>
                    <Col >
                        <div style={{ color: 'ivory', marginTop: '14px', marginLeft: '-388px' }}>ADMIN</div>
                    </Col>
                    <Col>
                        <Form>
                            {/* <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="basic-addon1">@</span>
                </div>
                <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
              </div> */}
                            <Form.Group>
                                <Form.Control style={{ marginLeft: '-700px', marginTop: '8px', width: '500px' }} type='text' placeholder='Search'></Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                    
                        <Button variant='success' style={{ marginLeft: '380px', marginTop: '8px' }} onClick={handleLogOut} >LOGOUT</Button>
                    </Col>
                </Row>

                <Row>

                    <Col className='innerRow' style={{ position: 'fixed', marginTop: '60px', width: '250px', height: '900px' }}>
                        <Row style={{ color: 'honeydew', fontSize: '25px', marginLeft: '2px', marginTop: '25px' }}>
                            MAIN
                        </Row>
                        <Row style={{ fontSize: '20px', marginLeft: '-8px', marginTop: '20px' }}>
                            <Link to="/home/dashboard" style={{ color: 'pink' }} >DASHBOARD</Link>
                        </Row>
                        <Row style={{ fontSize: '20px', marginLeft: '-8px', marginTop: '20px' }}>
                            <Link
                                style={{ color: 'pink' }} to="/home/products">PRODUCTS</Link>
                        </Row>
                        <Row style={{ fontSize: '20px', marginLeft: '-8px', marginTop: '20px' }}>
                            <Link style={{ color: 'pink' }} to="/messages">MESSAGES
                                <span class="position-relative top-5 start-30 badge rounded-pill bg-secondary">+99 <span class="visually-hidden">unread messages</span></span>
                            </Link>
                        </Row>
                        <Row style={{ fontSize: '20px', marginLeft: '-8px', marginTop: '20px' }}>
                            <Link style={{ color: 'pink' }} to="/notifications">NOTIFICATIONS</Link>
                        </Row>
                    </Col>

                    <Col style={{ marginTop: '10px', width: '1550px' , justifyContent:'center' }}>
                        <Outlet />
                    </Col>
                </Row>

            </Container>


        </>
    )
}

export default Home