import React from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

import '../Dashboard/card.css'; // Custom CSS file

function AddExpenseModal({
  isExpenseModalVisible,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  
  return (
    <Modal
    className="modal"
      title="Add Expense"
      open={isExpenseModalVisible}
      onCancel={handleExpenseCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input full-width" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" className="custom-input full-width" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="custom-input full-width" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Tag"
          className="tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2 full-width">
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            {/* Add more tags here */}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn " type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;
