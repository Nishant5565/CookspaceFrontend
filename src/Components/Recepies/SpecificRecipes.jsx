import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi } from '@/Constant';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { IoMdAdd } from 'react-icons/io';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {toast} from 'sonner';
import { MdDelete } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const SpecificRecipes = () => {
  const { id } = useParams();
  const [specificPackage, setSpecificPackage] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const getPackage = async () => {
      const response = await fetchApi(`api/packages/${id}`, 'GET');
      if (response.status === 200) {
        setSpecificPackage(response.data);
      }
    };
    getPackage();
  }, [id]);

  if (!specificPackage) {
    return <div className="text-center text-lg font-semibold text-gray-500">Loading...</div>;
  }

  const initialValues = {
    passenger: [{ name: '', gender: '', age: '' }],
    email: '',
    phoneNumber: '',
    travelers: 1,
    specialRequests: '',
    packageId: id,
    selectedDate: '',
    
  };

  const validationSchema = Yup.object({
    passenger: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        age: Yup.number().required('Age is required').positive('Age must be positive').integer('Age must be an integer'),
      })
    ),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    travelers: Yup.number().min(1, 'Number of travelers must be at least 1').required('Number of travelers is required'),
    specialRequests: Yup.string(),
    selectedDate: Yup.string().required('Please select a date'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const response = await fetchApi('api/bookings', 'POST', values);
    if (response.status === 201) {
      toast.success('Booked successfully', {description: 'Your booking has been created successfully'});
      setShowBookingForm(false);
    } else {
      toast.error('Error creating booking', {description: response.data.message});
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8">
      <div className="relative mb-6">
        <img
          src={specificPackage.image}
          alt={specificPackage.title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-70 text-white px-4 py-1 rounded-md text-sm">
          ₹{specificPackage.price}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-800">{specificPackage.title}</h1>
        <p className="text-lg text-gray-700 leading-relaxed">{specificPackage.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Available Dates</h2>
        <div className="flex flex-wrap gap-4">
          {specificPackage.availableDates.map((date, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium"
            >
              {new Date(date).toLocaleDateString()}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          Start Booking
        </button>
      </div>

      {showBookingForm && (
        <div className="mt-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-4">
                <FieldArray name="passenger">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.passenger.map((_, index) => (
                        <div key={index} className=" flex justify-between relative">
                          <div>
                          <Field
                            name={`passenger[${index}].name`}
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                          />
                          <ErrorMessage name={`passenger[${index}].name`} component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                          <Field name={`passenger[${index}].gender`}>
                            {({ field }) => (
                              <Select {...field} onValueChange={(value) => setFieldValue(`passenger[${index}].gender`, value)}>
                                <SelectTrigger className="border border-gray-300 p-2 rounded-lg w-full">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          </Field>
                          <ErrorMessage name={`passenger[${index}].gender`} component="div" className="text-red-500 text-sm" />
                          </div>
                          <div>
                          <Field
                            name={`passenger[${index}].age`}
                            type="number"
                            placeholder="Age"
                            className="border border-gray-300 p-2 rounded-lg w-full"
                          />
                          <ErrorMessage name={`passenger[${index}].age`} component="div" className="text-red-500 text-sm" />
                          </div>
                          {index > 0 && (
                            <button type="button" onClick={() => {
                              remove(index);
                              setFieldValue('travelers', values.passenger.length - 1);
                            }} className="text-red-500 absolute -right-5 top-1/2 transform -translate-y-1/2">
                              <MdDelete size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                        push({ name: '', gender: '', age: '' });
                        setFieldValue('travelers', values.passenger.length + 1);
                      }} className=" flex items-center gap-2 bg-teal-800 text-white px-2 py-1 rounded-lg">
                        Add More <IoMdAdd />
                      </button>
                    </div>
                  )}
                </FieldArray>
                <div className=' flex  items-center gap-10 pb-4'>
                <div className="">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 p-2 rounded-lg w-96"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 absolute text-sm" />
                </div>
                <div className="">
                  <Field
                    name="phoneNumber"
                    type="text"
                    maxLength="10"
                    placeholder="Phone Number"
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 absolute text-sm" />
                </div>
                <div className="">
                  <Field name="selectedDate">
                    {({ field }) => (
                      <Select {...field} onValueChange={(value) => setFieldValue('selectedDate', value)}>
                        <SelectTrigger className="border border-gray-300 rounded-lg w-full">
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {specificPackage.availableDates.map((date, index) => (
                              <SelectItem key={index} value={date}>
                                {new Date(date).toLocaleDateString()}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="selectedDate" component="div" className="text-red-500 absolute text-sm" />
                </div>
                </div>
                <div className="space-y-2">
                  <Field
                    name="specialRequests"
                    as="textarea"
                    placeholder="Special Requests"
                    className="border border-gray-300 p-2 rounded-lg w-full"
                  />
                  <ErrorMessage name="specialRequests" component="div" className="text-red-500 text-sm" />
                </div>
   
              <div className=' flex justify-between items-center'>



              <button
                  type="submit"
                  className="bg-green-600 text-white py-3 px-6 rounded-lg shadow hover:bg-green-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
                <div>
                  Total Price: ₹{specificPackage.price * values.travelers}
                </div>
              </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default SpecificRecipes;
