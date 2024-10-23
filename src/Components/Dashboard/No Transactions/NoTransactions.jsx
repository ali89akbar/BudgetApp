import React from "react";
import transactions from "../../../assets/transactions.svg";
import './style.css'
function NoTransactions() {
  return (
    <div className="noTransdiv">
      <img src={transactions} className="noTrans-img"/>
      <p className="noTrans-p">
        You Have No Transactions Currently
      </p>
    </div>
  );
}

export default NoTransactions;