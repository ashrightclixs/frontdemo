import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  user_id: "",
  purpose: "",
  return_no: "",
  date: "",
  currency: "",
  stock: "",
  quantity: "",
  price: "",
  amount: "",
  description: "-",
  received: "",
};

const Add_StockReturn = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  const [tax, setTax] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [product, setproduct] = useState([]); //tax value
  const [avail_qty, setAvail_qty] = useState([]);
  const [date, setDate] = useState(getdate());
  const [stockID, setStockID] = useState("");
  const [qty, setQty] = useState("");

  const [price, setprice] = useState([]); //set price
  const [discount, setdiscount] = useState([]); //set discount
  const [discountfinal, setdiscountfinal] = useState([]); //set final discount
  const [net, setnet] = useState([]); //set net
  const [amount, setAmount] = useState([]); //set amount

  const [received_chalan, setreceived_chalan] = useState([]); //set amount
  const [received_chalan_show, setreceived_chalan_show] = useState([]); //set amount

  const [receive, setreceive] = useState([]); // for recive amount

  const [loader, setLoader] = useState(false);

  const [loader_val, setloader_val] = useState(true);

  function getdate() {
    const date = new Date();
    const year = date.getFullYear();
    const getdate = new Date(date);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const full_date = [year, month, day].join("-");
    return full_date;
  }

  function percentage(num, per) {
    var q = (num / 100) * per;
    var e = num - q;
    setdiscount(e);
    return e;
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
      .get(`${process.env.REACT_APP_API_URL}/tax?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setTax(response.data.filter((p) => p.user_id == user._id));
        if (response.data.length === 0) {
          setTimeout(() => {
            ToggleAlert("Warning", "please add tax first");
          }, 5000);
        }
      })
      .catch((e) => {
        console.log(0);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/inventory/stock_adj`, {
        user_id: user_id,
      })
      .then((response) => {
        GenerateOrdernumber(response.data.filter((p) => p.user_id == user_id));
      })
      .catch((e) => {
        setreceived_chalan(1000);
      });

    //productshow  product
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_inventory?id=${user_id}`
      )
      .then((response) => {
        setproduct(response.data.filter((p) => p.user_id == user_id));
        if (response.data.length === 0) {
          ToggleAlert("Warning", "please add product in Stock Inventory first");
        }
      })
      .catch((e) => {
        console.log("error");
      });

    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 == index
            ? setreceived_chalan_show(userx.return_no + 1)
            : ""
        )
      : setreceived_chalan_show(1000);
  };

  const handleChange = (e) => {
    var price_value = document.getElementById("price").value;
    var quantity_value = document.getElementById("quantity").value;
    setAmount(price_value * quantity_value);
    setQty(quantity_value);
    if (e.target.name == "stock") {
      setStockID(e.target.value);
      product.map((ele) => {
        if (ele._id == e.target.value) {
          setAvail_qty(`${ele.quantity} PC`);
        }
      });
    }

    if (e.target.name == "date") {
      setDate(e.target.value);
    }
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      amount: amount,
      date: date,
      return_no: received_chalan_show,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(showformdata);
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_adj/add?id=${stockID}&quantity=${qty}`;
      const response = await axios.post(url, showformdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/inventory/stock_return");
      setTimeout(() => {
        ToggleAlert("Success", "Entry added successfully");
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
            {/* <div
          className={
            product.length === 0 || tax.length === 0
              ? "alert alert-warning alert-dismissible fade show"
              : "d-none"
          }
          id="submit"
          role="alert"
        >
          <strong>
            {product.length === 0 ? "[Product Missing]" : ""}{" "}
            {tax.length === 0 ? "[Tax Missing]" : ""}{" "}
          </strong>
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div> */}
            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Add Stock Return [SR-{received_chalan_show}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Purpose
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      name="purpose"
                      onChange={handleChange}
                      required
                      style={styles.uiInputSelect}
                    >
                      <option value="openings">Openings</option>
                      <option value="lost or theft">Lost or theft</option>
                      <option value="break">Break</option>
                      <option value="expire">Expire</option>
                      <option value="other">Other</option>
                      <option value="" selected>
                        Please select a purpose
                      </option>
                    </select>
                  </div>
                  <div className="col-md-2 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          SR
                        </span>
                      </div>
                      <input
                        type="Number"
                        name="return_no"
                        onChange={handleChange}
                        className="form-control"
                        value={received_chalan_show}
                        disabled
                        style={styles.uiInputGroupRight}
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom027" className="h6">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      onChange={handleChange}
                      className="form-control"
                      value={date}
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustom022"
                      name="currency"
                      style={styles.uiInput}
                      placeholder="Pakistani Rupees(Rs)"
                      disabled
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Product
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      name="stock"
                      onChange={handleChange}
                      required
                      style={styles.uiInputSelect}
                    >
                      {product.map((userx, index) => (
                        <option value={userx._id} key={index}>
                          PI-{userx.stock_inventory}{" "}
                          {userx.stock_inventory_name} {userx.sku}
                        </option>
                      ))}
                      <option selected value="">
                        Please select a product
                      </option>
                    </select>
                  </div>
                  <div className="col-md-2 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Available Quantity
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustom022"
                      name="avail_qty"
                      value={avail_qty}
                      style={styles.uiInput}
                      placeholder="PC"
                      disabled
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Quantity
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">QTY</span>
                      </div>
                      <input
                        type="Number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        onChange={handleChange}
                        style={styles.uiInputGroupRight}
                        placeholder="Enter quantity"
                        aria-describedby="inputGroupAppend"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Price
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">PKR</span>
                      </div>
                      <input
                        type="Number"
                        className="form-control"
                        id="price"
                        name="price"
                        onChange={handleChange}
                        style={styles.uiInputGroupRight}
                        placeholder="Enter price"
                        aria-describedby="inputGroupAppend"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Amount
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">PKR</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="amount"
                        value={amount.toLocaleString()}
                        style={styles.uiInputGroupRight}
                        placeholder="0"
                        aria-describedby="inputGroupAppend"
                        readOnly
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">QTY</span>
                      </div>
                      <input
                        type="Number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        onChange={handleChange}
                        style={styles.uiInputGroupRight}
                        placeholder="Enter quantity"
                        aria-describedby="inputGroupAppend"
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">PKR</span>
                      </div>
                      <input
                        type="Number"
                        className="form-control"
                        id="price"
                        name="price"
                        onChange={handleChange}
                        style={styles.uiInputGroupRight}
                        placeholder="Enter price"
                        aria-describedby="inputGroupAppend"
                        required
                      />
                    </div>
                  </td>
                  <td>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span class="input-group-text">PKR</span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="amount"
                        value={amount.toLocaleString()}
                        style={styles.uiInputGroupRight}
                        placeholder="0"
                        aria-describedby="inputGroupAppend"
                        readOnly
                        required
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              <div className="row mx-0 px-md-4 pt-md-4 px-2 pt-2">
                <div className="col-md-6 col-12 px-0">
                  <label
                    htmlFor="inputPassword3"
                    className="col-sm-12 col-form-label font-weight-bold h6 px-0"
                  >
                    Additional Notes
                  </label>
                  <textarea
                    className="form-control"
                    id="form-control mt-2 w-100 rounded-3"
                    rows="5"
                    cols="40"
                    placeholder="For Example: Customer Name"
                    name="description"
                    onChange={handleChange}
                    style={styles.uiInput}
                  ></textarea>
                </div>
                <div className="col-md-6 col-12 px-0">
                  <div className="form-group row mx-0">
                    <div className="col-md-2 mb-3"></div>
                    <div className="col-md-10 mb-3 px-0">
                      <label htmlFor="inputPassword3" className="h6">
                        Net Amount
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span class="input-group-text">PKR</span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          id="validationCustomUsername"
                          name="net_amount"
                          value={amount.toLocaleString()}
                          style={styles.uiInputGroupRight}
                          placeholder="0"
                          aria-describedby="inputGroupAppend"
                          disabled
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-2 mb-3"></div>
                    <div className="col-md-10 mb-3 px-0">
                      <label htmlFor="validationCustom02" className="h6">
                        Amount Received
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span class="input-group-text">PKR</span>
                        </div>
                        <input
                          type="Number"
                          className="form-control"
                          name="received"
                          onChange={handleChange}
                          style={styles.uiInputGroupRight}
                          placeholder="Enter amount received"
                          aria-describedby="inputGroupAppend"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-md-right text-center mt-2 ">
                    <button
                      type="submit"
                      class="btn btn-success mb-2 px-md-4 p-2 mr-2"
                      style={styles.btnRadius}
                      disabled={loader}
                    >
                      {loader ? (
                        <span
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
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

export default Add_StockReturn;
