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
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
const DataTableExtensions = dynamic(
  () => import("react-data-table-component-extensions"),
  { ssr: false }
);
import "react-data-table-component-extensions/dist/index.css";
import LoadingSpinner from "../../../Loader";
import HelperData from "../../../../helpers/Helper";
import icon from "/public/assets/img/brand/logo-light.png";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddModal from "../Add/index";
import CardComponent from "./Card";
import { _CAMP, _CAMP_MEMBERS, _CAMP_REQUEST, _FMT, _MANAGE_REQUEST, _QRT, _REQUEST, _USER } from "../../../constants/constant";

const ListComponent = (props) => {
  const [addModal, setAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editContent, setEditContent] = useState("");
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
  const url = router?.pathname ? `${process.env.NEXT_PUBLIC_API_ENDPOINT}${router?.pathname.replace(/^\/|\/$/g, '')}` : `${process.env.NEXT_PUBLIC_API_ENDPOINT}`;
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
    let field = column.sortField;
    if (field === "approved" || field === "active") {
      if (sortDirection === "asc") sortDirection = "desc";
      else if (sortDirection === "desc") sortDirection = "asc";
    }
    fetchListings(0, field, sortDirection);
  };
  const [assignModal, setAssignModal] = useState(true);
  const handleAssignChange = (_data) => {
    setAddModal(true)
    console.log(_data, 'user')
  }
  const columns = 
  props?.type == 1 ? 
  [
    {
      name: "Id",
      // width: "10%",
      selector: (row) => row.res_id,
      sortable: true,
      sortField: "res_id",
      cell: (row) => <div className="font-weight-bold">{row.res_id}</div>,
    },
    {
      name: "Mobile",
      selector: (row) => row.mob,
      // width: "20%",
      sortable: true,
      sortField: "mob",
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.mob || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      // width: "20%",
      selector: (row) => row.email,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.email || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Situation",
      sortable: true,
      sortField: "situation",
      // width: "30%",
      selector: (row) => row.situation,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.situation || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Status",
      // width: "20%",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <span
            className={`text-${
              parseInt(row.status) == 1 ? "success" : "warning"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {parseInt(row.status) == 1 ? "Assigned" : "Requested"}
          </span>
        </div>
      ),
    },
  ]
  :
  props?.type == 2 ? 
  [
    {
      name: "Id",
      // width: "10%",
      selector: (row) => row.res_id,
      sortable: true,
      sortField: "res_id",
      cell: (row) => <div className="font-weight-bold">{row.res_id}</div>,
    },
    {
      name: "Title",
      selector: (row) => row.name,
      // width: "20%",
      sortable: true,
      sortField: "name",
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.name || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Status",
      // width: "10%",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <span
            className={`text-${
              parseInt(row.status) == 1 ? "success" : "warning"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {parseInt(row.status) == 1 ? "Active" : "In active"}
          </span>
        </div>
      ),
    },
    {
      name: "Description",
      sortable: true,
      sortField: "description",
      // width: "20%",
      selector: (row) => row.description,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.description || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
  ]
  : 
  props?.type == _CAMP_MEMBERS ? 
  [
    {
      name: "Name",
      // width: "10%",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => <div className="font-weight-bold">{row.name}</div>,
    },
    {
      name: "Mobile",
      selector: (row) => row.mob,
      // width: "20%",
      sortable: true,
      sortField: "mob",
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.mob || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      // width: "20%",
      selector: (row) => row.email,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.email || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Situation",
      sortable: true,
      sortField: "situation",
      // width: "30%",
      selector: (row) => row.situation,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.situation || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Status",
      // width: "20%",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <span
            className={`text-${
              parseInt(row.status) == 1 ? "success" : "success"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {/* {parseInt(row.status) == 1 ? "Active" : "In active"} */}
            Active
          </span>
        </div>
      ),
    },
  ]
  :
  (props?.type == _FMT || props?.type == _QRT || props?.type == _CAMP || props?.type == _USER) ? 
  [
    {
      name: "Name",
      // width: "10%",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
      cell: (row) => <div className="font-weight-bold">{row.name}</div>,
    },
    {
      name: "Mobile",
      selector: (row) => row.mob,
      // width: "20%",
      sortable: true,
      sortField: "mob",
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.mob || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      // width: "20%",
      selector: (row) => row.email,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.email || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    // {
    //   name: "Situation",
    //   sortable: true,
    //   sortField: "situation",
    //   // width: "30%",
    //   selector: (row) => row.situation,
    //   cell: (row) => (
    //     <div>
    //       <Link href="#" passHref={true} legacyBehavior={true}>
    //         <a className="font-weight-bold">{row?.situation || 'Not available'}</a>
    //       </Link>
    //     </div>
    //   ),
    // },
    {
      name: "Status",
      // width: "20%",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <span
            className={`text-${
              parseInt(row.status) == 1 ? "success" : "success"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {/* {parseInt(row.status) == 1 ? "Active" : "In active"} */}
            Active
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
              <Dropdown.Item href="#" onClick={() => setResponsibility(row)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* {responsibility.id == row.id && (
            <AddModal
              componentType={"accreditation"}
              isEditModal={true}
              val={true}
              data={responsibility}
              onRequestClose={() => {
                setResponsibility("");
                setDes(!des);
              }}
            />
          )} */}
        </div>
      ),
    },
  ]
  :
  props?.type == _MANAGE_REQUEST ? 
  [
    {
      name: "Id",
      // width: "10%",
      selector: (row) => row.res_id,
      sortable: true,
      sortField: "res_id",
      cell: (row) => <div className="font-weight-bold">{row.res_id}</div>,
    },
    {
      name: "Mobile",
      selector: (row) => row.mob,
      // width: "20%",
      sortable: true,
      sortField: "mob",
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.mob || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Email",
      sortable: true,
      sortField: "email",
      // width: "20%",
      selector: (row) => row.email,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.email || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Situation",
      sortable: true,
      sortField: "situation",
      // width: "30%",
      selector: (row) => row.situation,
      cell: (row) => (
        <div>
          <Link href="#" passHref={true} legacyBehavior={true}>
            <a className="font-weight-bold">{row?.situation || 'Not available'}</a>
          </Link>
        </div>
      ),
    },
    {
      name: "Status",
      // width: "20%",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      cell: (row) => (
        <div>
          <span
            className={`text-${
              parseInt(row.status) == 1 ? "success" : "warning"
            } small mb-0 mt-1 tx-12`}
            style={{ cursor: "pointer" }}
          >
            {parseInt(row.status) == 1 ? "Assigned" : "Requested"}
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
              <Dropdown.Item href="#" onClick={() => setEditContent(row)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
                Edit
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={() => handleAssignChange(row)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
                Assign
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {editContent.id == row.id && (
            <AddModal
              isEditModal={true}
              val={true}
              data={editContent}
              onRequestClose={() => {
                setEditContent("");
                setDes(!des);
              }}
              _type={props?.type || _REQUEST}
              title={props?.title}
            />
          )}
        </div>
      ),
    },
  ]
  : 
  [
    {
      name: "Sl.No",
      width: "10%",
      selector: (row) => row.id,
      sortable: true,
      sortField: "id",
      cell: (row) => <div className="font-weight-bold">{row.id}</div>,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      sortField: "name",
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
      sortField: "approved",
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
      sortField: "active",
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
              <Dropdown.Item href="#" onClick={() => setEditContent(row)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {editContent.id == row.id && (
            <AddModal
              isEditModal={true}
              val={true}
              data={editContent}
              onRequestClose={() => {
                setEditContent("");
                setDes(!des);
              }}
              _type={props?.type || _REQUEST}
              title={props?.title}
            />
          )}
        </div>
      ),
    },
  ];

  const fetchListings = async (type = 0, field, sortDirection) => {
    setPending(true);
    const address = props?.listApiUrl
      ? props?.listApiUrl
      : `${url}/list`;
      console.log(address)
    const token = localStorage.getItem("token");
    const role = props?.type == _FMT ? 2 : props?.type == _QRT ? 3 : props?.type == _CAMP ? 4 : props?.type == _USER ? 5 : '';
    try {
      let config = {
        method: "get",
        url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&orderBy=${sortDirection}&sortBy=${field}`,
        headers: { Authorization: "Bearer " + token },
      };
      if(role) {
        config = {
          method: "get",
          url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&orderBy=${sortDirection}&sortBy=${field}&role=${role}`,
          headers: { Authorization: "Bearer " + token },
        }
      }
      if (type == 1) {
        if(role) {
          config = {
            method: "get",
            url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&active=${filter.active_status}&approve=${filter.approval_status}&role=${role}`,
            headers: { Authorization: "Bearer " + token },
          };
        } else 
          config = {
            method: "get",
            url: `${address}?page=${page}&per_page=${countPerPage}&delay=1&search=${search}&active=${filter.active_status}&approve=${filter.approval_status}`,
            headers: { Authorization: "Bearer " + token },
          };
      }

      const response = await axios(config);
      setPending(false);
      if (response?.status === 200) {
        if (response?.data?.status) {
          var datas = response?.data?.data?.data;
          if (datas?.length > 0) {
            setTotal(response?.data?.data?.meta?.total);
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
        } else {
          toast.warning(response?.data?.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else if (response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      } else if (error?.response?.status === 404) {
        toast.warning("Resource not found", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (error?.response?.status === 500) {
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
        const url = props?.deleteApiUrl
          ? props?.deleteApiUrl
          : `${url}/destroy`;
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
        const url = props?.changeStatusApiUrl
          ? props?.changeStatusApiUrl
          : `${url}/status`;
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
        const url = props?.approveApiUrl
          ? props?.approveApiUrl
          : `${url}/approve`;
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
  console.log('title', assignModal,'23')
  return (
    <>
      <Seo title={props?.title} />
      {assignModal && (<>
        <AddModal
          val={addModal}
          onRequestClose={() => {
            setAddModal(false);
            setDes(!des);
          }}
          _type={_MANAGE_REQUEST}
          title={props?.title}
        />
      </>)}
      <PageHeader
        title={props?.title}
        item={HelperData.stringFormatter(props?.short_title ?? props?.title)}
        active_item={props?.active_item}
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
          _type={props?.type || _REQUEST}
          title={props?.title}
        />
      )}
      <div>
        <Row className="row-sm">
          <Col md={12} lg={12}>
            <CardComponent
              tableData={tableData}
              filter={false}
              columns={columns}
              defaultSortAsc={true}
              striped={true}
              handleSort={handleSort}
              total={total}
              countPerPage={countPerPage}
              paginationComponentOptions={paginationComponentOptions}
              setCountPerPage={setCountPerPage}
              setPage={setPage}
              fixedHeaderScrollheight="450px"
              pending={pending}
              setFilter={setFilter}
              search={search}
              handleSearch={handleSearch}
              setIsFilterOpen={setIsFilterOpen}
              fetchListings={fetchListings}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
ListComponent.layout = "Contentlayout";
export default ListComponent;
