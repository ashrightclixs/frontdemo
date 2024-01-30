const Add_OtherCollection = () => {
  return (
    <>
      <div className="main-card">
        <div class="px-md-4 pt-md-4 px-1 pt-1">
          <div class="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
            <h4 class="mb-md-0 text-center text-md-left">Other Collections</h4>
            <h4 class="mb-md-0 text-center text-md-right">Drafts</h4>
          </div>
          <form>
            <div class="form-row">
              <div class="col-md-3 mb-3">
                <label for="validationCustom01" className="h6">Other Contact</label>
                <input
                  type="text"
                  class="form-control"
                  id="validationCustom01"
                  value=""
                  placeholder="Type to search contact"
                  required
                />
              </div>
              <div class="col-md-3 mb-3">
                <label for="validationCustom02" className="h6">Account</label>
                <input
                  type="text"
                  class="form-control"
                  id="validationCustom02"
                  value=""
                  placeholder="Type to search Account"
                  required
                />
              </div>
              <div class="col-md-3 mb-3">
                <label for="validationCustom02" className="h6">Number</label>
                <input
                  type="number"
                  class="form-control"
                  id="validationCustom02"
                  value=""
                  placeholder="Number"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="col-md-3 mb-3">
                <label for="validationCustom027" className="h6">Date</label>
                <select
                  class="custom-select mb-3 mr-3"
                  id="validationCustom027"
                  required
                >
                  <option selected>DD/MM/YYYY</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
              <div class="col-md-3 mb-3">
                <label for="validationCustom021" className="h6">Reference</label>
                <input
                  type="number"
                  class="form-control"
                  id="validationCustom021"
                  value=""
                  placeholder="Search Reference"
                  required
                />
              </div>
              <div class="col-md-3 mb-3">
                <label for="validationCustom022" className="h6">Currency</label>
                <input
                  type="number"
                  class="form-control"
                  id="validationCustom022"
                  placeholder="Pakistani Rupees(Rs)"
                  disabled
                />
              </div>
            </div>
            <div class="form-row mb-3 justify-content-between flex-md-row flex-column">
              <div class="col-md-3">
                <label for="validationCustom02" className="h6" >Narration</label>
                <input
                  type="number"
                  class="form-control"
                  id="validationCustom02"
                  value=""
                  placeholder="Narration"
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div class="table-responsive px-md-4 pt-md-5 px-1 pt-1">
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">Other Collection Mode</th>
                <th scope="col">Accounts</th>
                <th scope="col">Reference</th>
                <th scope="col">Bank Name</th>
                <th scope="col">Instrument No.</th>
                <th scope="col">Instrument Date</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="row">
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Cash"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Petty Cash"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Reference"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Bank Name"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="Instrument No. "
                    required
                  />
                </td>
                <td>
                  <select
                    class="custom-select mb-3 mr-3"
                    id="validationCustom027"
                    required
                  >
                    <option selected>DD/MM/YYYY</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    id="validationCustom01"
                    value=""
                    placeholder="0"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row mx-0 px-md-4 pt-md-4 px-1 pt-1">
          <div class="col-md-5 col-12">
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="autoSizingCheck2"
              />
              <label
                class="form-check-label text-secondary"
                for="autoSizingCheck2"
              >
                Account Adjustments (Optional) (e.g. WHT, Rebate, etc)
              </label>
            </div>
            <textarea
              type="text"
              class="form-control mt-2 w-100 rounded-3"
              rows="5"
              cols="40"
              id="validationCustom01"
              value=""
              placeholder="Comments"
              required
            ></textarea>
            <h6 class="my-3">Attachments</h6>
            <div class="w-100 dashed mb-3">
              <div class="input-group p-md-4 p-2">
                <div class="custom-file">
                  <input
                    type="file"
                    class="custom-file-input"
                    id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                  />
                  <label
                    class="custom-file-label border-0 w-50 mx-auto"
                    for="inputGroupFile01"
                  >
                    <span class="hide-me">Drop Files</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-7 col-12">
            <form>
              <div class="form-group row">
                <label
                  for="inputPassword3"
                  class="col-sm-4 col-form-label h6 text-muted"
                >
                  Total Amount(Rs)
                </label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" id="inputPassword3" />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="text-md-right text-center mt-2">
        <button type="submit" class="btn btn-success mb-2 px-md-4 p-1 mr-2">
                        Save & Approved
                        </button>
                        <button type="submit" class="btn px-md-5 p-1 btn-primary mb-2 ml-2">
                        Cancel
                        </button>
        </div>
      </div>
    </>
  );
};
 
export default Add_OtherCollection;