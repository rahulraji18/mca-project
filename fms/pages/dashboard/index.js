import React from 'react'
// import PageHeader from "../../shared/layout-components/page-header/page-header"
// import Seo from '../../shared/layout-components/seo/seo';
import PageHeader from '../../components/_App/Breadcrumb';
import Seo from '../../components/_App/Seo';
import Under from '../../components/UnderCon';
import withAuth from '../../helpers/withAuth'; // Import your withAuth HOC

import { Card, Col, Container, Dropdown, Row, Table, ProgressBar } from 'react-bootstrap';
import dynamic from 'next/dynamic';
const Dashboard = () => {
  const user = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}
  return (
    <>
    <Seo title="Dashboard"/>
    <PageHeader title="Welcome To Dashboard" item="Home" active_item="Dashboard"/>
    <Under />
    </>
  )
}
Dashboard.layout = "Contentlayout"

export default (Dashboard)