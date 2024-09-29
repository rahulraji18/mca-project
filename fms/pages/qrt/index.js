import React from 'react'
import { ListComponent } from '../../components/Users/Common';
import { _QRT } from '../../components/constants/constant';

const TITLE = 'Quick team';
const SHORT_TITLE = 'QRT';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Qrt = () => {
  return (
    <>
      <ListComponent title={TITLE} short_title={SHORT_TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={_QRT}/>
    </>
  )
}
Qrt.layout = "Contentlayout";
export default Qrt;