import React, { Fragment, useState, useEffect } from "react";
import Seo from "/components/_App/Seo";
import { Card, Col, Container, Form, Row, InputGroup } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "/components/OutLoadingSpinner";
import Swal from "sweetalert2";
import logolight from "/public/assets/img/brand/logo-light.png";
import user from "/public/assets/img/svgs/user.svg";
import logo from "/public/assets/img/brand/logo.png";
import { checkAuth } from "/helpers/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const routeChange = () => {
    router.push(`/admin/dashboard/`);
  };

  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const isAuthenticated = await checkAuth();
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAuthStatus();
  }, []);

  if (isAuthenticated) {
    routeChange();
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/; // Example for 10-digit mobile number
    return mobileRegex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!mobile.trim() || !validateMobile(mobile)) {
      newErrors.mobile = "Please enter a valid mobile number.";
    }

    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const body = new FormData();
      body.append("name", name);
      body.append("mobile", mobile);
      body.append("email", email);
      body.append("password", password);
      body.append("password_confirmation", confirmPassword);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}register`,
        {
          method: "POST",
          body: body,
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (data.status) {
        setName("");
        setMobile("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        Swal.fire({
          title: "Success",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          router.push(`/`, undefined, { shallow: true });
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div>
      <Seo title="Register" />
      <Fragment>
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
                    <div className="mt-3 pt-3 p-2 pos-absolute">
                      <img
                        src={logolight.src}
                        className="header-brand-img mb-4"
                        alt="logo"
                      />
                      <div className="clearfix"></div>
                      <img src={user.src} className="ht-100 mb-0" alt="user" />
                      <h5 className="mt-4 text-white">Sign up</h5>
                      <span className="tx-white-6 tx-13 mb-5 mt-xl-0">
                        Signup to create, discover and connect with the global
                        community
                      </span>
                    </div>
                  </Col>
                  <Col lg={6} xl={7} xs={12} sm={12} className="login_form">
                    <Container fluid>
                      <Row className="row-sm">
                        <Card.Body className="card-body mt-2 mb-2">
                          <img
                            src={logo.src}
                            className="d-lg-none header-brand-img text-start float-start mb-4 auth-light-logo"
                            alt="logo"
                          />
                          <img
                            src={logolight.src}
                            className="d-lg-none header-brand-img text-start float-start mb-4 auth-dark-logo"
                            alt="logo"
                          />
                          <h5 className="text-start mb-2">Sign up</h5>
                          <Form onSubmit={handleRegister}>
                            <Form.Group className="text-start" controlId="name">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                className="form-control"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                isInvalid={!!errors.name}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.name}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              className="text-start"
                              controlId="mobile"
                            >
                              <Form.Label>Mobile Number</Form.Label>
                              <Form.Control
                                className="form-control"
                                type="text"
                                placeholder="Enter your mobile number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                isInvalid={!!errors.mobile}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.mobile}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              className="text-start"
                              controlId="email"
                            >
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                className="form-control"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!errors.email}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.email}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group
                              className="text-start"
                              controlId="password"
                            >
                              <Form.Label>Password</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  className="form-control"
                                  type={isPasswordVisible ? "text" : "password"}
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  isInvalid={!!errors.password}
                                />
                                <InputGroup.Text
                                  onClick={togglePasswordVisibility}
                                  aria-label="Toggle password visibility"
                                >
                                  {isPasswordVisible ? (
                                    <FaEyeSlash />
                                  ) : (
                                    <FaEye />
                                  )}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {errors.password}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>

                            <Form.Group
                              className="text-start"
                              controlId="confirmPassword"
                            >
                              <Form.Label>Confirm Password</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  className="form-control"
                                  type={
                                    isConfirmPasswordVisible
                                      ? "text"
                                      : "password"
                                  }
                                  placeholder="Confirm your password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  isInvalid={!!errors.confirmPassword}
                                />
                                <InputGroup.Text
                                  onClick={toggleConfirmPasswordVisibility}
                                  aria-label="Toggle confirm password visibility"
                                >
                                  {isConfirmPasswordVisible ? (
                                    <FaEyeSlash />
                                  ) : (
                                    <FaEye />
                                  )}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                  {errors.confirmPassword}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>

                            <div className="text-start">
                              <button
                                type="submit"
                                className="btn ripple btn-main-primary btn-block mt-2"
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader /> : "Sign up"}
                              </button>
                            </div>
                          </Form>
                          <div className="text-start mt-2 ms-0">
                            <div className="mb-1">
                              <Link href="/">
                                Already have an account? Sign in
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
      </Fragment>
    </div>
  );
};

export default Register;
