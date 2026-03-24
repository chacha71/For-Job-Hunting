import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import FollowUps from './pages/FollowUps';
import Analysis from './pages/Analysis';
import Tags from './pages/Tags';
import Competitors from './pages/Competitors';
import Activities from './pages/Activities';
import Messages from './pages/Messages';
import Templates from './pages/Templates';
import Permissions from './pages/Permissions';
import Settings from './pages/Settings';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 220 }}>
          <Header />
          <Content style={{ margin: '24px', padding: '24px', background: '#fff', minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/followups" element={<FollowUps />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/tags" element={<Tags />} />
              <Route path="/competitors" element={<Competitors />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;