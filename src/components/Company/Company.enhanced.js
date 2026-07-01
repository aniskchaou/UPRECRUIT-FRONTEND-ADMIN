import React, { useEffect, useState, useCallback } from 'react';
import './Company.css';
import EditCompany from '../../../components/EditCompany/EditCompany';
import AddCompany from '../../../components/AddCompany/AddCompany';
import showMessage from '../../../libraries/messages/messages';
import companyHTTPService from '../../../main/services/companyHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col, Avatar, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Company = () => {

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllCompany()
  }, []);

  const getAllCompany = () => {
    setLoading(true);
    companyHTTPService.getAllCompany()
      .then(response => {
        setCompanies(response.data);
        filterData(response.data, searchText);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load companies', 'error')
      });
  };

  const filterData = useCallback((data, search) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCompanies(filtered);
  }, []);

  useEffect(() => {
    filterData(companies, searchText);
  }, [searchText, companies, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select companies to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => companyHTTPService.removeCompany(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllCompany();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredCompanies.filter(c => selectedRowKeys.includes(c.id))
      : filteredCompanies;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Name', 'Email', 'Category', 'Phone', 'Size'];
    const rows = data.map(item => [item.name, item.email, item.category, item.telephone, item.size]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeCompanyAction = (id) => {
    companyHTTPService.removeCompany(id).then(() => {
      getAllCompany();
      showMessage('Success', 'Company deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateCompanyAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const categoryCount = new Set(companies.map(item => item.category).filter(Boolean)).size;
  const sizeCount = companies.filter(item => item.size === 'Enterprise').length;

  const columns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.logo} size={40}>{text?.charAt(0)}</Avatar>
          <span>{text}</span>
        </Space>
      ),
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => <Tag>{text || '—'}</Tag>,
      width: 120,
    },
    {
      title: 'Phone',
      dataIndex: 'telephone',
      key: 'telephone',
      width: 130,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (text) => <Tag color={text === 'Enterprise' ? 'blue' : 'default'}>{text || '—'}</Tag>,
      width: 100,
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
              onClick={() => updateCompanyAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeCompanyAction(record.id)}
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
          <span className="module-page__eyebrow">Core module</span>
          <h2 className="module-page__title">Company Management</h2>
          <p className="module-page__subtitle">Manage partner companies and organization partners.</p>
          <div className="module-page__meta">
            <span>Partner tracking</span>
            <span>Organization management</span>
            <span>Company directory</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredCompanies.length}</strong>
            <span>Total companies</span>
          </div>
          <div>
            <strong>{categoryCount}</strong>
            <span>Categories</span>
          </div>
          <div>
            <strong>{sizeCount}</strong>
            <span>Enterprise</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search companies..."
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
                Add Company
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredCompanies.length === 0}
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
                  getAllCompany();
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
            dataSource={filteredCompanies}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No companies found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 1200 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Company"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditCompany company={updatedItem} closeModal={() => {
          setEditModalVisible(false);
          getAllCompany();
        }} />
      </Modal>

      <Modal
        title="Add Company"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddCompany closeModal={() => {
          setAddModalVisible(false);
          getAllCompany();
        }} />
      </Modal>
    </div>
  )
};

Company.propTypes = {};
Company.defaultProps = {};

export default Company;
