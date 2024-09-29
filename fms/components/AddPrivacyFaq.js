// components/FaqSection.js
import React, { useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import HelperData from '../helpers/Helper';
import axios from 'axios';
import LoadingSpinner from "./OutLoadingSpinner";
import FaqPrivacyIndex from "./FaqPrivacyIndex";

import { toast } from 'react-toastify';
import { useRouter } from 'next/router'

const FromInlineEditEditor = dynamic(() => import('../components/Editor/Editor'), { ssr: false })

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [which, setWhich] = useState(0);
  const [editedFaq, setEditedFaq] = useState({ question: '', answer: '' });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter()

  const handleClose = () => {
    setShowModal(false);
    setEditedFaq({ question: '', answer: '' });
  };

  const handleShow = () => {
    setShowModal(true);
  };

  

  const handleDeleteFaq = (index) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };
 
  function onSubmitNew(e) {
  
    e.preventDefault();
    var check=false;
    var elements = document.getElementById("form3").elements;
        for (var i = 0, element; element = elements[i++];)
      {
    if (element.name in editedFaq) {
        if(element.required)
        {
          if(element.type=='select-one')
          {
            check=checkValidationNew([element.name], element.value,HelperData.toCamel(element.name));
            if(check===false)
            { break;}

          }
          else {
            check=checkValidationNew([element.name], element.value,element.placeholder);
            if(check===false)
          {   break;}

          }
        }
    }
      }
    if(check)
    {
  if (editedFaq.answer.trim() === '' || editedFaq.answer.trim() === '<p></p>') {
  setErrors((errors) => {

  return { ...errors, ['answer']: "* Faq answer is required" };
  });
  check=false;
  }
  }
    if(check)
    {

            setIsSaving(true);

            const body = new FormData();
            body.append("question", editedFaq.question);
            body.append("answer", editedFaq.answer);
            body.append("type", 'faq2');

            const token = localStorage.getItem('token');
            const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/create`;

            axios.post(url, body, {
              headers: {
                Authorization: "Bearer " + token
              }
            })
            .then(res => {
              setIsSaving(false);
        if (res.status === 200) {
            if(res.data.status)
            {
                handleClose()
              toast.success(res.data.message, {
                position: 'top-right',
                autoClose: 3000,
              });
              setTimeout(function () {
                router.push(`/admin/cms/privacy/faq`, undefined, { shallow: true });
            
                }, 1500);
            }
            else{
               toast.warning(res.data.message, {
                position: 'top-right',
                autoClose: 3000,
              });
            }
        }
        else if (res.status === 401) {

          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          router.push('/');
        }
        else{
           toast.warning('An error occurred while creating the faq.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
              
            })
            .catch((error) => {
              setIsSaving(false);
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
            });

}
}
const [errors, setErrors] = useState({});



function checkValidationNew(name, value,text='',focus=true) {

    if (value === "") {
      // delete fields[name];
      if(focus){
              document.getElementById(name).focus();
      }

      setErrors((errors) => {

        return { ...errors, [name]: "* " +(text==''?HelperData.toCamel(name):text)+" is required" };
      });
      // setFormvalue(false);
// console.log(errors)
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
  const handleEditorContentChangeNew = (content) => {
    // setData(content);
    setEditedFaq({ ...editedFaq, ['answer']: content })
		// setErrors((errors) => {

		// 	return { ...errors, ['answer']: "" };
		// });
  };
const handleValidationNew = (e,req=false,type="")=>{
    const name = e.target.name;
    var value = e.target.value;
    setEditedFaq({ ...editedFaq, [name]: value });
    if(req)
    {
    checkValidationNew(name, value,e.target.placeholder?e.target.placeholder:'This field');

    }
}

  return (
    <div>
    <style jsx>
{
`.invalid-feedback {

display:block !important;
}
`
}


			</style>
            <div className="page-header">
      <div>
        <h2 className="main-content-title tx-24 mg-b-5">Privacy Faq</h2>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a>CMS</a></li>
          <li className="breadcrumb-item"><a href={`/admin/cms/privacy`}>Privacy</a></li>
          <li className="breadcrumb-item active" aria-current="page">Faq</li>
        </ol>
      </div>
    
        <div className="d-flex">
        <div className="justify-content-center">
        
          <button type="button"  onClick={() => handleShow()} className="btn btn-primary my-2 btn-icon-text">
            <i className="fe fe-plus"></i> Add New
          </button>
        </div>
      </div>
     
      

    </div>
           
     
     <FaqPrivacyIndex/>

    

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add FAQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {isSaving && <LoadingSpinner/>}
        <form id="form3">
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              className="form-control" name='question' id='question' placeholder='Question' required={true} 
               onChange={(e)=>handleValidationNew(e,true)} 
              value={editedFaq.question}
    
            />
            {errors['question'] && <div className="invalid-feedback">{errors['question']}</div>}
          </div>
          <div className="form-group">
            <label>Answer</label>
            <FromInlineEditEditor  content={editedFaq.answer}  onContentChange={handleEditorContentChangeNew}/>
            {errors['answer'] && <div className="invalid-feedback">{errors['answer']}</div>}
          </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={handleClose} type='button'>
            Close
          </Button>
          <Button variant="success" onClick={onSubmitNew}  type='button'>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FaqSection;
