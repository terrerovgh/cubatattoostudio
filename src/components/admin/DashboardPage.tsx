import React, { Suspense } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import DashboardStats from './DashboardStats';
const ActivityChart = React.lazy(() => import('./ActivityChart'))
const DistributionChart = React.lazy(() => import('./DistributionChart'))
import RecentActivity from './RecentActivity';

const DashboardPage = () => {
    return (
        <DashboardLayout title="Dashboard">
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <DashboardStats />
                </div>

                {/* Charts Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Activity Chart - Takes up 2 columns */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm lg:col-span-2">
                        <h3 className="mb-6 text-lg font-semibold text-white">Activity Overview</h3>
                        <Suspense fallback={<div className="h-80" />}> 
                            <ActivityChart />
                        </Suspense>
                    </div>

                    {/* Distribution Chart - Takes up 1 column */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm">
                        <h3 className="mb-6 text-lg font-semibold text-white">Content Distribution</h3>
                        <Suspense fallback={<div className="h-80" />}> 
                            <DistributionChart />
                        </Suspense>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 backdrop-blur-sm">
                    <h3 className="mb-6 text-lg font-semibold text-white">Recent Activity</h3>
                    <RecentActivity />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
