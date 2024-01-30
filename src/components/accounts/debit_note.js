import { Link } from "react-router-dom";

const Debit_Note = () => {
  return (
    <>
      <div className="main-card">
        <div className="px-md-4 pt-md-4 px-1 pt-1">
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 className="mb-md-0 text-center text-md-left">Debit Note</h4>
            <Link to="/accounts/add_debit_note">
              <button className="btn btn-md btn-success p-1 p-md-3 ml-md-2 my-2 my-md-0">
                + Add Debit Note
              </button>
            </Link>
          </div>
          <div className="d-flex justify-content-between flex-md-row flex-column my-2 py-3">
            <div className="text-center my-2 my-md-0 order-last order-md-first">
              <button className="btn btn-md btn-primary p-1 p-md-3">
                <i className="fa fa-filter pr-2"></i>Filter
              </button>
            </div>
            <div className="d-flex justify-content-end flex-md-row flex-column">
              <div className="text-center mx-md-2 my-2 my-md-0">
                <button className="btn btn-md btn-primary p-1 p-md-3">
                  <i className="fa fa-print pr-2"></i>Print
                </button>
              </div>
              <div className="text-center ml-md-2 my-2 my-md-0">
                <button className="btn btn-md btn-primary p-1 p-md-3">
                  Export to excel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive px-md-4 pb-md-4 px-1 pb-1">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Bank Name</th>
                <th scope="col">Branch Name</th>
                <th scope="col">Account Title</th>
                <th scope="col">Account Number</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>abc</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>
                  <i className="fa fa-trash"></i>
                </td>
              </tr>
              <tr>
                <td>abc</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>

                <td>
                  <i className="fa fa-trash"></i>
                </td>
              </tr>
              <tr>
                <td>abc</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>
                  <i className="fa fa-trash"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Debit_Note;
