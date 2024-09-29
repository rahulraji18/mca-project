import React from 'react'
import { ListComponent } from '../../components/Users/Common';
import { _FMT } from '../../components/constants/constant';

const TITLE = 'Flood management team';
const SHORT_TITLE = 'FMT';
const ACTIVE_ITEM = 'List';
const ADD_NEW = 1;
const Fmt = () => {
  return (
    <>
      <ListComponent title={TITLE} short_title={SHORT_TITLE} active_item={ACTIVE_ITEM} addNew={ADD_NEW} type={_FMT}/>
    </>
  )
}
Fmt.layout = "Contentlayout";
export default Fmt;