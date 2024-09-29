import React from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import MapComponent from "../../MapComponent";
import LoadingSpinner from "../../../../Loader";
import {
  _CAMP,
  _CAMP_MEMBERS,
  _CAMP_REQUEST,
  _FMT,
  _MANAGE_REQUEST,
  _QRT,
  _USER,
} from "../../../../constants/constant";
import MasterSelect from "../../../../MasterSelect";

// Styled modal component
const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 800px; /* Set to your desired width */
    width: 100%;
  }
`;

const Request = ({
  show,
  onRequestClose,
  isEditModal,
  title,
  isLoading,
  formData,
  errors,
  handleValidation,
  saveSubmit,
  _type = 1,
}) => {
  const QrtMasterApi = `${process.env.NEXT_PUBLIC_API_ENDPOINT}_qrt/all`;
  const handleQrtAssign = (selectedOption, name) => {
    console.log(selectedOption,'qrt reqid')
      // setFormData({ ...formData, [name]: selectedOption?.value || "",  ["reservational_group"]: selectedOption?.label || "" });
      // console.log(data,'rrr')
  }
  return (
    <>
      {_type == _CAMP_REQUEST ? (
        <StyledModal show={show} onHide={onRequestClose}>
          <Modal.Header>
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditModal ? `Edit ${title}` : `Add ${title}`}
            </h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <LoadingSpinner />}
            <form id="form01">
              <div className="row">
                {/* Existing form fields */}
                <div className="col-md-12 form-group mb-3">
                  <label>Title</label>
                  <input
                    value={formData.name}
                    className={
                      errors.name ? "form-control is-invalid" : "form-control"
                    }
                    name="name"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Title"
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    className={
                      errors.description
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    rows={5}
                    name="description"
                    onChange={handleValidation}
                    placeholder="Description type here..."
                  />
                  {errors.description && (
                    <div className="error-message">{errors.description}</div>
                  )}
                </div>
                <div className="col-md-12 form-group mb-3">
                  <label>Status</label>
                  <select
                    value={formData.status} // Binding the select value to formData.status
                    className={
                      errors.status ? "form-control is-invalid" : "form-control"
                    }
                    name="status" // Changed name to status
                    onChange={handleValidation} // Handle validation
                  >
                    <option value="1">Active</option>{" "}
                    {/* Default option for Active */}
                    <option value="0">Inactive</option>{" "}
                    {/* Option for Inactive */}
                  </select>
                  {errors.status && (
                    <div className="error-message">{errors.status}</div>
                  )}
                </div>

                {/* Fields for latitude and longitude */}
                <div className="col-md-6 form-group mb-3">
                  <label>Latitude</label>
                  <input
                    value={formData.lat || ""}
                    className={
                      errors.lat ? "form-control is-invalid" : "form-control"
                    }
                    name="lat"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Latitude"
                  />
                  {errors.lat && (
                    <div className="error-message">{errors.lat}</div>
                  )}
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label>Longitude</label>
                  <input
                    value={formData.lon || ""}
                    className={
                      errors.lon ? "form-control is-invalid" : "form-control"
                    }
                    name="lon"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Longitude"
                  />
                  {errors.lon && (
                    <div className="error-message">{errors.lon}</div>
                  )}
                </div>

                {/* Map Component */}
                <MapComponent
                  lat={formData.lat || 8.5241}
                  lon={formData.lon || 76.9366}
                  onMapClick={handleValidation}
                />
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
        </StyledModal>
      ) 
      :
      _type == _MANAGE_REQUEST ? (
        <StyledModal show={show} onHide={onRequestClose}>
          <Modal.Header>
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditModal ? `Edit ${title}` : `Add ${title}`}
            </h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <LoadingSpinner />}
            <form id="form01">
              <div className="row">
                {/* Existing form fields */}
                <div className="col-md-12 form-group mb-3">
                  <label>Assign to</label>
                  <MasterSelect
                select={"Select QRT"}
                apiUrl={QrtMasterApi}
                className={
                  errors.qrt_id ? "form-control invalid" : "form-control"
                }
                value={formData.qrt_id}
                name="qrt_id"
                id="qrt_id"
                onChange={handleQrtAssign}
                required={true}
                isMulti={false}
                addNew={false}
                label="qrt_id"
                divClassName={'common-input-select'}
              />
                  {errors.qrt_id && (
                    <div className="error-message">{errors.qrt_id}</div>
                  )}
                </div>
                <div className="col-md-12 text-end">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={saveSubmit}
                  >
                    {"Assign"}
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </StyledModal>
      ) 
      : _type == _CAMP_MEMBERS ? (
        <StyledModal show={show} onHide={onRequestClose}>
          <Modal.Header>
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditModal ? `Edit ${title}` : `Add ${title}`}
            </h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <LoadingSpinner />}
            <form id="form01">
              <div className="row">
                {/* Existing form fields */}
                <div className="col-md-12 form-group mb-3">
                  <label>Name</label>
                  <input
                    value={formData.name}
                    className={
                      errors.name ? "form-control is-invalid" : "form-control"
                    }
                    name="name"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Name"
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                </div>
                <div className="col-md-12 form-group mb-3">
                  <label>Email</label>
                  <input
                    value={formData.email}
                    className={
                      errors.email ? "form-control is-invalid" : "form-control"
                    }
                    name="email"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Mobile number</label>
                  <input
                    value={formData.mob}
                    className={
                      errors.mob ? "form-control is-invalid" : "form-control"
                    }
                    name="mob"
                    onChange={handleValidation}
                    type="number"
                    placeholder="Mobile number"
                  />
                  {errors.mob && (
                    <div className="error-message">{errors.mob}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Situation</label>
                  <textarea
                    value={formData.situation}
                    className={
                      errors.situation
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    rows={5}
                    name="situation"
                    onChange={handleValidation}
                    placeholder="Situation type here..."
                  />
                  {errors.situation && (
                    <div className="error-message">{errors.situation}</div>
                  )}
                </div>

                {/* Fields for latitude and longitude */}
                <div className="col-md-6 form-group mb-3">
                  <label>Latitude</label>
                  <input
                    value={formData.lat || ""}
                    className={
                      errors.lat ? "form-control is-invalid" : "form-control"
                    }
                    name="lat"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Latitude"
                  />
                  {errors.lat && (
                    <div className="error-message">{errors.lat}</div>
                  )}
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label>Longitude</label>
                  <input
                    value={formData.lon || ""}
                    className={
                      errors.lon ? "form-control is-invalid" : "form-control"
                    }
                    name="lon"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Longitude"
                  />
                  {errors.lon && (
                    <div className="error-message">{errors.lon}</div>
                  )}
                </div>

                {/* Map Component */}
                <MapComponent
                  lat={formData.lat || 8.5241}
                  lon={formData.lon || 76.9366}
                  onMapClick={handleValidation}
                />
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
        </StyledModal>
      ) : (_type == _FMT || _type == _QRT || _type == _CAMP || _USER) ? (
        <StyledModal show={show} onHide={onRequestClose}>
          <Modal.Header>
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditModal ? `Edit ${title}` : `Add ${title}`}
            </h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <LoadingSpinner />}
            <form id="form01">
              <div className="row">
                {/* Existing form fields */}
                <div className="col-md-12 form-group mb-3">
                  <label>Name</label>
                  <input
                    value={formData.name}
                    className={
                      errors.name ? "form-control is-invalid" : "form-control"
                    }
                    name="name"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Name"
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                </div>
                <div className="col-md-12 form-group mb-3">
                  <label>Email</label>
                  <input
                    value={formData.email}
                    className={
                      errors.email ? "form-control is-invalid" : "form-control"
                    }
                    name="email"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Mobile number</label>
                  <input
                    value={formData.mob}
                    className={
                      errors.mob ? "form-control is-invalid" : "form-control"
                    }
                    name="mob"
                    onChange={handleValidation}
                    type="number"
                    placeholder="Mobile number"
                  />
                  {errors.mob && (
                    <div className="error-message">{errors.mob}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Password</label>
                  <input
                    value={formData.password}
                    className={
                      errors.password
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="password"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>

                {/* Fields for latitude and longitude */}
                <div className="col-md-6 form-group mb-3">
                  <label>Latitude</label>
                  <input
                    value={formData.lat || ""}
                    className={
                      errors.lat ? "form-control is-invalid" : "form-control"
                    }
                    name="lat"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Latitude"
                  />
                  {errors.lat && (
                    <div className="error-message">{errors.lat}</div>
                  )}
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label>Longitude</label>
                  <input
                    value={formData.lon || ""}
                    className={
                      errors.lon ? "form-control is-invalid" : "form-control"
                    }
                    name="lon"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Longitude"
                  />
                  {errors.lon && (
                    <div className="error-message">{errors.lon}</div>
                  )}
                </div>

                {/* Map Component */}
                <MapComponent
                  lat={formData.lat || 8.5241}
                  lon={formData.lon || 76.9366}
                  onMapClick={handleValidation}
                />
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
        </StyledModal>
      ) : (
        <StyledModal show={show} onHide={onRequestClose}>
          <Modal.Header>
            <h5 className="modal-title" id="exampleModalLabel">
              {isEditModal ? `Edit ${title}` : `Add ${title}`}
            </h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            {isLoading && <LoadingSpinner />}
            <form id="form01">
              <div className="row">
                {/* Existing form fields */}
                <div className="col-md-12 form-group mb-3">
                  <label>Email</label>
                  <input
                    value={formData.email}
                    className={
                      errors.email ? "form-control is-invalid" : "form-control"
                    }
                    name="email"
                    onChange={handleValidation}
                    type="text"
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Mobile number</label>
                  <input
                    value={formData.mob}
                    className={
                      errors.mob ? "form-control is-invalid" : "form-control"
                    }
                    name="mob"
                    onChange={handleValidation}
                    type="number"
                    placeholder="Mobile number"
                  />
                  {errors.mob && (
                    <div className="error-message">{errors.mob}</div>
                  )}
                </div>

                <div className="col-md-12 form-group mb-3">
                  <label>Situation</label>
                  <textarea
                    value={formData.situation}
                    className={
                      errors.situation
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    rows={5}
                    name="situation"
                    onChange={handleValidation}
                    placeholder="Situation type here..."
                  />
                  {errors.situation && (
                    <div className="error-message">{errors.situation}</div>
                  )}
                </div>

                {/* Fields for latitude and longitude */}
                <div className="col-md-6 form-group mb-3">
                  <label>Latitude</label>
                  <input
                    value={formData.lat || ""}
                    className={
                      errors.lat ? "form-control is-invalid" : "form-control"
                    }
                    name="lat"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Latitude"
                  />
                  {errors.lat && (
                    <div className="error-message">{errors.lat}</div>
                  )}
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label>Longitude</label>
                  <input
                    value={formData.lon || ""}
                    className={
                      errors.lon ? "form-control is-invalid" : "form-control"
                    }
                    name="lon"
                    type="number"
                    onChange={handleValidation}
                    placeholder="Longitude"
                  />
                  {errors.lon && (
                    <div className="error-message">{errors.lon}</div>
                  )}
                </div>

                {/* Map Component */}
                <MapComponent
                  lat={formData.lat || 8.5241}
                  lon={formData.lon || 76.9366}
                  onMapClick={handleValidation}
                />
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
        </StyledModal>
      )}
    </>
  );
};

export default Request;
