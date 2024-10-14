import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, message } from 'antd';
import '../Dashboard/card.css'; // Custom CSS file

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  expenseData,
  setExpenseData,
  selectedRecord,
  isEditMode,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isExpenseModalVisible && selectedRecord) {
      form.setFieldsValue({
        name: selectedRecord.tag,
        amount: selectedRecord.amount,
        transaction_date: selectedRecord.transaction_date,
      });
    }
  }, [isExpenseModalVisible, selectedRecord]);

  const addExpense = async (values) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/expense/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: `${token}`,
        },
        body: JSON.stringify({
          amount: values.amount,
          tag: values.name,
          transaction_date: values.date,
          type: 'expense',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const data = await response.json();
      setExpenseData([...expenseData, data]);
      message.success('Expense added successfully!');
    } catch (error) {
      message.error('There was an error adding the expense.');
      console.log(error);
    }
  };

  const updateExpense = async (values) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/expense/expense/${selectedRecord.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: `${token}`,
        },
        body: JSON.stringify({
          amount: values.amount,
          tag: values.name,
          transaction_date: values.date,
          type: 'Expense',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      const updatedData = await response.json();
      const updatedExpenseData = expenseData.map((expense) =>
        expense.id === selectedRecord.id ? updatedData : expense
      );
      setExpenseData(updatedExpenseData);
      message.success('Expense updated successfully!');
    } catch (error) {
      message.error('There was an error updating the expense.');
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    if (isEditMode) {
      await updateExpense(values);
    } else {
      await addExpense(values);
    }
    form.resetFields();
    handleExpenseCancel();
  };

  return (
    <Modal
      className="modal"
      title={isEditMode ? 'Edit Expense' : 'Add Expense'}
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" size="large" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name of the transaction!' }]}
        >
          <Input type="text" className="custom-input full-width" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input the expense amount!' }]}
        >
          <Input type="number" className="custom-input full-width" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select the expense date!' }]}
        >
          <DatePicker className="custom-input full-width" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item>
          <Button className="btn" type="primary" htmlType="submit">
            {isEditMode ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;