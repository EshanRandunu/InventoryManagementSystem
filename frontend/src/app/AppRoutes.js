import React from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import Home from "../pages/home/Home";
import AddItem from "../pages/inventory/AddItem";
import DisplayItem from "../pages/inventory/DisplayItem";
import UpdateItem from "../pages/inventory/UpdateItem";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import UserProfile from "../pages/users/UserProfile";
import UpdateUser from "../pages/users/UpdateUser";
import DisplayUsers from "../pages/users/DisplayUsers";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import Shop from "../pages/shop/Shop";

function LegacyItemEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/inventory/${id}/edit`} replace />;
}

function LegacyUserEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/profile/edit/${id}`} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />

      <Route path="/inventory" element={<DisplayItem />} />
      <Route path="/inventory/new" element={<AddItem />} />
      <Route path="/inventory/:id/edit" element={<UpdateItem />} />

      <Route path="/signin" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/profile/edit/:id" element={<UpdateUser />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/profile" element={<UserProfile />} />
      <Route path="/admin/users" element={<DisplayUsers />} />

      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/userProfile" element={<Navigate to="/profile" replace />} />
      <Route path="/updateUser/:id" element={<LegacyUserEditRedirect />} />
      <Route path="/displayUsers" element={<Navigate to="/admin/users" replace />} />
      <Route path="/additem" element={<Navigate to="/inventory/new" replace />} />
      <Route path="/allItems" element={<Navigate to="/inventory" replace />} />
      <Route path="/updateItem/:id" element={<LegacyItemEditRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
