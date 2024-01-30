const Add_BankDeposit = () => {
    return (  
        <>
            <div className="main-card">
                <div className="px-md-4 pt-md-4 px-1 pt-1">
                    <div className="d-flex justify-content-between flex-md-row flex-column my-2 border-bottom py-3">
                        <h4 className="mb-md-0 text-center text-md-left">Bank Deposit</h4>
                        <h4 className="mb-md-0 text-center text-md-right">Drafts</h4>
                    </div>
                    <form>
                        <div className="form-row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom01" className="h6">Customer</label>
                                <input type="text" className="form-control" id="validationCustom01" value="" placeholder="Search Customer" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom02" className="h6">Number</label>
                                <input type="number" className="form-control" id="validationCustom02" value="" placeholder="Number" required/>
                            </div>
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
                                <label htmlFor="validationCustom026" className="h6">Due Date</label>
                                <select className="custom-select mb-3 mr-3" id="validationCustom026" required>
                                    <option selected>DD/MM/YYYY</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom021" className="h6">Reference</label>
                                <input type="number" className="form-control" id="validationCustom021" value="" placeholder="Search Reference" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom024" className="h6">Salesman</label>
                                <input type="number" className="form-control" id="validationCustom024" value="" placeholder="Search Salesman" required/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom022" className="h6">Currency</label>
                                <input type="number" className="form-control" id="validationCustom022" placeholder="Pakistani Rupees(Rs)" disabled/>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label htmlFor="validationCustom023" className="h6">Subject</label>
                                <input type="number" className="form-control" id="validationCustom023" value="" placeholder="Subject" required/>
                            </div>
                        </div>
                        <div className="form-row mb-3 justify-content-between flex-md-row flex-column">
                            <div className="col-md-3">
                                <label htmlFor="validationCustom02" className="h6">Narration</label>
                                <input type="number" className="form-control" id="validationCustom02" value="" placeholder="Narration" required/>
                            </div>
                            <button className="btn btn-sm btn-success mt-2">+ Quickly Add Products/Scan</button>
                        </div>
                    </form>
                </div>
                <div className="table-responsive px-md-4 pt-md-5 px-1 pt-1">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Reference</th>
                                <th scope="col">Ware house</th>
                                <th scope="col">Consignments</th>
                                <th scope="col">Quantity</th> 
                                <th scope="col">Price</th> 
                                <th scope="col">Disc.</th> 
                                <th scope="col">Amount</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row"><input type="text" className="form-control" id="validationCustom01" value="Mark" placeholder="Search products" required/>
                                <textarea type="text" className="form-control mt-2" id="validationCustom01" value="" placeholder="Description" required></textarea></td>
                                <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="Warehouse saddar" required/></td>
                                <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="Search consignments" required/></td>
                                <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="0" required/></td>
                                <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="0" required/></td>
                                <td><div className="input-group">
                                <input type="text" className="form-control" id="validationCustomUsername" placeholder="0" aria-describedby="inputGroupAppend" required/>
                                <div className="input-group-append">
                                    <span className="input-group-text" id="inputGroupAppend">%</span>
                                </div>
                                </div></td>
                                <td><input type="text" className="form-control" id="validationCustom01" value="" placeholder="0" required/></td>
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
                                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label text-muted h6">Gross</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputEmail3"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-muted h6">Discount</label>
                                <div className="col-sm-10 d-flex flex-row justify-content-around">
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="validationDefaultUsername"  aria-describedby="inputGroupPrepend2" required/>
                                        <div className="input-group-append">
                                            <span className="input-group-text" id="inputGroupPrepend2">%</span>
                                        </div>
                                    </div>
                                    <input type="text" className="form-control ml-3" id="inputPassword3"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-muted h6">Tax</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword3"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-muted h6">Shipping Charges</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword3"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-muted h6">Round Off</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword3"/>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label text-muted h6">Net(Rs)</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword3"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="validationCustom03" className="font-weight-bold">Cash Account</label>
                                    <select className="custom-select mb-3 mr-3" id="validationCustom03" required>
                                        <option selected>-Choose-</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="validationCustom01" className="font-weight-bold">Reference</label>
                                    <input type="text" className="form-control text-dark bg-light" id="validationCustom01" value="" placeholder="Reference" required/>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="validationCustom02" className="font-weight-bold">Received(Rs)</label>
                                    <input type="text" className="form-control text-dark bg-light" id="validationCustom02" value="" placeholder="0" required/>
                                </div>
                            </div>
                        </form>
                        <div className="text-md-right text-center mt-2">
                        <button type="submit" class="btn btn-success mb-2 px-md-4 p-1 mr-2">
                        Save & Approved
                        </button>
                        <button type="submit" class="btn px-md-5 p-1 btn-primary mb-2 ml-2">
                        Cancel
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default Add_BankDeposit;