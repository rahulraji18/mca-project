import React, { useState ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert} from 'react-bootstrap';
import LoadingSpinner from "../../OutLoadingSpinner";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import SelectOption from '../../SelectOption'
import DependOptions from '../../DepenSelect';


  const AddModal = ({ val,onRequestClose}) => {

    const [show, setShow] = useState(val);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData,setFormData]=useState({
      name:"",
      country:"",
      state:""
    })
    ;
    const [cities,setCities]=useState([])
    const [state,setState]=useState([])
    const [iscity,setIscity]=useState(null)
    const [soft,setSoft]=useState(null)

    const apiUrlState=`${process.env.NEXT_PUBLIC_API_ENDPOINT}location/country`;
    const apiUrlCountry=`${process.env.NEXT_PUBLIC_API_ENDPOINT}location/countries/all`;
  const apiUrlCity=`${process.env.NEXT_PUBLIC_API_ENDPOINT}master/cities/all`;

    useEffect(() => {
      if(formData.country)
      {
        fetchState(formData.country)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.country])
   

    const router = useRouter()
    // const apiUrlCountry=`${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/location/countries/all`;
    const fetchState=(id,state="")=>{
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      fetch(`${apiUrlState}/${id}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if(data.status)
      {
        setSoft(1)
        if(data.data.state)
        {
          setState(data.data.state.map((option) => ({
            value: option.id,
            label: option.name,
          })));
         
        }
        if(state!="")
        {
          
        }
      }
     
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      // Handle the error here
    });
    }
   

  const handleClose = () => {

setShow(false)
onRequestClose();
};
const checkValid =(name,value)=>{

    if((value === ""||value === " " || value===null))
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
  const handleSingleChange = (selectOption,name) =>{
    setFormData({...formData,[name]:selectOption?.value});
    checkValid(name,selectOption?.value)
  };

  const saveSubmit=async(e)=>{
    e.preventDefault()
    var check=false;
    var elements = document.getElementById("form001").elements;
    for (var i = 0, element; element = elements[i++];)
    {
      

        if(element.name in formData)
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
    body.append('state_id', formData.state);
    const token = localStorage.getItem('token');
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/location/city/create`;
  
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
        toast.warning('An error occurred while creating the faq.', {
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
        <h5 className="modal-title" id="exampleModalLabel">Add City</h5>
        <button type="button" className="close" onClick={onRequestClose}>
        <span aria-hidden="true">×</span>
        </button>
        </Modal.Header>
        <Modal.Body>
        {isLoading && <LoadingSpinner />}
        {/* <div className="card mb-4">
            <div className="card-body"> */}
                <form id="form001">
                    <div className="row">
                    <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">Country</label>
                            <SelectOption
                            select={"Select Country"} 
                            apiUrl={apiUrlCountry}
                            className={errors.country ?"form-control invalid":"form-control"} 
                            value={formData.country}  
                            name='country' 
                            id="country"
                            required={true}
                            onChange={handleSingleChange}
                            />
                            {errors.country && <div className="error-message">{errors.country}</div>}

                        </div>
                    <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">State</label>
                            {!(soft===null)&& <DependOptions
                            select={"Select state"} 
                            options={state}  
                            className={errors.state ?"form-control invalid":"form-control"} 
                              value={formData.state}
                                name='state'
                                id="state" 
                                required={true}
                                  onChange={handleSingleChange} />}
                          {(soft===null) && 
                          <DependOptions select={"Select state"}  options={""}  required={true}  className={errors.state ?"form-control invalid":"form-control"}  value={""}  name='state' id="state"  onChange={handleSingleChange} />}
    
                            {errors.state && <div className="error-message">{errors.state}</div>}

                        </div>
                        <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">City Name</label>
                            <input value={formData.name} className={errors && errors.name ? "form-control is-invalid" : "form-control"} 
                             name="name" onChange={handleValidation}  type="text" placeholder="City Name" />
                            {errors.name && <div className="error-message">{errors.name}</div>}

                        </div>
                      
                      <div className="col-md-12 text-end">
                            <button className="btn btn-primary" type="button" onClick={saveSubmit}>Save</button>
                        </div>
                    </div>
                </form>
            {/* </div>
        </div> */}
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddModal;
