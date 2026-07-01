import React, { useEffect, useState, useCallback } from 'react';
import './ApplyJob.css';
import AddApplyJob from '../AddApplyJob/AddApplyJob';
import showMessage from '../../../libraries/messages/messages';
import applyHTTPService from '../../../main/services/applyHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Select, Row, Col, Drawer, Tag } from 'antd';
import { DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const ApplyJob = () => {

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    getAllApply()
  }, []);

  const getAllApply = () => {
    setLoading(true);
    applyHTTPService.getAllApply()
      .then(response => {
        setApplications(response.data);
        filterData(response.data, searchText, filterStatus);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load applications', 'error')
      });
  };

  const filterData = useCallback((data, search, status) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.candidate?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) filtered = filtered.filter(item => item.status === status);
    setFilteredApplications(filtered);
  }, []);

  useEffect(() => {
    filterData(applications, searchText, filterStatus);
  }, [searchText, filterStatus, applications, filterData]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'green';
      case 'Rejected': return 'red';
      case 'Pending': return 'orange';
      default: return 'blue';
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select applications to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => applyHTTPService.removeApply(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllApply();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredApplications.filter(a => selectedRowKeys.includes(a.id))
      : filteredApplications;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Candidate', 'Job Offer', 'Application Date', 'Status', 'Appreciation'];
    const rows = data.map(item => [item.candidate, item.jobOffer, item.applicationDate, item.status, item.appreciation]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeApplicationAction = (id) => {
    applyHTTPService.removeApply(id).then(() => {
      getAllApply();
      showMessage('Success', 'Application deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const handleResetFilters = () => {
    setSearchText('');
    setFilterStatus('');
    showMessage('Success', 'Filters reset', 'success');
  };

  const statusList = [...new Set(applications.map(item => item.status).filter(Boolean))].sort();

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      width: 180,
      sorter: (a, b) => (a.candidate || '').localeCompare(b.candidate || ''),
    },
    {
      title: 'Job Offer',
      dataIndex: 'jobOffer',
      key: 'jobOffer',
      width: 150,
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={getStatusColor(text)}>{text || '—'}</Tag>,
      width: 120,
    },
    {
      title: 'Appreciation',
      dataIndex: 'appreciation',
      key: 'appreciation',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title="Delete"
          description="Confirm?"
          onConfirm={() => removeApplicationAction(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="module-page">
      <section className="module-page__hero">
        <div>
          <span className="module-page__eyebrow">Core module</span>
          <h2 className="module-page__title">Job Applications</h2>
          <p className="module-page__subtitle">Track and manage all job applications with detailed status updates.</p>
          <div className="module-page__meta">
            <span>Application tracking</span>
            <span>Status management</span>
            <span>Candidate pipeline</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredApplications.length}</strong>
            <span>Total applications</span>
          </div>
          <div>
            <strong>{applications.filter(a => a.status === 'Pending').length}</strong>
            <span>Pending</span>
          </div>
          <div>
            <strong>{applications.filter(a => a.status === 'Accepted').length}</strong>
            <span>Accepted</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search by candidate..."
                prefix="🔍"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </Col>
            <Col>
              <Tooltip title="Filters">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  type={filterStatus ? "primary" : "default"}
                >
                  Filters
                </Button>
              </Tooltip>
            </Col>
            {(searchText || filterStatus) && (
              <Col>
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleResetFilters}
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
                Add Application
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredApplications.length === 0}
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
                  getAllApply();
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
            dataSource={filteredApplications}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No applications found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 1000 }}
          />
        </Spin>
      </div>

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Status</label>
            <Select
              placeholder="All statuses"
              value={filterStatus}
              onChange={setFilterStatus}
              options={statusList.map(s => ({ label: s, value: s }))}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <Button onClick={handleResetFilters} style={{ marginTop: '16px' }}>Clear All</Button>
        </div>
      </Drawer>

      <Modal
        title="Add Application"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddApplyJob closeModal={() => {
          setAddModalVisible(false);
          getAllApply();
        }} />
      </Modal>
    </div>
  )
};

ApplyJob.propTypes = {};
ApplyJob.defaultProps = {};

export default ApplyJob;

