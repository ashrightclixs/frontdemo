import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

// import Customer from "./customer.sales";

const J_Entry = ({ ToggleAlert }) => {
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

  var user_id = user._id;

  useEffect(() => {
    setloader_val(true);
    show(pagination);
  }, []);

  const filterdata = (val) => {
    if ((price && start_price != "") || end_price != "") {
      return (
        parseInt(val.amount) >= start_price && parseInt(val.amount) <= end_price
      );
    } else if (qoutation_id && qoutation_value != "") {
      return val.j_entry_no == qoutation_value;
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
        `${process.env.REACT_APP_API_URL}/accounts/journal_entry/get_journalentry_page?page=${value}&id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        console.log(response.data);
        setData(response.data.items);
        if (response.data.items.length === 0) {
          ToggleAlert("Warning", "No Records Found");
        }
        setData1(response.data.pagination.q);
        setloader_val(false);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/accounts/journal_entry?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setall_data(response.data);
        // if(response.data.length === 0){
        //   ToggleAlert("Warning","No Record Found")
        // }
      });
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
      const url = `${process.env.REACT_APP_API_URL}/accounts/journal_entry/delete?id=${id}`;
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
    // setdate(data === "date" ? value : false);
    // setcustomer(data === "customer" ? value : false);
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
            {/* ExpoBird */}

            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-row my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">
                  Journal Entry
                </h4>
                <div className="d-flex justify-content-end flex-md-row flex-column">
                  <Link
                    to="/accounts/add_journal_entry"
                    className="text-center"
                  >
                    <button
                      className="btn btn-md btn-success p-2 p-md-3"
                      style={styles.btnRadius}
                    >
                      + Add Journal Entry
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

                      setqoutation_id(false);
                      setdate(false);
                    }}
                  >
                    <i className="fa fa-filter pr-2"></i>Filter
                  </button>
                </div>

                <div className="d-flex justify-content-end flex-md-row flex-column">
                  {/* <div className="text-center mx-md-2 my-2 my-md-0">
                    <button className="btn btn-md btn-primary p-2 p-md-3" style={styles.btnRadius}>
                  <i className="fa fa-print pr-2"></i>Print
                </button>
                  </div> */}
                  <div className="text-center mx-md-2 my-2 my-md-0">
                    <ReactHTMLTableToExcel
                      id="journal-table-xls-button"
                      className="btn btn-md btn-primary p-2 p-md-3 btn_radius"
                      table="journal-table-to-xls"
                      filename="Journal Entries"
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
                      qoutation_id === true
                        ? "btn btn-success"
                        : "btn btn-light"
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
                    class={price === true ? "btn btn-success" : "btn btn-light"}
                    style={styles.filter_btn}
                    onClick={() => setprice(toggle("price", price))}
                  >
                    Amount
                  </button>
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
                    Journal Entry ID
                  </label>
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text" id="inputGroupAppend">
                        JE
                      </span>
                    </div>
                    <input
                      type="Number"
                      onChange={(e) => setqoutation_value(e.target.value)}
                      className="form-control"
                      placeholder="Enter journal entry ID"
                      style={styles.uiInputGroupRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
              {/* table table-striped */}
              <table
                className="table table-striped "
                id="journal-table-to-xls"
                style={styles.table_font}
              >
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th>JE - ID</th>
                    <th>Payment Mode</th>
                    <th>Account Head</th>
                    <th>Amount</th>
                    {/* <td>{val.subject}</td> */}
                    {/* <td>{val.ware_house}</td> */}

                    <th scope="col"></th>
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
                          isChecked={isCheck.includes(val._id)}
                        /> */}
                            </td>
                            <td>JE-{val.j_entry_no}</td>
                            <td>{val.payment_mode}</td>
                            <td>{val.account_head}</td>
                            <td>{`PKR ${val.amount.toLocaleString()}`}</td>
                            {/* <td>{val.price}</td>
                      <td>{val.WareHouse.phone_number}</td> */}
                            <td>
                              {/* onClick={() => delete_data(val._id)}  */}
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

export default J_Entry;
