import { Table,Select,Radio } from 'antd'
import papaparse, { unparse } from 'papaparse';
import React, { useEffect, useState } from 'react'
import './table.css'

const Tables = ({transactions,
  pagination,
  setPagination,
  fetchData
}) => {
    let {Option}= Select;
    const [customPageSize,setCustomPageSize] = useState(10)
    const [search,setSearch]=useState("");
    const [sortKey,setSortKey]=useState("");
    const [typeFilter,setTypefilter] = useState("")
    const [monthFilter,setMonthFilter]= useState("")

    const handleTableChange = (pagination) => {
        console.log('handleTableChange', pagination);
        setPagination(pagination)
        fetchData(pagination.current,pagination.pageSize)
    };

    useEffect(()=>{
        fetchData(pagination.current,pagination.pageSize)
    },[])
    const column=[
      {
        title: 'No',

        key: 'key',
        render: (text, record, index) => {
          const { current, pageSize } = pagination;
          return (current - 1) * pageSize + index + 1; // Calculate the row number
        },
       
      },
      {
        title: 'Name',
        dataIndex: 'tag',
        key: 'tag',
      }, {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
      },
    {
        title:"Type",
        dataIndex: 'type',
        key: 'type',
    },{
        title:"Date",
        dataIndex: 'formattedDate',
        key: 'date',
    }]

    let normalizedTransactions = Array.isArray(transactions)
  ? transactions
      .filter((item) => item !== undefined && item !== null) // Filter undefined entries
      .map((item) => {
        // If object is nested 
        if (item[0]) {
          return item[0];
        }
        return item; 
      })
  : [];

const formatDate=(dateString)=>{
  const date = new Date(dateString);
  if(!isNaN(date.getTime())){
  return date.toISOString().split('T')[0];
  }
  return null;
}

// Filtering
let filters = normalizedTransactions.filter((item) => {
  if(!item.transaction_date) return false;
  const transactionDate  = formatDate(item.transaction_date);
  if(!transactionDate) return false;
  const transactionMonth = new Date(item.transaction_date).toLocaleString('default', { month: 'long' });
  return (
    item.tag &&
    item.tag.toLowerCase().includes(search.toLowerCase()) &&
    (monthFilter === "" || transactionMonth.toLowerCase() === monthFilter.toLowerCase())
  );
});

filters.forEach((item)=>{
  item.formattedDate = formatDate(item.transaction_date);
})
// Sorting 
let sorted = filters.sort((a, b) => {
  if (sortKey === "date") return new Date(a.transaction_date) - new Date(b.transaction_date);
  else if (sortKey === "amount") return parseFloat(a.amount) - parseFloat(b.amount);
  else return 0; // No sorting case
});

// export 
function exportToCsv() {
  const csv = unparse(sorted, {
    fields: ["id", "user_id", "amount", "tag", "type", "transaction_date", "created_at"],
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

  return (
    <div className='Table-mainDiv'>
      <div className='Table-firstchild'>
        <div className="input-flex">
          <input
           className='inputs'
           value={search}
           onChange={(e)=> setSearch(e.target.value)}
           placeholder='Search by name' />
        </div>
      <Select
        className="select-input"
        onChange={(value) => setMonthFilter(value)} // Set selected month
        value={monthFilter} // selected value
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
    <div className="my-table" >
        <div className="inside-table">
            <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
        
          <h2>Transactions</h2>
  
          <button className="btns" onClick={exportToCsv}>
              Export to CSV
            </button>
         
          </div>
  <Table  scroll={{ x: 'max-content' }}      
    pagination={{
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true, 
    pageSizeOptions: Array.from({length: 50}, (_, i) => (i + 1).toString()), 
  }}
    onChange={handleTableChange} 
    rowKey="id"
    dataSource={sorted}
    columns={column}
  />
    </div>
  </div>


  )
}

export default Tables