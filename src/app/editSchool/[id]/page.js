'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Validation schema same as addSchool
const schema = z.object({
  name: z.string().min(1, 'School name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  contact: z.string().regex(/^\d{10}$/, 'Contact must be a 10-digit number'),
  email_id: z.string().email('Invalid email address'),
  image: z
    .any()
    .optional() // Image optional for edit
    .refine(
      (files) =>
        !files ||
        (files?.length > 0 &&
          ['image/jpeg', 'image/png'].includes(files[0].type)),
      'Only JPEG or PNG images are allowed'
    ),
});

export default function EditSchool() {
  const { id } = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      setSubmitStatus('Invalid school ID');
      setLoading(false);
      return;
    }

    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools?id=${id}`);
        const data = await response.json();

        if (response.ok && data[0]) {
          const school = data[0];
          setValue('name', school.name);
          setValue('address', school.address);
          setValue('city', school.city);
          setValue('state', school.state);
          setValue('contact', school.contact);
          setValue('email_id', school.email_id);
        } else {
          setSubmitStatus('Error: School not found');
        }
      } catch (error) {
        setSubmitStatus('Error fetching school data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image' && value?.[0]) {
        formData.append(key, value[0]);
      } else if (value) {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(`/api/schools?id=${id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('School updated successfully!');
        setTimeout(() => router.push('/showSchools'), 1000);
      } else {
        setSubmitStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitStatus('Error updating form');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-700">Loading...</div>
    );
  }

  if (submitStatus && submitStatus.includes('Error')) {
    return (
      <div className="min-h-screen text-gray-500 bg-gradient-to-b from-blue-100 to-white flex flex-col items-center py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
          <p className="text-red-500 font-medium mb-4">{submitStatus}</p>
          <Link href="/showSchools">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition transform hover:scale-105">
              Back to Schools
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-400 bg-gradient-to-b from-blue-100 to-white flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit School
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* School Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name
            </label>
            <input
              {...register('name')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter school name"
              disabled={submitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              {...register('address')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter address"
              disabled={submitting}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* City */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              {...register('city')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter city"
              disabled={submitting}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              {...register('state')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter state"
              disabled={submitting}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          {/* Contact Number */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              {...register('contact')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter 10-digit contact number"
              disabled={submitting}
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email_id')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter email address"
              disabled={submitting}
            />
            {errors.email_id && (
              <p className="text-red-500 text-sm mt-1">{errors.email_id.message}</p>
            )}
          </div>

          {/* Image (Optional) */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Image (Optional)
            </label>
            <input
              type="file"
              {...register('image')}
              accept="image/jpeg,image/png"
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={submitting}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full p-3 rounded-lg font-semibold transition transform hover:scale-105 ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {submitting ? 'Updating...' : 'Update School'}
          </button>
        </form>

        {submitStatus && (
          <p
            className={`mt-4 text-center font-medium ${
              submitStatus.includes('Error')
                ? 'text-red-500'
                : 'text-green-600'
            }`}
          >
            {submitStatus}
          </p>
        )}

        <Link href="/showSchools">
          <button
            disabled={submitting}
            className={`mt-4 w-full p-3 rounded-lg font-semibold transition transform hover:scale-105 ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            Back to Schools
          </button>
        </Link>
      </div>
    </div>
  );
}
