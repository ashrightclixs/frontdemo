import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
import ReactHTMLTableToExcel from "react-html-table-to-excel";

// import Customer from "./customer.sales";

const Purchases_Invoice = ({ ToggleAlert }) => {

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

  const array1 = ["123", "123", "123322"];

  const [select_itempage, setselect_itempage] = useState([]);
  const [all_data, setall_data] = useState([]);

  const [invoice_id, setinvoice_id] = useState(1);
  const [recived_amount, setrecived_amount] = useState(1);
  const [recived, setrecived] = useState(1);

  const [net_amount, setnet_amount] = useState(1);

  const [loader, setLoader] = useState(false);

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
      return val.product_name.toLowerCase().includes(search);
    }
    else if (price && start_price != "" || end_price != "") {
      return val.price >= start_price && val.price <= end_price;
    }
    else if (date && curr_date != "" || due_date != "") {
      return val.curr_date >= curr_date && val.curr_date <= due_date;
    }
    else if (qoutation_id && qoutation_value != "") {
      return val.invoice == qoutation_value;
    } else {
      return val;
    }
  }

  const paginate = (value) => {
    setpagination(value);
    show(value);
  }

  const show = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/purchase/invoice/getinvoicepage?page=${value}&id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setData(response.data.items);
      if (response.data.items.length === 0) {
        ToggleAlert("Warning", "No Records Found");
      }
      setData1(response.data.pagination.q);
      setistotoal(calculationtotal(response.data.items));
      setloader_val(false);
    })

    axios.get(`${process.env.REACT_APP_API_URL}/purchase/invoice?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setall_data(response.data);
      if (response.data.length === 0) {
        ToggleAlert("Warning", "No Record Found")


      }
    })

  }

  const handleSubmitRecived = async (e) => {
    console.log(net_amount, parseInt(recived_amount) + recived);

    e.preventDefault()
    setLoader(true)
    const modal_cancel = document.getElementById("modal_cancel");
    if (net_amount < (parseInt(recived_amount) + recived)) {
      setLoader(false)
      modal_cancel.click()
      ToggleAlert(
        "Warning",
        "Amount paid should not be greater than amount due"
      );
    } else {
      try {
        const url = `${process.env.REACT_APP_API_URL}/purchase/invoice/check_Invoice_purchase?id=${invoice_id}&recived_money=${recived_amount}`;
        const response = await axios.post(url, user_id);
        setLoader(false);
        show(1);
        modal_cancel.click();
        setTimeout(() => {
          ToggleAlert("Success", "Invoice updated successfully");
        }, 1000);
      } catch (error) {
        console.log(error);
        setLoader(false);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.log(error.response.data.message);
        }
      }
    }
  }

  const calculationtotal = (value) => {
    let total_net = 0;
    let total_recive = 0;
    value.map((val, index) => {
      total_net = total_net + (val.net - val.received);
      total_recive = total_recive + val.received;

    })
    // console.log([total_net,total_recive]);
    return [total_net, total_recive];
  }



  const approved_delete = (value) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/purchase/invoice/deleteinvoicearray?id=${value}`, {
      'user_id': user_id
    }).then((response) => {
      show(1);
    })
  }
  //approved button working


  //approved for delete
  const deleteall = [];
  const delete_all = e => {
    console.log("select all");
    if (all_data.length == 0) {
      alert("You Have No data");
    } else {
      all_data.map((val, index) => {
        deleteall.push(val._id)
      })
      //function
      approved_delete(deleteall);

    }
    // console.log(data);
  }

  //approved for delete
  const select_delete_item = [];
  const select_item_delete_page = e => {
    console.log("select page item");
    if (data.length == 0) {
      alert("You Have No data");
    } else {
      data.map((val, index) => {
        select_delete_item.push(val._id)
      })
      //function
      approved_delete(select_delete_item);
    }

  }




  const select_item_delete = e => {
    console.log("select page item");
    // data.map((val, index) => {
    //   console.log(val._id)
    // })
    if (isCheck.length == 0) {
      alert("Please Select items")
    } else {
      approved_delete(isCheck);

    }

  }



  const handleClick = e => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  };


  function getdate() {
    const date = new Date()
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const full_date = [year, month, day].join('-');
    return full_date;
  }



  const delete_data = async (id) => {

    try {
      const url = `${process.env.REACT_APP_API_URL}/purchase/invoice/delete?id=${id}`;
      const response = await axios.delete(url);
      // console.log(response);
      ToggleAlert("Success", "Entry Deleted Successfully");
      show();
    }
    catch (error) {
      // console.log(error)
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.log(error.response.data.message)
      }
    }

  }

  const update_recivedAmount = (val) => {
    console.log(val);
    setrecived(val.received);
    setnet_amount(val.net);
    setinvoice_id(val._id);
  }

  const toggle = (data, value) => {
    setprice(data === "price" ? value : false);
    setdate(data === "date" ? value : false);
    setcustomer(data === "customer" ? value : false);
    setqoutation_id(data === "qoutation_id" ? value : false);
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

            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <form onSubmit={handleSubmitRecived}>
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Update Amount Paid
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
                      <div className="row">
                        <div className="col-md-6 mb-12">
                          <label htmlFor="validationCustom026" className="h6">
                            Previous Amount Paid
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="due_date"
                              // onChange={handleChange}
                              className="form-control"
                              value={`PKR ${recived.toLocaleString()}`}
                              style={styles.uiInput}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6 mb-12">
                          <label htmlFor="validationCustom026" className="h6">
                            Amount Due
                          </label>
                          <div className="input-group">
                            <input
                              type="text"
                              name="due_date"
                              // onChange={handleChange}
                              className="form-control"
                              value={`PKR ${(
                                net_amount - recived
                              ).toLocaleString()}`}
                              style={styles.uiInput}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-12 my-4">
                          <label htmlFor="validationCustom026" className="h6">
                            Recent Amount Paid
                          </label>
                          <div className="input-group">
                            <input
                              type="Number"
                              name="due_date"
                              className="form-control"
                              placeholder="Enter amount paid recently"
                              onChange={(e) => setrecived_amount(e.target.value)}
                              style={styles.uiInput}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        id="modal_cancel"
                        class="btn btn-success mb-2 px-md-4 p-2 mr-2"
                        data-dismiss="modal"
                        style={styles.btnRadius}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        class="btn btn-primary mb-2 px-md-4 p-2 mr-2"
                        style={styles.btnRadius}
                      >
                        {loader ? (
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Save"
                        )}
                      </button>
                      {/* <button type="submit" class="btn btn-primary">Save changes</button> */}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">All Purchases</h4>
                <div className="d-flex justify-content-end flex-md-row flex-column">
                  <Link to="/purchases/add_invoice" className="text-center">
                    <button
                      className="btn btn-md btn-success p-2 p-md-3"
                      style={styles.uiInput}
                    >
                      + Add Purchase Invoice
                    </button>
                  </Link>
                </div>
              </div>
              <div className="d-flex justify-content-between flex-row my-2 py-3">
                <div className="text-center my-2 my-md-0 order-first">
                  <button
                    className="btn btn-md btn-primary p-2 p-md-3"
                    style={styles.uiInput}
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
                  style={styles.uiInput}
                >
                  <i className="fa fa-print pr-2"></i>Print
                </button>
              </div> */}
                  <div className="text-center mx-md-2 my-2 my-md-0">
                    <ReactHTMLTableToExcel
                      id="purchases-table-xls-button"
                      className="btn btn-md btn-primary p-2 p-md-3 btn_radius"
                      table="purchases-table-to-xls"
                      filename="Purchases"
                      sheet="tablexls"
                      buttonText="Export to excel"
                    />
                  </div>

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
                      style={styles.uiInput}
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
                    Item
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
                    Price
                  </button>
                </div>
              </div>
              <div className={date === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom026" className="h6">
                    From Date issued
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
                    placeholder="Enter amount"
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
                    placeholder="Enter amount"
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
                    Purchase Invoice ID
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
                      placeholder="Enter purchase invoice ID"
                      style={styles.uiInputGroupRight}
                    />
                  </div>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Item purchased
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    style={styles.uiInput}
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Enter item name"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
              {/* table table-striped */}
              <table
                className="table table-striped "
                id="purchases-table-to-xls"
                style={styles.table_font}
              >
                <thead>
                  <tr>
                    <th scope="col">PI - ID</th>
                    {/* <th scope="col">Customer</th> */}
                    <th scope="col">Item</th>
                    {/* <th scope="col">Subject</th> */}
                    {/* <th scope="col">Ware_house</th> */}
                    <th scope="col">Rate</th>
                    <th scope="col">Quantity</th>
                    {/* <th scope="col">Discount</th> */}
                    {/* <th scope="col">Discription</th> */}
                    {/* <th scope="col">Tax</th> */}
                    {/* <th scope="col">reference</th> */}
                    <th scope="col">Amount Paid</th>
                    {/* <th scope="col">currency </th> */}
                    <th scope="col">Amount Due</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Download</th>
                    <th scope="col">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {/* val.customer.name.toLowerCase().includes(search) */}
                  {data &&
                    data
                      .filter((val) => {
                        return filter ? filterdata(val) : val;
                      })
                      .map((val, index) => (
                        <>
                          <tr key={index}>
                            <td>PI-{val.invoice}</td>
                            <td>{val.product_name}</td>
                            <td>{`PKR ${val.price.toLocaleString()}`}</td>
                            <td>{val.quantity}</td>
                            {/* <td>{val.discount}</td> */}
                            <td>{`PKR ${val.received.toLocaleString()}`}</td>
                            <td>{`PKR ${(
                              val.net - val.received
                            ).toLocaleString()}`}</td>
                            <td>{val.due_date}</td>
                            <td>
                              {Math.round(val.net) <= val.received ? (
                                <div
                                  className="btn btn-light"
                                  style={{ color: "green" }}
                                >
                                  <i class="fa fa-check" aria-hidden="true"></i>{" "}
                                </div>
                              ) : (
                                <div class="h6 p-2" style={{ color: "red" }}>
                                  <i class="fa fa-clock" aria-hidden="true"></i>
                                </div>
                              )}
                            </td>
                            <td>
                              <Link to={`/purchases/invoice/${val._id}`}>
                                <button className="btn btn-primary">
                                  <i class="fa fa-download"></i>
                                </button>
                              </Link>
                            </td>
                            <td>
                              {/* onClick={() => update_recivedAmount(val)} */}
                              <button
                                className="btn btn-light"
                                style={{ color: "green" }}
                                data-toggle="modal"
                                data-target="#exampleModal"
                                onClick={() => update_recivedAmount(val)}
                              >
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                              </button>
                            </td>
                            {/* <td>
                          <button
                            className="btn btn-light"
                            onClick={() => delete_data(val._id)}
                            style={{ color: "red" }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </td> */}
                          </tr>
                        </>
                      ))}
                </tbody>
                <tfoot className={filter != true ? "table-light" : "d-none"}>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <th>Total</th>

                    {/* {data && data.map((val, index) => (
                // val.customer && 
                <tr>
                  <td>PKR {val.receive}</td>
                  <td>PKR {val.receive}</td>
                 </tr>
               




              ))} */}
                    <td>PKR {Math.round(istotoal[1]).toLocaleString()}</td>
                    <td>PKR {Math.round(istotoal[0]).toLocaleString()}</td>
                  </tr>
                </tfoot>
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

export default Purchases_Invoice;;