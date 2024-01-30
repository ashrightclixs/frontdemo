import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

// import Customer from "./customer.sales";

const StockSupplier = ({ ToggleAlert }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState();
  const [filter, setfilter] = useState(false);
  const nav = useNavigate();
  const [ID, setID] = useState("");
  const [customer, setcustomer] = useState(false);
  const [search, setsearch] = useState("");
  const { user } = useContext(AuthContext);
  // for checkbox
  const [isCheck, setIsCheck] = useState([]);
  const [all_data_check, setall_data_check] = useState([]);
  const [pagination, setpagination] = useState(1);
  const array1 = ["123", "123", "123322"];
  const [all_data, setall_data] = useState([]);
  const [loader_val, setloader_val] = useState(true);
  const [modal_Load, setModal_Load] = useState(false)
  var user_id = user._id;

  useEffect(() => {
    show(pagination);
  }, []);

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }
  const compare_dates = (date1, date2) => {
    const date2_value = getdate();
    if (date1 > date2_value) {
      return "none";
    } else if (date1 < date2_value) {
      return "red";
    } else {
      return "none";
    }
  };

  const paginate = (value) => {
    setpagination(value);
    show(value);
  };

  const show = (value) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_supplier/getsupplierpage?page=${value}&id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setData(response.data.items);
        setData1(response.data.pagination.q);
        setloader_val(false);
      });
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_supplier?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setall_data(response.data);

        if (response.data.length === 0) {
          ToggleAlert("Warning", "No Record Found");
        }
      });
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const check_Availability = (val) => {
    // console.log(val._id);
    setModal_Load(true)
    setID(val._id);

    axios.get(`${process.env.REACT_APP_API_URL}/inventory/stock_inventory/stocksupplier_value?id=${val._id}`, {
      'user_id': user_id
    }).then((response) => {
      setall_data_check(response.data);
      setModal_Load(false)
    });
  };

  const Navigate = () => {
    const close_modal = document.getElementById("close_modal");
    close_modal.click();

    all_data_check.length > 0
      ? nav(`/sales/customer/pdf/${ID}`)
      : ToggleAlert("Warning", "No invoice for this customer");
  };

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
            {/* <div className={data.length === 0 ? "alert alert-warning alert-dismissible fade show" : "d-none"} role="alert">
          <strong>No Records Found</strong>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> */}
            <div
              class="modal fade"
              id="CustomerModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      Supplier Purchases
                    </h5>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div className="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Inventory Name</th>
                            <th scope="col">Inventory SKU</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Amount </th>
                          </tr>
                        </thead>
                        <tbody>
                          {modal_Load ? (
                            <div
                              style={{
                                textAlign: "center",
                                margin: "4rem 10rem",
                              }}
                            >
                              <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                              </div>
                            </div>
                          ) : (
                            all_data_check.map((value, index) => (
                              <tr key={index}>
                                {/* compare_dates */}
                                <th scope="row">{index + 1}</th>
                                <td>{value.stock_inventory_name}</td>
                                <td>{value.sku}</td>
                                <td>{value.quantity}</td>
                                <td>{value.amount}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      className="btn px-md-4 p-2 btn-primary mb-2 ml-2"
                      style={styles.btnRadius}
                      data-dismiss="modal"
                      id="close_modal"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">
                  Stock Supplier
                </h4>
                <Link
                  to="/inventory/add_stock_supplier"
                  className="text-center"
                >
                  <button
                    className="btn btn-md btn-success p-2 p-md-3"
                    style={styles.btnRadius}
                  >
                    + Add Stock Supplier
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
                  <div className="text-center mx-md-2 my-2 my-md-0">
                    <ReactHTMLTableToExcel
                      id="customer-table-xls-button"
                      className="btn btn-md btn-primary p-2 p-md-3 btn_radius"
                      table="customer-table-to-xls"
                      filename="Supplier"
                      sheet="tablexls"
                      buttonText="Export to excel"
                    />
                  </div>

                  {/* approved select */}

                  <div className="text-center my-2 my-md-0">
                    <button
                      className="btn btn-md btn-success p-2 p-md-3"
                      style={styles.btnRadius}
                      onClick={() => window.location.reload()}
                    >
                      <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
                    </button>
                  </div>

                  {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <button className="btn btn-md btn-primary p-2 p-md-3"
                  onClick={approved}>
                  Approve selected Quotation
                </button>
              </div> */}
                  {/* <div className="text-center mx-md-2 my-2 my-md-0"> */}

                  {/* <button className="btn btn-md btn-primary p-2 p-md-3">
                    Export to excel
                  </button> */}
                  {/* </div> */}
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
                    class={
                      customer === true ? "btn btn-success" : "btn btn-light"
                    }
                    onClick={() => setcustomer(!customer)}
                    style={styles.btnRadius}
                  >
                    Supplier
                  </button>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Search by supplier name"
                    required
                    style={styles.uiInput}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-2 pb-2">
              <table
                className="table table-striped"
                id="customer-table-to-xls"
                style={{ fontSize: "12px" }}
              >
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Company/Shop</th>
                    <th scope="col">Address</th>
                    <th scope="col">Email</th>
                    <th scope="col">Contact</th>
                    <th scope="col">Dues</th>
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
                        return filter
                          ? search != 0
                            ? val.name.toLowerCase().includes(search)
                            : val
                          : val;
                      })
                      .map((val, index) => (
                        <tr key={index}>
                          <th scope="row"></th>
                          {/* style={{ fontWeight:"bolder",
                  fontSize:"13px"}}  */}
                          <td>{val.name}</td>
                          <td>{val.company}</td>
                          <td>{val.address}</td>
                          <td>{val.email}</td>
                          <td>{val.contact}</td>
                          <td>
                            <button
                              className="btn btn-light"
                              data-toggle="modal"
                              data-target="#CustomerModal"
                              style={{ color: "green" }}
                              onClick={() => check_Availability(val)}
                            >
                              <i className="fa fa-eye"></i>
                            </button>
                          </td>
                          {/* <td>
                        <button
                          data-toggle="modal"
                          data-target="#DeleteAlert"
                          className="btn btn-light"
                          onClick={() => setDeleteID(val._id)}
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
};

export default StockSupplier;
