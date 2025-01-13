import React, { useState } from 'react';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
   } from "@/components/ui/dialog";
import AddPackage from './AddPackage';
import { fetchApi } from '@/Constant';
import {toast} from 'sonner'

const PackageList = ({ packages , fetchPackages}) => {
     const [selectedPackage, setSelectedPackage] = useState(null);
     console.log(packages);
     const handleDelete = async (id) => {
          window.confirm('Are you sure you want to delete this package?');
          try {
               const response = await fetchApi(`api/admin/packages/${id}`, 'DELETE');
               if (response.status === 200) {
                    fetchPackages();
                    toast.success('Package deleted successfully');
               }
          } catch (error) {
               console.error('Error deleting package:', error);
          }
     }

     return (
          <div className="flex flex-nowrap gap-4">
               {packages.length > 0 && packages.map(pkg => (
                    <Dialog key={pkg._id} onOpenChange={() => setSelectedPackage(pkg)} >
                         <DialogTrigger asChild>
                              <div className="border rounded-lg shadow-lg cursor-pointer w-60 p-1 ">
                                   <img src={pkg.image} alt={pkg.title} className="w-60 h-40 object-cover rounded-t-lg" />
                                   <div className="p-4">
                                        <h2 className="text-[17px] h-12 font-semibold text-gray-800">{pkg.title}</h2>
                                        <p className="text-gray-600 mt-2 text-[12px] h-20">{pkg.description.substring(0, 100)}...</p>
                                        <p className="text-gray-800 font-semibold mt-4">₹
                                        {pkg.price}</p>
                                   </div>
                              </div>
                         </DialogTrigger>
                         <DialogContent  className="p-0 overflow-hidden">
                              <DialogHeader className=" p-4 font-normal bg-blue-600 text-white">
                                   <DialogTitle className = "font-normal">{selectedPackage?.title}</DialogTitle>
                              </DialogHeader>
                              <DialogDescription className = "p-4">   
                                        <img src={selectedPackage?.image} alt={selectedPackage?.title} className="w-full h-60 object-cover rounded-lg" />
                                        <p className="text-gray-600 mt-4">{selectedPackage?.description}</p>
                                        <p className="text-gray-800 font-semibold mt-4">${selectedPackage?.price}</p>
                                   </DialogDescription>
                         <div className='flex justify-center'>
                         <AddPackage mode="edit" packageData={selectedPackage} fetchPackages = {fetchPackages}/>
                         <button onClick={() => handleDelete(selectedPackage?._id)} className="bg-red-600 text-white px-4 py-2 my-2 mx-auto rounded-lg">Delete</button>
                         </div>
                         </DialogContent>
                         
                    </Dialog>
               ))}
          </div>
     );
};

export default PackageList;
