import { Row, Card, Button } from 'antd'
import React from 'react';
import './card.css';

const Cards = ({total,contentStyle, Income,expense, showExpenseModal,showIncomeModal}) => {
  
  return (
    <div>
       <Row className='my-row' style={contentStyle}
    >
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>${total}</p>
        {/*<Button type='primary' className="btn" style={{ margin: 0 }} >
          Reset Balance
        </Button>*/}
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>${Income}</p>
     
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>${expense}</p>
        {/*<Button type='primary' className="btn" onClick={showExpenseModal}
        >
          Add Expense
        </Button>*/}
      </Card>
    </Row>
    </div>
  )
}

export default Cards