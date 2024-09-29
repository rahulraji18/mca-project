import React from "react";
import dynamic from "next/dynamic";
import { Card, Col } from "react-bootstrap";
const DataTable = dynamic(() => import("react-data-table-component"), {
  ssr: false,
});
const DataTableExtensions = dynamic(
  () => import("react-data-table-component-extensions"),
  { ssr: false }
);
import "react-data-table-component-extensions/dist/index.css";
import LoadingSpinner from "../../../Loader";
import Filter from "./Filter";

const CardComponent = ({
  tableData,
  filter = false,
  columns,
  defaultSortAsc = true,
  striped = true,
  handleSort,
  total,
  countPerPage,
  paginationComponentOptions,
  setCountPerPage,
  setPage,
  fixedHeaderScrollheight = "450px",
  pending,
  setFilter,
  search,
  handleSearch,
  setIsFilterOpen,
  fetchListings,
}) => {
  return (
    <>
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
          <DataTableExtensions {...tableData} filter={filter}>
            <DataTable
              columns={columns}
              defaultSortAsc={defaultSortAsc}
              striped={striped}
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
              fixedHeaderScrollheight={fixedHeaderScrollheight}
              selectableRowsHighlight
              subHeader
              progressPending={pending}
              progressComponent={<LoadingSpinner />}
              subHeaderComponent={
                <>
                  <Filter
                    search={search}
                    handleSearch={handleSearch}
                    setIsFilterOpen={setIsFilterOpen}
                    filter={filter}
                    setFilter={setFilter}
                    fetchListings={fetchListings}
                  />
                </>
              }
            />
          </DataTableExtensions>
        </Card.Body>
      </Card>
    </>
  );
};

export default CardComponent;
