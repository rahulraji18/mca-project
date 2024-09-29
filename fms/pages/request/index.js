import React from 'react'
import { ListComponent } from '../../components/Users/Common';
import { _MANAGE_REQUEST } from '../../components/constants/constant';

const TITLE = 'Request';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Request = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  const role = user?.role;
  return (
    <>
      <ListComponent title={TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={role !== 5 ? _MANAGE_REQUEST : 1}/>
    </>
  )
}
Request.layout = "Contentlayout";
export default Request;