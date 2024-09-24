import React from 'react'
import AddIncomeModal from '../../Modals/addIncome'

const Income = () => {
    const [isIncomeModal,setisIncomeModal]= useState(false)
    const [Income,setIncome]= useState(100)
    const [isExpenseModal,setIsExpenseModal]=useState(false)
    const [expense,setExpense]= useState(100)
    const [total,setTotal]= useState(100)
    
  const showExpenseModal=()=>{
    setIsExpenseModal(true);
}
const showIncomeModal=()=>{
    setisIncomeModal(true);
}
const handleExpense=()=>{
    setIsExpenseModal(false)
}
const handleIncome=()=>{
    setisIncomeModal(false)
}

const onFinish=(values,type)=>{
    console.log("Finish",values,type)
}
  return (
    <div>
           <Button type='primary'
    className="btn"
          style={{ margin: 0 }}
         onClick={showIncomeModal}
        >
          Add Income
        </Button>


        <AddIncomeModal
          isIncomeModalVisible={isIncomeModal}
          handleIncomeCancel={handleIncome}
          onFinish={onFinish}
        />
    </div>
  )
}

export default Income