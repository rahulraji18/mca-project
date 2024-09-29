import React,{useEffect,useState} from 'react'
import dynamic from 'next/dynamic';
import PageHeader from '../../../components/_App/Breadcrumb';
import Seo from '../../../components/_App/Seo';
import { Tab, Nav, Dropdown, Form, Button, Col, Breadcrumb, Row, FormGroup, Card } from "react-bootstrap";
import Link from "next/link"
import ProfileImageUpload from '../../../components/ProfileImageUpload';
import ProfilePassword from '../../../components/ProfilePassword';
import LoadingSpinner from "../../../components/OutLoadingSpinner";
import axios from "axios";
import Img from '../../../public/assets/img/basic_image.png';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import DefaultImg from '/public/assets/img/app/default.png'

const Profile = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [item, setItem] = useState(null);
  const router = useRouter()

  const handleImageChange = (imageFile) => {
    setCreateObjectURL(imageFile);
    setSelectedImage(imageFile);
  };
  const [users, setUsers] = useState({
    id:"",
        name: " ",
       email: " ",
       mob:" ",
       image:" "
      });

  useEffect(() => {
    if(window)
    {
      const token = localStorage.getItem('token');
      const address=`${process.env.NEXT_PUBLIC_API_ENDPOINT}user/myprofile`;
       let unmounted = false;
    setIsLoading(true);
    fetch( address,
     {
       headers: {
         Authorization: "Bearer " + token,
       },
     })
      .then((respose) =>  respose.json())
      .then((respose) => {
  // console.log(respose.data)
        var inity={
          id:respose.data.id,
          name:respose.data.name,
          email:respose.data.email,
          mob:respose.data.mob,
          image:respose.data.avatar_url?`${process.env.NEXT_PUBLIC_API_ENDPOINT}${respose.data.avatar_url}`:null
          };
          setCreateObjectURL(respose.data.avatar_url?`${process.env.NEXT_PUBLIC_API_ENDPOINT}${respose.data.avatar_url}`:null);
          setUsers(inity);
          setItem(respose.data)
  // console.log(createObjectURL)
  
         setIsLoading(false)
         
      })
      .catch((error) => {
           console.log(error);
         setErrorMessage('');
         setIsLoading(false);
      });
  return () => { unmounted = true };
    }
  
  }, []);
  const [errors, setErrors] = useState({});

  function handleValidation(e) {
     const name = e.target.name;
     const value = e.target.value;
       setUsers({ ...users, [e.target.name]: value });

     checkValidation(name, value);
   }

   function checkValidation(name, value) {

     if (value === "" && name!='image') {
       setErrors((errors) => {

         return { ...errors, [name]: "* " +name +" is required" };
       });
       return false;
     }
     else {

        setErrors((errors) => {

          return { ...errors, [name]: "" };
        });
        return true;
     }

     // delete errors[name];
     // setFields({ ...fields, [name]: value });
     // Special validation for email
     // emailValidation(name, value);

   }
	
   const onSubmit=async(e)=>{

    e.preventDefault()
    var check=true;
    var elements = document.getElementById("form2").elements;
    for (var i = 0, element; element = elements[i++];)
    {
      if (element.name in users) {

          if(element.required)
          {
            check=checkValidation(element.name, element.value,element.placeholder);
              if(check===false)
            {   break;}
          }
      }
    }
    if(check)
    {
      setIsLoading(true)
      const token = localStorage.getItem('token');
      const body =new FormData();
      if(selectedImage!=null)
        body.append("profile_image", selectedImage);
        body.append("name", users.name);
        // body.append("email", users.email);
        body.append("mob", users.mob);
        body.append("id", users.id);
          // formData.append("file", image);
          // console.log(body);
         
            var url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}user/update`;

        
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
                    setTimeout(function () {
                      // router.push(`/admin/profile`, undefined, { shallow: true });
                      location.reload()
                      }, 1500);
                    // var inity={
                    //   id:res.data.id,
                    //   name:res.data.name,
                    //   email:res.data.email,
                    //   mob:res.data.mob,
                    //   image:res.data.avatar_url?`${process.env.NEXT_PUBLIC_API_ENDPOINT}${res.data.avatar_url}`:null
                    //   };
                    //   setCreateObjectURL(res.data.avatar_url?`${process.env.NEXT_PUBLIC_API_ENDPOINT}${res.data.avatar_url}`:null);
                    //   setUsers(inity);
                    // setItem(res.data.data)
                    // console.log(users)

                  }
                  else
                  toast.success(res.data.message);

                })
                .catch((error) => {
                  // setFormvalue(false);
                    setFormsub(false);
                   if (error.response) {

                    toast.success(error.response.data.message);
                   } else if (error.request) {
                     console.log("network error");
                   } else {
                     console.log(error);
                   }

                });
    }

   }
  return (
    <>
    <style jsx>
{
`.invalid-feedback {

display:block !important;
}
`
}


			</style>
      <Seo title="Profile"/>
	  <PageHeader title="Profile" item="Profile" active_item="Profile"/>

	  <Tab.Container
      id="center-tabs-example"
      defaultActiveKey="editprofile"
      className="bg-gray-100"
    >
      <Row className="square job-details profile-details">
        <div lg={12} md={12}>
          <Card className="custom-card">
            <Card.Body>
              <div className="panel profile-cover">
              <div className="head-section">
                     <div className="profile-cover__img01">
                     <div className="org-logo01 profile-logo">
                     <img src={DefaultImg?.src || users?.image} style={{width:"100px",height:"100px"}} alt="img" />
                     </div>

                        <div className="info01">
                           <h3 className="h3 mt-0 mb-0">{users.name}</h3>
                           <p className="text-success tx-14 mb-1">{item?item.user_role.name:""}</p>
                           <p className="text-muted tx-13 mb-0">
                           <span><i className="fa fa-phone"></i>{item?item.mob:""}</span> 
                           <span className="ms-2"><i className="fa fa-envelope"></i> {item?item.email:""}</span></p>
                           {/* <p className="text-muted tx-13 mb-0">abc@gmail.com </p> */}
                        </div>
                     </div> 
                                                                           
                  </div>
                <div className="profile-tab tab-menu-heading">
                  <Nav variant="pills" className="p-3 bg-primary-transparent">
                   
                    <Nav.Item>
                      <Nav.Link eventKey="editprofile">Edit Profile </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="accountsetting">
                        Reset Password
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
            </Card.Body>
          </Card>

        </div>
      </Row>
      <Row className="row-sm">
        <Col md={12} lg={12}>
          <div className="card custom-card main-content-body-profile">
            <Tab.Content>
             {isLoading && <LoadingSpinner/>}
              <Tab.Pane eventKey="editprofile">
              
                <div
                  className="main-content-body tab-pane p-sm-4 p-0 border-top-0"
                >
                  <div className="card-body border">
                    <div className="mb-4 main-content-label">
                      Personal Information
                    </div>
                    <Form className="form-horizontal" id="form2">
                      <FormGroup className="form-group">
                        <Row className=" row-sm">
                        <Col md={3}> <Form.Label >Profile Picture</Form.Label> </Col>
                          <Col md={6} className="profile-upload01">
                         <ProfileImageUpload createObjectURL={DefaultImg?.src || createObjectURL} onImageChange={handleImageChange}/>
                         </Col>
                        </Row>
                      </FormGroup>
                      <hr/>
                      <FormGroup className="form-group">
                        <Row className=" row-sm">
                          <Col md={3}>
                            <Form.Label >Name</Form.Label>
                          </Col>
                          <Col md={9}>
                          <input name="name"    className={`form-control ${errors.name ? "is-invalid" : ""}`} required={true}
                            onChange={handleValidation} value={users.name}  id="fulltName1" type="text" placeholder="Enter your Full name" />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                          </Col>
                        </Row>
                      </FormGroup>
                     
                      <div className="mb-4 main-content-label">
                        Contact Info
                      </div>
                      <FormGroup className="form-group">
                        <Row className=" row-sm">
                          <Col md={3}>
                            <Form.Label >
                              Email<i>(required)</i>
                            </Form.Label>
                          </Col>
                          <Col md={9}>
                          <input required={true}  className={`form-control ${errors.email ? "is-invalid" : ""}`} id="userID"   onChange={handleValidation} name="email"  value={users.email} type="text" placeholder="Enter your Email" disabled />
                                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup className="form-group">
                        <Row className=" row-sm">
                          <Col md={3}>
                            <Form.Label >Mobile</Form.Label>
                          </Col>
                          <Col md={9}>
                          <input name="mob" required={true}    className={`form-control ${errors.mob ? "is-invalid" : ""}`}
                            onChange={handleValidation} value={users.mob}  id="fulltName1" type="text" placeholder="Enter Mobile" />
                            {errors.mob && <div className="invalid-feedback">{errors.mob}</div>}
                          </Col>
                        </Row>
                      </FormGroup>
                      <div className="card-footer text-end">
                      <button className="btn btn-primary " type="button" onClick={(e)=>onSubmit(e)}>Update</button>
                    </div>
                     
                    
                    </Form>
                  </div>
                </div>
              </Tab.Pane>
           
              <Tab.Pane eventKey="accountsetting">
                <div
                  className="main-content-body tab-pane p-sm-4 p-0 border-top-0"
                >
                  <div className="card-body border" data-select2-id="12">
                    <ProfilePassword/>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Col>
      </Row>
    </Tab.Container>
    </>
  )
}
Profile.layout = "Contentlayout"

export default Profile