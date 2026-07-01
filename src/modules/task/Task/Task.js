import React, { useEffect, useState, useCallback } from 'react';
import './Task.css';
import EditTask from '../EditTask/EditTask';
import AddTask from '../AddTask/AddTask';
import showMessage from '../../../libraries/messages/messages';
import taskHTTPService from '../../../main/services/taskHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col, Tag, Select, Drawer } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Task = () => {

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    getAllTask()
  }, []);

  const getAllTask = () => {
    setLoading(true);
    taskHTTPService.getAllTask()
      .then(response => {
        setTasks(response.data);
        filterData(response.data, searchText, filterStatus);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load tasks', 'error')
      });
  };

  const filterData = useCallback((data, search, status) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) filtered = filtered.filter(item => item.status === status);
    setFilteredTasks(filtered);
  }, []);

  useEffect(() => {
    filterData(tasks, searchText, filterStatus);
  }, [searchText, filterStatus, tasks, filterData]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Done': return 'green';
      case 'In Progress': return 'blue';
      case 'Pending': return 'orange';
      default: return 'default';
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select tasks to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => taskHTTPService.removeTask(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllTask();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredTasks.filter(t => selectedRowKeys.includes(t.id))
      : filteredTasks;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Title', 'Description', 'Status'];
    const rows = data.map(item => [item.title, item.description, item.status]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeTaskAction = (id) => {
    taskHTTPService.removeTask(id).then(() => {
      getAllTask();
      showMessage('Success', 'Task deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateTaskAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const handleResetFilters = () => {
    setSearchText('');
    setFilterStatus('');
    showMessage('Success', 'Filters reset', 'success');
  };

  const statusList = [...new Set(tasks.map(item => item.status).filter(Boolean))].sort();
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
      width: 250,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span>{text ? `${text.substring(0, 50)}...` : '—'}</span>,
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => <Tag color={getStatusColor(text)}>{text || '—'}</Tag>,
      width: 120,
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
              onClick={() => updateTaskAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeTaskAction(record.id)}
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
          <h2 className="module-page__title">Task Management</h2>
          <p className="module-page__subtitle">Track and manage team tasks and assignments.</p>
          <div className="module-page__meta">
            <span>Task tracking</span>
            <span>Project management</span>
            <span>Assignment tracking</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredTasks.length}</strong>
            <span>Total tasks</span>
          </div>
          <div>
            <strong>{doneCount}</strong>
            <span>Completed</span>
          </div>
          <div>
            <strong>{tasks.filter(t => t.status === 'In Progress').length}</strong>
            <span>In Progress</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search tasks..."
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
                Add Task
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredTasks.length === 0}
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
                  getAllTask();
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
            dataSource={filteredTasks}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No tasks found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 1100 }}
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
        title="Edit Task"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditTask task={updatedItem} closeModal={() => {
          setEditModalVisible(false);
          getAllTask();
        }} />
      </Modal>

      <Modal
        title="Add Task"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddTask closeModal={() => {
          setAddModalVisible(false);
          getAllTask();
        }} />
      </Modal>
    </div>
  )
};

Task.propTypes = {};
Task.defaultProps = {};

export default Task;

