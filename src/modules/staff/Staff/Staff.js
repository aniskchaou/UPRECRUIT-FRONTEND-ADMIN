import React, { useEffect, useState, useCallback } from 'react';
import './Staff.css';
import EditStaff from '../EditStaff/EditStaff';
import AddStaff from '../AddStaff/AddStaff';
import showMessage from '../../../libraries/messages/messages';
import staffHTTPService from '../../../main/services/staffHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Staff = () => {

  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllStaff()
  }, []);

  const getAllStaff = () => {
    setLoading(true);
    staffHTTPService.getAllStaff()
      .then(response => {
        setStaff(response.data);
        filterData(response.data, searchText);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load staff', 'error')
      });
  };

  const filterData = useCallback((data, search) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.role?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredStaff(filtered);
  }, []);

  useEffect(() => {
    filterData(staff, searchText);
  }, [searchText, staff, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select staff to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => staffHTTPService.removeStaff(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllStaff();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredStaff.filter(s => selectedRowKeys.includes(s.id))
      : filteredStaff;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Full Name', 'Role'];
    const rows = data.map(item => [item.full_name, item.role]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeStaffAction = (id) => {
    staffHTTPService.removeStaff(id).then(() => {
      getAllStaff();
      showMessage('Success', 'Staff deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateStaffAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const uniqueRoles = new Set(staff.map(item => item.role).filter(Boolean)).size;

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text) => text || '—',
      sorter: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
      width: 250,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text) => <Tag color="cyan">{text || '—'}</Tag>,
      width: 200,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => updateStaffAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeStaffAction(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="module-page">
      <section className="module-page__hero">
        <div>
          <span className="module-page__eyebrow">Operations module</span>
          <h2 className="module-page__title">Staff Management</h2>
          <p className="module-page__subtitle">Manage team members and their roles.</p>
          <div className="module-page__meta">
            <span>Team management</span>
            <span>Role assignment</span>
            <span>Staff directory</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredStaff.length}</strong>
            <span>Team members</span>
          </div>
          <div>
            <strong>{uniqueRoles}</strong>
            <span>Roles</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search staff by name or role..."
                prefix="🔍"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </Col>
            {searchText && (
              <Col>
                <Button
                  icon={<UndoOutlined />}
                  onClick={() => setSearchText('')}
                  danger
                >
                  Reset
                </Button>
              </Col>
            )}
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setAddModalVisible(true)}
              >
                Add Staff
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredStaff.length === 0}
                >
                  Export
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setSelectedRowKeys([]);
                  getAllStaff();
                }}
                loading={loading}
              />
            </Col>
            {selectedRowKeys.length > 0 && (
              <Col>
                <Popconfirm
                  title="Delete Multiple"
                  description={`Delete ${selectedRowKeys.length}?`}
                  onConfirm={handleBulkDelete}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="primary" danger>
                    Delete {selectedRowKeys.length}
                  </Button>
                </Popconfirm>
              </Col>
            )}
          </Row>
        </div>
        
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredStaff}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No staff found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 900 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Staff"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditStaff staff={updatedItem} closeModal={() => {
          setEditModalVisible(false);
          getAllStaff();
        }} />
      </Modal>

      <Modal
        title="Add Staff"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddStaff closeModal={() => {
          setAddModalVisible(false);
          getAllStaff();
        }} />
      </Modal>
    </div>
  )
};

Staff.propTypes = {};
Staff.defaultProps = {};

export default Staff;

