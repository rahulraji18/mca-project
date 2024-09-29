import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Alert} from 'react-bootstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingSpinner from "./OutLoadingSpinner";
import axios from 'axios';
import { toast } from 'react-toastify';


  const App = ({ val,userId,onRequestClose,type=0}) => {

  const [show, setShow] = useState(val);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {

setShow(false)
onRequestClose();
};
// console.log(type)
const [items,setItems]=useState({'password':"",'password_confirmation':""});
function handleValidation(e) {
   var name = e.target.name;
   var value = e.target.value;

     setItems({ ...items, [e.target.name]: value });
 }

  const validationSchema = Yup.object().shape({
    new_password: Yup.string().required('* New Password is required'),
    confirm_password: Yup.string()
       .oneOf([Yup.ref('new_password'), null], '* Passwords and confirm password must match')


   });
   function onSubmit() {


          // event.preventDefault();
           setFormValid(true);
           const token = localStorage.getItem('token');
             const body =new FormData();

               body.append("password", items.new_password);
               body.append("password_confirmation", items.confirm_password);
               body.append("user_id",userId);
               var url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/user/change/password`;
            //   if(type==1)
            //   {
            //     body.append("id",userId);
            //      url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/staffs/update/password`;
            //   }

                setIsLoading(true);
                axios.post(url, body, {
               headers: {
               Authorization: "Bearer " + token
               }
             }
           )
                       .then(res => {
                              setIsLoading(false);
                        if(res.data.status)
                        {
                          toast.success(res.data.message);
                          // event.preventDefault()
                         reset();
                          setFormValid(false);
                         onRequestClose()
                          }
                        else {
                            toast.error(res.data.message);
                        }

                       })
                       .catch((error) => {
                         setFormValid(false);
                        setIsLoading(false);
                           // setFormsub(false);
                          if (error.response) {

                           toast.error(error.response.data.message);


                          } else if (error.request) {
                            console.log("network error");
                          } else {
                            console.log(error);
                          }

                       });
   }

     const formOptions = { resolver: yupResolver(validationSchema) };
     const { register, handleSubmit, reset, formState } = useForm(formOptions);
     const { errors } = formState;
     const [formValid, setFormValid] = useState(false);

  const handleShow = () => setShow(true);

  return (
    <>


      <Modal show={show} onHide={onRequestClose}>
        <Modal.Header>
        <h5 className="modal-title" id="exampleModalLabel">Reset Password</h5>
        <button type="button" className="close" onClick={onRequestClose}>
        <span aria-hidden="true">×</span>
        </button>
        </Modal.Header>
        <Modal.Body>
        {isLoading && <LoadingSpinner />}
        <div className="card mb-4">
            <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">New Password</label>
                            <input  className={errors && errors.new_password ? "form-control is-invalid" : "form-control"} {...register('new_password')}  name="new_password" onChange={handleValidation}  type="password" placeholder="Enter New Password" />
                              <div className="invalid-feedback">{errors.new_password?.message}</div>
                        </div>
                        <div className="col-md-12 form-group mb-3">
                            <label htmlFor="firstName1">Confirm Password</label>
                            <input  className={errors && errors.confirm_password ? "form-control is-invalid" : "form-control"} {...register('confirm_password')}  name="confirm_password" onChange={handleValidation}  type="password" placeholder="Confirm Password " />
                              <div className="invalid-feedback">{errors.confirm_password?.message}</div>
                        </div>
                      <div className="col-md-12 text-end">
                            <button className="btn btn-primary" type="submit">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default App;
