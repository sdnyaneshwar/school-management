'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import Link from 'next/link';

// Define validation schema with Zod
const schema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  contact: z
    .string()
    .regex(/^\d{10}$/, 'Contact must be a 10-digit number'),
  email_id: z.string().email('Invalid email address'),
  image: z
    .any()
    .refine((files) => files?.length > 0, 'Image is required')
    .refine(
      (files) => files?.length > 0 && ['image/jpeg', 'image/png'].includes(files[0].type),
      'Only JPEG or PNG images are allowed'
    ),
});

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image') {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    for (let [key, value] of formData.entries()) {
      console.log(`FormData - ${key}:`, value);
    }

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitStatus('School added successfully!');
        reset();
      } else {
        setSubmitStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitStatus('Error submitting form');
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add a New School</h1>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
            <input
              {...register('name')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter school name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              {...register('address')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              {...register('city')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter city"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              {...register('state')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter state"
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              {...register('contact')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter 10-digit contact number"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email_id')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter email address"
            />
            {errors.email_id && <p className="text-red-500 text-sm mt-1">{errors.email_id.message}</p>}
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">School Image</label>
            <input
              type="file"
              {...register('image')}
              accept="image/jpeg,image/png"
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            Add School
          </button>
        </form>
        {submitStatus && (
          <p className={`mt-4 text-center font-medium ${submitStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
            {submitStatus}
          </p>
        )}
        <Link href="/">
          <button className="mt-4 w-full bg-gray-600 text-white p-3 rounded-lg font-semibold hover:bg-gray-700 transition transform hover:scale-105">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}