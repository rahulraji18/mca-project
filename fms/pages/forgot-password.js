import React, { Fragment, useState, useEffect } from "react";
import Seo from "../components/_App/Seo";
import HelperData from "../helpers/Helper";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../components/OutLoadingSpinner";
import Swal from "sweetalert2";
import logolight from "../public/assets/img/brand/logo-light.png";
import user from "../public/assets/img/svgs/user.svg";
import logo from "../public/assets/img/brand/logo.png";
import { checkAuth } from "../helpers/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [load, setLoad] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [empty, setEmpty] = useState(true);

  const { token } = router.query;
  const routeChange = () => {
    let path = `/admin/dashboard/`;
    router.push(path);
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
  if (isAuthenticated == true) {
    routeChange();
  }
  function Swicherbutton() {
    document.querySelector(".demo_changer").classList.toggle("active");
    document.querySelector(".demo_changer").style.right = "0px";
  }

  function remove() {
    document.querySelector(".demo_changer").style.right = "-270px";
    document.querySelector(".demo_changer").classList.remove("active");
  }

  const RequestReset = async (e) => {
    e.preventDefault();

    if (email === "") {
      setIsValid(false);
    } else {
      const isValidEmail = HelperData.emailValid(email);
      setIsValid(isValidEmail);
    }
    if (isValid && email) {
      setLoad(true);
      try {
        const body = new FormData();
        body.append("email", email);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}forgot_password`,
          {
            method: "POST",
            body: body,
          }
        );
        setLoad(false);
        const data = await res.json();
        if (data.status) {
          setEmail("");
          Swal.fire({
            icon: "success",
            text: data.message,
            confirmButtonText: "OK",
            cancelButtonColor: "#222222",
            confirmButtonColor: "#00008b",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Warning..!",
            text: data.message,
            confirmButtonText: "OK",
            cancelButtonColor: "#222222",
            confirmButtonColor: "#00008b",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setEmpty(true);
    setIsValidPassword(true);
    if (password.trim() === "") {
      setEmpty(false);
      return;
    } else if (password !== confirmPassword) {
      setIsValidPassword(false);
      return;
    }

    try {
      setIsLoading(true);
      const body = new FormData();
      body.append("token", token);
      body.append("password", password);
      body.append("password_confirmation", confirmPassword);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}forgot/password/verify`,
        {
          method: "POST",
          body: body,
        }
      );

      const data = await response.json();
      setIsLoading(false);

      if (data.status) {
        setPassword("");
        setConfirmPassword("");
        Swal.fire({
          title: "Success",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        setTimeout(function () {
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

  return (
    <div>
      <style global jsx>
        {`
          .invalid-feedback {
            display: block !important;
          }
        `}
      </style>
      <Seo title="Forgot Password" />
      <Fragment>
        <div className="page main-signin-wrapper">
          {load && <Loader />}
          <Row className="signpages text-center" onClick={() => remove()}>
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
                      <h5 className="mt-4 text-white">Reset Your Password</h5>
                      <span className="tx-white-6 tx-13 mb-5 mt-xl-0">
                        Signup to create, discover and connect with the global
                        community
                      </span>
                    </div>
                  </Col>
                  <Col lg={6} xl={7} xs={12} sm={12} className=" login_form ">
                    <Container fluid>
                      <Row className=" row-sm">
                        <Card.Body className="card-body mt-2 mb-2">
                          <img
                            src={logo.src}
                            className=" d-lg-none header-brand-img text-start float-start mb-4 auth-light-logo"
                            alt="logo"
                          />
                          <img
                            src={logolight.src}
                            className=" d-lg-none header-brand-img text-start float-start mb-4 auth-dark-logo"
                            alt="logo"
                          />
                          <div className="clearfix"></div>
                          <h5 className="text-start mb-2">Forgot Password</h5>
                          <p className="mb-4 text-muted tx-13 ms-0 text-start"></p>
                          {!token ? (
                            <Form>
                              <Form.Group
                                className="text-start"
                                controlId="from email"
                              >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  className="form-control"
                                  placeholder="Enter your email"
                                  type="text"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                                {!isValid && (
                                  <p
                                    className="error-text"
                                    style={{ color: "red" }}
                                  >
                                    * Please enter a valid email address.
                                  </p>
                                )}
                              </Form.Group>
                              <button
                                type="button"
                                onClick={RequestReset}
                                className="btn ripple btn-main-primary btn-block mt-4"
                              >
                                Request reset link
                              </button>
                            </Form>
                          ) : (
                            <Form onSubmit={handleResetPassword}>
                              <Form.Group
                                className="text-start"
                                controlId="password"
                              >
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                  className="form-control"
                                  type="password"
                                  placeholder="Enter your new password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  isInvalid={!isValidPassword}
                                />

                                {!empty && (
                                  <Form.Control.Feedback type="invalid">
                                    Password is required
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>

                              <Form.Group
                                className="text-start"
                                controlId="confirmPassword"
                              >
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                  className="form-control"
                                  type="password"
                                  placeholder="Confirm your new password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  isInvalid={!isValidPassword}
                                />
                                {!isValidPassword && (
                                  <Form.Control.Feedback type="invalid">
                                    Passwords do not match.
                                  </Form.Control.Feedback>
                                )}
                              </Form.Group>

                              <button
                                type="submit"
                                className="btn ripple btn-main-primary btn-block mt-4"
                                disabled={isLoading}
                              >
                                {isLoading ? "Resetting..." : "Reset Password"}
                              </button>
                            </Form>
                          )}
                          <div className="card-footer border-top-0 ps-0 mt-3 text-start ">
                            <p>Did you remembered your password?</p>
                            <p className="mb-0">
                              Try to
                              <Link href={`/`}> Signin</Link>
                            </p>
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
ForgotPassword.layout = "Authenticationlayout";

export default ForgotPassword;
