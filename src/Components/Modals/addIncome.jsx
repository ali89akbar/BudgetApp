import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import '../Dashboard/card.css'; // Make sure to update this with the new styles

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  incomeData,
  setIncomeData,
  selectedRecord,
  isEditMode,
  fetchData,
}) {

  const [form] = Form.useForm();

  useEffect(() => {
    if (isIncomeModalVisible && selectedRecord) {
      form.setFieldsValue({
        name: selectedRecord.tag,
        amount: selectedRecord.amount,
        transaction_date: selectedRecord.transaction_date,
      });
    }
  }, [isIncomeModalVisible, selectedRecord]);

  const handleAdd = async(values)=>{
    const token = localStorage.getItem("token")
   try{
    const response = await fetch("/api/income/adds",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        token:`${token}`
      },
      body: JSON.stringify({
        amount: values.amount,
          tag: values.name,
          transaction_date: values.date,
          type: 'Income',
      })
    });

    if(!response.ok){
      console.log("Error in response")
    }
  
    message.success("Income added Successfuly")
    fetchData()
  }
  catch(error){
    console.log("Error while adding Income",error);
    message.error("Error", error)
  }
  }

  const handleUpdate = async(values)=>{
    const token = localStorage.getItem("token")
    try{
      const response = await fetch(`/api/income/updates/${selectedRecord.id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          token:`${token}`
        },
        body: JSON.stringify({
          amount: values.amount,
          tag: values.name,
          transaction_date: values.date,
        })
      });
      if(!response.ok){
        console.log("Error in response")
      }
     
      message.success("Income updated Successfuly")
      fetchData()
     
    }
    catch(error){
      console.log("Error While Updating Income",error)
    }
  }

  const handleSubmit= async(values)=>{
    if(isEditMode){
      await handleUpdate(values)
    }
    else{
      await handleAdd(values);
    }
    form.resetFields();
    handleIncomeCancel();
  }

  return (
    <Modal
      title={isEditMode? "Update Income" :"Add Income"}
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
      
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="full-width-form" // Custom class for full width
      >
        <Form.Item
          label="Name"
          name="name"
          style={{ fontWeight: 600 }}
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input full-width-input" />
        </Form.Item>
        
        <Form.Item
  label="Amount"
  name="amount"
  style={{ fontWeight: 600 }}
  rules={[
    { 
      required: true, 
      message: "Please input the income amount!" 
    },
    { 
      validator: (_, value) => {
        if (value && value < 1) {
          return Promise.reject(new Error("Amount must be at least 1!"));
        }
        return Promise.resolve();
      }
    }
  ]}
>
  <Input 
    type="number" 
    className="custom-input full-width-input" 
    min={1} 
  />
</Form.Item>
        <Form.Item
          label="Date"
          name="date"
          style={{ fontWeight: 600 }}
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input full-width-input" />
        </Form.Item>
        <Form.Item>
          <Button className="btn full-width-input" type="primary" htmlType="submit">
          {isEditMode? "Update Income": "Add Income"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;

