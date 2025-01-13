import React, { useEffect, useState, useContext } from 'react';
import { fetchApi } from '@/Constant';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserContext } from '@/Contexts/UserContext';
import { Link } from 'react-router-dom';
import {toast} from 'sonner'

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetchApi('api/user/bookings', 'GET');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
     window.confirm('Are you sure you want to cancel this booking?');
     try {
           const response = await fetchApi(`api/bookings/${bookingId}`, 'DELETE');
               if (response.status === 200) {
                    toast.success('Booking Canceled successfully');
                    setBookings(bookings.filter(booking => booking._id !== bookingId));
               }    
     }
     catch (error) {
          console.error('Error cancelling booking:', error);
     }
     };

  return (
    <div className="container rounded-[20px] overflow-hidden min-h-screen border-2">
      <div className="flex justify-between items-center bg-gradient-to-r from-[#181818] to-[#000000] mb-6 p-6 rounded-t-[10px]">
        <h2 className="text-2xl text-white">Welcome, {user?.userName}!</h2>
        <h1 className="text-2xl text-white">User Dashboard</h1>
      </div>
      <div className="p-4">
        <h2 className="text-xl mb-4">Your Bookings</h2>
        <div className=' flex gap-10'>
        {bookings.length > 0 && bookings.map(booking => (
          <Dialog key={booking?._id} onOpenChange={() => setSelectedPackage(booking.package)}>
            <DialogTrigger asChild>
              <div className="border rounded-lg shadow-lg cursor-pointer w-60 p-1 mb-4">
                <img src={booking.package?.image} alt={booking.package?.title} className="w-60 h-40 object-cover rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-[17px] h-12 font-semibold text-gray-800">{booking.package?.title}</h2>
                  <p className="text-gray-600 mt-2 text-[12px] h-20">{booking.package?.description.substring(0, 100)}...</p>
                  <p className="text-gray-800 font-semibold mt-4">₹{booking.package?.price}</p>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden">
              <DialogHeader className="p-4 font-normal bg-blue-600 text-white">
                <DialogTitle className="font-normal">{selectedPackage?.title}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="p-4">
                <img src={selectedPackage?.image} alt={selectedPackage?.title} className="w-full h-60 object-cover rounded-lg" />
                <p className="text-gray-600 mt-4">{selectedPackage?.description}</p>
                <p className="text-gray-800 font-semibold mt-4">₹{selectedPackage?.price}</p>
              </DialogDescription>
              <DialogFooter className=' pr-4'>
                    <button className="bg-red-600 text-white px-4 py-2 mb-4 rounded-lg"
                    onClick={() => handleCancelBooking(booking._id)}
                    >Cancel Booking</button>

                    <Link to={`/reciept/${booking._id}`} className="bg-teal-600 text-white px-4 py-2 mb-4 rounded-lg">Show Reciept</Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
        
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;