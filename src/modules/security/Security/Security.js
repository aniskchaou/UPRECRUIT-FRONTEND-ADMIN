import React, { useState } from 'react';
import { Tabs, Switch, Button, Form, Input, Select, Table, Tag, Modal, message, Popconfirm } from 'antd';
import { LockOutlined, SafetyCertificateOutlined, GlobalOutlined, TeamOutlined, HistoryOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Password } = Input;

const activeSessions = [
  { id: 1, user: 'Admin User', device: 'Chrome / Windows', ip: '192.168.1.5', lastActive: '2026-07-01 10:45', current: true },
  { id: 2, user: 'Omar Nasser', device: 'Firefox / macOS', ip: '10.0.0.12', lastActive: '2026-07-01 09:30', current: false },
  { id: 3, user: 'Sara Benali', device: 'Chrome / Android', ip: '10.0.0.45', lastActive: '2026-07-01 08:15', current: false },
  { id: 4, user: 'Omar Nasser', device: 'Safari / iPhone', ip: '10.0.0.99', lastActive: '2026-06-30 20:00', current: false },
];

const ipRules = [
  { id: 1, ip: '192.168.1.0/24', label: 'Office network', action: 'Allow' },
  { id: 2, ip: '10.0.0.0/8', label: 'VPN range', action: 'Allow' },
  { id: 3, ip: '203.0.113.42', label: 'Blocked actor', action: 'Block' },
];

