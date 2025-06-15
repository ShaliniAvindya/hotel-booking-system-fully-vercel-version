import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, Layout, Typography, Spin, Card } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Content } = Layout;
const { Title } = Typography;

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleStatusChange = (value, index) => {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = value;
    setBookings(updatedBookings);
    axios
      .put(`http://localhost:8000/api/book/update-status/${updatedBookings[index]._id}`, {
        status: value,
      })
      .catch((err) => console.error('Error updating status:', err));
  };

  const columns = [
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'From Date',
      dataIndex: 'from_date',
      key: 'from_date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'To Date',
      dataIndex: 'to_date',
      key: 'to_date',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Total Days',
      dataIndex: 'total_days',
      key: 'total_days',
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record, index) => {
        const color = status === 'Cancelled' ? 'red' : 'green';
        return (
          <div>
            {status === 'Booked' ? (
              <Select
                value={status} // Use value instead of defaultValue
                style={{ width: 120 }}
                onChange={(value) => handleStatusChange(value, index)}
              >
                <Option value="Completed">Completed</Option>
                <Option value="Booking">Booking</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            ) : (
              <Tag color={color}>{status}</Tag>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/book/all');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout style={{ background: '#f0f2f5', minHeight: '80vh' }}>
      <Content style={{ padding: '0px', margin: '0' }}>
        <Card
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
        >
          <Title
            level={3}
            style={{
              marginBottom: '20px',
              textAlign: 'center',
              color: '#031d42',
              fontWeight: 'bold',
              fontSize: '35px',
              fontFamily: 'Playfair Display'
            }}
          >
            Bookings
          </Title>
          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              columns={columns}
              dataSource={bookings}
              loading={loading}
              rowKey={(record) => record._id}
              pagination={{ pageSize: 7 }}
              bordered
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default Bookings;
