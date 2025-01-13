import React, { useState } from "react";
import { fetchApi } from "@/Constant";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoMdAdd } from "react-icons/io";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddPackage = ({ fetchPackages, mode, packageData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const initialValues = {
    title: mode === "edit" ? packageData?.title : "",
    description: mode === "edit" ? packageData?.description : "",
    price: mode === "edit" ? packageData?.price : "",
    availableDates: mode === "edit" ? packageData?.availableDates.map(formatDate) || [] : [],
    image: mode === "edit" ? packageData?.image : "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    availableDates: Yup.array().of(Yup.string().required("Available date is required")).min(1, "At least one date is required"),
    image: Yup.string().url("Invalid URL").required("Image URL is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = { ...values, availableDates: [...values.availableDates] };
    try {
      const response =
        mode === "edit"
          ? await fetchApi(`api/admin/packages/${packageData._id}`, "PUT", payload)
          : await fetchApi("api/admin/packages", "POST", payload);

      if (response?.status == "200") {
        toast.success(response.data.message);
        resetForm();
        setSelectedDate(null);
        setIsOpen(false);
        fetchPackages();
      } else {
        console.log(response);
        toast.error("Failed to create package");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} className="fixed inset-0 z-50 overflow-y-auto">
      {mode === "edit" ? (
        <DialogTrigger className="w-fit px-4 py-2 text-center mx-auto my-2 bg-teal-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <button className="">Edit Package</button>
        </DialogTrigger>
      ) : (
        <DialogTrigger className="flex flex-col p-6 w-60 h-40 bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out">
          <div className="mt-4">Add A New Package</div>
          <div className="w-full text-end">
            <IoMdAdd className="translate-y-12 translate-x-36" size={40} />
          </div>
        </DialogTrigger>
      )}
      <DialogContent className=" min-w-[60vw] mx-auto p-6 bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {mode === "edit" ? "Edit Package" : "Add New Package"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in the details below to {mode === "edit" ? "update" : "add"} a package.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter package title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <Field
                    type="number"
                    id="price"
                    name="price"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter price"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                </div>

              <div className="form-group">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="3"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm h-40"
                  placeholder="Enter package description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="form-group grid grid-cols-2 gap-4">
     
                <div>
                  <DatePicker

                     
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFieldValue(
                        "availableDates",
                        [...(values.availableDates || []), formatDate(date)]
                      );
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholderText="Add dates"
                  />
                  <ErrorMessage
                    name="availableDates"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  <FieldArray name="availableDates">
                    {({ remove }) => (
                      <div className=" flex items-center justify-normal mt-2 gap-3">
                        {values.availableDates.map((date, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md gap-1">
                            <span className=" w-full text-nowrap text-[12px]"> {date}</span>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 text-[12px]"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <Field
                  type="text"
                  id="image"
                  name="image"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter image URL"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg shadow-lg focus:outline-none focus:ring-4"
              >
                {isSubmitting
                  ? mode === "edit"
                    ? "Updating..."
                    : "Adding..."
                  : mode === "edit"
                  ? "Update Package"
                  : "Add Package"}
              </button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddPackage;
