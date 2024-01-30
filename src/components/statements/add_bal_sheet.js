const Add_BalSheet = () => {
    return ( 
        <>
            <div className="main-card">
                <div className="px-md-4 pt-md-4 px-1 pt-1">
                    <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                        <h4 className="mb-md-0 text-center text-md-left">Balance Sheet</h4>
                        <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                    </div>
                    <form>
                        <div className="form-row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom01" className="h6">Other Contact</label>
                                <input type="text" className="form-control" id="validationCustom01" value="" placeholder="Type to search contact" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom02" className="h6">Account</label>
                                <input type="text" className="form-control" id="validationCustom02" value="" placeholder="Type to search Account" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom02" className="h6">Number</label>
                                <input type="number" className="form-control" id="validationCustom02" value="" placeholder="Number" required/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-3 mb-3">
                            <label htmlFor="validationCustom027" className="h6">Date</label>
                            <select className="custom-select mb-3 mr-3" id="validationCustom027" required>
                                <option selected>DD/MM/YYYY</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom021" className="h6">Reference</label>
                                <input type="number" className="form-control" id="validationCustom021" value="" placeholder="Search Reference" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom022" className="h6">Currency</label>
                                <input type="number" className="form-control" id="validationCustom022" placeholder="Pakistani Rupees(Rs)" disabled/>
                            </div>
                        </div>
                        <div className="form-row mb-3 justify-content-between flex-md-row flex-column">
                            <div className="col-md-3">
                                <label htmlFor="validationCustom02" className="h6">Narration</label>
                                <input type="number" className="form-control" id="validationCustom02" value="" placeholder="Narration" required/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="table-responsive px-md-4 pt-md-5 px-1 pt-1">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Payment mode</th>
                                <th scope="col">Account</th>
                                <th scope="col">Document No.</th>
                                <th scope="col">Amount</th> 
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td scope="row">
                                <select className="custom-select mb-3 mr-3" id="validationCustom027" required>
                                    <option selected>Cash</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </td>
                            <td>
                                <select className="custom-select mb-3 mr-3" id="validationCustom027" required>
                                    <option selected>Petty Cash</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </td>
                            <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="Document No." required/></td>
                            <td><input type="number" className="form-control" id="validationCustom01" value="" placeholder="0" required/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="row mx-0 px-md-4 pt-md-4 px-1 pt-1">
                    <div className="col-md-5 col-12">
                        <textarea type="text" className="form-control mt-2 w-100 rounded-3" rows="5" cols="40" id="validationCustom01" value="" placeholder="Comments" required></textarea>
                        <h6 className="my-3">Attachments</h6>
                        <div className="w-100 dashed mb-3">
                            <div className="input-group p-md-4 p-2">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"/>
                                    <label className="custom-file-label border-0 w-50 mx-auto" htmlFor="inputGroupFile01"><span className="hide-me">Drop Files</span></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 col-12">
                        <form>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-4 col-form-label h6 text-muted">Total Amount(Rs)</label>
                                <div className="col-sm-8">
                                <input type="text" className="form-control" id="inputPassword3"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="text-md-right text-center mt-2">
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
}
 
export default Add_BalSheet;