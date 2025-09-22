"use client"
import React from 'react';
import { useForm } from 'react-hook-form';

const HelpCenter = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = (data: any) => {
        console.log('Form submitted:', data);
        // Show success alert
        alert('Thank you for contacting us! We\'ll get back to you soon.');
        // Clear the form
        reset();
    };

    return (
        <div className="min-h-[580px] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Help Center
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're here to help! Please fill out the form below and our support team will get back to you as soon as possible.
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        Contact Support
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters'
                                    }
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message as any}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message as any}</p>
                            )}
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                {...register('phone', {
                                    pattern: {
                                        value: /^[+]?[\d\s-()]{10,}$/,
                                        message: 'Invalid phone number'
                                    }
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your phone number (optional)"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message as any}</p>
                            )}
                        </div>

                        {/* Subject Field */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <select
                                id="subject"
                                {...register('subject', { required: 'Subject is required' })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.subject ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select a subject</option>
                                <option value="technical">Technical Support</option>
                                <option value="billing">Billing Issue</option>
                                <option value="account">Account Problem</option>
                                <option value="feature">Feature Request</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.subject && (
                                <p className="mt-1 text-sm text-red-600">{errors.subject.message as any}</p>
                            )}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                rows={5}
                                {...register('description', {
                                    required: 'Description is required',
                                    minLength: {
                                        value: 10,
                                        message: 'Description must be at least 10 characters'
                                    }
                                })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Please describe your issue in detail..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message as any}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-white focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] border hover:border-primary hover:text-primary"
                            >
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Help Section */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Need immediate assistance? Call us at{' '}
                        <span className="text-blue-600 font-medium">1-800-HELP-NOW</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;