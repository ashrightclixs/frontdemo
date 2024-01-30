import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  stock_movement: "", //Number
  to_ware_house: "", //String
  from_ware_house: "", //String
  date: "", //String
  // currency: "", //String
  reference: "--", //String
  product_id: "", //Obj_ID
  quantity: "", //Number
  comments: "--", //String
};

const Add_StockMov = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  const [showformdata, setshowformdata] = useState(initialState); //form data passed
  const [product, setproduct] = useState([]); //tax value
  const [Quantity, setQuantity] = useState(0);
  const [order_final, setorder_final] = useState([]); //order_final
  const [ware_house, setware_house] = useState([]); //ware_house
  const [ware_house_from, setware_house_from] = useState([]); //ware_house_from
  const [curr_date, setcurr_date] = useState(getdate()); //data for customer
  const [availablequantity, set_availablequantity] = useState(0); //ware_house_from
  const [loader, setLoader] = useState(false);
  const [loader_val, setloader_val] = useState(true);

  const handleChange = (e) => {
    const to_ware = document.getElementById("to_ware_house").value;
    const from_ware = document.getElementById("from_ware_house").value;
    const submit_btn = document.getElementById("submit_btn");

    if (e.target.name === "from_ware_house") {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/getware_house?id=${e.target.value}`,
          {
            user_id: user_id,
          }
        )
        .then((response) => {
          setware_house_from(response.data);
          if (response.data.length === 0) {
            ToggleAlert(
              "Warning",
              "Please add product in this warehouse or select different warehouse"
            );
          }
        })
        .catch((e) => {
          console.log("error");
        });
      console.log(e.target.value);
    }
    if (e.target.name == "to_ware_house") {
      if (to_ware == from_ware) {
        submit_btn.disabled = true;
        ToggleAlert("Warning", "Please select different warehouse");
      } else {
        submit_btn.disabled = false;
      }
    }
    if (e.target.name == "curr_date") {
      setcurr_date(e.target.value);
    }
    if (e.target.name === "product_id") {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/GetInventory?id=${e.target.value}`
        )
        .then((res) => setQuantity(res.data.quantity))
        .catch((err) => console.log(err));
    }
    if (e.target.name === "quantity") {
      if (Quantity < e.target.value) {
        submit_btn.disabled = true;
        ToggleAlert("Warning", "You dont have enough quantity of this product");
      } else {
        submit_btn.disabled = false;
      }
    }

    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      currency: "Pakistani Rupees",
      stock_movement: order_final,
      date: curr_date,
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

  useEffect(() => {
    //productshow  product
    // axios.get(`${process.env.REACT_APP_API_URL}/products`, {
    //   'user_id': user_id
    // }).then((response) => {
    //   setproduct(response.data);
    //   if(response.data.length === 0){
    //     ToggleAlert("Warning","please add Product first")
    //   }
    // }).catch((e) => {
    //   console.log("error");
    // });

    setloader_val(true);

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_warehouse?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setware_house(response.data);
        if (response.data.length === 0 || response.data.length < 2) {
          ToggleAlert("Warning", "Please add Warehouse first");
        }
      })
      .catch((e) => {
        console.log("error");
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_movement?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length != 0
      ? e.map((userx, index) =>
          e.length - 1 == index ? setorder_final(userx.stock_movement + 1) : ""
        )
      : setorder_final(1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(showformdata);
    setLoader(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_movement/add`;
      const response = await axios.post(url, showformdata);
      const movement_url = `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/checkStock_Add?id=${showformdata.product_id}&quantity=${showformdata.quantity}&warehouse=${showformdata.to_ware_house}&user_id=${user_id}`;
      const response_movement = await axios.post(movement_url, user_id);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/inventory/stock_movement");
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
            product.length === 0
              ? "alert alert-warning alert-dismissible fade show"
              : "d-none"
          }
          id="submit"
          role="alert"
        >
          <strong> {product.length === 0 ? "[Product Missing]" : ""} </strong>
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
                    Stock Movement [SM-{order_final}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom01" className="h6">
                      From Warehouse
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="from_ware_house"
                      name="from_ware_house"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      {/* <option selected>DD/MM/YYYY</option> */}

                      {ware_house.map((userx, index) => (
                        <option value={userx._id} key={index}>
                          {userx.stock_warehouse_name} || {userx.address}
                        </option>
                      ))}
                      <option value="" selected>
                        Please select a Warehouse
                      </option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom02" className="h6">
                      To Warehouse
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="to_ware_house"
                      name="to_ware_house"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      {/* <option selected>DD/MM/YYYY</option> */}

                      {ware_house.map((userx, index) => (
                        <option value={userx._id} key={index}>
                          {userx.stock_warehouse_name} || {userx.address}
                        </option>
                      ))}
                      <option value="" selected>
                        Please select a Warehouse
                      </option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom026" className="h6">
                      Stock ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          SM-
                        </span>
                      </div>
                      <input
                        type="Number"
                        name="stock"
                        onChange={handleChange}
                        className="form-control"
                        value={order_final}
                        disabled
                        style={styles.uiInputGroupRight}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-3 mb-2">
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
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom021" className="h6">
                      Reference
                    </label>
                    <input
                      type="text"
                      onChange={handleChange}
                      className="form-control"
                      id="reference"
                      name="reference"
                      placeholder="Add Reference"
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom022" className="h6">
                      Currency
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="currency"
                      name="currency"
                      placeholder="Pakistani Rupees(Rs)"
                      disabled
                      style={styles.uiInput}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Product
                    </label>
                    <select
                      className="custom-select"
                      id="product"
                      name="product_id"
                      onChange={handleChange}
                      required
                      style={styles.uiInputSelect}
                    >
                      {ware_house_from.map((userx, index) => (
                        <option
                          value={userx._id}
                          key={index}
                          data-important={userx.quantity}
                        >
                          PI-{userx.stock_inventory}{" "}
                          {userx.stock_inventory_name} {userx.sku}
                        </option>
                      ))}
                      <option value="" selected>
                        Please select a Product
                      </option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Available Quantity
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="avail_quantity"
                      name="avail_quantity"
                      placeholder="quantity"
                      value={`${Quantity} pc`}
                      disabled
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="validationCustom022" className="h6">
                      Quantity
                    </label>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      placeholder="quantity"
                      onChange={handleChange}
                      required
                      style={styles.uiInput}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="table-responsive px-md-4 pt-md-5 px-2 pt-2">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Available Quantity</th>
                  <th scope="col">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">
                    <select
                      className="custom-select"
                      id="product"
                      name="product_id"
                      onChange={handleChange}
                      required
                      style={styles.uiInputSelect}
                    >
                      {ware_house_from.map((userx, index) => (
                        <option
                          value={userx._id}
                          key={index}
                          data-important={userx.quantity}
                        >
                          {userx.stock_inventory_name}
                        </option>
                      ))}
                      <option value="" selected>
                        Please select a Product
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="avail_quantity"
                      name="avail_quantity"
                      placeholder="quantity"
                      value={`${Quantity} pc`}
                      disabled
                      style={styles.uiInput}
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      placeholder="quantity"
                      onChange={handleChange}
                      required
                      style={styles.uiInput}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              <div className="row mx-0 px-md-4 pt-md-4 px-2 pt-2">
                <div className="col-md-5 col-12 px-0">
                  <textarea
                    type="text"
                    className="form-control mt-2 w-100 rounded-3"
                    rows="5"
                    cols="40"
                    id="validationCustom01"
                    name="comments"
                    onChange={handleChange}
                    style={styles.uiInput}
                    placeholder="Additional Notes"
                  ></textarea>
                </div>
                <div className="col-md-7 col-12"></div>
              </div>
              <div className="text-md-right text-center mt-2">
                <button
                  id="submit_btn"
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
                  type="submit"
                  class="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                  onClick={() => navigate(-1)}
                  style={styles.btnRadius}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Add_StockMov;
