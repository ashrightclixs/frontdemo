import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  customer: "",
  due_date: "",
  tax: "",
  discription: "-",
  reference: "-",
  // discription: "",
  // reference: "",
  // received: "",
};

const Add_SalesInvoice = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  const [customer, setCustomer] = useState([]); //data for customer
  const [tax, setTax] = useState([]); //tax value
  const [showformdata, setshowformdata] = useState(initialState); //form data passed

  const [price, setprice] = useState([]); //set price
  const [discount, setdiscount] = useState([]); //set discount
  const [discountfinal, setdiscountfinal] = useState(0); //set final discount
  const [net, setnet] = useState(0); //set net
  const [net_value, setnet_value] = useState(0); //set net
  const [amount, setamount] = useState(0); //set amount

  const [invoice, setinvoice] = useState([]); //set amount

  const [invoice_final, setinvoice_final] = useState([]);

  const [product, setproduct] = useState(0); // for recive amount

  const [curr_date, setcurr_date] = useState(getdate()); //data for customer

  const [ware_house, setware_house] = useState([]); //ware_house

  const [ware_house_from, setware_house_from] = useState([]); //ware_house_from

  const [dashboard_entries, setdashboard_entries] = useState([]); //ware_house_from

  const [dashboard_amount, setdashboard_amount] = useState(0); //ware_house_from

  const [dashboard_revenue, setdashboard_revenue] = useState(0); //ware_house_from

  const [with_payment, setwith_payment] = useState(true); //ware_house_from

  const [discription, setdiscription] = useState("discription");
  const [reference, setreference] = useState("reference");
  const [received, setreceived] = useState(0);

  const [loader, setLoader] = useState(false);

  const [add_div, set_add_div] = useState(false); //ware_house_from

  const [add_value_put, setadd_value_put] = useState([]);

  // const [ ware_house , set_ware_house ] = useState("");
  const [ware_house_val, set_ware_house_val] = useState([]);
  const [product_id, set_product_id] = useState("");
  const [quantity, setquantity] = useState(0);
  const [price_val, setprice_val] = useState(0);

  const [total_amount_val, settotal_amount_val] = useState([]);
  const [profit, setprofit] = useState([]);

  const [loader_val, setloader_val] = useState(true); // const [ amount ,setamount ]  = useState("");

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
    setloader_val(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/customer?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setCustomer(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "Please add customer first");
        }
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/tax?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setTax(response.data);
        if (response.data.length === 0) {
          setTimeout(() => {
            ToggleAlert("Warning", "Please add tax first");
          }, 5000);
        }
      })
      .catch((e) => {
        console.log(0);
      });

    // ware_house
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_warehouse?id=${user_id}`,
        {
          user_id: user_id,
        }
      )
      .then((response) => {
        setware_house(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "please add Product first");
        }
      })
      .catch((e) => {
        console.log("error");
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/sales/invoice?id=${user_id}`)
      .then((response) => {
        console.log(response.data);
        GenerateOrdernumber(response.data);
        console.log(response.data.length);
        setloader_val(false);
      })
      .catch((e) => {
        console.log("Error");
      });

  }, []);

  const GenerateOrdernumber = (e) => {
    e.length != 0
      ? e.map((userx, index) =>
          e.length - 1 == index ? setinvoice_final(e.length + 1000) : ""
        )
      : setinvoice_final(1000);
  };
  // const GenerateOrdernumber = (e) => {
  //   e.length !== 0 ? e.map((userx, index) => (
  //     e.length - 1 == index ? console.log(userx.invoice) : ""
  //   )) : setinvoice_final(1000);
  // };

  function taxcalculation(num, per) {
    var q = (num / 100) * per;
    var e = num + q;
    // setdiscount(e);
    return e;
  }

  let total_profit = 0;
  const handleChange = (e) => {
    var ee = document.getElementById("tax_select");
    var optionx = ee.options[ee.selectedIndex];
    var tax_value = optionx.getAttribute("data-test-id");
    // product_id
    var qq = document.getElementById("product_id");
    var optionqq = qq.options[qq.selectedIndex];
    var product_value = optionqq.getAttribute("data_important");

    var price_value = document.getElementById("price").value;
    var discount_value = document.getElementById("discount").value;
    var quantity_value_cal = document.getElementById("quantity").value;
    var quantity_value = document.getElementById("quantity");
    var received_value = document.getElementById("received").value;
    var button_value = document.getElementById("button_approve");
    var net_value = document.getElementById("net").value;

    var price_value_final = price_value * quantity_value_cal;
    var profit_total = 0;
    var Entries_total = 0;

    setprice_val(price_value);
    setquantity(quantity_value_cal);

    if (e.target.name === "ware_house") {
      const myArray = e.target.value.split(",");
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/inventory/stock_inventory/getware_house?id=${myArray[0]}`,
          {
            user_id: user_id,
          }
        )
        .then((response) => {
          set_ware_house_val([myArray[0], myArray[1]]);
          setware_house_from(response.data);
        })
        .catch((e) => {
          console.log("error");
        });
      console.log(e.target.value);
    }

    if (e.target.name == "tax") {
      if (!price_value && !discount_value && !quantity_value) {
        console.log("null");
      } else {
        add_value_put.map((val, index) => {
          total += val[6];
          total_profit += val[8];
        });
        profit_total = total_profit;
        Entries_total = total;
        settotal_amount_val(total);
        console.log(total);
        setprofit(total_profit);
        console.log("dddd" + total_profit);
        setprofit(total_profit);
        var setdiscount1 = percentage(total, discount_value); //this variable is create for due to state not update without handle
        setdiscountfinal((total / 100) * tax_value);
        document.getElementById("net").value = taxcalculation(total, tax_value);
        settotal_amount_val(total);
      }
      // handleChange(tax);
    }
    if (e.target.name == "discount" || e.target.name == "price") {
      setamount(percentage(price_value_final, discount_value));
    }

    if (e.target.name == "curr_date") {
      setcurr_date(e.target.value);
    }
    if (e.target.name == "product_id") {
      if (product_value <= 0) {
        button_value.disabled = true;
        quantity_value.disabled = true;
        ToggleAlert("Warning", "Selected product have 0 quantity");
      } else {
        const myArray = e.target.value.split(",");
        console.log(myArray[1]);
        setdashboard_amount(parseInt(myArray[1]));
        set_product_id([myArray[0], `${myArray[2]}-${myArray[3]}`]);
        setproduct(myArray[0]);
        button_value.disabled = false;
        quantity_value.disabled = false;
      }
      // setproduct("product_id");
    }

    if (e.target.name == "quantity") {
      if (parseInt(product_value) < quantity_value_cal) {
        button_value.disabled = true;
        ToggleAlert(
          "Warning",
          "The quantity entered is greater than quantity available"
        );
      } else {
        button_value.disabled = false;
      }
    }

    if (e.target.name == "received") {
      setreceived(e.target.value);
    }

    const received_final_value =
      received_value == 0 ? received : received_value;

    // profit_total
    setdashboard_revenue({
      user_id: user._id,
      date: getdate(),
      amount: profit_total,
      type: "revenue",
    });
    setdashboard_entries({
      user_id: user._id,
      date: getdate(),
      amount: Entries_total,
    });
    setshowformdata({
      ...showformdata,
      [e.target.name]: e.target.value,
      user_id: user._id,
      invoice: invoice_final,
      curr_date: curr_date,
      currency: "Pakistani Rupees",
      received: received_final_value,
      amount: Entries_total,
      net: document.getElementById("net").value,
    });
  };

  const percentage = (num, per) => {
    var q = (num / 100) * per;
    var e = num - q;
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(add_value_put);
    console.log(dashboard_entries);
    console.log(dashboard_revenue);
    console.log(showformdata);
    setLoader(true)
    try {
      const dashboard_entries_1 = `${process.env.REACT_APP_API_URL}/dashboard/dashbaord_entries/add`;
      const dashboard_entries_movement = await axios.post(
        dashboard_entries_1,
        dashboard_entries
      );

      const dashboard_revenue_api = `${process.env.REACT_APP_API_URL}/dashboard/dashboard_revenue/add`;
      const dashboard_revenue_movement = await axios.post(
        dashboard_revenue_api,
        dashboard_revenue
      );

      const url = `${process.env.REACT_APP_API_URL}/sales/invoice/add?data=${add_value_put}`;
      const response = await axios
        .post(url, showformdata)
        .then((res) => console.log(res.data))

      const movement_url = `${process.env.REACT_APP_API_URL}/sales/invoice/checkStockAdd?id=${add_value_put}`;
      const response_movement = await axios.post(movement_url, user_id).then((res) => setLoader(false));

      navigate("/sales/invoice");
      setTimeout(() => {
        ToggleAlert("Success", "Sales Invoice Added Successfully");
      }, 1000);
      setshowformdata(initialState);
    } catch (error) {
      setTimeout(() => {
        ToggleAlert("Error", "Something went wrong. Please refresh");
      }, 1000);
      console.log(error);
      setLoader(false)
      // navigate("/sales/invoice");
    }
  };

  function add_put() {
    set_add_div(!add_div);
    const value = [
      ware_house_val[0],
      ware_house_val[1],
      product_id[0],
      product_id[1],
      quantity,
      price_val,
      amount,
      dashboard_amount,
      price_val * quantity - dashboard_amount * quantity,
    ];
    setadd_value_put([...add_value_put, value]);
    setquantity(0);
    setamount(0);
    setprice_val(0);
    document.getElementById("ware_house").value = ""
    document.getElementById("product_id").value = ""
  }

  function remove_val(id){
    const newArray = [...add_value_put]; // Create a new array with the same elements
    newArray.splice(id, 1); // Remove the element at the specified index
    setadd_value_put(newArray); // Update the state with the new array
  }

  let total = 0;
  return (
    <>
      {loader_val === true && (
        <>
          <div style={{ textAlign: "center", marginTop: "10rem" }}>
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </>
      )}

      {loader_val === false && (
        <>
          <div className="main-card">
            <div
              className="modal fade"
              id="CustomerModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Products List
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">WareHouse</th>
                          <th scope="col">Product</th>
                          <th scope="col">Rate</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {add_value_put.map((val, index) => (
                          // val.customer &&
                          <>
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{val[1]}</td>
                              <td>{val[3]}</td>
                              <td>{parseInt(val[5]).toLocaleString()}</td>
                              <td>{val[4]}</td>
                              <td>{val[6].toLocaleString()}</td>
                              <td>
                                <button
                                  className="btn btn-light"
                                  onClick={() => remove_val(index)}
                                >
                                  <i className="fa fa-trash text-danger"></i>
                                </button>
                              </td>
                              {/* {total += val[6]}
                              {settotal_amount_val(total)} */}
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="modal-footer">
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

            <input
              type="text"
              name="profit"
              id="profit"
              // onChange={handleChange}
              className="form-control"
              value={profit}
              style={{ display: "none" }}
              // disabled
            />

            <form onSubmit={handleSubmit}>
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Invoice [SI-{invoice_final}]
                  </h4>

                  <div className=" text-center text-md-right">
                    <h4>Drafts</h4>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Customer
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      id="customer"
                      name="customer"
                      onChange={handleChange}
                      style={styles.uiInputSelect}
                      required
                    >
                      {/* <option selected>DD/MM/YYYY</option> */}

                      {customer.map((user, index) => (
                        <option value={user._id} key={index}>
                          {user.name}
                        </option>
                      ))}
                      <option selected value="">
                        Please Select a Customer
                      </option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom026" className="h6">
                      Invoice ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          SI-
                        </span>
                      </div>
                      <input
                        type="text"
                        name="invoice_final"
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
                    <label htmlFor="validationCustom026" className="h6">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      onChange={handleChange}
                      className="form-control"
                      style={styles.uiInput}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="custom-control custom-switch">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="customSwitch1"
                        onChange={() => setwith_payment(!with_payment)}
                      />
                      <label
                        className="custom-control-label"
                        for="customSwitch1"
                      >
                        With Money
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: add_div == true ? "" : "none",
                    backgroundColor: "#e9ecef",
                    padding: "25px",
                  }}
                >
                  <div className="form-row mb-3">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom01" className="h6">
                        Warehouse
                      </label>
                      <select
                        className="custom-select mb-3 mr-3"
                        id="ware_house"
                        name="ware_house"
                        onChange={handleChange}
                        style={styles.uiInputSelect}
                        required
                      >
                        {/* <option selected>DD/MM/YYYY</option> */}

                        {ware_house.map((userx, index) => (
                          <option
                            value={[userx._id, userx.stock_warehouse_name]}
                            key={index}
                          >
                            {userx.stock_warehouse_name} || {userx.address}
                          </option>
                        ))}
                        <option value="" selected>
                          Please select a Warehouse
                        </option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom01" className="h6">
                        Product
                      </label>
                      <select
                        className="custom-select mb-3 mr-3"
                        id="product_id"
                        name="product_id"
                        onChange={handleChange}
                        style={styles.uiInputSelect}
                        required
                      >
                        {ware_house_from.map((userx, index) => (
                          <option
                            value={[
                              userx._id,
                              userx.price,
                              userx.stock_inventory_name,
                              userx.sku,
                            ]}
                            key={index}
                            data_important={userx.quantity}
                          >
                            {userx.stock_inventory_name} || {userx.quantity} pc
                          </option>
                        ))}
                        <option value="" selected>
                          Please select a Product
                        </option>
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom022" className="h6">
                        Purchase Rate
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="dashboard_amount"
                        name="dashboard_amount"
                        // onChange={handleChange}
                        value={`PKR ${dashboard_amount.toLocaleString()}`}
                        placeholder="Enter your Quantity"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        disabled
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
                    {/* <div className="col-md-3 mb-3">
                  <label htmlFor="validationCustom023" className="h6">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustomUsername"
                    name="subject"
                    onChange={handleChange}
                    placeholder="Enter your Subject"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    required
                  />
                </div> */}
                  </div>
                  <div className="form-row">
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom023" className="h6">
                        Quantity
                      </label>
                      <input
                        type="Number"
                        className="form-control"
                        id="quantity"
                        name="quantity"
                        value={quantity}
                        onChange={handleChange}
                        placeholder="Enter product quantity"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom023" className="h6">
                        Price
                      </label>
                      <input
                        type="Number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={price_val}
                        onChange={handleChange}
                        placeholder="Enter product price"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom023" className="h6">
                        Discount
                      </label>
                      <div className="input-group">
                        <input
                          type="Number"
                          className="form-control"
                          id="discount"
                          name="discount"
                          onChange={handleChange}
                          placeholder="Enter discount percent"
                          aria-describedby="inputGroupAppend"
                          style={styles.uiInputGroupLeft}
                          required
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            id="inputGroupAppend"
                          >
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="validationCustom023" className="h6">
                        Amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="amount"
                        name="amount"
                        value={`PKR ${amount.toLocaleString()}`}
                        placeholder="Enter your Amount"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="container-fluid p-0"
                  style={{ marginTop: "35px" }}
                >
                  <div className="form-row">
                    <div className="col-12 float-left">
                      {/* <button
                        type="button"
                        className="btn btn-success mb-2 px-md-4 p-2 mr-2"
                        style={styles.btnRadius}
                        disabled={with_payment === false ? true : false}
                        onClick={() => setwith_payment(!with_payment)}
                      >
                        With Money
                      </button> */}
                      <button
                        type="button"
                        className="btn btn-primary mb-2 px-md-4 p-2"
                        data-toggle="modal"
                        data-target="#CustomerModal"
                        style={styles.btnRadius}
                      >
                        <i className="fa fa-eye mr-2"></i>View
                      </button>
                      <button
                        type="button"
                        className="btn btn-success mb-2 px-md-4 p-2"
                        style={{
                          float: "right",
                          display: add_div ? "none" : "",
                          borderRadius: "10px",
                        }}
                        // disabled={with_payment === false ? true : false}
                        onClick={() => set_add_div(!add_div)}
                      >
                        Add Items
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary mb-2 px-md-4 p-2 ml-3"
                        style={{
                          float: "right",
                          display: add_div ? "" : "none",
                          borderRadius: "10px",
                        }}
                        // disabled={with_payment === false ? true : false}
                        onClick={() => set_add_div(!add_div)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-success mb-2 px-md-4 p-2"
                        style={{
                          float: "right",
                          display: add_div ? "" : "none",
                          borderRadius: "10px",
                        }}
                        // disabled={with_payment === false ? true : false}
                        // onClick={() => setwith_payment(!with_payment)}
                        onClick={() => add_put()}
                      >
                        Save
                        {/* <i className="fas fa-plus">Add</i> */}
                      </button>
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
                  <th scope="col">Discount</th>
                  <th scope="col">Amount</th>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      placeholder="Enter product price"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </td>
                  <td>
                    <div className="input-group">
                      <input
                        type="Number"
                        className="form-control"
                        id="discount"
                        name="discount"
                        onChange={handleChange}
                        placeholder="Enter discount percent"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInputGroupLeft}
                        required
                      />
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          %
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={`PKR ${amount.toLocaleString()}`}
                      placeholder="Enter your Amount"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
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
                    name="discription"
                    placeholder="Additional Notes"
                    onChange={handleChange}
                    style={styles.uiInput}
                  ></textarea>
                </div>
                <div className="col-md-7 col-12 pr-0">
                  {/* <div className="form-group row">
                <label
                  htmlFor="inputPassword3"
                  className="col-sm-2 col-form-label font-weight-bold text-muted"
                >
                  Tax Add Amount
                </label>
                <div className="col-sm-10 d-flex flex-row justify-content-around">
                  <div className="input-group">
                    <input
                      type="Number"
                      className="form-control"
                      id="validationCustomUsername"
                      name="discountfinal"
                      value={discountfinal}
                      placeholder="Enter your Discount"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      readOnly
                      required
                    />
                  </div>
                </div>
              </div> */}
                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Tax
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="custom-select mb-3 mr-3"
                        id="tax_select"
                        name="tax"
                        onChange={handleChange}
                        style={styles.uiInputSelect}
                        // onChange={(event) => event.target.value == "add" ? setmodal(true) : setmodal(false)}
                        required
                      >
                        {/* <option selected>DD/MM/YYYY</option> */}
                        {tax.map((userx, index) => (
                          <option
                            data-test-id={userx.value}
                            dataid="2342"
                            value={userx._id}
                            mydata={userx.value}
                          >
                            {`${userx.description} - ${userx.value}%`}
                          </option>
                        ))}

                        <option selected value="">
                          Please Select a Tax
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* tax  */}
                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Tax Amount
                    </label>
                    <div className="col-sm-10 d-flex flex-row justify-content-around">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          id="validationCustomUsername"
                          name="discountfinal"
                          value={`PKR ${discountfinal.toLocaleString()}`}
                          placeholder="Enter your Discount"
                          aria-describedby="inputGroupAppend"
                          style={styles.uiInput}
                          readOnly
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* total amount  */}

                  <div className="form-group row">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-2 col-form-label font-weight-bold text-muted"
                    >
                      Total Amount
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control"
                        id="net"
                        name="net"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        readOnly
                        required
                      />
                    </div>
                  </div>

                  {/* reference  */}

                  <div className="form-row">
                    <div className="col-md-2 mb-3"></div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="validationCustom01" className="h6">
                        Reference
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="reference"
                        onChange={handleChange}
                        placeholder="Enter invoice reference"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                      />
                    </div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="validationCustom02" className="h6">
                        Amount Received (PKR)
                      </label>
                      <input
                        type="Number"
                        className="form-control"
                        id="received"
                        name="received"
                        onChange={handleChange}
                        placeholder="Enter amount received"
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        disabled={with_payment == true ? true : false}
                        required={with_payment == false ? true : false}
                      />
                    </div>
                  </div>

                  {/* button  */}

                  <div className="text-md-right text-center mt-2 ">
                    <button
                      type="submit"
                      className="btn btn-success mb-2 px-md-4 p-2 mr-2"
                      style={styles.btnRadius}
                      id="button_approve"
                      disabled={loader}
                    >
                      {loader ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Save & Approved"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn px-md-5 p-2 btn-primary mb-2 ml-2"
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

export default Add_SalesInvoice;
