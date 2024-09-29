import React from 'react'
import { ListComponent } from '../../components/Users/Common';
import { _CAMP_MEMBERS } from '../../components/constants/constant';

const TITLE = 'Camp members';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Camp = () => {
  return (
    <>
      <ListComponent title={TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={_CAMP_MEMBERS}/>
    </>
  )
}
Camp.layout = "Contentlayout";
export default Camp;