import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  // user_id: "", through handle data
  // stock_warehouse: "",  // number declare through handle change
  stock_warehouse_name: "", // name clear
  address: "", // address
  phone_number: "", // phone number
  date: "", //date clear
  comments: "-", //comments
};

const Add_StockWarehouse = ({ ToggleAlert }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  var user_id = user._id;

  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [order_final, setorder_final] = useState([]); //order_final
  const [loader_val, setloader_val] = useState(true);
  useEffect(() => {
    setloader_val(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/inventory/stock_warehouse?id=${user_id}`,
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
          e.length - 1 == index ? setorder_final(userx.stock_warehouse + 1) : ""
        )
      : setorder_final(1000);
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
      user_id: user._id,
      stock_warehouse: order_final,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log(user._id);
    console.log(data);
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_warehouse/add`;
      const response = await axios.post(url, data);
      setData(initialState);
      setLoader(false);
      navigate("/inventory/stock_warehouse");
      setTimeout(() => {
        ToggleAlert("Success", "Warehouse added successfully");
      }, 1000);
    } catch (e) {
      console.log(error);
      if (e.response && e.response.status >= 400 && e.response.status <= 500) {
        setError(e.response.data.message);
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
            {console.log(order_final)}
            <div className="px-md-4 pt-md-4 px-2 pt-2">
              <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                <h4 className="mb-md-0 text-center text-md-left">
                  Add Stock Warehouse
                </h4>
                <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  {/* stock_warehouse_name */}

                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom026" className="h6">
                      Warehouse ID
                    </label>
                    <div className="input-group">
                      <div className="input-group-append">
                        <span
                          className="input-group-text"
                          id="inputGroupAppend"
                        >
                          SW-
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

                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom01" className="h6">
                      Warehouse
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="validationCustomUsername"
                      name="stock_warehouse_name"
                      onChange={handleChange}
                      placeholder="Enter warehouse name"
                      aria-describedby="inputGroupAppend"
                      style={styles.uiInput}
                      required
                    />
                  </div>

                  {/* <div className="col-md-3 mb-2">
              <label htmlFor="validationCustom01" className="h6">
                WareHouse Name
              </label>
              <input
                type="text"
                className="form-control"
                id="validationCustomUsername"
                name="email"
                onChange={handleChange}
                placeholder="--------@gmail.com"
                aria-describedby="inputGroupAppend"
                style={styles.uiInput}
                required
              />
            </div> */}

                  <div className="col-md-3 mb-2">
                    <label htmlFor="validationCustom027" className="h6">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      onChange={handleChange}
                      className="form-control"
                      style={styles.uiInput}
                    />
                  </div>
                </div>
                <div className="table-responsive  pt-md-5 pt-1">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" className="h6">
                          Address
                        </th>
                        <th scope="col" className="h6">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            id="validationCustomUsername"
                            placeholder="Enter warehouse address"
                            name="address"
                            onChange={handleChange}
                            aria-describedby="inputGroupAppend"
                            style={styles.uiInput}
                            required
                          />
                        </td>
                        <td>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              id="validationCustomUsername"
                              name="phone_number"
                              onChange={handleChange}
                              placeholder="+92000000000"
                              aria-describedby="inputGroupAppend"
                              style={styles.uiInput}
                              required
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="row mx-0 pt-md-4 pt-1">
                  <div className="col-md-5 col-12 px-0">
                    <textarea
                      className="form-control"
                      id="form-control mt-2 w-100 rounded-3"
                      rows="5"
                      cols="40"
                      placeholder="Additional Notes"
                      name="comments"
                      onChange={handleChange}
                      style={styles.uiInput}
                    ></textarea>
                  </div>
                  <div className="col-md-7 col-12 px-0">
                    <div className="text-md-right text-center mt-2">
                      <button
                        type="submit"
                        className="btn btn-success mb-2 px-md-4 p-2 mr-2"
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
                        className="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                        onClick={() => navigate(-1)}
                        style={styles.btnRadius}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Add_StockWarehouse;
