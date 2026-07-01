import React, { useState } from 'react';
import { Table, Tag, Select, Input, Button, DatePicker } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const auditData = [
  { id: 1, user: 'Admin User', action: 'Job Created', resource: 'Senior Frontend Developer', ip: '192.168.1.5', at: '2026-07-01 10:14', category: 'Job' },
  { id: 2, user: 'Omar Nasser', action: 'Candidate Status Changed', resource: 'Sara Benali → First Interview', ip: '10.0.0.12', at: '2026-07-01 09:52', category: 'Candidate' },
  { id: 3, user: 'Admin User', action: 'Role Edited', resource: 'Recruiter', ip: '192.168.1.5', at: '2026-07-01 09:30', category: 'Permission' },
  { id: 4, user: 'Omar Nasser', action: 'User Login', resource: '—', ip: '10.0.0.12', at: '2026-07-01 09:00', category: 'Auth' },
  { id: 5, user: 'Admin User', action: 'User Invited', resource: 'new.recruiter@company.com', ip: '192.168.1.5', at: '2026-06-30 17:45', category: 'Team' },
  { id: 6, user: 'Admin User', action: 'Offer Approved', resource: 'Contract Proposal #14', ip: '192.168.1.5', at: '2026-06-30 16:22', category: 'Offer' },
  { id: 7, user: 'System', action: 'Candidate Rejected', resource: 'Application #88', ip: 'system', at: '2026-06-30 15:10', category: 'Candidate' },
  { id: 8, user: 'Admin User', action: 'Job Published', resource: 'Backend Engineer', ip: '192.168.1.5', at: '2026-06-30 14:05', category: 'Job' },
  { id: 9, user: 'Omar Nasser', action: 'Interview Scheduled', resource: 'Candidate #42 — 2026-07-05', ip: '10.0.0.12', at: '2026-06-30 12:38', category: 'Interview' },
  { id: 10, user: 'Admin User', action: 'Permission Changed', resource: 'HR Assistant role', ip: '192.168.1.5', at: '2026-06-29 11:00', category: 'Permission' },
  { id: 11, user: 'Admin User', action: 'User Login', resource: '—', ip: '192.168.1.5', at: '2026-06-29 09:00', category: 'Auth' },
  { id: 12, user: 'System', action: 'Job Closed', resource: 'DevOps Engineer', ip: 'system', at: '2026-06-28 18:00', category: 'Job' },
];

const categoryColors = {
  Auth: 'blue',
  Job: 'geekblue',
  Candidate: 'cyan',
  Permission: 'volcano',
  Team: 'purple',
  Offer: 'gold',
  Interview: 'green',
};

const AuditLogs = () => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = auditData.filter((row) => {
    const matchCat = category === 'all' || row.category === category;
    const matchSearch = !search || row.user.toLowerCase().includes(search.toLowerCase()) || row.action.toLowerCase().includes(search.toLowerCase()) || row.resource.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const columns = [
    {
      title: 'Date / Time',
      dataIndex: 'at',
      key: 'at',
      render: (v) => <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>,
      width: 150,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (v) => <strong>{v}</strong>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (v) => <span style={{ color: '#374151' }}>{v}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v) => <Tag color={categoryColors[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (v) => <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'monospace' }}>{v}</span>,
    },
  ];

  return (
    <div className="AuditLogs">
      {/* Stats */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-primary mb-1">{auditData.length}</h4>
            <small className="text-muted">Total Events</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-warning mb-1">{auditData.filter(a => a.category === 'Permission').length}</h4>
            <small className="text-muted">Permission Changes</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-success mb-1">{auditData.filter(a => a.category === 'Auth').length}</h4>
            <small className="text-muted">Login Events</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-info mb-1">{new Set(auditData.map(a => a.user)).size}</h4>
            <small className="text-muted">Active Users</small>
          </div>
        </div>
      </div>

      {/* Filters + Export */}
      <div className="card mb-4">
        <div className="card-body d-flex flex-wrap align-items-center" style={{ gap: 12 }}>
          <Input.Search
            placeholder="Search by user, action or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select value={category} onChange={setCategory} style={{ width: 180 }}>
            <Option value="all">All Categories</Option>
            <Option value="Auth">Auth</Option>
            <Option value="Job">Job</Option>
            <Option value="Candidate">Candidate</Option>
            <Option value="Permission">Permission</Option>
            <Option value="Team">Team</Option>
            <Option value="Offer">Offer</Option>
            <Option value="Interview">Interview</Option>
          </Select>
          <RangePicker style={{ width: 240 }} />
          <Button icon={<i className="fa fa-download mr-1"></i>} style={{ marginLeft: 'auto' }}>
            Export Logs
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="card-body p-0">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 10, showTotal: (t) => `${t} events` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
