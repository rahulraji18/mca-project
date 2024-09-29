import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert} from 'react-bootstrap';
import LoadingSpinner from "../OutLoadingSpinner";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'


  const IndustryAdd = ({ val,onRequestClose,data}) => {

    const [show, setShow] = useState(val);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData,setFormData]=useState({'name':data?.name,'status':data?.is_active,'id':data?.id});
    const router = useRouter()

  const handleClose = () => {

setShow(false)
onRequestClose();
};
const checkValid =(name,value)=>{
    if(value==="")
    {
        setErrors((errors) => {
            
            return { ...errors, [name]: "This field is required"};
          });
          return false
    }
    else{
        setErrors((errors) => {
            
            return { ...errors, [name]: ""};
          });
          return true 
    }
}


  const handleValidation = (e) =>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
    checkValid(name,value)
  };

  const saveSubmit=async(e)=>{
    e.preventDefault()
    var check=false;
    var elements = document.getElementById("form01").elements;
    for (var i = 0, element; element = elements[i++];)
    {
        if(element.name in FormData)
        {
            check=checkValid(element.name, element.value);
            if(check===false)
          {   break;}
        }
       
    }
    // console.log(errors)
  if (check) {
    setIsLoading(true);       
    const body = new FormData();
   
    body.append('name', formData.name);
    body.append('active', formData.status);
    body.append('id', formData.id);
    const token = localStorage.getItem('token');
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/technical-skill/update`;
  
    try {
      const response = await axios.post(url, body, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
  
      setIsLoading(false);
  
      if (response.status === 200) {
        if (response.data.status) {
         
          toast.success(response.data.message, {
            position: 'top-right',
            autoClose: 3000,
          });
          handleClose()
          // console.log(response.data)
        //   if(response.data && response.data.data)
        //   UpdateProfile(response.data.data)
        //   NextTab(next,2)
         
        } 
        else {
          toast.warning(response.data.message, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/');
      } else {
        toast.warning('An error occurred while creating time.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            router.push('/');
        } else if (error.response.status === 404) {
          toast.warning('Resource not found', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else if (error.response.status === 500) {
          toast.warning('Internal server error', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          toast.warning('An error occurred', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } else {
        // Handle other types of errors here (e.g., network errors)
        toast.warning('An error occurred', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  }
}

  return (
    <>


      <Modal show={show} onHide={onRequestClose}>
        <Modal.Header>
        <h5 className="modal-title" id="exampleModalLabel">Edit Technical Skill</h5>
        <button type="button" className="close" onClick={onRequestClose}>
        <span aria-hidden="true">×</span>
        </button>
        </Modal.Header>
        <Modal.Body>
        {isLoading && <LoadingSpinner />}
        <form id="form01">
                    <div className="row">
                        <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">Name</label>
                            <input value={formData.name} className={errors && errors.name ? "form-control is-invalid" : "form-control"} 
                             name="name" onChange={handleValidation}  type="text" placeholder="Technical Skill Name" />
                            {errors.name && <div className="error-message">{errors.name}</div>}

                        </div>
                        <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">Status</label>
                           <select  onChange={handleValidation} className={errors && errors.name ? "form-control is-invalid" : "form-control"}  name='status' value={formData.status}>
                            <option value={1}>Active</option>
                            <option value={0}>In-active</option>
                           </select>
                            {errors.status && <div className="error-message">{errors.status}</div>}

                        </div>
                        
                      <div className="col-md-12 text-end">
                            <button className="btn btn-primary" type="button" onClick={saveSubmit}>Update</button>
                        </div>
                    </div>
                </form>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IndustryAdd;
