/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PageHeader from "/components/_App/Breadcrumb";
import Seo from "/components/_App/Seo";
import Link from "next/link";
import {
  Card,
  Col,
  FormGroup,
  Form,
  Dropdown,
  Row,
  Collapse,
} from "react-bootstrap";
// import DataTable from "react-data-table-component";
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
// import DataTableExtensions from "react-data-table-component-extensions";
const DataTableExtensions = dynamic(
  () => import("react-data-table-component-extensions"),
  { ssr: false }
);
import "react-data-table-component-extensions/dist/index.css";
import LoadingSpinner from "/components/Loader";
import HelperData from "/helpers/Helper";
import icon from "/public/assets/img/brand/logo-light.png";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddModal from "/components/Masters/DegreeAddOrEdit";

const Orders = () => {
  const [addModal, setAddModal] = useState(false);
  const [editDegree, setEditDegree] = useState("");

  const [search, setSearch] = useState("");
  const [pass, setPass] = useState("");
  let [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [des, setDes] = useState(0);
  const [pending, setPending] = React.useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [countPerPage, setCountPerPage] = useState(15);
  const obj = {
    approval_status: "",
    active_status: "",
  };
  const [filter, setFilter] = useState(obj);
  const onRequestClose = () => {
    setPass("");
  };
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };

  const handleSort = async (column, sortDirection) => {
    let field = column.sortField
    if(field === 'approved' || field === 'active') {
      if(sortDirection === 'asc') sortDirection = 'desc';
      else if(sortDirection === 'desc') sortDirection = 'asc';
    }
    fetchListings(0, field, sortDirection);
	};

  const columns = [
    {
      name: "Sl.No",
      width: "10%",
      selector: (row) => row.id,
      sortable: true,
      sortField: 'id',
      cell: (row) => <div className="font-weight-bold">{row.id}</div>,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      sortField: 'name',
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row.name}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Approval Status",
      sortable: true,
      sortField: 'approved',
      width: "20%",
      selector: (row) => !row.approved,
      cell: (row) => (
        <div>
          {parseInt(row.approved) === 1 ? (
            <span className="text-success small mb-0 mt-1 tx-12">Approved</span>
          ) : (
            <span
              onClick={(e) => {
                e.preventDefault();
                changeApproveStatus(e, 1, row.id);
              }}
              className="text-danger small mb-0 mt-1 tx-12"
              style={{ cursor: "pointer" }}
            >
              Pending
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Active Status",
      width: "20%",
      selector: (row) => !row.active,
      sortable: true,
      sortField: 'active',
      cell: (row) => (
        <div>
          <span
            onClick={(e) => {
              e.preventDefault();
              if (parseInt(row.active) === 1) {
                changeStatus(e, 0, row.id);
              } else {
                changeStatus(e, 1, row.id);
              }
            }}
            className={`text-${
              parseInt(row.active) == 1 ? "success" : "warning"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {parseInt(row.active) == 1 ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      name: "ACTIONS",
      selector: (row) => [row.ACTIONS],
      sortable: false,
      cell: (row) => (
        <div className="button-list">
          <Dropdown className="dropdown">
            <Dropdown.Toggle className="new option-dots2" variant="default">
              <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="dropdown-menu-end"
              style={{ marginTop: "0px" }}
            >
              <Dropdown.Item href="#" onClick={() => setEditDegree(row)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {editDegree.id == row.id && (
            <AddModal
              isEditModal={true}
              val={true}
              data={editDegree}
              onRequestClose={() => {
                setEditDegree("");
                setDes(!des);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  const fetchListings = async (type = 0, field, sortDirection) => {
    setPending(true);
    const address = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/degree/list`;
    const token = localStorage.getItem("token");
    try {
      let config = {
        method: "get",
        url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&orderBy=${sortDirection}&sortBy=${field}`,
        headers: { Authorization: "Bearer " + token },
      };
      if (type == 1) {
        config = {
          method: "get",
          url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&active=${filter.active_status}&approve=${filter.approval_status}`,
          headers: { Authorization: "Bearer " + token },
        };
      }

      const response = await axios(config);
      setPending(false);
      if (response.status === 200) {
        if (response.data.status) {
          var datas = response.data.data.data;
          // console.log(datas)
          if (datas.length > 0) {
            setTotal(response.data.data.meta.total);
            datas.forEach((da, index) => {
              if (page === 1) {
                da.serial = index + 1;
              } else {
                da.serial = (page - 1) * countPerPage + (index + 1);
              }
            });
          }
          setData(datas);
          setFilteredUsers(datas);
          // setPending(false);
        } else {
          toast.warning(response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      }
    } catch (error) {
      // console.log(error)
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      } else if (error.response.status === 404) {
        toast.warning("Resource not found", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error.response.status === 500) {
        toast.warning("Internal server error", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.warning("An error occurred", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };
  useEffect(() => {
    fetchListings(0);
  }, [page, search, countPerPage, des]);
  const tableData = {
    columns,
    data,
  };
  const removeList = async (ev, id) => {
    ev.preventDefault();
    Swal.fire({
      title: "Are you sure you want to delete this degree?",
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Confirm",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const body = new FormData();
        body.append("id", id);
        // body.append('slug', slug);
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/degree/destroy`;
        const token = localStorage.getItem("token");
        setIsLoading(true);
        try {
          const response = await axios.post(url, body, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            if (response.data.status) {
              toast.success(response.data.message, {
                position: "top-right",
                autoClose: 3000,
              });
              setDes(!des);
            } else {
              toast.success(response.data.message, {
                position: "top-right",
                autoClose: 3000,
              });
            }
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else {
            toast.warning("An error occurred while deleting the user.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          setIsLoading(false);
          //   console.log()
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else if (error.response.status === 404) {
            toast.warning("Resource not found", {
              position: "top-right",
              autoClose: 3000,
            });
          } else if (error.response.status === 403) {
            toast.warning(
              error.response.data.data
                ? error.response.data.data[0].message
                : error.response.message,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } else if (error.response.status === 500) {
            toast.warning("Internal server error", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.warning("An error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
      }
    });
  };
  const changeStatus = async (ev, sts, id) => {
    // return 1
    ev.preventDefault();
    const status = sts === 1 ? "active" : "inactive";
    Swal.fire({
      title: `Are you sure you want to change status to ${status}?`,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Confirm",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const body = new FormData();
        body.append("id", id);
        // body.append('slug', slug);
        body.append("active", sts);
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/degree/status`;
        const token = localStorage.getItem("token");
        setIsLoading(true);
        try {
          const response = await axios.post(url, body, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            toast.success(response.data.message, {
              position: "top-right",
              autoClose: 3000,
            });
            setDes(!des);
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else {
            toast.warning("An error occurred while changing the status.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          setIsLoading(false);
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else if (error.response.status === 404) {
            toast.warning("Resource not found", {
              position: "top-right",
              autoClose: 3000,
            });
          } else if (error.response.status === 500) {
            toast.warning("Internal server error", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.warning("An error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
      }
    });
  };
  const changeApproveStatus = async (ev, sts, id) => {
    // return 1
    ev.preventDefault();
    Swal.fire({
      title: `Are you sure you want to approve this degree?`,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: "Confirm",
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const body = new FormData();
        body.append("id", id);
        body.append("approve", sts);
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}admin/masters/degree/approve`;
        const token = localStorage.getItem("token");
        setIsLoading(true);
        try {
          const response = await axios.post(url, body, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          if (response.status === 200) {
            toast.success(response.data.message, {
              position: "top-right",
              autoClose: 3000,
            });
            setDes(!des);
          } else if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else {
            toast.warning("An error occurred while changing the status.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } catch (error) {
          setIsLoading(false);
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userData");
            router.push("/");
          } else if (error.response.status === 404) {
            toast.warning("Resource not found", {
              position: "top-right",
              autoClose: 3000,
            });
          } else if (error.response.status === 500) {
            toast.warning("Internal server error", {
              position: "top-right",
              autoClose: 3000,
            });
          } else {
            toast.warning("An error occurred", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
      }
    });
  };
  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearch(searchText);
  };

  const openModal = () => {
    setAddModal(true);
  };

  return (
    <>
      <style jsx>
        {`
          .filter-text {
            border: 1px solid #e8e8f7 !important;
            border-bottom: 1px solid #e8e8f7 !important;
            outline: none !important;
            padding: 0.375rem 0.75rem !important;
            margin-left: -11px !important;
            background-color: transparent !important;
            border-radius: 7px;
          }
          .data-table-extensions {
            display: none !important;
          }
          .custom-card .header {
            width: auto !important;
          }
          .filter-table {
            margin-left: 0px !important;
          }
          .filter-table {
            border: 0 !important;
          }
          .table-accordian-filter.accordion {
            margin-right: -10px;
            margin-left: 15px;
          }
        `}
      </style>
      <Seo title="Degree Listing" />
      <PageHeader
        title="Degree"
        item="Degree"
        active_item="Listing"
        right={1}
        isModal={true}
        openModal={openModal}
      />
      {addModal && (
        <AddModal
          val={addModal}
          onRequestClose={() => {
            setAddModal(false);
            setDes(!des);
          }}
        />
      )}
      <div>
        {/* <!-- Row --> */}
        <Row className="row-sm">
          <Col md={12} lg={12}>
            <Card className=" custom-card">
              {/* 
         <Card.Header className=" border-bottom-0 pb-0">
            <div>
               <div className="d-flex">
                  <label className="main-content-label my-auto pt-2">
                  All Individuals
                  </label>
               </div>
            </div>
         </Card.Header>
         */}
              <Card.Body>
                {/* <a className="btn btn-outline-dark filter-table">Filter <i className="fa fa-filter font-17 ml-2"></i></a> */}
                <DataTableExtensions {...tableData} filter={false}>
                  <DataTable
                    columns={columns}
                    defaultSortAsc={true}
                    striped={true}
                    onSort={handleSort}
                    sortServer
                    highlightOnHover
                    pagination
                    paginationServer
                    paginationTotalRows={total}
                    paginationPerPage={countPerPage}
                    paginationComponentOptions={paginationComponentOptions}
                    onChangeRowsPerPage={(countPerPage) =>
                      setCountPerPage(countPerPage)
                    }
                    onChangePage={(page) => setPage(page)}
                    fixedHeader
                    fixedHeaderScrollheight="450px"
                    selectableRowsHighlight
                    subHeader
                    progressPending={pending}
                    progressComponent={<LoadingSpinner />}
                    subHeaderComponent={
                      <>
                        <div>
                          <div className="table-filter-search">
                            <div className="input-filter-div01">
                              <input
                                type="text"
                                className="filter-text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search..."
                              />
                              <div className="filter-action01">
                                <a
                                  className={`filter-link01 ${
                                    isFilterOpen ? "" : "collapsed"
                                  }`}
                                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                                  role="button"
                                  aria-expanded={isFilterOpen}
                                >
                                  <i className="fa fa-filter font-17 ml-2" />
                                </a>
                              </div>
                            </div>
                          </div>
                          <Collapse in={isFilterOpen}>
                            <div
                              className="row collapse-content01"
                              id="collapseFilter"
                            >
                              <div lg={12} md={12}>
                                <Card className="custom-card">
                                  <Card.Body className="border b-radious-11">
                                    <div className="row p-3">
                                      <FormGroup className="form-group col-md-6">
                                        <Form.Label className="tx-medium">
                                          Approval Status
                                        </Form.Label>
                                        <select
                                          onChange={(e) =>
                                            setFilter({
                                              ...filter,
                                              ["approval_status"]:
                                                e.target.value,
                                            })
                                          }
                                          className={"form-control"}
                                          name="approval_status"
                                          value={filter.approval_status}
                                        >
                                          <option value="">--Select--</option>
                                          <option value={1}>Approved</option>
                                          <option value={0}>Pending</option>
                                        </select>
                                      </FormGroup>
                                      <FormGroup className="form-group col-md-6">
                                        <Form.Label className="tx-medium">
                                          Active Status
                                        </Form.Label>
                                        <select
                                          onChange={(e) =>
                                            setFilter({
                                              ...filter,
                                              ["active_status"]: e.target.value,
                                            })
                                          }
                                          className={"form-control"}
                                          name="active_status"
                                          value={filter.active_status}
                                        >
                                          <option value="">--Select--</option>
                                          <option value={1}>Active</option>
                                          <option value={0}>Inactive</option>
                                        </select>
                                      </FormGroup>

                                      <div className="col-md-12 text-end">
                                        <Link
                                          href="#"
                                          className="btn btn-light  me-2"
                                          onClick={() => {
                                            setIsFilterOpen(false);
                                            setFilter(obj);
                                            fetchListings(0);
                                          }}
                                        >
                                          Cancel
                                        </Link>
                                        <Link
                                          href="#!"
                                          className="btn btn-success"
                                          onClick={() => fetchListings(1)}
                                        >
                                          Submit
                                        </Link>
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </>
                    }
                  />
                </DataTableExtensions>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* <!-- End Row --> */}
      </div>
    </>
  );
};
Orders.layout = "Contentlayout";
export default Orders;
