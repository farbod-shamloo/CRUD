import React, { useEffect, useState } from "react";

import {useSearchParams} from "react-router-dom"
import styles from "./UserList.module.css";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Tooltip,
  message,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CreateUser from "./CreateUser";

function UserList() {
  // استفاده از useState برای مدیریت وضعیت‌ها و داده‌ها
  const [data, setData] = useState([]); // داده‌های کاربران
  const [editingUser, setEditingUser] = useState(null); // کاربر در حال ویرایش
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // وضعیت نمایش مدال ویرایش
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // وضعیت نمایش مدال حذف
  const [currentUserIdToDelete, setCurrentUserIdToDelete] = useState(null); // ذخیره‌ی شناسه کاربری که باید حذف شود
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); // وضعیت نمایش مدال فیلتر
  const [filteredData, setFilteredData] = useState([]); // داده‌های فیلتر شده
  const [searchText, setSearchText] = useState(""); // متن جستجو
  const [selectedType, setSelectedType] = useState(null); // نوع فیلتر کاربر
  const [selectedStatus, setSelectedStatus] = useState(null); // وضعیت فیلتر کاربر


  
  const [searchParams, setSearchParams] = useSearchParams();
const initialPage = parseInt(searchParams.get("page")) || 1;
const initialPageSize = parseInt(searchParams.get("pageSize")) || 5;

const [currentPage, setCurrentPage] = useState(initialPage);
const [pageSize, setPageSize] = useState(initialPageSize);

