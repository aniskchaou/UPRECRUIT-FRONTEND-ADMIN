import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Candidate.css';
import EditCandidate from './../EditCandidate/EditCandidate';
import ViewCandidate from '../ViewCandidate/ViewCandidate';
import candidateHTTPService from '../../../main/services/candidateHTTPService'
import showMessage from '../../../libraries/messages/messages';
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Select, Row, Col, Drawer, Tag } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Candidate = () => {

  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  useEffect(() => {
    getAllCandidate()
  }, []);

  const getAllCandidate = () => {
    setLoading(true);
    candidateHTTPService.getAllCandidate()
      .then(response => {
        setCandidates(response.data);
        filterData(response.data, searchText, filterGender, filterCity);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load candidates', 'error')
      });
  };

  const filterData = useCallback((data, search, gender, city) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (gender) filtered = filtered.filter(item => item.gender === gender);
    if (city) filtered = filtered.filter(item => item.city === city);
    setFilteredCandidates(filtered);
  }, []);

  useEffect(() => {
    filterData(candidates, searchText, filterGender, filterCity);
  }, [searchText, filterGender, filterCity, candidates, filterData]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select candidates to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id =>
      candidateHTTPService.removeCandidate(id)
    );
    Promise.all(deletePromises)
      .then(() => {
        getAllCandidate();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} candidates deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredCandidates.filter(c => selectedRowKeys.includes(c.id))
      : filteredCandidates;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['First Name', 'Last Name', 'Email', 'Gender', 'City'];
    const rows = data.map(item => [item.firstName, item.lastName, item.email, item.gender, item.city]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported successfully', 'success');
  };

  const removeCandidateAction = (id) => {
    candidateHTTPService.removeCandidate(id).then(() => {
      getAllCandidate()
      showMessage('Success', 'Candidate deleted', 'success')
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateCandidateAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const viewCandidateAction = (data) => {
    setUpdatedItem(data)
    setViewModalVisible(true)
  }

  const closeEditModal = () => {
    setEditModalVisible(false)
    getAllCandidate()
  }

  const handleAddCandidate = () => {
    setUpdatedItem({});
    setAddModalVisible(true);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    getAllCandidate();
  };

  const handleResetFilters = () => {
    setSearchText('');
    setFilterGender('');
    setFilterCity('');
    showMessage('Success', 'Filters reset', 'success');
  };

  const citiesList = [...new Set(candidates.map(item => item.city).filter(Boolean))].sort();
  const cityCount = new Set(candidates.map((item) => item.city).filter(Boolean)).size;
  const femaleCount = candidates.filter((item) => `${item.gender}`.toLowerCase() === 'female').length;

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'firstName',
      key: 'fullName',
      render: (text, record) => `${record.firstName || ''} ${record.lastName || ''}`.trim(),
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      width: 180,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
      width: 200,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => {
        const color = text === 'Male' ? 'blue' : text === 'Female' ? 'magenta' : 'default';
        return <Tag color={color}>{text || '—'}</Tag>;
      },
      filters: [{ text: 'Male', value: 'Male' }, { text: 'Female', value: 'Female' }],
      width: 100,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (text) => <span>{text || '—'}</span>,
      sorter: (a, b) => (a.city || '').localeCompare(b.city || ''),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewCandidateAction(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => updateCandidateAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Candidate"
              description="Are you sure?"
              onConfirm={() => removeCandidateAction(record.id)}
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
          <h2 className="module-page__title">Candidate Intelligence</h2>
          <p className="module-page__subtitle">
            Manage profile quality, accelerate shortlist decisions, and keep candidate records accurate across your funnel.
          </p>
          <div className="module-page__meta">
            <span>Shortlist readiness</span>
            <span>Profile hygiene</span>
            <span>Funnel transparency</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredCandidates.length}</strong>
            <span>Total candidates</span>
          </div>
          <div>
            <strong>{cityCount}</strong>
            <span>Cities represented</span>
          </div>
          <div>
            <strong>{femaleCount}</strong>
            <span>Female candidates</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search by name or email..."
                prefix="🔍"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </Col>
            <Col>
              <Tooltip title={filterGender || filterCity ? "Filters active" : "Add filters"}>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  type={filterGender || filterCity ? "primary" : "default"}
                >
                  Filters
                </Button>
              </Tooltip>
            </Col>
            <Col>
              {(searchText || filterGender || filterCity) && (
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
                onClick={() => handleAddCandidate()}
              >
                Add Candidate
              </Button>
            </Col>
            <Col>
              <Tooltip title={selectedRowKeys.length > 0 ? `Export ${selectedRowKeys.length} selected` : "Export all"}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredCandidates.length === 0}
                >
                  Export
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Refresh data">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSelectedRowKeys([]);
                    getAllCandidate();
                  }}
                  loading={loading}
                />
              </Tooltip>
            </Col>
            {selectedRowKeys.length > 0 && (
              <Col>
                <Popconfirm
                  title="Delete Multiple"
                  description={`Delete ${selectedRowKeys.length} candidates?`}
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
            dataSource={filteredCandidates}
            rowKey={(record) => record.id || record.email}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No candidates found. New applications will appear here." style={{ marginTop: '40px' }} />
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
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Gender</label>
            <Select
              placeholder="All genders"
              value={filterGender}
              onChange={setFilterGender}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
              ]}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>City</label>
            <Select
              placeholder="All cities"
              value={filterCity}
              onChange={setFilterCity}
              options={citiesList.map(city => ({ label: city, value: city }))}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          <Button onClick={handleResetFilters} style={{ marginTop: '16px' }}>Clear All</Button>
        </div>
      </Drawer>

      <Modal
        title="Edit Candidate"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditCandidate candidate={updatedItem} closeModal={closeEditModal} />
      </Modal>

      <Modal
        title="Candidate Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={900}
      >
        <ViewCandidate candidate={updatedItem} />
      </Modal>

      <Modal
        title="Add New Candidate"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditCandidate candidate={{}} closeModal={closeAddModal} isNew={true} />
      </Modal>
    </div>
  )
};

Candidate.propTypes = {};

Candidate.defaultProps = {};

export default Candidate;

