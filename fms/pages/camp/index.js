import React from 'react'
import { ListComponent } from '../../components/Users/Common';

const TITLE = 'Camp';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Camp = () => {
  return (
    <>
      <ListComponent title={TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={2}/>
    </>
  )
}
Camp.layout = "Contentlayout";
export default Camp;