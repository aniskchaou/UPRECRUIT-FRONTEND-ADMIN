import React, { useEffect, useState, useCallback } from 'react';
import './Company.css';
import EditCompany from '../EditCompany/EditCompany';
import AddCompany from '../AddCompany/AddCompany';
import showMessage from '../../libraries/messages/messages';
import companyHTTPService from '../../main/services/companyHTTPService'
import { Table, Button, Modal, Space, Popconfirm, Empty, Spin, Input, Tooltip, Row, Col, Avatar, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UndoOutlined, ReloadOutlined, CheckOutlined, CloseOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';

const Company = () => {

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [mediaDraft, setMediaDraft] = useState({ logo: '', banner: '' });

  const normalizeCompany = useCallback((item, index) => ({
    ...item,
    id: item.id || (10000 + index),
    pageStatus: item.pageStatus || (index % 3 === 0 ? 'Pending' : 'Approved'),
    verifiedBadge: Boolean(item.verifiedBadge),
    isFraudulent: Boolean(item.isFraudulent),
    rating: Number(item.rating || (3.8 + (index % 2) * 0.5)).toFixed(1),
    reviewCount: Number(item.reviewCount || (8 + index)),
    reviews: Array.isArray(item.reviews) && item.reviews.length > 0
      ? item.reviews
      : [
        { id: `${item.id || index}-r1`, author: 'Candidate', score: 4, text: 'Good response time.' },
        { id: `${item.id || index}-r2`, author: 'Recruiter', score: 5, text: 'Clean onboarding process.' },
      ],
    banner: item.banner || '',
  }), []);

  const getAllCompany = useCallback(() => {
    setLoading(true);
    companyHTTPService.getAllCompany()
      .then(response => {
        const normalized = (Array.isArray(response.data) ? response.data : []).map(normalizeCompany);
        setCompanies(normalized);
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        showMessage('Error', 'Failed to load companies', 'error')
      });
  }, [normalizeCompany]);

  useEffect(() => {
    getAllCompany();
  }, [getAllCompany]);

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

  const updateCompanyState = (companyId, mapper) => {
    setCompanies((previous) => previous.map((company) => (company.id === companyId ? mapper(company) : company)));
  };

  const handleCompanyPageReview = (companyId, approved) => {
    updateCompanyState(companyId, (company) => ({
      ...company,
      pageStatus: approved ? 'Approved' : 'Rejected',
    }));
    showMessage('Success', approved ? 'Company page approved' : 'Company page rejected', 'success');
  };

  const handleToggleVerificationBadge = (companyId) => {
    updateCompanyState(companyId, (company) => ({
      ...company,
      verifiedBadge: !company.verifiedBadge,
    }));
    showMessage('Success', 'Company verification badge updated', 'success');
  };

  const handleMarkFraudulent = (companyId) => {
    updateCompanyState(companyId, (company) => ({
      ...company,
      isFraudulent: !company.isFraudulent,
      pageStatus: !company.isFraudulent ? 'Rejected' : company.pageStatus,
    }));
    showMessage('Success', 'Fraud status updated', 'success');
  };

  const handleDeleteFraudulent = () => {
    const fraudulentIds = companies.filter((company) => company.isFraudulent).map((company) => company.id);
    if (fraudulentIds.length === 0) {
      showMessage('Info', 'No fraudulent companies to delete', 'info');
      return;
    }
    setCompanies((previous) => previous.filter((company) => !company.isFraudulent));
    setSelectedRowKeys((previous) => previous.filter((id) => !fraudulentIds.includes(id)));
    showMessage('Success', `${fraudulentIds.length} fraudulent companies deleted`, 'success');
  };

  const handleOpenMediaEditor = (company) => {
    setSelectedCompany(company);
    setMediaDraft({
      logo: company.logo || '',
      banner: company.banner || '',
    });
    setMediaModalVisible(true);
  };

  const handleSaveMedia = () => {
    if (!selectedCompany) {
      return;
    }
    updateCompanyState(selectedCompany.id, (company) => ({
      ...company,
      logo: mediaDraft.logo,
      banner: mediaDraft.banner,
    }));
    setMediaModalVisible(false);
    showMessage('Success', 'Company media updated', 'success');
  };

  const handleOpenReviews = (company) => {
    setSelectedCompany(company);
    setReviewModalVisible(true);
  };

  const handleMergeDuplicates = () => {
    if (selectedRowKeys.length < 2) {
      showMessage('Info', 'Select at least 2 companies to merge', 'info');
      return;
    }

    setCompanies((previous) => {
      const selectedCompanies = previous.filter((company) => selectedRowKeys.includes(company.id));
      const primary = selectedCompanies[0];
      const mergedReviews = selectedCompanies.flatMap((company) => company.reviews || []);
      const averageRating = (selectedCompanies.reduce((acc, company) => acc + Number(company.rating || 0), 0) / selectedCompanies.length).toFixed(1);
      const mergedCompany = {
        ...primary,
        reviewCount: mergedReviews.length,
        rating: averageRating,
        reviews: mergedReviews,
        pageStatus: selectedCompanies.some((company) => company.pageStatus === 'Rejected') ? 'Pending' : primary.pageStatus,
      };

      const remaining = previous.filter((company) => !selectedRowKeys.includes(company.id));
      return [mergedCompany, ...remaining];
    });

    setSelectedRowKeys([]);
    showMessage('Success', 'Duplicate companies merged successfully', 'success');
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
  const pendingPagesCount = companies.filter((item) => item.pageStatus === 'Pending').length;
  const verifiedBadgesCount = companies.filter((item) => item.verifiedBadge).length;

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
      title: 'Page Status',
      dataIndex: 'pageStatus',
      key: 'pageStatus',
      render: (text) => {
        const color = text === 'Approved' ? 'green' : text === 'Rejected' ? 'red' : 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
      width: 130,
    },
    {
      title: 'Verification',
      key: 'verification',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Tag color={record.verifiedBadge ? 'gold' : 'default'}>{record.verifiedBadge ? 'Verified Badge' : 'Unverified'}</Tag>
          <Tag color={record.isFraudulent ? 'red' : 'default'}>{record.isFraudulent ? 'Fraudulent' : 'Clean'}</Tag>
        </Space>
      ),
      width: 140,
    },
    {
      title: 'Reviews',
      key: 'reviews',
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <span>{record.rating} / 5</span>
          <span>{record.reviewCount} reviews</span>
        </Space>
      ),
      width: 110,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 330,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Edit">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => updateCompanyAction(record)}
            />
          </Tooltip>
          <Tooltip title="Approve Page">
            <Button
              type="default"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleCompanyPageReview(record.id, true)}
            />
          </Tooltip>
          <Tooltip title="Reject Page">
            <Button
              type="default"
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleCompanyPageReview(record.id, false)}
            />
          </Tooltip>
          <Tooltip title="Toggle Verification Badge">
            <Button
              type={record.verifiedBadge ? 'primary' : 'default'}
              size="small"
              onClick={() => handleToggleVerificationBadge(record.id)}
            >
              Badge
            </Button>
          </Tooltip>
          <Tooltip title="Edit Media">
            <Button
              type="default"
              size="small"
              icon={<UploadOutlined />}
              onClick={() => handleOpenMediaEditor(record)}
            />
          </Tooltip>
          <Tooltip title="Monitor Reviews">
            <Button
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenReviews(record)}
            />
          </Tooltip>
          <Tooltip title="Toggle Fraudulent">
            <Button
              type={record.isFraudulent ? 'primary' : 'default'}
              danger={record.isFraudulent}
              size="small"
              onClick={() => handleMarkFraudulent(record.id)}
            >
              Fraud
            </Button>
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
          <div>
            <strong>{pendingPagesCount}</strong>
            <span>Pending pages</span>
          </div>
          <div>
            <strong>{verifiedBadgesCount}</strong>
            <span>Verified badges</span>
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
            <Col>
              <Button onClick={handleMergeDuplicates} disabled={selectedRowKeys.length < 2}>Merge Duplicates</Button>
            </Col>
            <Col>
              <Popconfirm
                title="Delete Fraudulent Companies"
                description="Delete all companies marked as fraudulent?"
                onConfirm={handleDeleteFraudulent}
                okText="Delete"
                okButtonProps={{ danger: true }}
              >
                <Button danger type="primary">Delete Fraudulent</Button>
              </Popconfirm>
            </Col>
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
            scroll={{ x: 1800 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Company"
        open={editModalVisible}
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
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
        width={900}
      >
        <AddCompany closeModal={() => {
          setAddModalVisible(false);
          getAllCompany();
        }} />
      </Modal>

      <Modal
        title="Upload or Edit Company Media"
        open={mediaModalVisible}
        onCancel={() => setMediaModalVisible(false)}
        onOk={handleSaveMedia}
        okText="Save Media"
      >
        <div className="company-management__media-form">
          <label>Logo URL</label>
          <Input
            placeholder="https://example.com/logo.png"
            value={mediaDraft.logo}
            onChange={(event) => setMediaDraft((previous) => ({ ...previous, logo: event.target.value }))}
          />

          <label>Banner URL</label>
          <Input
            placeholder="https://example.com/banner.png"
            value={mediaDraft.banner}
            onChange={(event) => setMediaDraft((previous) => ({ ...previous, banner: event.target.value }))}
          />
        </div>
      </Modal>

      <Modal
        title={`Company Reviews and Ratings${selectedCompany ? ` - ${selectedCompany.name}` : ''}`}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <div className="company-management__reviews-wrap">
          {selectedCompany && (selectedCompany.reviews || []).map((review) => (
            <div key={review.id} className="company-management__review-item">
              <strong>{review.author}</strong>
              <span>{review.score} / 5</span>
              <p>{review.text}</p>
            </div>
          ))}
          {selectedCompany && (!selectedCompany.reviews || selectedCompany.reviews.length === 0) && (
            <Empty description="No reviews found" />
          )}
        </div>
      </Modal>
    </div>
  )
};

Company.propTypes = {};
Company.defaultProps = {};

export default Company;
