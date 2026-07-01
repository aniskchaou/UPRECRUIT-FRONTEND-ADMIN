import React, { useEffect, useState, useCallback } from 'react';
import './Skill.css';
import EditSkill from '../../../components/EditSkill/EditSkill';
import AddSkill from '../../../components/AddSkill/AddSkill';
import showMessage from '../../../libraries/messages/messages';
import skillHTTPService from '../../../main/services/skillHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UndoOutlined, ReloadOutlined } from '@ant-design/icons';

const Skill = () => {

  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllSkill()
  }, []);

  const getAllSkill = () => {
    setLoading(true);
    skillHTTPService.getAllSkill()
      .then(response => {
        setSkills(response.data);
        filterData(response.data, searchText);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load skills', 'error')
      });
  };

  const filterData = useCallback((data, search) => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(item =>
        item.skillName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredSkills(filtered);
  }, []);

  useEffect(() => {
    filterData(skills, searchText);
  }, [searchText, skills, filterData]);

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      showMessage('Info', 'Select skills to delete', 'info');
      return;
    }
    const deletePromises = selectedRowKeys.map(id => skillHTTPService.removeSkill(id));
    Promise.all(deletePromises)
      .then(() => {
        getAllSkill();
        setSelectedRowKeys([]);
        showMessage('Success', `${selectedRowKeys.length} deleted`, 'success');
      })
      .catch(e => showMessage('Error', 'Deletion failed', 'error'));
  };

  const handleExport = () => {
    const data = selectedRowKeys.length > 0 
      ? filteredSkills.filter(s => selectedRowKeys.includes(s.id))
      : filteredSkills;
    if (data.length === 0) {
      showMessage('Info', 'No data to export', 'info');
      return;
    }
    const headers = ['Skill Name'];
    const rows = data.map(item => [item.skillName]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skills_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showMessage('Success', 'Exported', 'success');
  };

  const removeSkillAction = (id) => {
    skillHTTPService.removeSkill(id).then(() => {
      getAllSkill();
      showMessage('Success', 'Skill deleted', 'success');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    }).catch(e => {
      showMessage('Error', 'Deletion failed', 'error')
    });
  }

  const updateSkillAction = (data) => {
    setUpdatedItem(data)
    setEditModalVisible(true)
  }

  const columns = [
    {
      title: 'Skill Name',
      dataIndex: 'skillName',
      key: 'skillName',
      sorter: (a, b) => (a.skillName || '').localeCompare(b.skillName || ''),
      width: 300,
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
              onClick={() => updateSkillAction(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete"
              description="Confirm?"
              onConfirm={() => removeSkillAction(record.id)}
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
          <h2 className="module-page__title">Skill Management</h2>
          <p className="module-page__subtitle">Manage available skills and competencies.</p>
          <div className="module-page__meta">
            <span>Skill registry</span>
            <span>Competency tracking</span>
            <span>Job requirements</span>
          </div>
        </div>
        <div className="module-page__kpis">
          <div>
            <strong>{filteredSkills.length}</strong>
            <span>Total skills</span>
          </div>
          <div>
            <strong>{skills.length}</strong>
            <span>All available</span>
          </div>
        </div>
      </section>

      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col flex="auto">
              <Input
                placeholder="Search skills..."
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
                Add Skill
              </Button>
            </Col>
            <Col>
              <Tooltip title="Export">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredSkills.length === 0}
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
                  getAllSkill();
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
            dataSource={filteredSkills}
            rowKey={(record) => record.id}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No skills found" style={{ marginTop: '40px' }} />
            }}
            size="middle"
            scroll={{ x: 600 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Skill"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={900}
      >
        <EditSkill skill={updatedItem} closeModal={() => {
          setEditModalVisible(false);
          getAllSkill();
        }} />
      </Modal>

      <Modal
        title="Add Skill"
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddSkill closeModal={() => {
          setAddModalVisible(false);
          getAllSkill();
        }} />
      </Modal>
    </div>
  )
};

Skill.propTypes = {};
Skill.defaultProps = {};

export default Skill;
