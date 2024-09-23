import { Table,Select } from 'antd'
import React, { useState } from 'react'

const Tables = ({transactions}) => {
    let {Option}= Select;
    const [search,setSearch]=useState("");
    const [typeFilter,setTypefilter] = useState("")
    const column=[{
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

    let filters= transactions.filter((item)=> item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
);
  return (
    <>
    <input
    value={search}
    onChange={(e)=> setSearch(e.target.value)}
    placeholder='Search by name' />
    <Select
    className="select-input"
    onChange={(value)=> setTypefilter(value)}
    value={typeFilter}
    placeholder ="Filter"
    allowClear
    >
        <Option value="">All</Option>
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>
    </Select>
    <Table  dataSource={filters} columns={column}/>
    
    
    </>
  )
}

export default Tables