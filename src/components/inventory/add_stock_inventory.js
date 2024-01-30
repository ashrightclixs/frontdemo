import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  // user_id: "",build in handlechange
  // stock_inventory: "",build in handlechange
  // quantity: "", state
  // price: "",  state
  // amount: "", state
  // currency: "", build in handlechange

  date: "",
  sku: "",
  WareHouse: "",
  stock_inventory_name: "",
  WareHouse: "",
  Supplier: "",
};

const Add_Stock_Inventory = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;
  const [tax, setTax] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [quantity, setquantity] = useState(1); //set quantity
  const [price, setprice] = useState(1); //set price
  const [discount, setdiscount] = useState([]); //set discount
  const [discountfinal, setdiscountfinal] = useState([]); //set final discount
  const [net, setnet] = useState([]); //set net
  const [amount, setamount] = useState(0); //set amount
  const [invoice, setinvoice] = useState([]); //set amount
  const [supplier, setSupplier] = useState([]); //set supplier
  const [invoice_final, setinvoice_final] = useState([]);
  const [receive, setreceive] = useState([]); // for recive amount
  const [curr_date, setcurr_date] = useState(getdate()); //data for customer
  const [comments, setcomments] = useState("---");
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);
  function percentage(num, per) {
    var q = (num / 100) * per;
    var e = num - q;
    setdiscount(e);
    return e;
  }

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }

  function taxcalculation(num, per) {
    var q = (num / 100) * per;
    var e = num + q;
    // setdiscount(e);
    return e;
  }

  useEffect(() => {
    setloader_val(true);
    console.log(user_id);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_supplier?id=${user_id}`
      )
      .then((response) => {
        setSupplier(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "Please add Supplier first");
        }
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_warehouse?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setTax(response.data);
        if (response.data.length === 0) {
          setTimeout(() => {
            ToggleAlert("Warning", "please add Warehouse first");
          }, 5500);
        }
      })
      .catch((e) => {
        console.log(0);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_inventory?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        setinvoice(1000);
      });

    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 === index
            ? setinvoice_final(userx.stock_inventory + 1)
            : ""
        )
      : setinvoice_final(1000);
  };

  const handleChange = (e) => {
    if (e.target.name == "curr_date") {
      setcurr_date(e.target.value);
    }
    if (e.target.name === "quantity") {
      setquantity(e.target.value);
      setamount(price * e.target.value);
    }
    if (e.target.name === "price") {
      setprice(e.target.value);
      setamount(e.target.value * quantity);
    }
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      quantity: quantity,
      price: price,
      amount: amount,
      stock_inventory: invoice_final,
      comments: comments,
      date: curr_date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/add`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/inventory/stock_inventory");
      setTimeout(() => {
        ToggleAlert("Success", "Product added successfully");
      }, 1000);
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.log(error.response.data.message);
      }
    }
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
            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Add Stock Inventory [PI-{invoice_final}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom027" className="h6">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="stock_inventory_name"
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Enter product name"
                      style={styles.uiInput}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Product ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          PI-
                        </span>
                      </div>
                      <input
                        type="text"
                        name="product"
                        // onChange={handleChange}
                        className="form-control"
                        value={invoice_final}
                        style={styles.uiInputGroupRight}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom027" className="h6">
                      Date
                    </label>
                    <input
                      type="date"
                      name="curr_date"
                      onChange={handleChange}
                      className="form-control"
                      value={curr_date}
                      style={styles.uiInput}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustom022"
                      name="currency"
                      placeholder="Pakistani Rupees(Rs)"
                      style={styles.uiInput}
                      disabled
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Warehouse
                    </label>
                    <select
                      className="custom-select"
                      id="tax_select"
                      name="WareHouse"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      {tax.map((userx, index) => (
                        <option
                          data-test-id={userx.value}
                          dataid="2342"
                          value={userx._id}
                          mydata={userx.value}
                        >
                          {userx.stock_warehouse_name} | {userx.address}
                        </option>
                      ))}

                      <option selected value="">
                        Please select a warehouse
                      </option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="h6">Supplier</label>
                    <select
                      className="custom-select"
                      name="Supplier"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      {supplier.map((userx) => (
                        <option value={userx._id}>{userx.name}</option>
                      ))}

                      <option selected value="">
                        Please select a supplier
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Quantity
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      onChange={handleChange}
                      placeholder="Enter product quantity"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Rate
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="price"
                      name="price"
                      onChange={handleChange}
                      placeholder="Enter product rate"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Gross Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      value={`PKR ${amount.toLocaleString()}`}
                      onChange={handleChange}
                      placeholder="-"
                      style={styles.uiInput}
                      aria-describedby="inputGroupAppend"
                      readOnly
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      SKU
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="sku"
                      name="sku"
                      onChange={handleChange}
                      placeholder="Enter Product SKU"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </div>
                </div>
              </div>
              {/* <div className="table-responsive px-md-4 pt-md-3 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Quantity</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Gross Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      onChange={(e) => {
                        setquantity(e.target.value);
                        setamount(price * e.target.value);
                      }}
                      placeholder="Enter product quantity"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="price"
                      name="price"
                      onChange={(e) => {
                        setprice(e.target.value);
                        setamount(e.target.value * quantity);
                      }}
                      placeholder="Enter product rate"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      value={`PKR ${amount.toLocaleString()}`}
                      placeholder="-"
                      style={styles.uiInput}
                      aria-describedby="inputGroupAppend"
                      readOnly
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              <div className="row mx-0 px-md-4 pt-md-4 px-2 pt-2">
                <div className="col-md-5 col-12 px-0">
                  <textarea
                    className="form-control"
                    id="form-control mt-2 w-100 rounded-3"
                    rows="5"
                    cols="40"
                    placeholder="Additional Notes"
                    name="comments"
                    onChange={(e) => setcomments(e.target.value)}
                    style={styles.uiInput}
                  ></textarea>
                </div>
                <div className="col-md-7 col-12 px-0">
                  {/* <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Net(Rs)
                </label>
                <div className="col-sm-10">
                  <input
                    type="Number"
                    className="form-control"
                    id="validationCustomUsername"
                    name="net"
                    value={net}
                    placeholder=""
                    style={styles.uiInput}
                    aria-describedby="inputGroupAppend"
                    readOnly
                    required
                  />
                </div>
              </div> */}

                  <div className="text-md-right text-center mt-2 ">
                    <button
                      type="submit"
                      class="btn btn-success mb-2 px-md-4 p-2 mr-2"
                      style={styles.btnRadius}
                    >
                      {loader ? (
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                          disabled={loader}
                        ></span>
                      ) : (
                        "Save & Approved"
                      )}
                    </button>
                    <button
                      type="button"
                      class="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                      style={styles.btnRadius}
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Add_Stock_Inventory;
