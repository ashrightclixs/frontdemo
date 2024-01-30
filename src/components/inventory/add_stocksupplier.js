import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState = {
  name: "",
  contact: "",
  email: "",
  company: "",
  address: "",
  description: "-",
};

const Add_StockSupplier = ({ ToggleAlert }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [data, setData] = useState(initialState);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value, user_id: user._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    try {
      const url = `${process.env.REACT_APP_API_URL}/inventory/stock_supplier/add`;
      const response = await axios.post(url, data);
      setData(initialState);
      setLoader(false)
      navigate("/inventory/stock_supplier");
      setTimeout(() => {
        ToggleAlert("Success", "Supplier added successfully");
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
      <div className="main-card">
        <div className="px-md-4 pt-md-4 px-2 pt-2">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">
              Add Stock Supplier
            </h4>
            <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-4 mb-12">
                <label htmlFor="validationCustom01" className="h6">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter supplier's name"
                  aria-describedby="inputGroupAppend"
                  style={styles.uiInput}
                  required
                />
              </div>
              <div className="col-md-4 mb-12">
                <label htmlFor="validationCustom01" className="h6">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter supplier's email"
                  aria-describedby="inputGroupAppend"
                  style={styles.uiInput}
                  required
                />
              </div>
              <div className="col-md-4 mb-12">
                <label htmlFor="validationCustom01" className="h6">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="validationCustomUsername"
                  name="address"
                  onChange={handleChange}
                  placeholder="Enter supplier's address"
                  aria-describedby="inputGroupAppend"
                  style={styles.uiInput}
                  required
                />
              </div>
            </div>
            <div className="table-responsive  pt-md-5 pt-1">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col" className="h6">
                      Company/Shop
                    </th>
                    <th scope="col" className="h6">
                      Phone Number
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
                        placeholder="Enter supplier's company/shop name"
                        name="company"
                        onChange={handleChange}
                        aria-describedby="inputGroupAppend"
                        style={styles.uiInput}
                        required
                      />
                    </td>
                    <td>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          id="validationCustomUsername"
                          name="contact"
                          onChange={handleChange}
                          placeholder="Enter supplier's contact number"
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
                  placeholder="Add additional notes/references"
                  name="description"
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
                  <Link to="/sales/customer">
                    <button
                      type="submit"
                      className="btn px-md-5 p-2 btn-primary mb-2 ml-2"
                      onClick={() => navigate(-1)}
                      style={styles.btnRadius}
                    >
                      Cancel
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Add_StockSupplier;
