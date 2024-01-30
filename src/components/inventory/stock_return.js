import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
// import Customer from "./customer.sales";

const StockReturn = ({ ToggleAlert }) => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState();

  const [filter, setfilter] = useState(false);

  const [date, setdate] = useState(false);
  const [price, setprice] = useState(false);
  const [customer, setcustomer] = useState(false);

  const [search, setsearch] = useState("");

  const [curr_date, setcurr] = useState("");
  const [due_date, setdue] = useState("");

  const [start_price, setstart_price] = useState("");
  const [end_price, setend_price] = useState("");
  const [qoutation_value, setqoutation_value] = useState(0);

  const [qoutation_id, setqoutation_id] = useState("");

  const { user } = useContext(AuthContext);
  // const [deletequotation, setdeletequotation] = useState(false);

  const [debitquotation, setdebitquotation] = useState(0);
  const [creditquotation, setcreditquotation] = useState(0);

  // for checkbox
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [istotoal, setistotoal] = useState([0, 0]);

  const [pagination, setpagination] = useState(1);

  const [searchParams] = useSearchParams();

  const [select_itempage, setselect_itempage] = useState([]);
  const [all_data, setall_data] = useState([]);
  const [loader_val, setloader_val] = useState(true);

  let Arr = [];
  // const [ error , seterror ] =  useState(false);

  // const { modal, setModal } = useState(false);
  var user_id = user._id;

  useEffect(() => {
    show(pagination);
  }, []);

  const filterdata = (val) => {
    if (customer && search != "") {
      return val.stock.stock_inventory_name.toLowerCase().includes(search);
    } else if ((price && start_price != "") || end_price != "") {
      return val.price >= start_price && val.price <= end_price;
    } else if ((date && curr_date != "") || due_date != "") {
      return val.date >= curr_date && val.date <= due_date;
    } else if (qoutation_id && qoutation_value != "") {
      return val.return_no == qoutation_value;
    } else {
      return val;
    }
  };

  const paginate = (value) => {
    setpagination(value);
    show(value);
  };

  const show = (value) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_adj/getstockAdjpage?page=${value}&id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setData(response.data.items);
        setData1(response.data.pagination.q);
        setistotoal(calculationtotal(response.data.items));
        setloader_val(false);

      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_adj?id=${user_id}`,
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

  const calculationtotal = (value) => {
    let total_net = 0;
    let total_recive = 0;
    value.map((val, index) => {
      total_net = total_net + val.net;
      total_recive = total_recive + val.received;
    });
    // console.log([total_net,total_recive]);
    return [total_net, total_recive];
  };

  const approved_delete = (value) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/inventory/stock_adj/deletestockadjarray?id=${value}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        show(1);
      });
  };
  //approved button working

  //approved for delete
  const deleteall = [];
  const delete_all = (e) => {
    console.log("select all");
    if (all_data.length == 0) {
      alert("You Have No data");
    } else {
      all_data.map((val, index) => {
        deleteall.push(val._id);
      });
      //function
      approved_delete(deleteall);
    }
    // console.log(data);
  };

  //approved for delete
  const select_delete_item = [];
  const select_item_delete_page = (e) => {
    console.log("select page item");
    if (data.length == 0) {
      alert("You Have No data");
    } else {
      data.map((val, index) => {
        select_delete_item.push(val._id);
      });
      //function
      approved_delete(select_delete_item);
    }
  };

  const select_item_delete = (e) => {
    console.log("select page item");
    // data.map((val, index) => {
    //   console.log(val._id)
    // })
    if (isCheck.length == 0) {
      alert("Please Select items");
    } else {
      approved_delete(isCheck);
    }
  };

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }

  const delete_data = async (id) => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_adj/delete?id=${id}`;
      const response = await axios.delete(url);
      // console.log(response);
      ToggleAlert("Success", "Entry Deleted Successfully");
      show();
    } catch (error) {
      // console.log(error)
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
      }
    }
  };

  const toggle = (data, value) => {
    setprice(data === "price" ? value : false);
    setdate(data === "date" ? value : false);
    setcustomer(data === "customer" ? value : false);
    setqoutation_id(data === "qoutation_id" ? value : false);
    return !value;
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

            {/* <div className={ data.length === 0 ?  "alert alert-warning alert-dismissible fade show"  : "d-none"  } role="alert">
          <strong>Are You Sure!</strong>You have no data .
          { !error && <i className="fa fa-trash" style={{float: "right"}}  aria-hidden="true"></i>}
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div> */}

            {/* ExpoBird */}

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">Stock Return</h4>
                <div className="d-flex justify-content-end flex-md-row flex-column">
                  <Link to="/inventory/add_stock_return" className="text-center">
                    <button
                      className="btn btn-md btn-success p-2 p-md-3"
                      style={styles.btnRadius}
                    >
                      + Add Stock Return
                    </button>
                  </Link>
                </div>
              </div>
              <div className="d-flex justify-content-between flex-row my-2 py-3">
                <div className="text-center my-2 my-md-0 order-first">
                  <button
                    className="btn btn-md btn-primary p-2 p-md-3"
                    style={styles.btnRadius}
                    onClick={() => {
                      setfilter(!filter);
                      setcustomer(false);
                      setprice(false);
                      setqoutation_id(false);
                      setdate(false);
                    }}
                  >
                    <i className="fa fa-filter pr-2"></i>Filter
                  </button>
                </div>

                <div className="d-flex justify-content-end flex-md-row flex-column">
                  {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <button
                  className="btn btn-md btn-primary p-2 p-md-3"
                  style={styles.btnRadius}
                >
                  <i className="fa fa-print pr-2"></i>Print
                </button>
              </div> */}

                  {/* approved select */}
                  {/* <div className="dropdown text-center mx-md-2 my-2 my-md-0">
                <button
                  className="btn btn-primary btn-md p-2 p-md-3"
                  type="button"
                  id="dropdownMenuButton1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={styles.btnRadius}
                >
                  Bulk Actions<i class="fa fa-angle-down pl-2"></i>
                </button>
                <div
                  className="dropdown-menu dropdown-menu-right p-3 border-success border mt-2"
                  aria-labelledby="dropdownMenuButton1"
                  style={styles.nav_dropdown}
                >
                  <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => delete_all()}
                  >
                    Delete All Items
                  </a>
                  <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => select_item_delete()}
                  >
                    Delete Selected Items
                  </a>
                  <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => select_item_delete_page()}
                  >
                    Delete All items of this page
                  </a>
                </div>
              </div> */}

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
                  {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <ReactHTMLTableToExcel
                  id="quotation-table-xls-button"
                  className="btn btn-md btn-primary p-2 p-md-3"
                  table="quotation-table-to-xls"
                  filename="tablexls"
                  sheet="tablexls"
                  buttonText="Export to excel"
                />
                <button className="btn btn-md btn-primary p-2 p-md-3">
                    Export to excel
                  </button>
              </div> */}
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
                      qoutation_id === true ? "btn btn-success" : "btn btn-light"
                    }
                    style={styles.btnRadius}
                    onClick={() =>
                      setqoutation_id(toggle("qoutation_id", qoutation_id))
                    }
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    class={customer === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setcustomer(toggle("customer", customer))}
                  >
                    Product
                  </button>
                  <button
                    type="button"
                    class={date === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setdate(toggle("date", date))}
                  >
                    Between Dates
                  </button>

                  <button
                    type="button"
                    class={price === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setprice(toggle("price", price))}
                  >
                    Rate
                  </button>
                </div>
              </div>
              <div className={date === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom026" className="h6">
                    From Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="curr_date"
                    name="curr_date"
                    onChange={(e) => setcurr(e.target.value)}
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    defaultValue={getdate()}
                    required
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom026" className="h6">
                    To
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="due_date"
                    name="due_date"
                    onChange={(e) => setdue(e.target.value)}
                    style={styles.uiInput}
                    aria-describedby="inputGroupAppend"
                    required
                  />
                </div>
              </div>

              <div className={price === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Starting From
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id="start_price"
                    name="start_price"
                    onChange={(e) => setstart_price(e.target.value)}
                    style={styles.uiInput}
                    aria-describedby="inputGroupAppend"
                    placeholder="Enter product rate"
                    required
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    To
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id="end_price"
                    name="end_price"
                    onChange={(e) => setend_price(e.target.value)}
                    placeholder="Enter product rate"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    required
                  />
                </div>
              </div>

              <div
                className={qoutation_id === true ? "form-row" : "d-none"}
                style={{ marginBottom: "15px" }}
              >
                <div className="col-sm-4 mb-6">
                  <label htmlFor="validationCustom026" className="h6">
                    Stock Return ID
                  </label>
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroupAppend">
                        SI
                      </span>
                    </div>
                    <input
                      type="Number"
                      onChange={(e) => setqoutation_value(e.target.value)}
                      className="form-control"
                      placeholder="Enter stock return ID"
                      style={styles.uiInputGroupRight}
                    />
                  </div>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    style={styles.uiInput}
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-2 pb-2">
              {/* table table-striped */}
              <table
                className="table table-striped "
                id="quotation-table-to-xls"
                style={styles.table_font}
              >
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th>SR - ID</th>
                    <th>Purpose</th>
                    <th>Product</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Gross Amount</th>
                    <th>Amount Received</th>
                    <th>Date</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data
                      .filter((val) => {
                        return filter ? filterdata(val) : val;
                      })
                      .map((val, index) => (
                        // val.customer &&
                        <>
                          <tr key={index}>
                            <td scope="row">

                            </td>
                            <td>{`SR-${val.return_no}`}</td>
                            <td>{val.purpose}</td>
                            <td>{val.stock.stock_inventory_name}</td>
                            <td>{`PKR ${val.price.toLocaleString()}`}</td>
                            <td>{val.quantity}</td>
                            <td>{`PKR ${val.amount.toLocaleString()}`}</td>
                            <td>{`PKR ${val.received.toLocaleString()}`}</td>
                            <td>{val.date}</td>
                            <td>
                              {/* <button
                            className="btn btn-light"
                            onClick={() => delete_data(val._id)}
                            style={{ color: "red" }}
                          >
                            <i className="fa fa-trash"></i>
                          </button> */}
                            </td>
                          </tr>
                        </>
                      ))}
                </tbody>
                {/* <tfoot className={filter != true ? "table-light" : "d-none"}>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <th>Total</th>
                <td>PKR {Math.round(istotoal[1])}</td>
                <td>PKR {Math.round(istotoal[0])}</td>
              </tr>
            </tfoot> */}
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

export default StockReturn;