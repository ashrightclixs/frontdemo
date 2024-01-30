

import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
import ReactHTMLTableToExcel from "react-html-table-to-excel";

// import Customer from "./customer.sales";

const Tax = ({ ToggleAlert }) => {

  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  var user_id = user._id;

  //data from api 
  const [data, setData] = useState([]); //for specific data though pages
  const [data1, setData1] = useState(); // for get lenght of pagination data
  const [all_data, setall_data] = useState([]); //for get all data


  //for toggle  (filter data)
  const [filter, setfilter] = useState(false);  //filter
  const [customer, setcustomer] = useState(false); //customer

  //for set filter data in state
  const [search, setsearch] = useState("");

  //for paginatioon 
  const [pagination, setpagination] = useState(1);

  const [loader_val, setloader_val] = useState(true);


  useEffect(() => {
    show(pagination);
  }, []);


  const filterdata = (val) => {
    if (customer && search != "") {
      return val.description.toLowerCase().includes(search);
    } else {
      return val;
    }
  }

  const paginate = (value) => {
    setpagination(value);
    show(value);
  }

  const show = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/tax/gettaxpage?page=${value}&id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setData(response.data.items);
      setData1(response.data.pagination.q);
      setloader_val(false);
    })
    axios.get(`${process.env.REACT_APP_API_URL}/tax?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setall_data(response.data);
      if (response.data.length === 0) {
        ToggleAlert("Warning", "No Record Found")
      }
    })
  }


  // const delete_data = async (id) => {

  //   try {
  //     const url = `${process.env.REACT_APP_API_URL}/tax/delete?id=${id}`;
  //     const response = await axios.delete(url);
  //     // console.log(response);
  //     ToggleAlert("Success", "Entry Deleted Successfully");
  //     show();
  //   }
  //   catch (error) {
  //     // console.log(error)
  //     if (error.response && error.response.status >= 400 && error.response.status <= 500) {
  //       console.log(error.response.data.message)
  //     }
  //   }

  // }

  const toggle = (data, value) => {
    setcustomer(data === "customer" ? value : false);
    return !value;
  }


  return (
    <>
      {loader_val === true && (
        <>
          <div style={{ textAlign: "center", marginTop: "10rem" }}>
            <div class="spinner-border" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}

      {loader_val === false && (
        <>
          <div className="main-card">
            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">Tax</h4>
                <Link to="/sales/add_tax" className="text-center">
                  <button
                    className="btn btn-md btn-success p-2 p-md-3"
                    style={styles.btnRadius}
                  >
                    + Add Tax
                  </button>
                </Link>
              </div>
              <div className="d-flex justify-content-between flex-row my-2 py-3">
                <div className="text-center my-2 my-md-0 order-first">
                  <button
                    className="btn btn-md btn-primary p-2 p-md-3"
                    style={styles.btnRadius}
                    onClick={() => {
                      setfilter(!filter);
                      setcustomer(false);
                    }}
                  >
                    <i className="fa fa-filter pr-2"></i>Filter
                  </button>
                </div>

                <div className="d-flex justify-content-end flex-md-row flex-column">
                  <div className="text-center my-2 my-md-0">
                    <ReactHTMLTableToExcel
                      id="tax-table-xls-button"
                      className="btn btn-md btn-primary p-2 p-md-3 btn_radius"
                      table="tax-table-to-xls"
                      filename="All Tax Percentages"
                      sheet="tablexls"
                      buttonText="Export to excel"
                    />
                  </div>
                </div>
              </div>

              {/* data-toggle="modal"
                data-target="#filter_quotation" */}
              <div
                className={
                  filter == true
                    ? "d-flex justify-content-between flex-md-row flex-column my-2 py-3"
                    : "d-none"
                }
              >
                <div className="text-center my-2 my-md-0 order-last order-md-first">
                  <button
                    type="button"
                    class={customer === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.btnRadius}
                    onClick={() => setcustomer(toggle("customer", customer))}
                  >
                    Tax
                  </button>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Tax Name/Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Search by tax type"
                    required
                    style={styles.uiInput}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-2 pb-2">
              <table
                className="table table-striped"
                id="tax-table-to-xls"
                style={{ fontSize: "12px" }}
              >
                <thead>
                  <tr>
                    <th scope="col">Tax Type</th>
                    <th scope="col">Tax Percent</th>
                    {/* <th scope="col">Delete</th> */}
                    {/* <th scope="col">Gross Amount</th>
                  <th scope="col">Net Amount </th>
                  <th scope="col">Status</th>*/}
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data
                      .filter((val) => {
                        return filter ? filterdata(val) : val;
                      })
                      .map((val, index) => (
                        <tr key={index}>
                          {/* style={{ fontWeight:"bolder",
                  fontSize:"13px"}}  */}
                          <td>{val.description}</td>
                          <td>{val.value}%</td>
                          {/* <td>
                        <button
                          className="btn btn-light"
                          onClick={() => delete_data(val._id)}
                          style={{ color: "red" }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td> */}
                          {/* <td>Otto</td>
                  <td>@mdo</td>
                  <td>Mark</td>
                  <td>Otto</td> */}
                        </tr>
                      ))}
                </tbody>
              </table>
              <nav aria-label="Page navigation example" style={{}}>
                <ul class="pagination">
                  {data1 != 0 ? (
                    (() => {
                      let pages = [];
                      for (let i = 1; i < data1 + 1; i++) {
                        pages.push(
                          <li class="page-item">
                            <span
                              class="page-link"
                              style={{ cursor: "pointer" }}
                              onClick={() => paginate(i)}
                            >
                              {i}
                            </span>
                          </li>
                        );
                      }
                      return pages;
                    })()
                  ) : (
                    <li class="page-item">
                      <span class="page-link" style={{ cursor: "pointer" }}>
                        1
                      </span>
                    </li>
                  )}

                  {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">Next</a></li> */}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Tax;

























