import React, { useState } from 'react';
import { Tabs, Table, Tag, Button, Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const emailTemplates = [
  { id: 1, name: 'Interview Invitation', type: 'Interview', status: 'Active', lastUsed: '2026-06-28' },
  { id: 2, name: 'Application Received', type: 'Application', status: 'Active', lastUsed: '2026-06-30' },
  { id: 3, name: 'Offer Letter', type: 'Offer', status: 'Active', lastUsed: '2026-06-25' },
  { id: 4, name: 'Rejection Notice', type: 'Rejection', status: 'Draft', lastUsed: '2026-06-10' },
  { id: 5, name: 'Interview Reminder', type: 'Reminder', status: 'Active', lastUsed: '2026-06-29' },
];

const announcements = [
  { id: 1, title: 'Q3 Hiring Drive Launch', audience: 'All Staff', sentAt: '2026-06-15', status: 'Sent' },
  { id: 2, title: 'New Interview Policy', audience: 'Recruiters', sentAt: '2026-06-20', status: 'Sent' },
  { id: 3, title: 'Platform Update July', audience: 'All Staff', sentAt: null, status: 'Draft' },
];

const smsTemplates = [
  { id: 1, name: 'Interview Reminder SMS', status: 'Active' },
  { id: 2, name: 'Offer Confirmation SMS', status: 'Active' },
  { id: 3, name: 'Application Update SMS', status: 'Draft' },
];

const Communication = () => {
  const [composeOpen, setComposeOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [form] = Form.useForm();
  const [tplForm] = Form.useForm();

  const templateColumns = [
    { title: 'Template Name', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (v) => <Tag color="blue">{v}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v) => <Tag color={v === 'Active' ? 'green' : 'default'}>{v}</Tag> },
    { title: 'Last Used', dataIndex: 'lastUsed', key: 'lastUsed', render: (v) => v || '—' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <span>
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link">Use</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  const announcementColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title', render: (v) => <strong>{v}</strong> },
    { title: 'Audience', dataIndex: 'audience', key: 'audience' },
    { title: 'Sent At', dataIndex: 'sentAt', key: 'sentAt', render: (v) => v || '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v) => <Tag color={v === 'Sent' ? 'green' : 'default'}>{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, r) => (
        <span>
          {r.status === 'Draft' && <Button size="small" type="link">Send</Button>}
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  const smsColumns = [
    { title: 'Template Name', dataIndex: 'name', key: 'name', render: (v) => <strong>{v}</strong> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (v) => <Tag color={v === 'Active' ? 'green' : 'default'}>{v}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <span>
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </span>
      ),
    },
  ];

  const handleSend = (values) => {
    message.success(`Message sent to ${values.audience}`);
    setComposeOpen(false);
    form.resetFields();
  };

  const handleSaveTemplate = (values) => {
    message.success(`Template "${values.name}" saved`);
    setTemplateOpen(false);
    tplForm.resetFields();
  };

  return (
    <div className="Communication">
      {/* Stats Row */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-primary mb-1">{emailTemplates.filter(t => t.status === 'Active').length}</h4>
            <small className="text-muted">Active Email Templates</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-success mb-1">{announcements.filter(a => a.status === 'Sent').length}</h4>
            <small className="text-muted">Announcements Sent</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-warning mb-1">{smsTemplates.length}</h4>
            <small className="text-muted">SMS Templates</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-info mb-1">98%</h4>
            <small className="text-muted">Delivery Rate</small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-4">
        <div className="card-body d-flex gap-2 flex-wrap">
          <Button type="primary" icon={<i className="fa fa-paper-plane mr-1"></i>} onClick={() => setComposeOpen(true)}>
            Send Bulk Email
          </Button>
          <Button icon={<i className="fa fa-bullhorn mr-1"></i>} onClick={() => setComposeOpen(true)}>
            Post Announcement
          </Button>
          <Button icon={<i className="fa fa-plus mr-1"></i>} onClick={() => setTemplateOpen(true)}>
            New Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-body">
          <Tabs defaultActiveKey="email" items={[
            { key: 'email', label: 'Email Templates', children: (
              <Table dataSource={emailTemplates} columns={templateColumns} rowKey="id" size="middle" />
            )},
            { key: 'announcements', label: 'Announcements', children: (
              <>
                <div className="mb-2 text-right">
                  <Button type="primary" size="small" onClick={() => setComposeOpen(true)}>+ New Announcement</Button>
                </div>
                <Table dataSource={announcements} columns={announcementColumns} rowKey="id" size="middle" />
              </>
            )},
            { key: 'sms', label: 'SMS Templates', children: (
              <Table dataSource={smsTemplates} columns={smsColumns} rowKey="id" size="middle" />
            )},
            { key: 'notifications', label: 'Notification Templates', children: (
              <div className="text-center p-5 text-muted">
                <i className="fa fa-bell fa-3x mb-3" style={{ color: '#d1d5db' }}></i>
                <p>Notification templates are configured in <strong>Configuration → Notifications</strong>.</p>
              </div>
            )},
          ]} />
        </div>
      </div>

      {/* Compose Modal */}
      <Modal title="Send Message" open={composeOpen} onCancel={() => { setComposeOpen(false); form.resetFields(); }} onOk={() => form.submit()} destroyOnHidden>
        <Form form={form} layout="vertical" onFinish={handleSend}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="email">Bulk Email</Option>
              <Option value="announcement">Announcement</Option>
              <Option value="reminder">Interview Reminder</Option>
              <Option value="offer">Offer Reminder</Option>
            </Select>
          </Form.Item>
          <Form.Item name="audience" label="Audience" rules={[{ required: true }]}>
            <Select placeholder="Select audience">
              <Option value="All Staff">All Staff</Option>
              <Option value="Recruiters">Recruiters</Option>
              <Option value="Candidates">Candidates</Option>
              <Option value="Hiring Managers">Hiring Managers</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input placeholder="Message subject" />
          </Form.Item>
          <Form.Item name="body" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Write your message..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Template Modal */}
      <Modal title="Create Template" open={templateOpen} onCancel={() => { setTemplateOpen(false); tplForm.resetFields(); }} onOk={() => tplForm.submit()} destroyOnHidden>
        <Form form={tplForm} layout="vertical" onFinish={handleSaveTemplate}>
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Interview Invitation" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="Interview">Interview</Option>
              <Option value="Application">Application</Option>
              <Option value="Offer">Offer</Option>
              <Option value="Rejection">Rejection</Option>
              <Option value="Reminder">Reminder</Option>
            </Select>
          </Form.Item>
          <Form.Item name="channel" label="Channel">
            <Select placeholder="Select channel" defaultValue="Email">
              <Option value="Email">Email</Option>
              <Option value="SMS">SMS</Option>
              <Option value="Notification">In-App Notification</Option>
            </Select>
          </Form.Item>
          <Form.Item name="body" label="Template Body" rules={[{ required: true }]}>
            <TextArea rows={5} placeholder="Use {candidate_name}, {job_title}, {date} as variables" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Communication;
