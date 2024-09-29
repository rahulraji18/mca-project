import React,{useState} from 'react'
import { useRouter } from 'next/router'

const PageHeader = (props) => {
  const router = useRouter();
  return (
    <div className="page-header">
      <div>
        <h2 className="main-content-title tx-24 mg-b-5">{props.title}</h2>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a>{props.item}</a></li>
          {props.intermediate_item && <li className="breadcrumb-item"><a href={props.intermediate_item_link}>{props.intermediate_item}</a></li>}
          <li className="breadcrumb-item active" aria-current="page">{props.active_item}</li>
        </ol>
      </div>
      {props.right==1 && <>
        <div className="d-flex">
        <div className="justify-content-center">
          {/* <button type="button" className="btn btn-white btn-icon-text my-2 me-2">
            <i className="fe fe-filter me-2"></i> Filter
          </button> */}

         {props.isModal? 
          <button type="button"  onClick={() => props.openModal()} className="btn btn-primary my-2 btn-icon-text">
            <i className="fe fe-plus"></i> {props.btn_name? props.btn_name:'Add New'}
          </button>
         
         :<button type="button"  onClick={() => router.push(props.path, undefined, { shallow: true })} className="btn btn-primary my-2 btn-icon-text">
            <i className="fe fe-plus"></i> {props.btn_name? props.btn_name:'Add New'}
          </button>}
        </div>
      </div>
      </>}
      

    </div>
  )
}

export default PageHeader