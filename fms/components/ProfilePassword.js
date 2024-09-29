import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "./OutLoadingSpinner";
import { useForm } from 'react-hook-form';
import { Alert } from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router'
import { Tab, Nav, Dropdown, Form, Button, Col, Breadcrumb, Row, FormGroup, Card } from "react-bootstrap";
import { toast } from 'react-toastify';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [users, setUsers] = useState({
    new_password: "",
    confirm_password: "",
    old_password: "",
  });

  // Define a function to clear the error message
  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const handleValidation = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUsers({ ...users, [e.target.name]: value });
  };

  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('* Enter Current Password'),
    new_password: Yup.string().required('* New Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password'), null], '* Passwords and confirm password must match')
  });

  const onSubmit = () => {
    setFormValid(true);
    const token = localStorage.getItem('token');
    const body = new FormData();

    body.append("password", users.new_password);
    body.append("current_password", users.old_password);
    body.append("password_confirmation", users.confirm_password);

    var url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}reset-password`;

    // Set isLoading to true before making the API request
    setIsLoading(true);

    axios.post(url, body, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        // Reset form and clear error message on success
        setFormValid(false);
        setIsLoading(false);
        setUsers({
          new_password: "",
          confirm_password: "",
          old_password: "",
        });
        clearErrorMessage();

        toast.success(res.data.message);
      })
      .catch((error) => {
        setFormValid(false);
        setIsLoading(false); // Set isLoading to false on error
        if (error.response) {
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message);
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  };

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  const [formValid, setFormValid] = useState(false);

  const renderUser = (
    <Form className="form-horizontal" data-select2-id="11" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4 main-content-label">Reset Password</div>
      <FormGroup className="form-group">
        <Row className=" row-sm">
          <Col md={3}>
            <Form.Label >Current Password</Form.Label>
          </Col>
          <Col md={9}>
            <input
              className={`form-control ${errors.old_password ? "is-invalid" : ""}`}
              {...register('old_password')}
              name="old_password"
              onChange={handleValidation}
              type="password"
              placeholder="Enter Current Password"
            />
            {errors.old_password && <div className="invalid-feedback">{errors.old_password?.message}</div>}
          </Col>
        </Row>
      </FormGroup>
      <FormGroup className="form-group">
        <Row className=" row-sm">
          <Col md={3}>
            <Form.Label >New Password</Form.Label>
          </Col>
          <Col md={9}>
            <input
              className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
              {...register('new_password')}
              name="new_password"
              onChange={handleValidation}
              type="password"
              placeholder="Enter New Password"
            />
            {errors.new_password && <div className="invalid-feedback">{errors.new_password?.message}</div>}
          </Col>
        </Row>
      </FormGroup>
      <FormGroup data-select2-id="108" className="form-group">
        <div className="row" data-select2-id="107">
          <Col md={3}>
            <Form.Label >Confirm Password</Form.Label>
          </Col>
          <div className="col-md-9" data-select2-id="106">
            <input
              type="password"
              className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
              {...register('confirm_password')}
              name="confirm_password"
              onChange={handleValidation}
              placeholder="Enter Confirm Password"
            />
            {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password?.message}</div>}
          </div>
        </div>
      </FormGroup>
      <div className="card-footer text-end">
        <button className="btn btn-primary " type="submit" id="sub_btn" disabled={formValid}>
          {formValid && <i className="fa fa-spinner"></i>} Reset Password
        </button>
      </div>
    </Form>
  );

  return (
    <>
      {isLoading ? <LoadingSpinner /> : renderUser}
      {errorMessage && <div className="error">{errorMessage}</div>}
    </>
  );
}
