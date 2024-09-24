import { Table,Select,Radio } from 'antd'
import { unparse } from 'papaparse';
import React, { useState } from 'react'

const Tables = ({transactions}) => {
    let {Option}= Select;
    const [search,setSearch]=useState("");
    const [sortKey,setSortKey]=useState("");
    const [typeFilter,setTypefilter] = useState("")
    const [monthFilter,setMonthFilter]= useState("")
    const column=[
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
      }, {
        title: 'Tag',
        dataIndex: 'tag',
        key: 'tag',
  
    },
    {
        title:"Type",
        dataIndex: 'type',
        key: 'type',
    },{
        title:"Date",
        dataIndex: 'date',
        key: 'date',
    }]

    let filters = transactions.filter((item) => {
      const transactionMonth = new Date(item.date).toLocaleString('default', { month: 'long' });
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (monthFilter === "" || transactionMonth.toLowerCase() === monthFilter.toLowerCase())
      );
    });
    


  let sorted = filters.sort((a,b)=>{
    if(sortKey==="date") return new Date(a.date) - new Date(b.date);
    else if(sortKey==="amount") return a.amount - b.amount;
    else return 0;  //No sort case
  } )



  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(){

  }
  
  return (
    <div
      style={{
        width: "100%",
        padding: "0rem 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
    <input
    value={search}
    onChange={(e)=> setSearch(e.target.value)}
    placeholder='Search by name' />
    </div>
    <Select
  className="select-input"
  onChange={(value) => setMonthFilter(value)} // Set the selected month filter
  value={monthFilter} // Track the selected value
  placeholder="Filter by Month"
  allowClear
>
  <Option value="">All</Option>
  <Option value="January">January</Option>
  <Option value="February">February</Option>
  <Option value="March">March</Option>
  <Option value="April">April</Option>
  <Option value="May">May</Option>
  <Option value="June">June</Option>
  <Option value="July">July</Option>
  <Option value="August">August</Option>
  <Option value="September">September</Option>
  <Option value="October">October</Option>
  <Option value="November">November</Option>
  <Option value="December">December</Option>
</Select>
    </div>
    <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>Transactions</h2>
    <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btns" onClick={exportToCsv}>
              Export to CSV
            </button>
            <label for="file-csv"
            style={{display:"flex", justifyContent:"center",color:"white", textAlign:"center" , alignItems:"center"}}
            className="btns">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
          </div>

    <Table  dataSource={sorted} columns={column}/>
    
    
    </div>
    </div>
  )
}

export default Tables