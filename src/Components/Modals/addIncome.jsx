import React from "react";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import '../Dashboard/card.css'; // Make sure to update this with the new styles

function AddIncomeModal({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  
  return (
    <Modal
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
      
    >
      <Form
        form={form}
        layout="vertical"
        
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
        }}
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

        <Form.Item
          label="Tag"
          name="tag"
          className="tag"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2 full-width-input">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn full-width-input" type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;
