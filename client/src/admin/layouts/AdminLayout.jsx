import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const AdminLayout = () => {
const { user, loading } = useUser();

if (loading) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="animate-spin h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full"></span>
    </div>
    );
}

if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
}

return (
    <div className="flex h-screen bg-[#f3f4f6] font-body overflow-hidden">
    <AdminSidebar />

    <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f3f4f6] p-6">
        <Outlet />
        </main>
    </div>
    </div>
);
};

export default AdminLayout;