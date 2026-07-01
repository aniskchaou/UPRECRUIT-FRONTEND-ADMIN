import React, { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Select, message, Popconfirm } from 'antd';

const { Option } = Select;

const initialPools = [
  { id: 1, name: 'Senior Developers', description: 'Experienced fullstack and backend engineers', count: 24, tags: ['Engineering', 'Senior'], created: '2026-05-10' },
  { id: 2, name: 'Marketing Experts', description: 'Growth and brand professionals', count: 12, tags: ['Marketing'], created: '2026-05-18' },
  { id: 3, name: 'Graduates 2026', description: 'Freshly graduated candidates for junior roles', count: 38, tags: ['Junior', 'Graduate'], created: '2026-06-01' },
  { id: 4, name: 'Sales Executives', description: 'Enterprise and SMB sales professionals', count: 17, tags: ['Sales'], created: '2026-06-12' },
  { id: 5, name: 'Future Hiring Pipeline', description: 'Candidates for upcoming headcount', count: 9, tags: ['Planned'], created: '2026-06-20' },
];

const tagColors = { Engineering: 'blue', Senior: 'geekblue', Marketing: 'purple', Junior: 'green', Graduate: 'cyan', Sales: 'orange', Planned: 'gold' };

const TalentPool = () => {
  const [pools, setPools] = useState(initialPools);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Pool Name', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => tags.map((t) => <Tag key={t} color={tagColors[t] || 'default'}>{t}</Tag>),
    },
    { title: 'Candidates', dataIndex: 'count', key: 'count', render: (v) => <strong>{v}</strong> },
    { title: 'Created', dataIndex: 'created', key: 'created' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button size="small" type="link" onClick={() => { setEditing(record); form.setFieldsValue({ name: record.name, description: record.description }); setOpen(true); }}>Edit</Button>
          <Button size="small" type="link">Share</Button>
          <Button size="small" type="link">Export</Button>
          <Popconfirm title="Delete this pool?" onConfirm={() => { setPools(pools.filter((p) => p.id !== record.id)); message.success('Pool deleted'); }}>
            <Button size="small" type="link" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleSave = (values) => {
    if (editing) {
      setPools(pools.map((p) => p.id === editing.id ? { ...p, ...values } : p));
      message.success('Pool updated');
    } else {
      setPools([...pools, { id: Date.now(), count: 0, tags: [], created: new Date().toISOString().slice(0, 10), ...values }]);
      message.success('Talent pool created');
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  return (
    <div className="TalentPool">
      {/* Stats */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-primary mb-1">{pools.length}</h4>
            <small className="text-muted">Active Pools</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-success mb-1">{pools.reduce((s, p) => s + p.count, 0)}</h4>
            <small className="text-muted">Total Candidates</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-warning mb-1">3</h4>
            <small className="text-muted">Shared Pools</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-info mb-1">86%</h4>
            <small className="text-muted">Qualified Rate</small>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Talent Pools</h5>
          <Button type="primary" onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }}>
            + Create Pool
          </Button>
        </div>
        <div className="card-body p-0">
          <Table dataSource={pools} columns={columns} rowKey="id" size="middle" pagination={{ pageSize: 10 }} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editing ? 'Edit Pool' : 'Create Talent Pool'}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); form.resetFields(); }}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Pool Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Senior Developers" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input placeholder="Short description" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Add tags (press Enter)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TalentPool;
