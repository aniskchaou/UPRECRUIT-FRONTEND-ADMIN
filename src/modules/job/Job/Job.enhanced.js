import React, { useEffect, useState, useCallback } from 'react';
import './Job.css';
import EditJob from '../EditJob/EditJob';
import AddJob from '../AddJob/AddJob';
import showMessage from '../../../libraries/messages/messages';
import jobHTTPService from '../../../main/services/jobHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Select, Row, Col, Drawer, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Job = () => {

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    getAllJob()
  }, []);

  const getAllJob = () => {
    setLoading(true);
    jobHTTPService.getAllJob()
      .then(response => {
        setJobs(response.data);
        filterData(response.data, searchText, filterLocation);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load jobs', 'error')
      });
  };

  const filterData = useCallback((data, search, location) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.post?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (location) filtered = filtered.filter(item => item.location === location);
    setFilteredJobs(filtered);
  }, []);

  useEffect(() => {
    filterData(jobs, searchText, filterLocation);
  }, [searchText, filterLocation, jobs, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select jobs to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => jobHTTPService.removeJob(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllJob();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} jobs deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredJobs.filter(j => selectedRowKeys.includes(j.id))
      : filteredJobs;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Position', 'Location', 'Start Date', 'End Date', 'Experience'];
    const rows = data.map(item => [item.post, item.location, item.start, item.end, item.experienceLevel]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported successfully', 'success');
  };

  const removeJobAction = (id) => {
    jobHTTPService.removeJob(id).then(() => {
      getAllJob();
      showMessage('Success', 'Job deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateJobAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const handleAddJob = () => {
    setUpdatedItem({});
    setAddModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false)
    getAllJob()
  }

  const closeAddModal = () => {
    setAddModalVisible(false);
    getAllJob();
  };

  const handleResetFilters = () => {
    setSearchText('');
    setFilterLocation('');
    showMessage('Success', 'Filters reset', 'success');
  };

  const locationsList = [...new Set(jobs.map(item => item.location).filter(Boolean))].sort();
  const activeJobsCount = jobs.length;
  const uniqueLocations = new Set(jobs.map(item => item.location).filter(Boolean)).size;

  const columns = [
    {
      title: 'Position',
      dataIndex: 'post',
      key: 'post',
      width: 200,
      sorter: (a, b) => (a.post || '').localeCompare(b.post || ''),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      sorter: (a, b) => (a.location || '').localeCompare(b.location || ''),
    },
    {
      title: 'Start Date',
      dataIndex: 'start',
      key: 'start',
      width: 120,
    },
    {
      title: 'End Date',
      dataIndex: 'end',
      key: 'end',
      width: 120,
    },
    {
      title: 'Experience',
      dataIndex: 'experienceLevel',
      key: 'experienceLevel',
      render: (text) => <Tag color="blue">{text || '—'}</Tag>,
      width: 130,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => updateJobAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Job"
              description="Are you sure?"
              onConfirm={() => removeJobAction(record.id)}
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
          <h2 className="module-page__title">Job Management</h2>
          <p className="module-page__subtitle">
            Create, manage, and track job openings across your organization with detailed positioning and experience requirements.
          </p>
          <div className="module-page__meta">
            <span>Position tracking</span>
            <span>Location coverage</span>
            <span>Hiring pipeline</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{activeJobsCount}</strong>
            <span>Active jobs</span>
          </div>
          <div>
            <strong>{uniqueLocations}</strong>
            <span>Locations</span>
          </div>
          <div>
            <strong>{filteredJobs.length}</strong>
            <span>Visible jobs</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search by position..."
                prefix="🔍"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </Col>
            <Col>
              <Tooltip title="Add filters">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  type={filterLocation ? "primary" : "default"}
                >
                  Filters
                </Button>
              </Tooltip>
            </Col>
            <Col>
              {(searchText || filterLocation) && (
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleResetFilters}
                  danger
                >
                  Reset
                </Button>
              )}
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddJob}
              >
                Add Job
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredJobs.length === 0}
                >
                  Export
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Refresh">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSelectedRowKeys([]);
                    getAllJob();
                  }}
                  loading={loading}
                />
              </Tooltip>
            </Col>
            {selectedRowKeys.length > 0 && (
              <Col>
                <Popconfirm
                  title="Delete Multiple"
                  description={`Delete ${selectedRowKeys.length} jobs?`}
                  onConfirm={handleBulkDelete}
                  okText="Delete"
                  cancelText="Cancel"
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
            dataSource={filteredJobs}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No jobs found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 1200 }}
          />
        </Spin>
      </div>

      <Drawer
        title="Advanced Filters"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Location</label>
            <Select
              placeholder="All locations"
              value={filterLocation}
              onChange={setFilterLocation}
              options={locationsList.map(loc => ({ label: loc, value: loc }))}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <Button onClick={handleResetFilters} style={{ marginTop: '16px' }}>Clear All</Button>
        </div>
      </Drawer>

      <Modal
        title="Edit Job"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditJob job={updatedItem} closeModal={closeEditModal} />
      </Modal>

      <Modal
        title="Add New Job"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddJob closeModal={closeAddModal} />
      </Modal>
    </div>
  )
};

Job.propTypes = {};
Job.defaultProps = {};

export default Job;
