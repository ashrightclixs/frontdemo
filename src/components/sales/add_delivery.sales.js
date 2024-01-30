import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios, { Axios } from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  date: "",
  delivery_id: "",
  invoice: "",
  description: "-",
  charges: "",
  attachment: "",
};

const Add_SalesDelivery = ({ ToggleAlert }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  var user_id = user._id;

  const [customer, setCustomer] = useState([]); //data for customer
  const [product, setProduct] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [price, setPrice] = useState([]);
  const [gross, setGross] = useState([]);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [loader, setLoader] = useState(false);

  const [showformdata, setshowformdata] = useState(initialState); //form data passed

  const [amount, setAmount] = useState([]); //set amount  delivery_chalan

  const [delivery_chalan_final, setdelivery_chalan_final] = useState([]); //set amount

  const [date, setDate] = useState(getdate()); //data for customer
  const [attachment, setAttachemnt] = useState("no-attachment"); //data for customer

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

  useEffect(() => {
    setloader_val(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/sales/invoice?id=${user_id}`, {
        user_id: user_id,
      })
      .then((response) => {
        setInvoice(response.data);
        if (response.data.length === 0) {
          ToggleAlert("Warning", "Please add sales invoice first");
        }
        console.log(response.data);
      })
      .catch((e) => {
        console.log(`error : ${e}`);
        setTimeout(() => {
          ToggleAlert("Warning", "Please add Product in Stock Inventory first");
        }, 5000);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/sales/delivery?id=${user_id}`)
      .then((response) => {
        GenerateOrdernumber(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setloader_val(false);
  }, []);

  const GenerateOrdernumber = (e) => {
    e.length !== 0
      ? e.map((userx, index) =>
          e.length - 1 == index
            ? setdelivery_chalan_final(userx.delivery_id + 1)
            : ""
        )
      : setdelivery_chalan_final(1000);
  };

  const HandleFileUpload = (e) => {
    /*Maximum allowed size in bytes
       5MB Example
       Change first operand(multiplier) for your needs*/
    const maxAllowedSize = 5 * 1024 * 1024;
    if (e.target.files[0].size > maxAllowedSize) {
      // Here you can ask your users to load correct file
      ToggleAlert("Warning", `File is too big!`);
      e.target.value = "";
    } else {
      setshowformdata({ ...showformdata, attachment: e.target.files[0] });
      ToggleAlert(
        "Success",
        `Your File : ${e.target.files[0].name} has been added. Click Save Changes Button`
      );
      setImageUpdated(true);
    }
  };

  const handleChange = (e) => {
    // var price_value = document.getElementById("price").value;
    // var quantity_value = document.getElementById("quantity").value;

    // setAmount(price_value * quantity_value)

    if (e.target.name == "invoice") {
      invoice.map((val) => {
        if (val._id == e.target.value) {
          setCustomer(val.customer.name);
          setGross(val.net);
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
      delivery_id: delivery_chalan_final,
      date: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formdata = new FormData();
    imageUpdated
      ? formdata.append(
          "attachment",
          showformdata.attachment,
          showformdata.attachment.name
        )
      : formdata.append("attachment", "-");
    formdata.append("user_id", showformdata.user_id);
    formdata.append("delivery_id", showformdata.delivery_id);
    formdata.append("date", showformdata.date);
    formdata.append("invoice", showformdata.invoice);
    formdata.append("description", showformdata.description);
    formdata.append("charges", showformdata.charges);
    console.log(formdata);

    try {
      const url = `${process.env.REACT_APP_API_URL}/sales/delivery/add`;
      const response = await axios.post(url, formdata);
      setshowformdata(initialState);
      setLoader(false);
      navigate("/sales/delivery");
      setTimeout(() => {
        ToggleAlert("Success", "Sales Delivery recorded successfully");
      }, 1000);
    } catch (error) {
      console.log(error);
      setLoader(false);
      setTimeout(() => {
        ToggleAlert("Error", "Something went wrong");
      }, 1000);
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="px-md-4 pt-md-4 px-2 pt-2">
                <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                  <h4 className="mb-md-0 text-center text-md-left">
                    Sale Delivery [SD-{delivery_chalan_final}]
                  </h4>
                  <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                </div>

                <div className="form-row">
                  <div className="col-md-2 mb-2">
                    <label htmlFor="validationCustom026" className="h6">
                      Delivery ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          SD
                        </span>
                      </div>
                      <input
                        type="Number"
                        name="delivery_chalan_final"
                        style={styles.uiInputGroupRight}
                        // onChange={handleChange}
                        className="form-control"
                        value={delivery_chalan_final}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="validationCustom01" className="h6">
                      Invoice
                    </label>
                    <select
                      className="custom-select mb-3 mr-3"
                      name="invoice"
                      onChange={handleChange}
                      required
                      style={styles.uiInputSelect}
                    >
                      {invoice.map((item, index) => (
                        <option value={item._id} key={index}>
                          SI-{item.invoice} - {item.user_id.username}
                        </option>
                      ))}
                      <option selected value="">
                        Please select an Invoice
                      </option>
                    </select>
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
                      required
                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label htmlFor="validationCustom026" className="h6">
                      Customer
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustom022"
                      name="customer"
                      placeholder="Customer Name"
                      value={customer}
                      onChange={handleChange}
                      style={styles.uiInput}
                      disabled
                    />
                  </div>
                  <div className="col-md-2 mb-2">
                    <label htmlFor="validationCustom026" className="h6">
                      Gross Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      placeholder="Gross Amount"
                      value={`PKR ${gross.toLocaleString()}`}
                      aria-describedby="inputGroupAppend"
                      onChange={handleChange}
                      style={styles.uiInput}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {/* <div className="table-responsive px-md-4 pt-md-3 px-2 pt-2">
            <table className="table table-striped table-bordered table-responsive">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Gross Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="quantity"
                      name="product"
                      placeholder="Product"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      value={product}
                      onChange={handleChange}
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="Number"
                      className="form-control"
                      id="quantity"
                      name="quantity"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={handleChange}
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      name="price"
                      placeholder="Price"
                      value={`PKR ${price.toLocaleString()}`}
                      aria-describedby="inputGroupAppend"
                      onChange={handleChange}
                      style={styles.uiInput}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="amount"
                      placeholder="Gross Amount"
                      value={`PKR ${gross.toLocaleString()}`}
                      aria-describedby="inputGroupAppend"
                      onChange={handleChange}
                      style={styles.uiInput}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              <div className="row mx-0 px-md-4 pt-md-4 px-2 pt-2">
                <div className="col-md-5 col-12 px-0">
                  <div className="form-group row align-items-center mx-0">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-12 col-form-label h6 px-0"
                    >
                      Reference
                    </label>
                    <textarea
                      className="form-control"
                      id="form-control mt-2 w-100 rounded-3"
                      rows="5"
                      cols="30"
                      placeholder="Example : ------------"
                      style={styles.uiInput}
                      name="description"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-2 col-12 px-0"></div>
                <div className="col-md-5 col-12 px-0">
                  <div className="form-group row align-items-center mx-0">
                    <label
                      htmlFor="inputPassword3"
                      className="col-sm-12 col-form-label h6"
                    >
                      Delivery Charges
                    </label>
                    <div className="col-sm-12 d-flex flex-row justify-content-around px-0">
                      <div className="input-group">
                        <div className="input-group-append">
                          <span
                            className="input-group-text"
                            id="inputGroupAppend"
                          >
                            PKR
                          </span>
                        </div>
                        <input
                          type="Number"
                          className="form-control"
                          id="validationCustomUsername"
                          name="charges"
                          onChange={handleChange}
                          placeholder="Enter delivery charges"
                          aria-describedby="inputGroupAppend"
                          style={styles.uiInputGroupRight}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="form-group row">
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
                    required
                  >
                    {tax.map((userx, index) => (
                      <option
                        data-test-id={userx.value}
                        dataid="2342"
                        value={userx._id}
                        mydata={userx.value}
                      >
                        {userx.value}%
                      </option>
                    ))}

                    <option selected value="">
                      Please Select a Tax
                    </option>
                  </select>
                </div>

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
                    placeholder="Enter your reference"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInput}
                    readOnly
                    required
                  />
                </div>
              </div>
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
                    placeholder="Enter your reference"
                    aria-describedby="inputGroupAppend"
                    required
                  />
                </div>
                <div className="col-md-5 mb-3">
                  <label htmlFor="validationCustom02" className="h6">
                    Received(Rs)
                  </label>
                  <input
                    type="Number"
                    className="form-control"
                    id="received"
                    name="received"
                    onChange={handleChange}
                    placeholder="Enter your reference"
                    aria-describedby="inputGroupAppend"
                    required
                  />
                </div>
              </div> */}
                </div>

                <div className="col-md-6 col-12 px-0">
                  <h6 className="my-3">Attachments</h6>
                  <div className="w-100 dashed mb-3">
                    <div className="input-group p-md-4 p-2">
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          name="attachment"
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={HandleFileUpload}
                          aria-describedby="inputGroupFileAddon01"
                        />
                        <label
                          className="custom-file-label border-0 w-50 mx-auto"
                          htmlFor="inputGroupFile01"
                        >
                          <span className="hide-me">
                            {imageUpdated ? "Done" : "Drop Files"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 d-flex justify-content-md-end justify-content-center align-items-end px-0">
                  <div className="my-4 ">
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

export default Add_SalesDelivery;
