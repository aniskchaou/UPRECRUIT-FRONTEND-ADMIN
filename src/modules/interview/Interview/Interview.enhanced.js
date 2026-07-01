import React, { useEffect, useState, useCallback } from 'react';
import './Interview.css';
import EditInterview from '../EditInterview/EditInterview';
import ViewInterview from '../ViewInterview/ViewInterview';
import AddInterview from '../AddInterview/AddInterview';
import showMessage from '../../../libraries/messages/messages';
import interviewHTTPService from '../../../main/services/interviewHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Select, Row, Col, Drawer, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Interview = () => {

  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    getAllInterview()
  }, []);

  const getAllInterview = () => {
    setLoading(true);
    interviewHTTPService.getAllInterview()
      .then(response => {
        setInterviews(response.data);
        filterData(response.data, searchText);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load interviews', 'error')
      });
  };

  const filterData = useCallback((data, search) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.candidate?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredInterviews(filtered);
  }, []);

  useEffect(() => {
    filterData(interviews, searchText);
  }, [searchText, interviews, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select interviews to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => interviewHTTPService.removeInterview(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllInterview();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredInterviews.filter(i => selectedRowKeys.includes(i.id))
      : filteredInterviews;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Candidate', 'Schedule Date', 'Time', 'Employee', 'Comment'];
    const rows = data.map(item => [item.candidate, item.scheduleDate, item.scheduleTime, item.employee, item.comment]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interviews_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeInterviewAction = (id) => {
    interviewHTTPService.removeInterview(id).then(() => {
      getAllInterview();
      showMessage('Success', 'Interview deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateInterviewAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const viewInterviewAction = (data) => {
    setUpdatedItem(data)
    setViewModalVisible(true)
  }

  const closeEditModal = () => {
    setEditModalVisible(false)
    getAllInterview()
  }

  const handleResetFilters = () => {
    setSearchText('');
    showMessage('Success', 'Filters reset', 'success');
  };

  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      width: 180,
      sorter: (a, b) => (a.candidate || '').localeCompare(b.candidate || ''),
    },
    {
      title: 'Schedule Date',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
      width: 130,
    },
    {
      title: 'Time',
      dataIndex: 'scheduleTime',
      key: 'scheduleTime',
      width: 100,
    },
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      width: 150,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
      render: (text) => <span>{text ? `${text.substring(0, 50)}...` : '—'}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewInterviewAction(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => updateInterviewAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeInterviewAction(record.id)}
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
          <h2 className="module-page__title">Interview Management</h2>
          <p className="module-page__subtitle">Schedule, track, and manage interviews with candidates.</p>
          <div className="module-page__meta">
            <span>Interview scheduling</span>
            <span>Candidate tracking</span>
            <span>Interview pipeline</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredInterviews.length}</strong>
            <span>Total interviews</span>
          </div>
          <div>
            <strong>{interviews.length}</strong>
            <span>All scheduled</span>
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
            {searchText && (
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
                Add Interview
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredInterviews.length === 0}
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
                  getAllInterview();
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
            dataSource={filteredInterviews}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No interviews found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 1200 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Interview"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditInterview interview={updatedItem} closeModal={closeEditModal} />
      </Modal>

      <Modal
        title="Interview Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={900}
      >
        <ViewInterview interview={updatedItem} />
      </Modal>

      <Modal
        title="Add Interview"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddInterview closeModal={() => {
          setAddModalVisible(false);
          getAllInterview();
        }} />
      </Modal>
    </div>
  )
};

Interview.propTypes = {};
Interview.defaultProps = {};

export default Interview;
