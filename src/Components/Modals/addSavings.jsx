import React, { useEffect } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import '../Dashboard/card.css'; // Make sure to update this with the new styles

function AddSavingModal({
  isSavingModalVisible,
  handleSavingCancel,
  savingData,
  setsavingData,
  selectedRecord,
  fetchData,
  isEditMode,
}) {

  const [form] = Form.useForm();

  useEffect(() => {
    if (isSavingModalVisible && selectedRecord) {
      form.setFieldsValue({
        name: selectedRecord.tag,
        amount: selectedRecord.amount,
        transaction_date: selectedRecord.transaction_date,
      });
    }
  }, [isSavingModalVisible, selectedRecord]);

  const handleAdd = async(values)=>{
    const token = localStorage.getItem("token")
   try{
    const response = await fetch("/api/saving/saving",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        token:`${token}`
      },
      body: JSON.stringify({
        amount: values.amount,
          tag: values.name,
          transaction_date: values.date,
          type: 'Saving',
      })
    });

    if(!response.ok){
      console.log("Error in response")
    }
    
    message.success("Saving added Successfuly")
    fetchData()
  }
  catch(error){
    console.log("Error while adding Saving",error);
  }
  }

  const handleUpdate = async(values)=>{
    const token = localStorage.getItem("token")
    try{
      const response = await fetch(`/api/saving/saving/${selectedRecord.id}`,{
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
      message.success("Updated Saving Successfully")
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
    handleSavingCancel();
  }

  return (
    <Modal
      title={isEditMode? "Update Saving" :"Add Saving"}
      open={isSavingModalVisible}
      onCancel={handleSavingCancel}
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
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" className="custom-input full-width-input" />
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
          {isEditMode? "Update Saving": "Add Saving"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddSavingModal;

