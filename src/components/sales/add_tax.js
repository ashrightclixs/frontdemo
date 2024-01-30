import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContextProvicer";
import styles from "../../styles/styles";

export const initialState_of_modal = {
  description: "",
  value: "",
};

const Add_Tax = ({ToggleAlert}) => {
  // modal submit
  const [modal, setmodal] = useState(initialState_of_modal); //add modal values in form
  const [loader, setLoader] = useState(false)

  const navigate = useNavigate()
  const {user} = useContext(AuthContext)
  const handlemodal = (e) => {
    setmodal({ ...modal, [e.target.name]: e.target.value, user_id: user._id });
  };
  const handlemodalSubmit = async (e) => {
    e.preventDefault();
    // console.log(modal.user_id +"discription" + modal.description + "value" + modal.value);
    try {
      const url = `${process.env.REACT_APP_API_URL}/tax/add`;
      const response = await axios.post(url, modal);
      navigate("/sales/tax");
      setTimeout(() => {
        ToggleAlert("Success", "Tax added successfully");
      }, 1000);
    } catch (error) {
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
      <div className="main-card">
        <div className="px-md-4 pt-md-4 px-2 pt-2">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">Add Tax</h4>
            <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
          </div>
          <form onSubmit={handlemodalSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-12">
                <label className="h6">Tax Type</label>
                <select
                  className="custom-select mb-3 mr-3"
                  name="description"
                  onChange={handlemodal}
                  style={styles.uiInputSelect}
                  required
                >
                  <option selected>Please select tax</option>
                  <option value="Income Tax">Income Tax</option>
                  <option value="Sales Tax">Sales Tax</option>
                  <option value="General Sales Tax">General Sales Tax</option>
                  <option value="Excise Tax">Excise Tax</option>
                  <option value="Tariff Tax">Tariff Tax</option>
                  <option value="Value-added Tax (VAT)">
                    Value-added Tax (VAT)
                  </option>
                  <option value="Capital Gains Tax">Capital Gains Tax</option>
                  <option value="Inheritance Tax">Inheritance Tax</option>
                  <option value="Franchise Tax">Franchise Tax</option>
                  <option value="Payroll Tax">Payroll Tax</option>
                  <option value="Payroll Tax">Payroll Tax</option>
                  <option value="No Tax">No Tax</option>
                </select>
              </div>
              <div className="col-md-6 mb-12">
                <label className="h6">Tax Percent</label>
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control"
                    name="value"
                    onChange={handlemodal}
                    placeholder="0"
                    aria-describedby="inputGroupAppend"
                    style={styles.uiInputGroupLeft}
                    required
                  />
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-md-right text-center mt-4 ">
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
          </form>
        </div>
      </div>
    </>
  );
}

export default Add_Tax;