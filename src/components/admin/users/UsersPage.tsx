import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import UsersTable from './UsersTable';

const UsersPage = () => {
    return (
        <DashboardLayout title="Users">
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Users</h1>
                        <p className="text-zinc-400">Manage user roles and permissions</p>
                    </div>
                </div>
                <UsersTable />
            </div>
        </DashboardLayout>
    );
};

export default UsersPage;
