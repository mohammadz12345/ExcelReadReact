import React, { Component } from 'react';
import XLSX from 'xlsx';
import { make_cols } from './MakeColumns';
import { SheetJSFT } from './types';

class ReadExcel extends Component {
    state = {  }
    constructor(props) {
        super(props);
        this.state = {
          file: {},
          data: [],
          cols: [],
          isEmpty:true,
        }
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
      }
     
      handleChange(e) {
        const files = e.target.files;
        if (files && files[0]) this.setState({ file: files[0] });
      };
     
      handleFile() {
        try{
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        
        reader.onload = (e) => {
           /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws);
          /* Update state */
         this.setState({ data: data, cols: make_cols(ws['!ref']) ,isEmpty:false});
          
         console.log(this.state.data);
             
        };

         if (rABS) {
          reader.readAsBinaryString(this.state.file);
        } else {
          reader.readAsArrayBuffer(this.state.file);
        };
      }catch(e){
        console.log("Empty");
      }
            }
     
      render() {
        return (
          <div>
            <label >Upload Excel</label>
            <br />
            <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
            <br /><br />
            <button onClick={this.handleFile}>Print</button>
          </div>
                  )
      }
}
 
export default ReadExcel;