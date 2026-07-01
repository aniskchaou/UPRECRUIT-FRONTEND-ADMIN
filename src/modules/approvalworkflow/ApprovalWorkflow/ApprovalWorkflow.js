import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Select, Input, Steps, message, Popconfirm, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const pendingApprovals = [
  {
    id: 1,
    type: 'Job',
    title: 'Senior Backend Engineer',
    submittedBy: 'Omar Nasser',
    department: 'Engineering',
    step: 1,
    stepLabel: 'Department Manager Approval',
    submittedAt: '2026-07-01 08:30',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 2,
    type: 'Job',
    title: 'Marketing Specialist',
    submittedBy: 'Sara Benali',
    department: 'Marketing',
    step: 2,
    stepLabel: 'Finance Approval',
    submittedAt: '2026-06-30 14:15',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 3,
    type: 'Job',
    title: 'DevOps Engineer',
    submittedBy: 'Omar Nasser',
    department: 'Engineering',
    step: 3,
    stepLabel: 'HR Director Approval',
    submittedAt: '2026-06-29 11:00',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 4,
    type: 'Offer',
    title: 'Offer Letter — Candidate #14',
    submittedBy: 'Sara Benali',
    department: 'Sales',
    step: 1,
    stepLabel: 'Manager Approval',
    submittedAt: '2026-07-01 09:45',
    priority: 'Urgent',
    status: 'Pending',
  },
  {
    id: 5,
    type: 'Offer',
    title: 'Offer Letter — Candidate #22',
    submittedBy: 'Omar Nasser',
    department: 'Engineering',
    step: 2,
    stepLabel: 'Finance Approval',
    submittedAt: '2026-06-30 16:00',
    priority: 'Medium',
    status: 'Pending',
  },
];

const history = [
  { id: 101, type: 'Job', title: 'Frontend Developer', action: 'Approved', by: 'Admin User', at: '2026-06-28 10:00', department: 'Engineering' },
  { id: 102, type: 'Job', title: 'HR Assistant', action: 'Rejected', by: 'Admin User', at: '2026-06-27 15:30', department: 'HR' },
  { id: 103, type: 'Offer', title: 'Offer Letter — Candidate #8', action: 'Approved', by: 'Admin User', at: '2026-06-26 11:20', department: 'Finance' },
];

const workflowSteps = [
  'Recruiter Creates',
  'Department Manager',
  'Finance',
  'HR Director',
  'Published',
];

const priorityColor = { Urgent: 'red', High: 'orange', Medium: 'blue', Low: 'default' };

