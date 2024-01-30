import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import { useSearchParams } from "react-router-dom";
import styles from "../../styles/styles"
// import Customer from "./customer.sales";

const RecMoney_Sales = ({ ToggleAlert }) => {

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
    else if (date && curr_date != "" || due_date != "") {
      return val.date >= curr_date && val.date <= due_date;
    }
    else if (qoutation_id && qoutation_value != "") {
      return val.received_chalan == qoutation_value;
    } else {
      return val;
    }
  }

  const paginate = (value) => {
    setpagination(value);
    show(value);
  }

  const show = (value) => {
    axios.get(`${process.env.REACT_APP_API_URL}/sales/received/getmoneypage?page=${value}&id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setData(response.data.items);
      setData1(response.data.pagination.q);
      setistotoal(calculationtotal(response.data.items));
    })

    axios.get(`${process.env.REACT_APP_API_URL}/sales/received?id=${user_id}`, {
      'user_id': user_id
    }).then((response) => {
      setall_data(response.data);
      if(response.data.length === 0){
        ToggleAlert("Warning","No Record Found")
      }
    })

  }

  const calculationtotal = (value) => {
    let total_net = 0;
    let total_recive = 0;
    value.map((val, index) => {
      total_net = total_net + val.net;
      total_recive = total_recive + val.received;

    })
    // console.log([total_net,total_recive]);
    return [total_net, total_recive];
  }



  const approved_delete = (value) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/sales/received/deletemoneyarray?id=${value}`, {
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
      const url = `${process.env.REACT_APP_API_URL}/sales/received/delete?id=${id}`;
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







        <div className="px-md-4 pt-md-4 px-1 pt-1">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">
              Sale Received Money
            </h4>
            <div className="d-flex justify-content-end flex-md-row flex-column">
              <Link to="/sales/add_received_money">
                <button className="btn btn-md btn-success p-1 p-md-3 mx-md-2 my-2 my-md-0" style={styles.btnRadius}>
                  + Add Received Money
                </button>
              </Link>
              <button className="btn btn-md btn-success p-1 p-md-3 ml-md-2 my-2 my-md-0" style={styles.btnRadius}>
                + Add Bulk Received Money
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 py-3">
            <div className="text-center my-2 my-md-0 order-last order-md-first">
              <button
                className="btn btn-md btn-primary p-1 p-md-3"
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
                <button className="btn btn-md btn-primary p-1 p-md-3" style={styles.btnRadius}>
                  <i className="fa fa-print pr-2"></i>Print
                </button>
              </div>


              {/* approved select */}
              <div className="dropdown text-center mx-md-2 my-2 my-md-0">
              <button
                  className="btn btn-primary btn-md p-1 p-md-3"
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

                  <a className="dropdown-item h6 my-1" href="#" onClick={() => delete_all()}>
                    Delete All Items
                  </a>
                  <a className="dropdown-item h6 my-1" href="#" onClick={() => select_item_delete()}>
                    Delete Selected Items
                  </a>
                  <a className="dropdown-item h6 my-1" href="#" onClick={() => select_item_delete_page()}>
                    Delete All items of this page
                  </a>

                </div>
              </div>

              <button className="btn btn-md btn-success p-1 p-md-3" style={styles.btnRadius} onClick={() => window.location.reload()}>
                <i class="fa fa-refresh" aria-hidden="true"></i> Refresh
              </button>


              {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <button className="btn btn-md btn-primary p-1 p-md-3"
                  onClick={approved}>
                  Approve selected Quotation
                </button>
              </div> */}
              {/* <div className="text-center mx-md-2 my-2 my-md-0">
                <ReactHTMLTableToExcel
                  id="quotation-table-xls-button"
                  className="btn btn-md btn-primary p-1 p-md-3"
                  table="quotation-table-to-xls"
                  filename="tablexls"
                  sheet="tablexls"
                  buttonText="Export to excel"
                />
                <button className="btn btn-md btn-primary p-1 p-md-3">
                    Export to excel
                  </button>
              </div> */}
            </div>
          </div>


          {/* data-toggle="modal"
                data-target="#filter_quotation" */}
          <div className={filter == true ? "d-flex justify-content-between flex-md-row flex-column my-2 py-3" : "d-none"}>
            <div className="text-center my-2 my-md-0 order-last order-md-first">
              <button type="button"
                class={date === true ? "btn btn-success" : "btn btn-light"}
                style={{ "marginLeft": "5px" }}
                onClick={() => setdate(toggle("date", date))}>
                <i class={date === true ? "fa fa-check" : "fa fa-times"} aria-hidden="true"></i>   Date
              </button>

              <button type="button"
                class={price === true ? "btn btn-success" : "btn btn-light"}
                style={{ "marginLeft": "5px" }}
                onClick={() => setprice(toggle("price", price))} >
                <i class={price === true ? "fa fa-check" : "fa fa-times"} aria-hidden="true"></i>     Price
              </button>

              <button type="button"
                class={qoutation_id === true ? "btn btn-success" : "btn btn-light"} style={{ "marginLeft": "5px" }}
                onClick={() => setqoutation_id(toggle("qoutation_id", qoutation_id))} >
                <i class={qoutation_id === true ? "fa fa-check" : "fa fa-times"} aria-hidden="true"></i>     Search
              </button>

              <button type="button"
                class={customer === true ? "btn btn-success" : "btn btn-light"} style={{ "marginLeft": "5px" }}
                onClick={() => setcustomer(toggle("customer", customer))} >
                <i class={customer === true ? "fa fa-check" : "fa fa-times"} aria-hidden="true"></i>    Customer
              </button>
            </div>
          </div>
          <div className={date === true ? "form-group row" : "d-none"}>
            <div className="col-sm-4">
              <input
                type="date"
                className="form-control"
                id="curr_date"
                name="curr_date"
                onChange={(e) => setcurr(e.target.value)}
                aria-describedby="inputGroupAppend"
                defaultValue={getdate()}
                required
              />
            </div>
            <div className="col-sm-4">
              <input
                type="date"
                className="form-control"
                id="due_date"
                name="due_date"
                onChange={(e) => setdue(e.target.value)}
                aria-describedby="inputGroupAppend"
                required
              />
            </div>


          </div>



          <div className={price === true ? "form-group row" : "d-none"}>
            <div className="col-sm-4">
              <input
                type="Number"
                className="form-control"
                id="start_price"
                name="start_price"
                onChange={(e) => setstart_price(e.target.value)}
                aria-describedby="inputGroupAppend"
                placeholder="Enter Your Start Price"
                required
              />
            </div>
            <div className="col-sm-4">
              <input
                type="Number"
                className="form-control"
                id="end_price"
                name="end_price"
                onChange={(e) => setend_price(e.target.value)}
                placeholder="Enter Your End Price"
                aria-describedby="inputGroupAppend"
                required
              />
            </div>


          </div>




          <div className={qoutation_id === true ? "form-row" : "d-none"} style={{ "marginBottom": "15px" }}>
            <div className="col-md-6 mb-6">
              <label htmlFor="validationCustom026" className="h6">
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

                />
              </div>
            </div>
          </div>


          <div className={customer === true ? "form-group row" : "d-none"}>
            <div className="col-sm-4">
              <input
                type="text"
                className="form-control"
                id="search customer"
                name="search"
                onChange={(e) => setsearch(e.target.value)}
                placeholder="Enter Your Customer Name"
                required
              />
            </div>

          </div>



        </div>
        <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
          {/* table table-striped */}
          <table className="table table-striped " id="quotation-table-to-xls" style={styles.table_font}>
            <thead>
            <tr>
                  <th scope="col">
                    {/* <input type="checkbox" /> */}
                  </th>
                  <th scope="col">Received-ID</th>
                  <th scope="col">Payment Mode</th>
                  <th scope="col">Customer</th>
                  {/* <th scope="col">Contact</th> */}

                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Discount</th>
                  {/* <th scope="col">Discription</th> */}

                  {/* <th scope="col">Tax</th> */}
                  {/* <th scope="col">reference</th> */}
                  <th scope="col">Amount Received</th>

                  {/* <th scope="col">currency </th> */}
                  <th scope="col">Net</th>
                  <th scope="col">Date</th>
                  <th scope="col">Delete</th>
                </tr>
            </thead>
            < tbody >
              {/* val.customer.name.toLowerCase().includes(search) */}
              {data &&
                data.filter((val) => {
                  return filter ? filterdata(val) :
                    val;
                }).map((val, index) => (
                  // val.customer && 
                  <>

                    <tr key={index}>
                      <td scope="row">
                        <input
                          type="checkbox"
                          id={val._id}
                          key={val._id}
                          name="check"
                          onClick={handleClick}
                          isChecked={isCheck.includes(val._id)}
                        />
                      </td>
                      <td>SD-{val.received_chalan}</td>
                      <td>{val.payment_mode}</td>
                      <td>{val.customer.name}</td>
                      <td>PKR {val.price}</td>
                      <td>{val.quantity}</td>
                      <td>{val.discount}%</td>
                      <td>PKR {val.received}</td>
                      <td>PKR {val.net}</td>
                      <td>PKR {val.date}</td>
                      <td>
                        <button className="btn btn-light" onClick={() => delete_data(val._id)} style={{ "color": "red" }}>
                          <i
                            className="fa fa-trash">
                          </i>
                        </button>
                      </td>
                    </tr>
                  </>




                ))}
            </tbody>
            <tfoot className={filter != true ? "table-light" : "d-none"}>
              <tr>
                <td></td>
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
                <td>PKR {Math.round(istotoal[0])}</td>
                <td>PKR {Math.round(istotoal[1])}</td>




              </tr>
            </tfoot>





          </table>
          <nav aria-label="Page navigation example" style={{}}>
            <ul class="pagination">
              {
                data1 != 0 ? (() => {
                  let pages = [];
                  for (let i = 1; i < data1 + 1; i++) {
                    pages.push(<li class="page-item"><span class="page-link" style={{ cursor: "pointer" }} onClick={() => paginate(i)}>{i}</span></li>)
                  }
                  return pages;
                })() : <li class="page-item"><span class="page-link" style={{ cursor: "pointer" }} >1</span></li>
              }





              {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
              <li class="page-item"><a class="page-link" href="#">2</a></li>
              <li class="page-item"><a class="page-link" href="#">3</a></li>
              <li class="page-item"><a class="page-link" href="#">Next</a></li> */}
            </ul>
          </nav>

        </div>
      </div>
    </>
  );
}

export default RecMoney_Sales;