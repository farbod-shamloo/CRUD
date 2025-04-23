import React, { useState } from "react";
import { Table, Button, Modal, Input, Form, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CreateUser = ({ data , setData}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();


  const showModal = () => {
    setIsModalVisible(true);
  };

  // تابع بستن مدال
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // تابع برای ثبت کاربر جدید
  const handleAddUser = (values) => {
    const newUser = {
      id: data.length + 1, 
      ...values, 
    };

   
    setData([newUser, ...data]);


    setIsModalVisible(false);

    notification.success({
      message: "ثبت کاربر جدید موفقیت‌آمیز بود",
      description: `کاربر ${values.firstName} ${values.lastName} با موفقیت ثبت شد.`,
    });

   
    form.resetFields();
  };



  return (
    <div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: "20px" }}
      >
        ثبت کاربر جدید
      </Button>



      <Modal
        title="ثبت کاربر جدید"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
    
          <Form.Item
            label="نام"
            name="firstName"
            rules={[{ required: true, message: "لطفاً نام را وارد کنید" }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="نام خانوادگی"
            name="lastName"
            rules={[
              { required: true, message: "لطفاً نام خانوادگی را وارد کنید" },
            ]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            label="کد ملی"
            name="nationalCode"
            rules={[
              { required: true, message: "لطفاً کد ملی را وارد کنید" },
              { len: 10, message: "کد ملی باید 10 رقم باشد" },
            ]}
          >
            <Input />
          </Form.Item>

   
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              ثبت
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUser;
