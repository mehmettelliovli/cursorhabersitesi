import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard, NewsManagement, UserManagement } from '../pages/admin';
import AdminLayout from '../layouts/AdminLayout';
import AddRole from '../pages/admin/AddRole';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="news" element={<NewsManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="addrole" element={<AddRole />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 