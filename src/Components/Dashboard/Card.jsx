import { Row, Card, Button } from 'antd'
import React from 'react';
import './card.css';

const Cards = ({total, Income,expense, showExpenseModal,showIncomeModal}) => {
  return (
    <div>
       <Row className='my-row'
    >
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>{total}</p>
        <Button type='primary' class="btn " style={{ margin: 0 }} >
          Reset Balance
        </Button>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>{Income}</p>
        <Button type='primary'
    className="btn"
          style={{ margin: 0 }}
         onClick={showIncomeModal}
        >
          Add Income
        </Button>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>{expense}</p>
        <Button type='primary' className="btn" onClick={showExpenseModal}
        >
          Add Expense
        </Button>
      </Card>
    </Row>
    </div>
  )
}

export default Cards