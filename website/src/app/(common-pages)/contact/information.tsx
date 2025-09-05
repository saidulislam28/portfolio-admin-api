'use client'
import React from 'react'
import { Controller, useForm } from 'react-hook-form';

export default function Information() {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();

    const interestOptions = [
        'Vehicle Tracking',
        'Sensor Monitoring',
        'Record Usage',
        'Control Fuel Usage',
        'Fleet Policy & Report'
    ];

    const vehicleOptions = [
        '1-10',
        '11-20',
        '21-30',
        '41-50'
    ];

    const onSubmit = (data: any) => {
        console.log('Form submitted:', data);
        // Add your form submission logic here
    };
    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg mt-20">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Give Your Information</h2>
            <p className="text-gray-600 mb-6">If you have any query or any type of suggestion, you can contact us here. We would love to hear from you.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                        <input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />

                    </div>

                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-gray-700 mb-1">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9+\-() ]+$/,
                                    message: "Invalid phone number"
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="company" className="block text-gray-700 mb-1">Company</label>
                    <input
                        id="company"
                        {...register("company")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="block text-gray-700 mb-2">Number of vehicles</p>
                        <div className="space-y-2">
                            {vehicleOptions.map((option) => (
                                <div key={option} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={option}
                                        value={option}
                                        {...register("vehicles", { required: "Please select an option" })}
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                    />
                                    <label htmlFor={option} className="ml-2 text-gray-700">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="block text-gray-700 mb-2">Interest</p>
                        <div className="space-y-2">
                            <Controller
                                control={control}
                                name="interests"
                                render={({ field }) => (
                                    <>
                                        {interestOptions.map((option) => (
                                            <div key={option} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={option.replace(/\s+/g, '-').toLowerCase()}
                                                    value={option}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = e.target.value;
                                                        const currentInterests = field.value || [];

                                                        if (checked) {
                                                            field.onChange([...currentInterests, value]);
                                                        } else {
                                                            field.onChange(currentInterests.filter((item: any) => item !== value));
                                                        }
                                                    }}
                                                    checked={(field.value || []).includes(option)}
                                                    className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                                                />
                                                <label htmlFor={option.replace(/\s+/g, '-').toLowerCase()} className="ml-2 text-gray-700">
                                                    {option}
                                                </label>
                                            </div>
                                        ))}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
                    <textarea
                        id="message"
                        rows={5}
                        {...register("message", { required: "Message is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-150"
                >
                    Send Message
                </button>
            </form>
        </div>
    )
}
