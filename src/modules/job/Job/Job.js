import React, { useEffect, useState, useCallback } from 'react';
import './Job.css';
import EditJob from '../EditJob/EditJob';
import AddJob from '../AddJob/AddJob';
import showMessage from '../../../libraries/messages/messages';
import jobHTTPService from '../../../main/services/jobHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Select, Row, Col, Drawer, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined, CheckOutlined, CloseOutlined, WarningOutlined, CalendarOutlined, StarOutlined } from '@ant-design/icons';

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
  const [expiryModalVisible, setExpiryModalVisible] = useState(false);
  const [selectedJobForExpiry, setSelectedJobForExpiry] = useState(null);
  const [expiryDateDraft, setExpiryDateDraft] = useState('');

  const normalizeJob = useCallback((item, index) => ({
    ...item,
    id: item.id || (20000 + index),
    moderationStatus: item.moderationStatus || (index % 3 === 0 ? 'Pending' : 'Approved'),
    published: item.published !== undefined ? Boolean(item.published) : true,
    flaggedSuspicious: Boolean(item.flaggedSuspicious),
    featured: Boolean(item.featured),
    scheduledExpiry: item.scheduledExpiry || item.end || '',
    description: item.description || `${item.post || 'Job'} based in ${item.location || 'N/A'}. Contact talent@company.com for details.`,
  }), []);

  useEffect(() => {
    getAllJob()
  }, []);

  const getAllJob = () => {
    setLoading(true);
    jobHTTPService.getAllJob()
      .then(response => {
        const normalized = (Array.isArray(response.data) ? response.data : []).map(normalizeJob);
        setJobs(normalized);
        filterData(normalized, searchText, filterLocation);
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

  const updateJobState = (jobId, mapper) => {
    setJobs((previous) => previous.map((job) => (job.id === jobId ? mapper(job) : job)));
  };

  const handleModerationDecision = (jobId, approved) => {
    updateJobState(jobId, (job) => ({
      ...job,
      moderationStatus: approved ? 'Approved' : 'Rejected',
      published: approved,
    }));
    showMessage('Success', approved ? 'Job approved' : 'Job rejected', 'success');
  };

  const handleUnpublishToggle = (jobId) => {
    updateJobState(jobId, (job) => ({
      ...job,
      published: !job.published,
      moderationStatus: !job.published ? 'Approved' : 'Unpublished',
    }));
    showMessage('Success', 'Publish state updated', 'success');
  };

  const handleFlagSuspicious = (jobId) => {
    updateJobState(jobId, (job) => ({
      ...job,
      flaggedSuspicious: !job.flaggedSuspicious,
      moderationStatus: !job.flaggedSuspicious ? 'Flagged' : job.moderationStatus,
      published: job.flaggedSuspicious ? job.published : false,
    }));
    showMessage('Success', 'Scam detection flag updated', 'success');
  };

  const handleBulkModeration = (approved) => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select jobs first', 'info');
      return;
    }
    setJobs((previous) => previous.map((job) => {
      if (!selectedRowKeys.includes(job.id)) {
        return job;
      }
      return {
        ...job,
        moderationStatus: approved ? 'Approved' : 'Rejected',
        published: approved,
      };
    }));
    showMessage('Success', approved ? 'Bulk approval completed' : 'Bulk rejection completed', 'success');
  };

  const handlePromoteToggle = (jobId) => {
    updateJobState(jobId, (job) => ({
      ...job,
      featured: !job.featured,
    }));
    showMessage('Success', 'Job promotion state updated', 'success');
  };

  const handleSanitizeJob = (jobId) => {
    updateJobState(jobId, (job) => {
      const sanitizedDescription = (job.description || '')
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig, '[redacted-email]')
        .replace(/\+?\d[\d\s().-]{7,}/g, '[redacted-phone]');

      return {
        ...job,
        description: sanitizedDescription,
      };
    });
    showMessage('Success', 'Sensitive content sanitized in job description', 'success');
  };

  const handleOpenExpiryScheduler = (job) => {
    setSelectedJobForExpiry(job);
    setExpiryDateDraft(job.scheduledExpiry || '');
    setExpiryModalVisible(true);
  };

  const handleSaveScheduledExpiry = () => {
    if (!selectedJobForExpiry || !expiryDateDraft) {
      showMessage('Info', 'Choose an expiry date first', 'info');
      return;
    }

    updateJobState(selectedJobForExpiry.id, (job) => ({
      ...job,
      scheduledExpiry: expiryDateDraft,
      end: expiryDateDraft,
    }));

    setExpiryModalVisible(false);
    showMessage('Success', 'Job expiry scheduled', 'success');
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
  const pendingModerationCount = jobs.filter((job) => job.moderationStatus === 'Pending').length;
  const featuredJobsCount = jobs.filter((job) => job.featured).length;

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
      title: 'Moderation',
      dataIndex: 'moderationStatus',
      key: 'moderationStatus',
      render: (text) => {
        const color = text === 'Approved'
          ? 'green'
          : text === 'Rejected' || text === 'Flagged'
            ? 'red'
            : text === 'Unpublished'
              ? 'orange'
              : 'blue';
        return <Tag color={color}>{text}</Tag>;
      },
      width: 130,
    },
    {
      title: 'State',
      key: 'state',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.published ? 'green' : 'default'}>{record.published ? 'Published' : 'Unpublished'}</Tag>
          <Tag color={record.flaggedSuspicious ? 'red' : 'default'}>{record.flaggedSuspicious ? 'Flagged' : 'Clean'}</Tag>
          <Tag color={record.featured ? 'gold' : 'default'}>{record.featured ? 'Featured' : 'Standard'}</Tag>
        </Space>
      ),
      width: 130,
    },
    {
      title: 'Scheduled Expiry',
      dataIndex: 'scheduledExpiry',
      key: 'scheduledExpiry',
      render: (text) => text || 'Not scheduled',
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 380,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Approve">
            <Button
              type="default"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleModerationDecision(record.id, true)}
            />
          </Tooltip>
          <Tooltip title="Reject">
            <Button
              type="default"
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleModerationDecision(record.id, false)}
            />
          </Tooltip>
          <Tooltip title="Unpublish or Publish">
            <Button
              type={record.published ? 'default' : 'primary'}
              size="small"
              onClick={() => handleUnpublishToggle(record.id)}
            >
              {record.published ? 'Unpublish' : 'Publish'}
            </Button>
          </Tooltip>
          <Tooltip title="Flag Suspicious (Scam Detection)">
            <Button
              type={record.flaggedSuspicious ? 'primary' : 'default'}
              danger={record.flaggedSuspicious}
              size="small"
              icon={<WarningOutlined />}
              onClick={() => handleFlagSuspicious(record.id)}
            />
          </Tooltip>
          <Tooltip title="Promote / Feature Job">
            <Button
              type={record.featured ? 'primary' : 'default'}
              size="small"
              icon={<StarOutlined />}
              onClick={() => handlePromoteToggle(record.id)}
            />
          </Tooltip>
          <Tooltip title="Schedule Expiry">
            <Button
              type="default"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleOpenExpiryScheduler(record)}
            />
          </Tooltip>
          <Tooltip title="Sanitize Sensitive Content">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleSanitizeJob(record.id)}
            />
          </Tooltip>
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
          <div>
            <strong>{pendingModerationCount}</strong>
            <span>Pending moderation</span>
          </div>
          <div>
            <strong>{featuredJobsCount}</strong>
            <span>Featured jobs</span>
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
            <Col>
              <Button icon={<CheckOutlined />} onClick={() => handleBulkModeration(true)} disabled={selectedRowKeys.length === 0}>
                Bulk Approve
              </Button>
            </Col>
            <Col>
              <Button danger icon={<CloseOutlined />} onClick={() => handleBulkModeration(false)} disabled={selectedRowKeys.length === 0}>
                Bulk Reject
              </Button>
            </Col>
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
            scroll={{ x: 1900 }}
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
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditJob job={updatedItem} closeModal={closeEditModal} />
      </Modal>

      <Modal
        title="Add New Job"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddJob closeModal={closeAddModal} />
      </Modal>

      <Modal
        title={`Schedule Job Expiry${selectedJobForExpiry ? ` - ${selectedJobForExpiry.post}` : ''}`}
        open={expiryModalVisible}
        onCancel={() => setExpiryModalVisible(false)}
        onOk={handleSaveScheduledExpiry}
        okText="Save Expiry"
      >
        <div className="job-management__expiry-wrap">
          <label>Expiry Date</label>
          <Input
            type="date"
            value={expiryDateDraft}
            onChange={(event) => setExpiryDateDraft(event.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
};

Job.propTypes = {};
Job.defaultProps = {};

export default Job;
