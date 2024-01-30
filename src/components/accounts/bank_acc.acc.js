import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
// import Customer from "./customer.sales";

const Bank_Account = ({ ToggleAlert }) => {
  //forget user
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  var user_id = user._id;

  //data from api
  const [data, setData] = useState([]); //for specific data though pages
  const [data1, setData1] = useState(); // for get lenght of pagination data
  const [all_data, setall_data] = useState([]); //for get all data

  //for toggle  (filter data)
  const [filter, setfilter] = useState(false); //filter
  const [date, setdate] = useState(false); //date
  const [price, setprice] = useState(false); //price
  const [customer, setcustomer] = useState(false); //customer
  const [qoutation_id, setqoutation_id] = useState(false); //qoutation

  //for set filter data in state
  const [search, setsearch] = useState("");
  const [curr_date, setcurr] = useState("");
  const [due_date, setdue] = useState("");
  const [start_price, setstart_price] = useState("");
  const [end_price, setend_price] = useState("");
  const [qoutation_value, setqoutation_value] = useState(0);

  // for checkbox
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [istotoal, setistotoal] = useState([0, 0]);

  //for paginatioon
  const [pagination, setpagination] = useState(1);
  const [recived, setrecived] = useState(1);
  const [invoice_id, setinvoice_id] = useState(1);
  const [recived_amount, setrecived_amount] = useState(1);

  const [net_amount, setnet_amount] = useState(1);


  const [deposit_amount, setdeposit_amount] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);



  useEffect(() => {
    show(pagination);
  }, []);

  const filterdata = (val) => {
    if (customer && search != "") {
      return val.bank_name.toLowerCase().includes(search);
    }
    // else if (price && start_price != "" || end_price != "") {
    //   return val.price >= start_price && val.price <= end_price;
    // }
    // else if (date && curr_date != "" || due_date != "") {
    //   return val.curr_date >= curr_date && val.curr_date <= due_date;
    // }
    // else if (qoutation_id && qoutation_value != "") {
    //   return val.invoice == qoutation_value;
    // }
    else {
      return val;
    }
  };

  const paginate = (value) => {
    setpagination(value);
    show(value);
  };

  const update_recivedAmount = (val) => {
    console.log(val);
    setrecived(val.amount);
    // setnet_amount(val.net);
    setinvoice_id(val._id);
  }

  const handleSubmitRecived = async (e) => {
    e.preventDefault()
    setLoader(true)
    const modal_cancel = document.getElementById("modal_cancel");
    console.log(recived);


    try {
      const url = `${process.env.REACT_APP_API_URL}/accounts/bank_account/checkBank?id=${invoice_id}&amount=${recived_amount}`;
      const response = await axios.post(url, user_id);
      show(1);
      modal_cancel.click();
      document.getElementById("amount").value = "";
      setLoader(false);
      setTimeout(() => {
        ToggleAlert("Success", "updated successfully");
      }, 1000);
    }
    catch (error) {
      console.log(error)
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        console.log(error.response.data.message)
      }
    }


  }


  const show = (value) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/bank_account/getbankaccountpage?page=${value}&id=${user_id}`)
      .then((response) => {
        setData(response.data.items);
        if (response.data.items.length === 0) {
          ToggleAlert("Warning", "No Records Found");
        }
        setloader_val(false);
        setData1(response.data.pagination.q);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/bank_account?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setall_data(response.data);
      });
  };

  const approved_delete = (value) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/sales/invoice/deleteinvoicearray?id=${value}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setIsCheck([]);
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

  //approved for delete
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
      const url = `${process.env.REACT_APP_API_URL}/accounts/bank_account/delete?id=${id}`;
      const response = await axios.delete(url);
      // console.log(response);
      // ToggleAlert("Success", "Entry Deleted Successfully");
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
                        Add Amount Received/Withdrawed
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
                        <div className="col-md-6">
                          <label htmlFor="validationCustom026" className="h6">
                            Current Bank Balance
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

                        <div className="col-md-12 my-4">
                          <label htmlFor="validationCustom026" className="h6">
                            {deposit_amount ? "Cash Deposit" : "Cash Withdraw"}
                          </label>
                          <div className="input-group">
                            <input
                              type="Number"
                              name="amount"
                              id="amount"
                              className="form-control"
                              placeholder={
                                deposit_amount
                                  ? "Enter amount to deposit"
                                  : "Enter amount to withdraw"
                              }
                              onChange={(e) =>
                                setrecived_amount(
                                  deposit_amount
                                    ? parseInt(recived) + parseInt(e.target.value)
                                    : parseInt(recived) - parseInt(e.target.value)
                                )
                              }
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
                        class="btn btn-success mb-2 px-md-4 p-2 mr-2"
                        style={styles.btnRadius}
                        data-dismiss="modal"
                        id="modal_cancel"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary mb-2 px-md-4 p-2 mr-2"
                        style={styles.btnRadius}
                        onClick={() => setdeposit_amount(!deposit_amount)}
                      >
                        {deposit_amount ? "Cash Deposit" : "Cash Withdraw"}
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
            {/* ExpoBird */}

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">Bank Account</h4>
                <Link to="/accounts/add_bank_account" className="text-center">
                  <button
                    className="btn btn-md btn-success p-2 p-md-3"
                    style={styles.btnRadius}
                  >
                    + Add Bank Account
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
                    class={customer === true ? "btn btn-success" : "btn btn-light"}
                    onClick={() => setcustomer(!customer)}
                    style={styles.btnRadius}
                  >
                    Bank
                  </button>
                </div>
              </div>

              <div className={customer === true ? "form-group row" : "d-none"}>
                <div className="col-sm-4">
                  <label htmlFor="validationCustom01" className="h6">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="search customer"
                    name="search"
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Enter bank name"
                    required
                    style={styles.uiInput}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
              {/* table table-striped */}
              <table
                className="table table-striped "
                id="quotation-table-to-xls"
                style={styles.table_font}
              >
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Account Name</th>
                    <th scope="col">Bank Account title</th>
                    <th scope="col">Bank Account Number</th>
                    <th scope="col">Bank</th>
                    <th scope="col">Branch</th>
                    <th scope="col">Balance</th>
                    <th scope="col">Edit Balance</th>
                    {/* <th scope="col">Description</th> */}
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
                            <td scope="row">
                              {/* <input
                          type="checkbox"
                          id={val._id}
                          key={val._id}
                          name="check"
                          onClick={handleClick}
                          isChecked={isCheck.includes(val._id)}
                        /> */}
                            </td>
                            <td>{val.account_name}</td>
                            <td>{val.bank_account_title}</td>
                            <td>{val.bank_account_number}</td>
                            <td>{val.bank_name}</td>
                            <td>{val.branch_name}</td>
                            <td>{val.amount}</td>
                            <td>
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
                            {/* <td>{val.description}</td> */}

                            {/* <td> */}
                            {/* onClick={() => delete_data(val._id)} */}
                            {/* <button className="btn btn-light" onClick={() => delete_data(val._id)} style={{ "color": "red" }}>
                          <i
                            className="fa fa-trash">
                          </i>
                        </button> */}
                            {/* </td> */}
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
                <td></td>
                <th>Total</th>

                <td>PKR {Math.round(istotoal[0])}</td>
                <td>PKR {Math.round(istotoal[1])}</td>




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

export default Bank_Account;























