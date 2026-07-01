import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Table, Tag, Popconfirm, message } from 'antd';

const { Option } = Select;

const initialDepts = [
  { id: 1, name: 'Engineering', head: 'Alice Martin', teams: ['Backend', 'Frontend', 'DevOps'], parent: null },
  { id: 2, name: 'Sales', head: 'Bob Chen', teams: ['Enterprise', 'SMB'], parent: null },
  { id: 3, name: 'Human Resources', head: 'Carol Dupont', teams: ['Recruitment', 'L&D'], parent: null },
  { id: 4, name: 'Finance', head: 'David Osei', teams: ['Accounting', 'Payroll'], parent: null },
  { id: 5, name: 'Marketing', head: 'Eva Torres', teams: ['Brand', 'Digital'], parent: null },
];

const branches = [
  { id: 1, name: 'HQ — Algiers', country: 'Algeria', type: 'Headquarters', staff: 120 },
  { id: 2, name: 'Branch — Paris', country: 'France', type: 'Regional Office', staff: 45 },
  { id: 3, name: 'Branch — Dubai', country: 'UAE', type: 'Regional Office', staff: 28 },
];

const Organization = () => {
  const [depts, setDepts] = useState(initialDepts);
  const [addDeptOpen, setAddDeptOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form] = Form.useForm();

  const deptColumns = [
    { title: 'Department', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
    { title: 'Head', dataIndex: 'head', key: 'head' },
    {
      title: 'Teams',
      dataIndex: 'teams',
      key: 'teams',
      render: (teams) => teams.map((t) => <Tag key={t} color="blue">{t}</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button size="small" type="link" onClick={() => { setEditDept(record); form.setFieldsValue({ name: record.name, head: record.head }); setAddDeptOpen(true); }}>Edit</Button>
          <Popconfirm title="Delete this department?" onConfirm={() => { setDepts(depts.filter((d) => d.id !== record.id)); message.success('Department removed'); }}>
            <Button size="small" type="link" danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const branchColumns = [
    { title: 'Branch', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v) => <Tag color={v === 'Headquarters' ? 'gold' : 'geekblue'}>{v}</Tag> },
    { title: 'Staff', dataIndex: 'staff', key: 'staff' },
  ];

  const handleSaveDept = (values) => {
    if (editDept) {
      setDepts(depts.map((d) => d.id === editDept.id ? { ...d, ...values } : d));
      message.success('Department updated');
    } else {
      setDepts([...depts, { id: Date.now(), teams: [], parent: null, ...values }]);
      message.success('Department created');
    }
    setAddDeptOpen(false);
    setEditDept(null);
    form.resetFields();
  };

  return (
    <div className="Organization">
      {/* Org Chart Summary */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-primary mb-1">{depts.length}</h4>
            <small className="text-muted">Departments</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-success mb-1">{depts.reduce((s, d) => s + d.teams.length, 0)}</h4>
            <small className="text-muted">Teams</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-warning mb-1">{branches.length}</h4>
            <small className="text-muted">Branches</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-info mb-1">{branches.reduce((s, b) => s + b.staff, 0)}</h4>
            <small className="text-muted">Total Staff</small>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Departments</h5>
          <Button type="primary" onClick={() => { setEditDept(null); form.resetFields(); setAddDeptOpen(true); }}>
            + Add Department
          </Button>
        </div>
        <div className="card-body p-0">
          <Table dataSource={depts} columns={deptColumns} rowKey="id" pagination={false} size="middle" />
        </div>
      </div>

      {/* Branches */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Branches &amp; Offices</h5>
        </div>
        <div className="card-body p-0">
          <Table dataSource={branches} columns={branchColumns} rowKey="id" pagination={false} size="middle" />
        </div>
      </div>

      {/* Hierarchy Visualization */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Reporting Hierarchy</h5>
        </div>
        <div className="card-body">
          <div style={{ fontFamily: 'monospace', fontSize: 14, lineHeight: 2, color: '#374151' }}>
            <div><strong>Company</strong></div>
            {depts.map((dept, i) => (
              <div key={dept.id}>
                <span style={{ color: '#6b7280' }}>{i === depts.length - 1 ? '└── ' : '├── '}</span>
                <strong>{dept.name}</strong>
                <span style={{ color: '#9ca3af' }}> ({dept.head})</span>
                {dept.teams.map((team, ti) => (
                  <div key={team} style={{ paddingLeft: 32 }}>
                    <span style={{ color: '#6b7280' }}>{ti === dept.teams.length - 1 ? '└── ' : '├── '}</span>
                    {team}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Department Modal */}
      <Modal
        title={editDept ? 'Edit Department' : 'Add Department'}
        open={addDeptOpen}
        onCancel={() => { setAddDeptOpen(false); setEditDept(null); form.resetFields(); }}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSaveDept}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g. Engineering" />
          </Form.Item>
          <Form.Item name="head" label="Department Head" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item name="type" label="Type">
            <Select placeholder="Select type" defaultValue="Department">
              <Option value="Department">Department</Option>
              <Option value="Division">Division</Option>
              <Option value="Business Unit">Business Unit</Option>
              <Option value="Cost Center">Cost Center</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Organization;
