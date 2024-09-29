import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import LoadingSpinner from "../../../OutLoadingSpinner";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { _CAMP, _CAMP_MEMBERS, _CAMP_REQUEST, _FMT, _MANAGE_REQUEST, _QRT, _REQUEST } from "../../../constants/constant";
import Request from "./Request";

const AddModal = ({ val, onRequestClose, isEditModal, data, title="", _type={_REQUEST} }) => {
  const [show, setShow] = useState(val);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: data?.email,
    mob: data?.mob,
    situation: data?.situation,
    qrt_id: data?.qrt_id || 0,
    lat: data?.lat || 8.5241,
    lon: data?.lon || 76.9366,
    name: data?.name,
    status: data?.status || 1,
  });
  const router = useRouter();

  const handleClose = () => {
    setShow(false);
    onRequestClose();
  };
  const checkValid = (name, value) => {
    if (value === "") {
      setErrors((errors) => {
        return { ...errors, [name]: "This field is required" };
      });
      return false;
    } else {
      setErrors((errors) => {
        return { ...errors, [name]: "" };
      });
      return true;
    }
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;
    if (name === "location") {
        // Update both latitude and longitude
        setFormData((prevData) => ({
          ...prevData,
          lat: value.lat,
          lon: value.lon,
        }));
      } else {
    setFormData({ ...formData, [name]: value });
    checkValid(name, value);
      }
  };
  const handleSingleChange = (selectOption, name) => {
    setFormData({ ...formData, [name]: selectOption?.value });
  };

  const saveSubmit = async (e) => {
    e.preventDefault();

    // Validate form data and gather any errors
    // const { isValid, errors } = validateForm(formData, type);
    // if (!isValid) {
    //   setErrors(errors); // Set errors to state to display in UI
    //   return; // Prevent submission if invalid
    // }
  
    console.log('Form is valid');
    setIsLoading(true);
    const body = new FormData();
  
    if (isEditModal) {
      body.append("id", formData.degree_id);
    }
    const token = localStorage.getItem("token");
    let url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}request/${isEditModal ? "update" : "create"}`;
    if( _type == _CAMP_REQUEST) {
      body.append("name", formData?.name ?? "");
      body.append("description", formData?.description ?? "");
      body.append("lat", formData?.lat ?? "");
      body.append("lon", formData?.lon ?? "");
      body.append("status", formData?.status ?? "");
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}camp/${isEditModal ? "update" : "create"}`;
    } else if(_type === _CAMP_MEMBERS) {
      body.append("name", formData?.name ?? "");
      body.append("email", formData?.email ?? "");
      body.append("mob", formData?.mob ?? "");
      body.append("situation", formData?.situation ?? "");
      body.append("qrt_id", formData?.qrt_id ?? 0);
      body.append("lat", formData?.lat ?? "");
      body.append("lon", formData?.lon ?? "");
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}camp/member/${isEditModal ? "update" : "create"}`;
    }
    else if(_type === _FMT) {
      body.append("email", formData?.email ?? "");
      body.append("password", formData?.password ?? "");
      body.append("mobile", formData?.mob ?? "");
      body.append("name", formData?.name ?? '');
      body.append("role",  2);
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}fmt/${isEditModal ? "update" : "create"}`;
    }
    else if(_type === _QRT) {
      body.append("email", formData?.email ?? "");
      body.append("password", formData?.password ?? "");
      body.append("mobile", formData?.mob ?? "");
      body.append("name", formData?.name ?? '');
      body.append("role",  3);
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}qrt/${isEditModal ? "update" : "create"}`;
    }
    else if(_type === _CAMP) {
      body.append("email", formData?.email ?? "");
      body.append("password", formData?.password ?? "");
      body.append("mobile", formData?.mob ?? "");
      body.append("name", formData?.name ?? '');
      body.append("role",  4);
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}camp/camp/${isEditModal ? "update" : "create"}`;
    }
    else if(_type === _MANAGE_REQUEST) {
      body.append("email", formData?.email ?? "");
      body.append("password", formData?.password ?? "");
      body.append("mobile", formData?.mob ?? "");
      body.append("name", formData?.name ?? '');
      body.append("role",  4);
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}camp/camp/${isEditModal ? "update" : "create"}`;
    }
    else {
      body.append("email", formData?.email ?? "");
      body.append("mob", formData?.mob ?? "");
      body.append("situation", formData?.situation ?? "");
      body.append("qrt_id", formData?.qrt_id ?? 0);
      body.append("lat", formData?.lat ?? "");
      body.append("lon", formData?.lon ?? "");
      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}request/${isEditModal ? "update" : "create"}`;

    }
  
    try {

      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setIsLoading(false);
  
      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        handleClose();
      } else {
        toast.warning(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      setIsLoading(false);
      handleErrorResponse(error);
    }
  };
  
  // Validation Function
  const validateForm = (data) => {
    const errors = {};
    let isValid = true;
  
    if (!data.email) {
      isValid = false;
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      isValid = false;
      errors.email = "Email address is invalid.";
    }
  
    if (!data.mob) {
      isValid = false;
      errors.mob = "Mobile number is required.";
    } else if (data.mob.length < 10) {
      isValid = false;
      errors.mob = "Mobile number must be at least 10 digits.";
    }
  
    if (!data.situation) {
      isValid = false;
      errors.situation = "Situation is required.";
    }
  
    if (data.lat === undefined) {
      isValid = false;
      errors.lat = "Latitude is required.";
    }
  
    if (data.lon === undefined) {
      isValid = false;
      errors.lon = "Longitude is required.";
    }
  
    return { isValid, errors };
  };
  
  // Handle Error Response
  const handleErrorResponse = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          router.push("/");
          break;
        case 404:
          toast.warning("Resource not found", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        case 500:
          toast.warning("Internal server error", {
            position: "top-right",
            autoClose: 3000,
          });
          break;
        default:
          toast.warning("An error occurred", {
            position: "top-right",
            autoClose: 3000,
          });
      }
    } else {
      toast.warning("An error occurred", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <>
    {_type == _REQUEST ? (
        <Request 
        show={show}
        onRequestClose={onRequestClose}
        isEditModal={isEditModal}
        title={title}
        isLoading={isLoading}
        formData={formData}
        errors={errors}
        handleValidation={handleValidation}
        saveSubmit={saveSubmit}
        _type={_type}
        />
    )
    :_type == _MANAGE_REQUEST ? (
      <Request 
      show={show}
      onRequestClose={onRequestClose}
      isEditModal={isEditModal}
      title={"Assign to QRT"}
      isLoading={isLoading}
      formData={formData}
      errors={errors}
      handleValidation={handleValidation}
      saveSubmit={saveSubmit}
      _type={_type}
      />
  )
    : _type == _CAMP_REQUEST ? (<>
            <Request 
        show={show}
        onRequestClose={onRequestClose}
        isEditModal={isEditModal}
        title={title}
        isLoading={isLoading}
        formData={formData}
        errors={errors}
        handleValidation={handleValidation}
        saveSubmit={saveSubmit}
        _type={_type}

        />
    </>)
    :
     _type == _CAMP_MEMBERS ? (<>
      <Request 
  show={show}
  onRequestClose={onRequestClose}
  isEditModal={isEditModal}
  title={title}
  isLoading={isLoading}
  formData={formData}
  errors={errors}
  handleValidation={handleValidation}
  saveSubmit={saveSubmit}
  _type={_type}

  />
</>)
    :
    _type == _FMT ? (<>
     <Request 
 show={show}
 onRequestClose={onRequestClose}
 isEditModal={isEditModal}
 title={title}
 isLoading={isLoading}
 formData={formData}
 errors={errors}
 handleValidation={handleValidation}
 saveSubmit={saveSubmit}
 _type={_type}

 />
</>)
    :
    _type == _QRT ? (<>
     <Request 
 show={show}
 onRequestClose={onRequestClose}
 isEditModal={isEditModal}
 title={title}
 isLoading={isLoading}
 formData={formData}
 errors={errors}
 handleValidation={handleValidation}
 saveSubmit={saveSubmit}
 _type={_type}

 />
</>)
    :
    _type == _CAMP ? (<>
     <Request 
 show={show}
 onRequestClose={onRequestClose}
 isEditModal={isEditModal}
 title={title}
 isLoading={isLoading}
 formData={formData}
 errors={errors}
 handleValidation={handleValidation}
 saveSubmit={saveSubmit}
 _type={_type}

 />
</>)
    :(
      <Modal show={show} onHide={onRequestClose}>
        <Modal.Header>
          <h5 className="modal-title" id="exampleModalLabel">
            {isEditModal ? `${`Edit ${title}`}` : `${`Add ${title}`}`}
          </h5>
          <button type="button" className="close" onClick={onRequestClose}>
            <span aria-hidden="true">×</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          {isLoading && <LoadingSpinner />}
          {/* <div className="card mb-4">
            <div className="card-body"> */}
          <form id="form01">
            <div className="row">
              <div className="col-md-12 form-group mb-3">
                <label htmlFor="firstName1">Degree Name</label>
                <input
                  value={formData.name}
                  className={
                    errors && errors.name
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="name"
                  onChange={handleValidation}
                  type="text"
                  placeholder="Degree Name"
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>
              <div className="col-md-12 form-group mb-3">
                <label htmlFor="firstName1">Status</label>
                <select
                  onChange={handleValidation}
                  className={
                    errors && errors.name
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  name="status"
                  value={formData.status}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
                {errors.status && (
                  <div className="error-message">{errors.status}</div>
                )}
              </div>
              <div className="col-md-12 text-end">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={saveSubmit}
                >
                  {isEditModal ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

    )}
    </>
  );
};

export default AddModal;
