import React from "react";
import Link from "next/link";
import { Card, FormGroup, Form, Collapse } from "react-bootstrap";

const Filter = ({
  search,
  handleSearch,
  isFilterOpen,
  setIsFilterOpen,
  filter,
  setFilter,
}) => {
  return (
    <>
      <div>
        <div className="table-filter-search">
          <div className="input-filter-div01">
            <input
              type="text"
              className="filter-text"
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
            />
            <div className="filter-action01">
              <a
                className={`filter-link01 ${isFilterOpen ? "" : "collapsed"}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                role="button"
                aria-expanded={isFilterOpen}
              >
                <i className="fa fa-filter font-17 ml-2" />
              </a>
            </div>
          </div>
        </div>
        <Collapse in={isFilterOpen}>
          <div className="row collapse-content01" id="collapseFilter">
            <div lg={12} md={12}>
              <Card className="custom-card">
                <Card.Body className="border b-radious-11">
                  <div className="row p-3">
                    <FormGroup className="form-group col-md-6">
                      <Form.Label className="tx-medium">
                        Approval Status
                      </Form.Label>
                      <select
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            ["approval_status"]: e.target.value,
                          })
                        }
                        className={"form-control"}
                        name="approval_status"
                        value={filter.approval_status}
                      >
                        <option value="">--Select--</option>
                        <option value={1}>Approved</option>
                        <option value={0}>Pending</option>
                      </select>
                    </FormGroup>
                    <FormGroup className="form-group col-md-6">
                      <Form.Label className="tx-medium">
                        Active Status
                      </Form.Label>
                      <select
                        onChange={(e) =>
                          setFilter({
                            ...filter,
                            ["active_status"]: e.target.value,
                          })
                        }
                        className={"form-control"}
                        name="active_status"
                        value={filter.active_status}
                      >
                        <option value="">--Select--</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </FormGroup>

                    <div className="col-md-12 text-end">
                      <Link
                        href="#"
                        className="btn btn-light  me-2"
                        onClick={() => {
                          setIsFilterOpen(false);
                          setFilter(obj);
                          fetchListings(0);
                        }}
                      >
                        Cancel
                      </Link>
                      <Link
                        href="#!"
                        className="btn btn-success"
                        onClick={() => fetchListings(1)}
                      >
                        Submit
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Filter;