useEffect(() => {
  setSearchParams({
    page: currentPage,
    pageSize: pageSize,
  });
}, [currentPage, pageSize]);

  // گرفتن دیتا از فایل json
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("./data.json");
      const data = await res.json();
      setData(data.data.items); // داده‌های بارگذاری شده را در state قرار می‌دهیم
      setIsFilterModalVisible(false); // بسته شدن مدال فیلتر بعد از بارگذاری داده‌ها
    };
    fetchData();
  }, []);

  // تابع جستجو
  const handleSearch = (value) => {
    setSearchText(value); // ذخیره متن جستجو
    filterData(value, selectedType, selectedStatus); // فیلتر داده‌ها بر اساس جستجو
  };

  // نمایش مدال فیلتر
  const handleFilterModalOpen = () => {
    setIsFilterModalVisible(true);
  };

  // بستن مدال فیلتر
  const handleFilterModalClose = () => {
    setIsFilterModalVisible(false);
  };

  // اعمال فیلترها
  const handleFilterApply = () => {
    filterData(searchText, selectedType, selectedStatus); // اعمال فیلتر
    setIsFilterModalVisible(false); // بستن مدال فیلتر
  };

  // تابع فیلتر کردن داده‌ها
  const filterData = (searchValue, typeValue, statusValue) => {
    let filtered = [...data]; // کپی از داده‌ها برای فیلتر کردن

    if (searchValue) {
      filtered = filtered.filter(
        (item) =>
          item.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.lastName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (typeValue !== null) {
      filtered = filtered.filter((item) => item.type === typeValue);
    }

    if (statusValue !== null) {
      filtered = filtered.filter((item) => item.status === statusValue);
    }

    setFilteredData(filtered); // ذخیره داده‌های فیلتر شده
  };

  // تنظیم ستون‌های جدول
  const columns = [
    {
      title: "ردیف",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "نام نام خانوادگی",
      key: "fullName",
      render: (record) => `${record.firstName} ${record.lastName}`, // ترکیب نام و نام خانوادگی
    },
    {
      title: "کد ملی",
      dataIndex: "nationalCode",
      key: "nationalCode",
    },
    {
      title: "نام کاربری",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "وضعیت کاربران",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === 1 ? "green" : "red"}>
          {status === 1 ? "فعال" : "غیرفعال"}
        </Tag>
      ),
    },
    {
      title: "ورود دو مرحله‌ای",
      dataIndex: "twoFactorEnabled",
      key: "twoFactorEnabled",
      render: (twoFactorEnabled) => (
        <Tag color={twoFactorEnabled === 1 ? "green" : "red"}>
          {twoFactorEnabled === 1 ? "فعال" : "غیر‌فعال"}
        </Tag>
      ),
    },
    {
      title: "نوع کاربر",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === 1 ? "orange" : "blue"}>
          {type === 1 ? "شهروند" : "سازمانی"}
        </Tag>
      ),
    },
    {
      title: "نام سیستم",
      dataIndex: "systems",
      key: "systems",
    },
    
    {
      title: "عملیات",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* عملیات ویرایش و حذف */}
          <Tooltip title="ویرایش">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)} // فراخوانی تابع ویرایش
              shape="circle"
            />
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)} // فراخوانی تابع حذف
              shape="circle"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // تابع ویرایش کاربر
  const handleEdit = (user) => {
    setEditingUser(user); // تعیین کاربر در حال ویرایش
    setIsEditModalVisible(true); // نمایش مدال ویرایش
  };

  // تابع حذف کاربر
  const handleDelete = (userId) => {
    setCurrentUserIdToDelete(userId); // ذخیره شناسه کاربر برای حذف
    setIsDeleteModalVisible(true); // نمایش مدال تایید حذف
  };

  // ذخیره تغییرات پس از ویرایش
  const handleSaveEdit = (values) => {
    const updatedData = data.map((user) =>
      user.id === editingUser.id ? { ...user, ...values } : user
    );
    setData(updatedData);

    const updatedFilteredData = filteredData.map((user) =>
      user.id === editingUser.id ? { ...user, ...values } : user
    );
    setFilteredData(updatedFilteredData);

    setIsEditModalVisible(false); // بستن مدال ویرایش
    message.success("ویرایش با موفقیت انجام شد"); // نمایش پیام موفقیت
  };

  // تایید حذف کاربر
  const handleConfirmDelete = () => {
    const updatedData = data.filter(
      (user) => user.id !== currentUserIdToDelete
    );
    setData(updatedData);
    setIsDeleteModalVisible(false); // بستن مدال حذف
    message.success("کاربر با موفقیت حذف شد"); // نمایش پیام موفقیت
  };

  // تغییر تعداد سطرها در هر صفحه
  const handlePageSizeChange = (value) => {
    setPageSize(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div className={styles.sub__container}>
        {/* فیلد جستجو */}
        <div>
          <Input
            style={{ width: 200, marginRight: 20 }}
            placeholder="جستجو..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)} // فراخوانی تابع جستجو
            prefix={<SearchOutlined />}
          />
          <Button
            onClick={handleFilterModalOpen} // باز کردن مدال فیلتر
            type="primary"
            style={{ margin: "20px" }}
            icon={<FilterOutlined />}
          >
            فیلتر
          </Button>
        </div>
        {/* ایجاد کاربر جدید */}
        <CreateUser data={data} setData={setData} />

        <div style={{ marginBottom: "20px" }}>
          <span>
            تعداد کل کاربران:{" "}
            {filteredData.length > 0 ? filteredData.length : data.length}
          </span>
        </div>
      </div>

      {/* جدول کاربران */}
      <Table
        dataSource={filteredData.length > 0 ? filteredData : data}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          position: ["bottomCenter"],
          current: currentPage,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
        scroll={{ x: "max-content" }}
        style={{ width: "100%" }}
      />

      {/* مدال فیلتر */}
      <Modal
        title="فیلتر کاربران"
        visible={isFilterModalVisible}
        onCancel={handleFilterModalClose} // بستن مدال فیلتر
        onOk={handleFilterApply} // اعمال فیلتر
        footer={[
          <Button key="cancel" onClick={handleFilterModalClose}>
            انصراف
          </Button>,
          <Button key="apply" type="primary" onClick={handleFilterApply}>
            اعمال فیلتر
          </Button>,
        ]}
      >
        {/* فیلتر نوع کاربر */}
        <div style={{ marginBottom: "15px" }}>
          <Select
            style={{ width: "100%" }}
            placeholder="نوع کاربر"
            value={selectedType}
            onChange={(value) => setSelectedType(value)} // تغییر نوع کاربر
            allowClear
          >
            <Select.Option value={0}>سازمانی</Select.Option>
            <Select.Option value={1}>شهروند</Select.Option>
          </Select>
        </div>

        {/* فیلتر وضعیت */}
        <div>
          <Select
            style={{ width: "100%" }}
            placeholder="وضعیت کاربر"
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)} // تغییر وضعیت کاربر
            allowClear
          >
            <Select.Option value={0}>فعال</Select.Option>
            <Select.Option value={1}>غیر فعال</Select.Option>
          </Select>
        </div>
      </Modal>

      {/* انتخاب تعداد سطرها در هر صفحه */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span style={{ marginRight: "10px" }}>تعداد سطرها:</span>
        <Select
          defaultValue={pageSize}
          style={{ width: 120 }}
          onChange={handlePageSizeChange} // تغییر تعداد سطرها
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
          <Option value={30}>30</Option>
        </Select>
      </div>

      {/* مدال ویرایش */}
      <Modal
        title="ویرایش کاربر"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)} // بستن مدال ویرایش
        footer={null}
      >
        <Form
          initialValues={{
            firstName: editingUser?.firstName,
            lastName: editingUser?.lastName,
            userName: editingUser?.userName,
            nationalCode: editingUser?.nationalCode,
          }}
          onFinish={handleSaveEdit} // فراخوانی تابع ذخیره تغییرات
        >
          <Form.Item label="نام" name="firstName">
            <Input />
          </Form.Item>
          <Form.Item label="نام خانوادگی" name="lastName">
            <Input />
          </Form.Item>
          <Form.Item label="نام کاربری" name="userName">
            <Input />
          </Form.Item>
          <Form.Item label="کد ملی" name="nationalCode">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              ذخیره تغییرات
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* مدال حذف */}
      <Modal
        title="حذف کاربر"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)} // بستن مدال حذف
        footer={[
          <Button
            key="cancel"
            onClick={() => setIsDeleteModalVisible(false)} // بستن مدال حذف
          >
            انصراف
          </Button>,
          <Button
            key="confirm"
            danger
            onClick={handleConfirmDelete} // تایید حذف
          >
            حذف
          </Button>,
        ]}
      >
        <p>آیا از حذف این کاربر اطمینان دارید؟</p>
      </Modal>
    </div>
  );
}

export default UserList;