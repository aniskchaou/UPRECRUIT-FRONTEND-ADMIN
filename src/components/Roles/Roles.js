import React, { useEffect, useState, useCallback } from 'react';
import './Roles.css';
import showMessage from '../../libraries/messages/messages';
import roleHTTPService from '../../main/services/roleHTTPService';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Empty, Spin, Tooltip, Row, Col, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => { getAllRoles(); }, []);

  const getAllRoles = () => {
    setLoading(true);
    roleHTTPService.getAllRoles()
      .then(response => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showMessage('Error', 'Failed to load roles', 'error');
      });
  };

  const filterData = useCallback((data, search) => {
    if (!search) return setFilteredRoles(data);
    setFilteredRoles(data.filter(r => r.name?.toLowerCase().includes(search.toLowerCase())));
  }, []);

  useEffect(() => { filterData(roles, searchText); }, [roles, searchText, filterData]);

  const handleAdd = (values) => {
    roleHTTPService.createRole(values)
      .then(() => {
        getAllRoles();
        setAddModalVisible(false);
        form.resetFields();
        showMessage('Success', 'Role created', 'success');
      })
      .catch(() => showMessage('Error', 'Failed to create role', 'error'));
  };

  const handleEdit = (values) => {
    roleHTTPService.editRole(editingRole.id, values)
      .then(() => {
        getAllRoles();
        setEditModalVisible(false);
        setEditingRole(null);
        showMessage('Success', 'Role updated', 'success');
      })
      .catch(() => showMessage('Error', 'Failed to update role', 'error'));
  };

  const handleDelete = (id) => {
    roleHTTPService.removeRole(id)
      .then(() => {
        getAllRoles();
        showMessage('Success', 'Role deleted', 'success');
      })
      .catch(() => showMessage('Error', 'Failed to delete role', 'error'));
  };

  const openEditModal = (record) => {
    setEditingRole(record);
    editForm.setFieldsValue({ name: record.name });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag color="blue">{text || '\u2014'}</Tag>,
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button type="default" size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete role"
              description="Are you sure?"
              onConfirm={() => handleDelete(record.id)}
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
          <h2 className="module-page__title">Role Management</h2>
          <p className="module-page__subtitle">Define and manage permission roles for your team.</p>
          <div className="module-page__meta">
            <span>Access control</span>
            <span>Permission management</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredRoles.length}</strong>
            <span>Total roles</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }} wrap>
          <Col flex="auto">
            <Input
              placeholder="Search roles..."
              prefix="Search"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </Col>
          <Col>
            <Space>
              <Button icon={<PlusOutlined />} type="primary" onClick={() => setAddModalVisible(true)}>
                Add Role
              </Button>
              <Button icon={<ReloadOutlined />} onClick={getAllRoles} />
            </Space>
          </Col>
        </Row>

        <Spin spinning={loading}>
          <Table
            dataSource={filteredRoles}
            columns={columns}
            rowKey="id"
            size="middle"
            locale={{ emptyText: <Empty description="No roles found" /> }}
            pagination={{ pageSize: 10, showSizeChanger: false }}
          />
        </Spin>
      </div>

      <Modal
        title="Add Role"
        open={addModalVisible}
        onCancel={() => { setAddModalVisible(false); form.resetFields(); }}
        footer={null}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}>
            <Input placeholder="e.g. Recruiter, HR Manager..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Create</Button>
              <Button onClick={() => { setAddModalVisible(false); form.resetFields(); }}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Role"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setEditingRole(null); }}
        footer={null}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: 'Role name is required' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Save</Button>
              <Button onClick={() => { setEditModalVisible(false); setEditingRole(null); }}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;

