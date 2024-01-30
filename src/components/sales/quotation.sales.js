import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
// import Customer from "./customer.sales";
import ReactHTMLTableToExcel from "react-html-table-to-excel";


const Quotation = ({ ToggleAlert }) => {

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
      return val.customer.name.toLowerCase().includes(search);
    }
    else if (price && start_price != "" || end_price != "") {
      return val.price >= start_price && val.price <= end_price;
    }
    else if (date && curr_date != "") {
      return val.curr_date == curr_date;
    }
    else if (qoutation_id && qoutation_value != "") {
      return val.qoutation_number == qoutation_value;
    } else {
      return val;
    }
  }

  const paginate = (value) => {
    setpagination(value);
    show(value);
  }

  const show = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/qoutation/Getqoutation?page=${value}&id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setData(response.data.items);
      setData1(response.data.pagination.q);
      setistotoal(calculationtotal(response.data.items));
      setloader_val(false);
    })

    axios.get(`${process.env.REACT_APP_API_URL}/qoutation?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setall_data(response.data);
      if (response.data.length === 0) {
        ToggleAlert("Warning", "No Record Found")
      }
    })


  }

  const calculationtotal = (value) => {
    let total_net = 0;
    let total_recive = 0;
    value.map((val, index) => {
      total_net = total_net + val.net;
      total_recive = total_recive + val.receive;

    })
    // console.log([total_net,total_recive]);
    return [total_net, total_recive];
  }

  const approved = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/qoutation/putqoutation?page=${value}`, {
      'user_id': user_id
    }).then((response) => {
      show(1);
    })
  }

  const approved_delete = (value) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/qoutation/deleteqoutation?id=${value}`, {
      'user_id': user_id
    }).then((response) => {
      show(1);
    })
  }
  //approved button working
  const selectall = [];
  const select_all = e => {
    console.log("select all");
    if (all_data.length == 0) {
      alert("You Have No data");
    } else {
      all_data.map((val, index) => {
        selectall.push(val._id)
      })
      //function
      approved(selectall);

    }
    // console.log(data);
  }

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

  const selectitem = [];
  const select_item_page = e => {
    console.log("select page item");
    if (data.length == 0) {
      alert("You Have No data");
    } else {
      data.map((val, index) => {
        selectitem.push(val._id)
      })
      //function
      approved(selectitem);
    }

  }

  //approved for delete
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

  // const [isCheck, setIsCheck] = useState([]);
  // const [isCheckAll, setIsCheckAll] = useState(false);

  const select_item = e => {
    console.log("select page item");
    // data.map((val, index) => {
    //   console.log(val._id)
    // })
    if (isCheck.length == 0) {
      alert("Please Select items")
    } else {
      setIsCheck([]);
      approved(isCheck);

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
      const url = `${process.env.REACT_APP_API_URL}/qoutation/delete?id=${id}`;
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

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">
                  Sales Quotation
                </h4>
                <Link to="/sales/add_quotation" className="text-center">
                  <button
                    className="btn btn-md btn-success p-2 p-md-3"
                    style={styles.btnRadius}
                  >
                    + Add Sales Quotation
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
                      setprice(false);
                      setqoutation_id(false);
                      setdate(false);
                    }}
                  >
                    <i className="fa fa-filter pr-2"></i>Filter
                  </button>
                </div>

                <div className="d-flex justify-content-end flex-md-row flex-column">
                  <div className="text-center mx-md-2 my-2 my-md-0">
                    <ReactHTMLTableToExcel
                      id="quotation-table-xls-button"
                      className="btn btn-md btn-primary p-2 p-md-3 btn_radius"
                      table="quotation-table-to-xls"
                      filename="Sales Quotations"
                      sheet="tablexls"
                      buttonText="Export to excel"
                    />
                  </div>

                  {/* approved select */}
                  <div className="dropdown text-center mx-md-2 my-2 my-md-0">
                    <div
                      className="dropdown-menu dropdown-menu-right p-3 shadow"
                      aria-labelledby="dropdownMenuButton1"
                      style={styles.nav_dropdown}
                    >
                      <a
                        className="dropdown-item h6 my-1"
                        href="#"
                        onClick={() => select_all()}
                        style={styles.drop_nav_link}
                      >
                        Approve all entries
                      </a>
                      <a
                        className="dropdown-item h6 my-1"
                        href="#"
                        onClick={() => select_item()}
                        style={styles.drop_nav_link}
                      >
                        Approve selected entries
                      </a>
                      <a
                        className="dropdown-item h6 my-1"
                        href="#"
                        onClick={() => select_item_page()}
                        style={styles.drop_nav_link}
                      >
                        Approve all entries of this page
                      </a>
                      {/* <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => delete_all()}
                    style={styles.drop_nav_link}
                  >
                    Delete all entries
                  </a>
                  <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => select_item_delete()}
                    style={styles.drop_nav_link}
                  >
                    Delete selected entries
                  </a>
                  <a
                    className="dropdown-item h6 my-1"
                    href="#"
                    onClick={() => select_item_delete_page()}
                    style={styles.drop_nav_link}
                  >
                    Delete all entries of this page
                  </a> */}
                    </div>
                  </div>

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
                    Customer
                  </button>
                  <button
                    type="button"
                    class={date === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setdate(toggle("date", date))}
                  >
                    Date
                  </button>

                  <button
                    type="button"
                    class={price === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setprice(toggle("price", price))}
                  >
                    Amount
                  </button>
                </div>
              </div>
              <div className={date === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="curr_date"
                    name="curr_date"
                    onChange={(e) => setcurr(e.target.value)}
                    aria-describedby="inputGroupAppend"
                    defaultValue={getdate()}
                    style={styles.uiInput}
                    required
                  />
                </div>
                {/* <div className="col-sm-4">
              <input
                type="date"
                className="form-control"
                id="due_date"
                name="due_date"
                onChange={(e) => setdue(e.target.value)}
                aria-describedby="inputGroupAppend"
                required
              />
            </div> */}
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
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
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
                    style={styles.uiInput}
                    name="end_price"
                    onChange={(e) => setend_price(e.target.value)}
                    placeholder="Enter amount"
                    aria-describedby="inputGroupAppend"
                    required
                  />
                </div>
              </div>

              <div
                className={qoutation_id === true ? "form-row" : "d-none"}
                style={{ marginBottom: "15px" }}
              >
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Qoutation ID
                  </label>
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroupAppend">
                        SQ
                      </span>
                    </div>
                    <input
                      type="Number"
                      onChange={(e) => setqoutation_value(e.target.value)}
                      className="form-control"
                      style={styles.uiInputGroupRight}
                      placeholder="Enter qoutation ID"
                    />
                  </div>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    style={styles.uiInput}
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Enter customer name"
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
                    {/* <th scope="col"></th> */}
                    <th scope="col">SI - ID</th>
                    <th scope="col">Customer</th>
                    {/* <th scope="col">Rate</th> */}
                    {/* <th scope="col">Quantity</th> */}
                    {/* <th scope="col">Discount</th> */}
                    <th scope="col">Amount</th>
                    <th scope="col">Due Date</th>
                    {/* <th scope="col">Date</th> */}
                    <th scope="col">Download</th>
                    {/* <th scope="col">Delete</th> */}
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
                        // val.customer &&
                        <>
                          <tr key={index}>
                            {/* <td scope="row">
                          <input
                            type="checkbox"
                            id={val._id}
                            key={val._id}
                            name="check"
                            onClick={handleClick}
                            isChecked={isCheck.includes(val._id)}
                          />
                        </td> */}
                            <td>SI-{val.invoice}</td>
                            <td>{val.customer.name}</td>
                            {/* <td>PKR {val.price.toLocaleString()}</td> */}
                            {/* <td>{val.quantity}</td> */}
                            {/* <td>{val.discount}%</td> */}
                            <td>PKR {Math.round(val.net).toLocaleString()}</td>
                            <td>{val.due_date}</td>
                            {/* <td>{val.curr_date}</td> */}
                            <td>
                              <Link to={`/sales/quotation/${val._id}`}>
                                <button className="btn btn-primary">
                                  <i class="fa fa-download"></i>
                                </button>
                              </Link>
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
                {/* <tfoot className={filter != true ? "table-light" : "d-none"}>
              <tr>
                <td></td>
                <th>Total</th>
                <td>PKR {Math.round(istotoal[1]).toLocaleString()}</td>
                <td>PKR {Math.round(istotoal[0]).toLocaleString()}</td>
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
}

export default Quotation;