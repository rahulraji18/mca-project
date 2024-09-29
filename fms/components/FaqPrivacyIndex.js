import React, { useState,useEffect } from 'react'
import dynamic from 'next/dynamic';
import {Card, Col, OverlayTrigger, Row, Tooltip,Dropdown } from "react-bootstrap";
const DataTable = dynamic(()=>import("react-data-table-component"), { ssr: false })
const DataTableExtensions = dynamic(()=>import('react-data-table-component-extensions'), { ssr: false })
import "react-data-table-component-extensions/dist/index.css";
import LoadingSpinner from "./Loader";
import  HelperData from "../helpers/Helper";
import { useRouter } from 'next/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import FaqDetailsModal from './FaqEditPrivacyModal'; 

const Orders = ({which}) => {

	const [search, setSearch] = useState("");
	let [data, setData] = useState([])
  const [page, setPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [des, setDes] = useState(0);
  const [pending, setPending] = React.useState(true);
  const [show, setShow] = React.useState(false);
  const [faqid, setFaqid] = React.useState('');
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const [countPerPage, setCountPerPage] = useState(15);
 
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL"
  };
  const closeModal =()=>{
    setFaqid('');
    setShow(false)
    setDes(!des)
  }
    
const DoneEdit=(row)=>{
    setFaqid(row);
    setShow(true)
}
	const columns = [
        {
            name: "Sl.No",
            selector: row => [row.serial],
            sortable: true,
            cell: row => <div className="font-weight-bold">
                {row.serial}
            </div>,

        },

        {
            name: "Question",
            selector: row => [row.question],
            cell: row =>
                <div>
                    {row.question}
                </div>,
            sortable: true
        },
        {
            name: "Created On",
            selector: row => [row.created_at],
            cell: row =>
                <div>
                    {HelperData.formatDate(row.created_at)}
                </div>,
            sortable: true
        },
        {
          name: "STATUS",
          selector: row => [row.active],
          sortable: true,
          cell: row =>
              <div>
                  <span
                  onClick={(e) => {
        e.preventDefault(); 
        if (parseInt(row.active) === 1) {
          changeStatus(e,0,row.id,row.slug);
        } else {
          changeStatus(e,1,row.id,row.slug);
        }
      }}
                   className={`text-${parseInt(row.active)==1?'success':'warning'} small mb-0 mt-1 tx-12`}
                   style={{ cursor: "pointer" }}
                  >{parseInt(row.active)==1?'Active':'Inactive'}</span>
                  
              </div>
      },

        {
            name: "ACTIONS",
            selector: row => [row.ACTIONS],
            sortable: true,
            cell: row =>
            <div className="button-list">
                    <Dropdown className="dropdown">
                        <Dropdown.Toggle
                            className="new option-dots2"
                            variant="default"
                            >
                            <i className="fas fa-ellipsis-v"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end" style={{ marginTop: "0px" }}>
                        <Dropdown.Item href="#" onClick={() => DoneEdit(row.slug)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Edit
                        </Dropdown.Item>
                        <Dropdown.Item href="#" onClick={(e) => {removeList(e,row.id,row.slug);}}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i> Delete
                        </Dropdown.Item>
                      
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

              
        },
    ];


		
		useEffect(() => {
      const fetchListings = async () => {
        const address = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/index`;
        const token = localStorage.getItem('token');
        setIsLoading(true)
        try {
          const config = {
            method: 'get',
            url: `${address}?type=faq2&page=${page}&per_page=${countPerPage}&delay=1&search=${search}`,
            headers: { "Authorization": "Bearer " + token }
          }
          const response = await axios(config);
          setIsLoading(false);
          if(response.status===200)
          {
            if (response.data.status) {
              var datas = response.data.data.faqs.data;
              if (datas.length > 0) {
                setTotal(response.data.data.faqs.meta.total);
                datas.forEach((da, index) => {
                  if (page === 1) {
                    da.serial = index + 1;
                  } else {
                    da.serial = ((page - 1) * countPerPage) + (index + 1);
                  }
                });
              }
              setData(datas);
              setFilteredUsers(datas);
              setPending(false);
            }
            else{
               toast.warning(response.data.message, {
                position: 'top-right',
                autoClose: 3000,
              });
            }
          }
          else if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            router.push('/');
          } else {
            
             toast.warning('An error occurred while fetching the faqs.', {
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
	    fetchListings();
	  }, [page,search,countPerPage,des,router]);
	

    const tableData = {
        columns,
        data,
    };
    const changeStatus =async (ev,sts,id,slug) =>{
      ev.preventDefault();
      var status=(sts==1?'active':'inactive'+' ?');
 
      Swal.fire({
      title: 'Are you sure you want to change status to '+status,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Confirm',
      // imageUrl:icon.src,
      icon: "warning",
      }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      const body =new FormData();
        body.append("id", id);
        body.append("slug", slug);
        body.append("active", sts);
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/update/status`;
      const token = localStorage.getItem('token');
      setIsLoading(true);
      axios.post(url, body, {
                headers: {
                Authorization: "Bearer " + token
                         }
                           }
                         )
          .then(res => {
              setIsLoading(false);
              if(res.status===200)
              {
                if(res.data.status)
                {
                  toast.success(res.data.message, {
                    position: 'top-right',
                    autoClose: 3000,
                  });
                  setDes(!des);
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
              } else {
                
                 toast.warning('An error occurred', {
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
      })
 
 
 
   };
    const removeList =async (ev,id,slug) =>{
      ev.preventDefault();
 
 
      Swal.fire({
      title: 'Are you sure you want to delete this faq?',
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Confirm',
      // imageUrl:icon.src,
      icon: "warning",
      }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
      const body =new FormData();
        body.append("id", id);
        body.append("slug", slug);
      const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/faq/destroy`;
      const token = localStorage.getItem('token');
      setIsLoading(true);
      axios.post(url, body, {
                headers: {
                Authorization: "Bearer " + token
                         }
                           }
                         )
          .then(res => {
              setIsLoading(false);
              if(res.status===200){
                toast.success(res.data.message, {
                  position: 'top-right',
                  autoClose: 3000,
                });
                setDes(!des);
              }
              else if (res.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                router.push('/');
              } else {
                
                 toast.warning('An error occurred', {
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
      })
 
 
 
   };
    
   const handleSearch = (e) => {
    const searchText = e.target.value;
     setSearch(searchText);
   };
 
  return (
    <>
			<style jsx>{

		`
.filter-text{
			border: 1px solid #e8e8f7 !important;
	    border-bottom: 1px solid #e8e8f7 !important;
	    outline: none !important;
	    padding: 0.375rem 0.75rem !important;
	    margin-left: -11px !important;
	    background-color: transparent !important;
	    border-radius: 7px;
}
.data-table-extensions { display: none; }
`
		}
</style>
       

    {/* <!-- Row --> */}
	<Row className="row-sm">
        <Col md={12} lg={12}>
          <Card className=" custom-card">
            {/* <Card.Header className=" border-bottom-0 pb-0">
              <div>
                <div className="d-flex">
                  <label className="main-content-label my-auto pt-2">
                    All Faq
                  </label>
                </div>
              </div>
            </Card.Header> */}
            <Card.Body>
              <DataTableExtensions {...tableData} filter={false} >
                <DataTable
                    columns={columns}
                    defaultSortAsc={false}
                    // striped={true}
                     highlightOnHover
                      pagination
                      paginationServer
                      paginationTotalRows={total}
                      paginationPerPage={countPerPage}
                      paginationComponentOptions={paginationComponentOptions}
                      onChangeRowsPerPage={countPerPage => setCountPerPage(countPerPage)}
                      onChangePage={page => setPage(page)}
                      fixedHeader
                      fixedHeaderScrollheight="450px"
                      selectableRowsHighlight
                      subHeader
                      progressPending={pending}
                      progressComponent={<LoadingSpinner />}
						        subHeaderComponent={
						          <input
						            type="text" className="filter-text"
						            value={search}
						            onChange={handleSearch}
						            placeholder="Search..."
						          />
						        }

                />
            </DataTableExtensions>


            </Card.Body>
          </Card>
        </Col>
      </Row>
    {show && <FaqDetailsModal show={show} faqId={faqid} closeModal={closeModal}/>}
    </>
  )
}

Orders.layout = "Contentlayout"


export default Orders
