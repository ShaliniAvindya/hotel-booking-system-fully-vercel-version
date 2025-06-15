import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Select, message as antdMessage, Checkbox, Table } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { a } from 'react-spring';

const { Option } = Select;

const NotificationForm = () => {
  const [type, setType] = useState('email');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get('/api/users/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      antdMessage.error('Failed to fetch registered users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.email));
    } else {
      setSelectedUsers([]);
    }
  };

  const sendNotification = async () => {
    const recipients =
      type === 'email'
        ? sendToAll
          ? users.map((user) => user.email)
          : selectedUsers
        : [phoneNumber];

    const payload = { type, recipients, subject, message };

    try {
      const response = await axios.post('/api/notifications/send-to-users', payload);
      if (response.data.success) {
        antdMessage.success('Notification sent successfully');
        resetForm();
      } else {
        antdMessage.error(response.data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error.response || error);
      antdMessage.error('Failed to send notification');
    }
  };

  const resetForm = () => {
    setType('email');
    setSelectedUsers([]);
    setSubject('');
    setMessage('');
    setSendToAll(false);
    setPhoneNumber('');
  };

  const columns = [
    {
      title: <div style={{ textAlign: 'center' }}>Name</div>, // Center the header only
      dataIndex: 'name',
      key: 'name',
      align: 'center', // Center the column data only
    },
    {
      title: <div style={{ textAlign: 'center' }}>Email</div>, // Center the header only
      dataIndex: 'email',
      key: 'email',
      align: 'center', // Center the column data only
    },
    {
      title: (
        <div style={{ textAlign: 'center' }}>
          <Checkbox
            indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
            checked={selectedUsers.length === users.length && users.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            Select All
          </Checkbox>
        </div>
      ), // Center the header and include the "Select All" checkbox
      key: 'select',
      align: 'center', // Center the column data only
      render: (text, record) => (
        <Checkbox
          
          checked={selectedUsers.includes(record.email)}
          onChange={(e) => {
            const newSelectedUsers = e.target.checked
              ? [...selectedUsers, record.email]
              : selectedUsers.filter((email) => email !== record.email);
            setSelectedUsers(newSelectedUsers);
          }}
          disabled={sendToAll || type === 'sms'}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        borderRadius: '15px',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        padding: '0 2vw',
      }}
    >
      <h2
        style={{
          color: '#010e30',
          textAlign: 'center',
          fontFamily: 'Playfair Display',
          fontSize: '40px',
          fontWeight: 'bold',
          marginBottom: '1vh',
        }}
      >
        Send Notification
      </h2>
      <Select
        value={type}
        onChange={(value) => setType(value)}
        style={{
          width: '10%',
          marginBottom: '15px',
          borderRadius: '10px',
        }}
      >
        <Option value="email">Email</Option>
        <Option value="sms">SMS</Option>
      </Select>
      {type === 'email' && (
        <Input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            marginBottom: '15px',
            borderRadius: '10px',
            padding: '10px',
          }}
        />
      )}
      <Input.TextArea
        rows={4}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          marginBottom: '15px',
          borderRadius: '10px',
          padding: '10px',
        }}
      />
      {type === 'sms' && (
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{
            marginBottom: '15px',
            borderRadius: '10px',
          }}
        />
      )}
      {type === 'email' && (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="email"
          loading={loadingUsers}
          pagination={{ pageSize: 5 }}
          style={{
            marginBottom: '15px',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '4vh',
        }}
      >
        <Button
          type="primary"
          onClick={sendNotification}
          disabled={
            !message || (type === 'sms' && !phoneNumber) || (type === 'email' && !sendToAll && selectedUsers.length === 0)
          }
          style={{
            border: 'none',
            borderRadius: '10px',
            padding: '20px 20px',
            fontSize: '16px',
            backgroundColor: '#1E3A8A',
            color: 'white',
          }}
          icon={<SendOutlined />}
        >
          Send Notification
        </Button>
        <Button
          onClick={resetForm}
          danger
          style={{
            borderRadius: '10px',
            padding: '20px 20px',
            fontSize: '16px',
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default NotificationForm;
