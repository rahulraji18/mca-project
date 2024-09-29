import Head from 'next/head'
import { Button, Col, Row,Form, Alert, Container, Card, Navbar } from 'react-bootstrap';
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.scss'
import { useState } from 'react';
import Link from "next/link";
import logolight from "/public/assets/img/brand/logo-light.png"
import user from "../public/assets/img/svgs/user.svg"
import logo from "../public/assets/img/brand/logo.png"
import axios from 'axios';
import { checkAuth } from '../helpers/auth';
import { useEffect } from 'react';
import { Formik, Field,ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Home = () => {
  let navigate = useRouter();

  const [err, setError] = useState("");
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}login`;
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const routeChange = () => {
    let user = JSON.parse(localStorage.getItem('userData'));
    console.log(user,'userDetails')
  const path = (user?.role === 1 ? '/fmt' : user?.role === 2 ? '/qrt' : user?.role === 3 ? '/qrt' :user?.role === 4 ? '/qrt' : '/request');
    // let path = `/dashboard/`;
    navigate.push(path);
  }

  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const isAuthenticated = await checkAuth();
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        // Handle any errors gracefully
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuthStatus();
  }, []);
  if (isAuthenticated==true) {
    routeChange();
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>{process?.env?.APP_NAME}</title>
        <meta name="description" content={process?.env?.APP_NAME} />
      </Head>
      <div className="">
        <div className="">
          <div className="">
            <Navbar
              expand="lg"
              className="main-header side-header hor-header"
              style={{ marginBottom: "-64px" }}
            >
              <Container fluid className="main-container">
                <div className="main-header-left">
                  <div className="hor-logo">
                    <Link href="#!" className="main-logo">
                    </Link>
                  </div>
                </div>
                <div className="main-header-center">
                  <div className="responsive-logo">
                      FMS
                    <Link href={`/components/dashboard/dashboard`}>
                    </Link>
                  </div>
                </div>
                <div className="main-header-right">
                  <Navbar.Toggle
                    className="navresponsive-toggler"
                    type="button"
                    data-bs-target="#navbarSupportedContent-4"
                    aria-controls="navbarSupportedContent-4"
                  >
                    <i className="fe fe-more-vertical header-icons navbar-toggler-icon"></i>
                  </Navbar.Toggle>
                  <div className="navbar navbar-expand-lg  nav nav-item  navbar-nav-right responsive-navbar navbar-dark  ">
                    <Navbar.Collapse
                      className="collapse navbar-collapse"
                      id="navbarSupportedContent-4"
                    >
                      <div className="d-flex order-lg-2 ms-auto">
                        <div className="header-nav-right p-3">
                          {/* <Link
                            className="btn ripple btn-min w-sm btn-outline-primary me-2"
                            href="/components/authentication/signup/"
                            
                          >
                            New User
                          </Link> */}
                          <Link
                            href="/components/authentication/signin/"
                            className="btn ripple btn-min w-sm btn-primary me-2"
                            
                          >
                            View camp request
                          </Link>
                        </div>
                      </div>
                    </Navbar.Collapse>
                  </div>
                </div>
              </Container>
            </Navbar>
            </div>
            </div>
            </div>
      <div className="page main-signin-wrapper">
        <Row className="signpages text-center">
          <Col md={12}>
            <Card>
              <Row className="row-sm">
                <Col
                  lg={6}
                  xl={5}
                  className="d-none d-lg-block text-center bg-primary details"
                >
                  <div className="mt-5 pt-4 p-2 pos-absolute">
                    <p>Flood Management System</p>
                    <div className="clearfix"></div>
                    <img
                      src={user.src}
                      className="ht-100 mb-0"
                      alt="user"
                    />
                    <h5 className="mt-4 text-white">Create Your Account</h5>
                    <span className="tx-white-6 tx-13 mb-5 mt-xl-0">
                      Signup to create, discover and connect with the global
                      community
                    </span>
                  </div>
                </Col>
                <Col lg={6} xl={7} xs={12} sm={12} className="login_form ">
                  <Container fluid>
                    <Row className="row-sm">
                      <Card.Body className="mt-2 mb-2">
                        <img
                          src={logo.src}
                          className=" d-lg-none header-brand-img text-start float-start mb-4 auth-light-logo"
                          alt="logo"
                        />
                        <div className="clearfix"></div>
                        {err && <Alert variant="danger">{err}</Alert>}
                        
                        {/* Formik Form */}
                        <Formik
                          initialValues={{
                            email: '',
                            password: '',
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string()
                              .email('* Invalid email')
                              .required('* Email is required'),
                            password: Yup.string().required('* Password is required'),
                          })}
                          onSubmit={async (values, { setSubmitting }) => {
                            try {
                              console.log(url)
                              const res = await axios.post(url, {
                                email: values.email,
                                password: values.password,
                              });

                              if (res.data.status) {
                                localStorage.setItem('token', res.data.data.token);
                                localStorage.setItem(
                                  'userData',
                                  JSON.stringify(res.data.data.user)
                                );
                                routeChange();
                              } else {
                                setError(res.data.message);
                              }
                            } catch (error) {
                              if (error.response) {
                                setError(error.response.data.message);
                              } else if (error.request) {
                                console.error('Network error');
                              } else {
                                console.error('Error:', error);
                              }
                            } finally {
                              setSubmitting(false);
                            }
                          }}
                        >
                          {({ isSubmitting ,handleSubmit}) => (
                            <Form>
                              <h5 className="text-start mb-2">
                                Signin to Your Account
                              </h5>
                              <p className="mb-4 text-muted tx-13 ms-0 text-start">
                                Signin to create, discover and connect with the
                                global community
                              </p>
                              <Form.Group
                                className="text-start form-group"
                                controlId="formEmail"
                              >
                                <Form.Label>Email</Form.Label>
                                <Field
                                  type="text"
                                  name="email"
                                  className="form-control"
                                  placeholder="Enter your email"
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group
                                className="text-start form-group"
                                controlId="formpassword"
                              >
                                <Form.Label>Password</Form.Label>
                                <Field
                                  type="password"
                                  name="password"
                                  className="form-control"
                                  placeholder="Enter your password"
                                />
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Button
                                type="button"
                                className="btn ripple btn-main-primary btn-block mt-2"
                                disabled={isSubmitting} onClick={handleSubmit}
                              >
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                              </Button>
                            </Form>
                          )}
                        </Formik>
                        
                        {/* End Formik Form */}
                        
                        <div className="text-start mt-5 ms-0">
                          <div className="mb-1">
                            <Link href="/forgot-password">
                              Forgot password?
                            </Link><br/>
                            <Link href="/register">
                            Don't have an account? Sign up
                            </Link>
                          </div>
                        </div>
                      </Card.Body>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

Home.layout = "Authenticationlayout";

export default Home;