const Security = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [ipRestrict, setIpRestrict] = useState(true);
  const [sessions, setSessions] = useState(activeSessions);
  const [rules, setRules] = useState(ipRules);
  const [addIpOpen, setAddIpOpen] = useState(false);
  const [policyForm] = Form.useForm();
  const [ssoForm] = Form.useForm();
  const [ipForm] = Form.useForm();

  const sessionColumns = [
    { title: 'User', dataIndex: 'user', key: 'user', render: (v, r) => <span><strong>{v}</strong>{r.current && <Tag color="green" style={{ marginLeft: 6 }}>Current</Tag>}</span> },
    { title: 'Device', dataIndex: 'device', key: 'device' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span> },
    { title: 'Last Active', dataIndex: 'lastActive', key: 'lastActive', render: v => <small style={{ color: '#6b7280' }}>{v}</small> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, r) => !r.current && (
        <Popconfirm title="Force logout this session?" onConfirm={() => { setSessions(sessions.filter(s => s.id !== r.id)); message.success('Session terminated'); }}>
          <Button size="small" danger>Force Logout</Button>
        </Popconfirm>
      ),
    },
  ];

  const ipColumns = [
    { title: 'IP / Range', dataIndex: 'ip', key: 'ip', render: v => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
    { title: 'Label', dataIndex: 'label', key: 'label' },
    { title: 'Action', dataIndex: 'action', key: 'action', render: v => <Tag color={v === 'Allow' ? 'green' : 'red'}>{v}</Tag> },
    {
      title: '',
      key: 'del',
      render: (_, r) => (
        <Popconfirm title="Remove rule?" onConfirm={() => { setRules(rules.filter(x => x.id !== r.id)); message.success('Rule removed'); }}>
          <Button size="small" type="link" danger>Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="Security">
      {/* Status cards */}
      <div className="row mb-3">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className={mfaEnabled ? 'text-success mb-1' : 'text-danger mb-1'}>{mfaEnabled ? 'ON' : 'OFF'}</h4>
            <small className="text-muted">MFA Status</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className="text-primary mb-1">{sessions.length}</h4>
            <small className="text-muted">Active Sessions</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className={ssoEnabled ? 'text-success mb-1' : 'text-warning mb-1'}>{ssoEnabled ? 'ON' : 'OFF'}</h4>
            <small className="text-muted">SSO Status</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h4 className={ipRestrict ? 'text-success mb-1' : 'text-muted mb-1'}>{ipRestrict ? 'Active' : 'Inactive'}</h4>
            <small className="text-muted">IP Restrictions</small>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Tabs defaultActiveKey="mfa" items={[
            {
              key: 'mfa',
              label: <span><SafetyCertificateOutlined /> MFA</span>,
              children: (
              <div className="row">
                <div className="col-md-6">
                  <div className="card p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-0">Multi-Factor Authentication</h6>
                        <small className="text-muted">Require MFA for all admin users</small>
                      </div>
                      <Switch checked={mfaEnabled} onChange={v => { setMfaEnabled(v); message.success(v ? 'MFA enabled' : 'MFA disabled'); }} />
                    </div>
                    <Select defaultValue="totp" style={{ width: '100%' }} disabled={!mfaEnabled}>
                      <Option value="totp">Authenticator App (TOTP)</Option>
                      <Option value="sms">SMS Code</Option>
                      <Option value="email">Email Code</Option>
                    </Select>
                    <Button type="primary" className="mt-3" disabled={!mfaEnabled} onClick={() => message.success('MFA settings saved')}>
                      Save MFA Settings
                    </Button>
                  </div>
                </div>
              </div>
            )
            },
            {
              key: 'password',
              label: <span><LockOutlined /> Password Policy</span>,
              children: (
              <Form form={policyForm} layout="vertical" style={{ maxWidth: 480 }} onFinish={() => message.success('Password policy saved')}>
                <Form.Item name="minLength" label="Minimum Length" initialValue={10}>
                  <Select>
                    {[8, 10, 12, 16].map(n => <Option key={n} value={n}>{n} characters</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item name="expiry" label="Password Expiry" initialValue={90}>
                  <Select>
                    <Option value={30}>30 days</Option>
                    <Option value={60}>60 days</Option>
                    <Option value={90}>90 days</Option>
                    <Option value={0}>Never</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="history" label="Password History" initialValue={5}>
                  <Select>
                    {[3, 5, 8, 10].map(n => <Option key={n} value={n}>Last {n} passwords</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item label="Requirements">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Uppercase letters required', 'Numbers required', 'Special characters required', 'Prevent common passwords'].map(req => (
                      <div key={req} className="d-flex justify-content-between align-items-center">
                        <span>{req}</span>
                        <Switch defaultChecked size="small" />
                      </div>
                    ))}
                  </div>
                </Form.Item>
                <Button type="primary" htmlType="submit">Save Policy</Button>
              </Form>
            )
            },
            {
              key: 'sso',
              label: <span><GlobalOutlined /> SSO</span>,
              children: (
              <>
              <div className="mb-3 d-flex align-items-center" style={{ gap: 12 }}>
                <span><strong>Enable SSO</strong></span>
                <Switch checked={ssoEnabled} onChange={v => { setSsoEnabled(v); message.info(v ? 'SSO enabled — configure below' : 'SSO disabled'); }} />
              </div>
              <Form form={ssoForm} layout="vertical" style={{ maxWidth: 480 }} onFinish={() => message.success('SSO configuration saved')} disabled={!ssoEnabled}>
                <Form.Item name="provider" label="Identity Provider">
                  <Select placeholder="Select provider">
                    <Option value="okta">Okta</Option>
                    <Option value="azure">Azure AD / Entra ID</Option>
                    <Option value="google">Google Workspace</Option>
                    <Option value="saml">Custom SAML 2.0</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="entityId" label="Entity ID / Client ID">
                  <Input placeholder="e.g. https://sso.company.com/saml" />
                </Form.Item>
                <Form.Item name="ssoUrl" label="SSO URL">
                  <Input placeholder="https://idp.provider.com/sso" />
                </Form.Item>
                <Form.Item name="certificate" label="X.509 Certificate">
                  <Input.TextArea rows={3} placeholder="Paste certificate content..." />
                </Form.Item>
                <Button type="primary" htmlType="submit" disabled={!ssoEnabled}>Save SSO Config</Button>
              </Form>
              </>
            )
            },
            {
              key: 'ip',
              label: <span><GlobalOutlined /> IP Restrictions</span>,
              children: (
              <>
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center" style={{ gap: 12 }}>
                  <span><strong>Enable IP Restrictions</strong></span>
                  <Switch checked={ipRestrict} onChange={v => { setIpRestrict(v); message.info(v ? 'IP restrictions active' : 'IP restrictions disabled'); }} />
                </div>
                <Button type="primary" size="small" onClick={() => setAddIpOpen(true)} disabled={!ipRestrict}>+ Add Rule</Button>
              </div>
              <Table dataSource={rules} columns={ipColumns} rowKey="id" size="small" pagination={false} />
              </>
            )
            },
            {
              key: 'sessions',
              label: <span><TeamOutlined /> Sessions</span>,
              children: (
              <>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span><strong>{sessions.length}</strong> active sessions</span>
                <Popconfirm title="Force logout all other sessions?" onConfirm={() => { setSessions(sessions.filter(s => s.current)); message.success('All other sessions terminated'); }}>
                  <Button danger size="small">Force Logout All Others</Button>
                </Popconfirm>
              </div>
              <Table dataSource={sessions} columns={sessionColumns} rowKey="id" size="middle" pagination={false} />
              </>
            )
            },
          ]} />
        </div>
      </div>

      {/* Add IP Rule Modal */}
      <Modal title="Add IP Rule" open={addIpOpen} onCancel={() => { setAddIpOpen(false); ipForm.resetFields(); }} onOk={() => ipForm.submit()} destroyOnHidden>
        <Form form={ipForm} layout="vertical" onFinish={v => { setRules([...rules, { id: Date.now(), ...v }]); setAddIpOpen(false); ipForm.resetFields(); message.success('Rule added'); }}>
          <Form.Item name="ip" label="IP Address or CIDR Range" rules={[{ required: true }]}>
            <Input placeholder="e.g. 192.168.1.0/24 or 10.0.0.1" />
          </Form.Item>
          <Form.Item name="label" label="Label" rules={[{ required: true }]}>
            <Input placeholder="e.g. Office network" />
          </Form.Item>
          <Form.Item name="action" label="Action" initialValue="Allow" rules={[{ required: true }]}>
            <Select>
              <Option value="Allow">Allow</Option>
              <Option value="Block">Block</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Security;
