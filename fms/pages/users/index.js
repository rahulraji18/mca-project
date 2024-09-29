import React from 'react'
import { ListComponent } from '../../components/Users/Common';
import { _USER } from '../../components/constants/constant';

const TITLE = 'User';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Users = () => {
  return (
    <>
      <ListComponent title={TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={_USER}/>
    </>
  )
}
Users.layout = "Contentlayout";
export default Users;