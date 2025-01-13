import React, {useState, useEffect} from 'react';
import { fetchApi } from '@/Constant';

const Analytics = () => {
     const [analytics, setAnalytics] = useState({ totalBookings: 0, totalRevenue: 0 });

     useEffect(() => {
          const fetchAnalytics = async () => {
               const response = await fetchApi('api/admin/analytics', 'GET');
               if (response.status === 200) {
                    setAnalytics(response.data);
               }
          }
          fetchAnalytics();
     }, []);

     return (
          <div className="mt-8 border-t pt-4 ">
               <h2 className="text-xl font-bold mb-4">Analytics</h2>
               <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white shadow rounded-lg">
                         <h3 className="text-lg font-semibold">Total Bookings</h3>
                         <p className="text-2xl">{analytics.totalBookings}</p>
                    </div>
                    <div className="p-4 bg-white shadow rounded-lg">
                         <h3 className="text-lg font-semibold">Total Revenue</h3>
                         <p className="text-2xl">₹{analytics.totalRevenue}</p>
                    </div>
               </div>
          </div>
     );
};

export default Analytics;
