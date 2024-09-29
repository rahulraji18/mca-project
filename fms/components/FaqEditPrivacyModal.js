import React, { useState, useEffect } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import LoadingSpinner from './OutLoadingSpinner';
import axios from 'axios';
import { useRouter } from 'next/router';
import ErrorPage from '../pages/warning';
import { toast } from 'react-toastify';

const FromInlineEditEditor = dynamic(
  () => import('./Editor/FromInlineEditEditor'),
  { ssr: false }
);

const FAQComponent = ({ faqId ,show,closeModal}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState('<p></p>');
  const [faq, setFaq] = useState(null);
  const { asPath, pathname } = useRouter();
  const id = faqId;
  const [err, setErr] = useState(null);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const router = useRouter();

  const [items, setItems] = useState({});
  const [errors, setErrors] = useState({});
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFaqData = async () => {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/show/${id}`;
      const token = localStorage.getItem('token');
      try {
        const config = {
          method: 'get',
          url: url,
          headers: { Authorization: 'Bearer ' + token },
        };
        const response = await axios(config);

        if (response.status === 200) {
          setIsLoading(false);
          if (response.data.status && response.data.data.faq != null) {
            const faqq = response.data.data.faq;
            setData(faqq.answer ? faqq.answer : '<p></p>');
            setEditorLoaded(true);
            const first = {
              question: faqq.question ? faqq.question : '',
              id: faqq.id ? faqq.id : '',
            };
            setItems(first);
            setFaq(faqq);
          } else {
            setErr('404');
          }
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          router.push('/');
        } else {
          toast.error('An error occurred while fetching the faq.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (error) {
        setIsLoading(false);
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
      }
    };

    fetchFaqData();
  }, [id, router]);

  const handleEditorContentChange = (content) => {
    setData(content);
    setErrors((errors) => {
      return { ...errors, ['answer']: '' };
    });
  };

  const checkValidation = (name, value, text = '', focus = true) => {
    if (value === '') {
      if (focus) {
        document.getElementById(name).focus();
      }

      setErrors((errors) => {
        return {
          ...errors,
          [name]: '* ' + (text === '' ? toCamel(name) : text) + ' is required',
        };
      });

      return false;
    } else {
      setErrors((errors) => {
        return { ...errors, [name]: '' };
      });

      return true;
    }
  };

  const onUpdate = (e) => {
    e.preventDefault();
    let check = false;
    const elements = document.getElementById('form2').elements;
    for (let i = 0, element; (element = elements[i++]); ) {
      if (element.name in items) {
        if (element.required) {
          if (element.type === 'select-one') {
            check = checkValidation(
              [element.name],
              element.value,
              toCamel(element.name)
            );
            if (check === false) {
              break;
            }
          } else {
            check = checkValidation(
              [element.name],
              element.value,
              element.placeholder
            );
            if (check === false) {
              break;
            }
          }
        }
      }
    }

    if (check) {
      if (data.trim() === '' || data.trim() === '<p></p>') {
        setErrors((errors) => {
          return { ...errors, ['answer']: '* Faq answer is required' };
        });
        check = false;
      }
    }

    if (check) {
      setIsLoading(true);

      const body = new FormData();
      body.append('question', items.question);
      body.append('answer', data);
      body.append('id', items.id);

      const token = localStorage.getItem('token');
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/update`;

      axios
        .post(url, body, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 200) {
            if (res.data.status) {
             
              toast.success(res.data.message, {
                position: 'top-right',
                autoClose: 3000,
              });
              closeModal()
            } else {
              toast.warning(res.data.message, {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          } else if (res.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            router.push('/');
          } else {
            toast.warning('An error occurred while editing the faq.', {
              position: 'top-right',
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
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
  };

  function toCamel(string) {
    if (Array.isArray(string)) {
      return '';
    }
    return string != ''
      ? string.replace(/(?:_| |\b)(\w)/g, function ($1) {
          return $1.toUpperCase().replace('_', ' ');
        })
      : string;
  }

  const handleValidation = (e, req = false, type = '') => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
    if (req) {
      checkValidation(name, value, e.target.placeholder ? e.target.placeholder : 'This field');
    }
  };

  // const openModal = () => {
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  // };

  return (
    <>
      

      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Privacy FAQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Card className="custom-card">
          {err != null && <ErrorPage statusCode={err} />}
          <Card.Body>
          <form id="form2">
            {faq != null && (
              <>
                <div className="col-md-12 form-group mb-3">
                  <label htmlFor="firstName1">FAQ Question</label>
                  <input
                    value={items.question}
                    className={
                      errors && errors.question
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="question"
                    id="question"
                    onChange={(e) => handleValidation(e, true)}
                    required={true}
                    type="text"
                    placeholder="Faq Question"
                  />
                  {errors['question'] && (
                    <div className="invalid-feedback">{errors['question']}</div>
                  )}
                  <div className="invalid-feedback">{errors.question?.message}</div>
                </div>
                <div className="col-md-12 form-group mb-3">
                  <label htmlFor="firstName1">FAQ Answer</label>
                  {editorLoaded && (
                    <FromInlineEditEditor
                      content={data}
                      name="answer"
                      onContentChange={handleEditorContentChange}
                    />
                  )}
                  {errors['answer'] && (
                    <div className="invalid-feedback">{errors['answer']}</div>
                  )}
                </div>
              </>
            )}
            </form>
          </Card.Body>
         
        </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeModal}>
            Close
          </Button>
          {faq != null && (      
              <button
                className="btn btn-success "
                type="button"
                onClick={(e) => onUpdate(e)}
              >
                Update
              </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FAQComponent;
