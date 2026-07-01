import React, { useEffect, useState, useCallback } from 'react';
import './Location.css';
import EditLocation from '../EditLocation/EditLocation';
import AddLocation from '../AddLocation/AddLocation';
import showMessage from '../../../libraries/messages/messages';
import locationHTTPService from '../../../main/services/locationHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Location = () => {

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllLocation()
  }, []);

  const getAllLocation = () => {
    setLoading(true);
    locationHTTPService.getAllLocation()
      .then(response => {
        setLocations(response.data);
        filterData(response.data, searchText);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load locations', 'error')
      });
  };

  const filterData = useCallback((data, search) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.city?.toLowerCase().includes(search.toLowerCase()) ||
        item.country?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredLocations(filtered);
  }, []);

  useEffect(() => {
    filterData(locations, searchText);
  }, [searchText, locations, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select locations to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => locationHTTPService.removeLocation(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllLocation();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredLocations.filter(l => selectedRowKeys.includes(l.id))
      : filteredLocations;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['City', 'Country'];
    const rows = data.map(item => [item.city, item.country]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeLocationAction = (id) => {
    locationHTTPService.removeLocation(id).then(() => {
      getAllLocation();
      showMessage('Success', 'Location deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateLocationAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const countryCount = new Set(locations.map(item => item.country).filter(Boolean)).size;

  const columns = [
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => (a.city || '').localeCompare(b.city || ''),
      width: 200,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (text) => <Tag>{text || '—'}</Tag>,
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
              onClick={() => updateLocationAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeLocationAction(record.id)}
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
          <span className="module-page__eyebrow">Settings module</span>
          <h2 className="module-page__title">Location Management</h2>
          <p className="module-page__subtitle">Manage office locations and job sites.</p>
          <div className="module-page__meta">
            <span>Office locations</span>
            <span>Geographic coverage</span>
            <span>Job sites</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredLocations.length}</strong>
            <span>Total locations</span>
          </div>
          <div>
            <strong>{countryCount}</strong>
            <span>Countries</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search locations..."
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
                Add Location
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredLocations.length === 0}
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
                  getAllLocation();
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
            dataSource={filteredLocations}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No locations found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 800 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Location"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditLocation location={updatedItem} closeModal={() => {
          setEditModalVisible(false);
          getAllLocation();
        }} />
      </Modal>

      <Modal
        title="Add Location"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddLocation closeModal={() => {
          setAddModalVisible(false);
          getAllLocation();
        }} />
      </Modal>
    </div>
  )
};

Location.propTypes = {};
Location.defaultProps = {};

export default Location;