const ApprovalWorkflow = () => {
  const [items, setItems] = useState(pendingApprovals);
  const [actionModal, setActionModal] = useState(null); // { item, type: 'approve'|'reject'|'escalate' }
  const [comment, setComment] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');

  const filtered = items.filter(i => filterType === 'all' || i.type === filterType);

  const handleAction = (item, type) => {
    setActionModal({ item, type });
    setComment('');
  };

  const confirmAction = () => {
    const { item, type } = actionModal;
    if (type === 'approve') {
      message.success(`"${item.title}" approved and moved to next step`);
    } else if (type === 'reject') {
      if (!comment.trim()) { message.warning('Please add a reason for rejection'); return; }
      message.error(`"${item.title}" rejected`);
    } else if (type === 'escalate') {
      message.info(`"${item.title}" escalated`);
    }
    setItems(items.filter(i => i.id !== item.id));
    setActionModal(null);
    setComment('');
  };

  const pendingColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type', render: v => <Tag color={v === 'Job' ? 'geekblue' : 'gold'}>{v}</Tag>, width: 70 },
    { title: 'Title', dataIndex: 'title', key: 'title', render: v => <strong>{v}</strong> },
    { title: 'Submitted by', dataIndex: 'submittedBy', key: 'submittedBy' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    {
      title: 'Current Step',
      dataIndex: 'stepLabel',
      key: 'stepLabel',
      render: (v, r) => (
        <span>
          <Tag color="processing">{`Step ${r.step}`}</Tag> {v}
        </span>
      ),
    },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: v => <Tag color={priorityColor[v] || 'default'}>{v}</Tag> },
    { title: 'Submitted', dataIndex: 'submittedAt', key: 'submittedAt', render: v => <small style={{ color: '#6b7280' }}>{v}</small> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Approve">
            <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleAction(record, 'approve')} />
          </Tooltip>
          <Tooltip title="Reject">
            <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleAction(record, 'reject')} />
          </Tooltip>
          <Tooltip title="Request Changes">
            <Button size="small" icon={<ExclamationCircleOutlined />} onClick={() => handleAction(record, 'changes')} />
          </Tooltip>
          <Tooltip title="Escalate">
            <Button size="small" icon={<ReloadOutlined />} onClick={() => handleAction(record, 'escalate')} />
          </Tooltip>
        </span>
      ),
    },
  ];

  const historyColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type', render: v => <Tag color={v === 'Job' ? 'geekblue' : 'gold'}>{v}</Tag>, width: 70 },
    { title: 'Title', dataIndex: 'title', key: 'title', render: v => <strong>{v}</strong> },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: v => <Tag color={v === 'Approved' ? 'green' : 'red'}>{v}</Tag> },
    { title: 'By', dataIndex: 'by', key: 'by' },
    { title: 'At', dataIndex: 'at', key: 'at', render: v => <small style={{ color: '#6b7280' }}>{v}</small> },
  ];

  return (
    <div className="ApprovalWorkflow">
      {/* Stats */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-danger mb-1">{items.filter(i => i.priority === 'Urgent').length}</h4>
            <small className="text-muted">Urgent Approvals</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-warning mb-1">{items.length}</h4>
            <small className="text-muted">Pending Total</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-success mb-1">{history.filter(h => h.action === 'Approved').length}</h4>
            <small className="text-muted">Approved This Week</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-info mb-1">1.4d</h4>
            <small className="text-muted">Avg. Approval Time</small>
          </div>
        </div>
      </div>

      {/* Workflow diagram */}
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="mb-3" style={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>Approval Chain</h6>
          <Steps size="small" current={-1}>
            {workflowSteps.map(s => <Step key={s} title={s} />)}
          </Steps>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between flex-wrap" style={{ gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type={activeTab === 'pending' ? 'primary' : 'default'} size="small" onClick={() => setActiveTab('pending')}>
              Pending ({items.length})
            </Button>
            <Button type={activeTab === 'history' ? 'primary' : 'default'} size="small" onClick={() => setActiveTab('history')}>
              History
            </Button>
          </div>
          {activeTab === 'pending' && (
            <Select value={filterType} onChange={setFilterType} size="small" style={{ width: 130 }}>
              <Option value="all">All Types</Option>
              <Option value="Job">Jobs</Option>
              <Option value="Offer">Offers</Option>
            </Select>
          )}
        </div>
        <div className="card-body p-0">
          {activeTab === 'pending' ? (
            <Table dataSource={filtered} columns={pendingColumns} rowKey="id" size="middle" pagination={{ pageSize: 10 }} />
          ) : (
            <Table dataSource={history} columns={historyColumns} rowKey="id" size="middle" pagination={false} />
          )}
        </div>
      </div>

      {/* Action Modal */}
      <Modal
        title={
          actionModal?.type === 'approve' ? 'Approve Request' :
          actionModal?.type === 'reject' ? 'Reject Request' :
          actionModal?.type === 'escalate' ? 'Escalate Request' :
          'Request Changes'
        }
        open={!!actionModal}
        onCancel={() => setActionModal(null)}
        onOk={confirmAction}
        okText={
          actionModal?.type === 'approve' ? 'Confirm Approval' :
          actionModal?.type === 'reject' ? 'Reject' :
          'Confirm'
        }
        okButtonProps={{ danger: actionModal?.type === 'reject' }}
        destroyOnHidden
      >
        {actionModal && (
          <div>
            <p>
              <strong>{actionModal.item.title}</strong>
              <br />
              <small style={{ color: '#6b7280' }}>
                Submitted by {actionModal.item.submittedBy} · {actionModal.item.submittedAt}
              </small>
            </p>
            <TextArea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                actionModal.type === 'approve' ? 'Optional comment...' :
                actionModal.type === 'reject' ? 'Reason for rejection (required)' :
                'Add a note...'
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApprovalWorkflow;
