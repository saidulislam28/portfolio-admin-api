'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";

export default function Checkout() {
    const { register, handleSubmit } = useForm();

    const {
        isEmpty,
        totalUniqueItems,
        items,
        updateItemQuantity,
        removeItem,
    } = useCart();
    const subtotal = items.reduce((total, item:any) => {
        return total + (item.price * item?.quantity);
    }, 0);

    const onSubmit = (data:any) => {
       
        console.log('Form data:', data);
        console.log('Cart items:', items);
        console.log('Subtotal:', subtotal);
    
      };

    return (
        <div className="max-w-7xl mx-auto flex items-center flex-col md:flex-row gap-6 p-6 bg-white shadow-md rounded-lg">
            <div className="w-[60%] p-6">
                <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* First Name */}
                    <div>
                        <label className="block text-gray-700 mb-1">First Name*</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('firstName')}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('phone')}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('email')}
                        />
                    </div>

                    {/* Installation Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Installation Date</label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register('installationDate')}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Installation Time</label>
                            <input
                                type="time"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register('installationTime')}
                            />
                        </div>
                    </div>

                    {/* Vehicle Brand and Model */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Vehicle Brand</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register('vehicleBrand')}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Vehicle Model</label>
                            <input
                                type="text"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                {...register('vehicleModel')}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('address')}
                        />
                    </div>

                    {/* City/Town */}
                    <div>
                        <label className="block text-gray-700 mb-1">City/Town</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('city')}
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-gray-700 mb-1">District</label>
                        <select
                            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                            {...register('district')}
                        >
                            <option value="">Select District</option>
                            <option value="dhaka">Dhaka</option>
                            <option value="chittagong">Chittagong</option>
                            <option value="sylhet">Sylhet</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>

                    {/* Save Information Checkbox */}
                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            id="saveInfo"
                            className="h-4 w-4 text-orange-500 focus:ring-orange-400"
                            {...register('saveInfo')}
                        />
                        <label htmlFor="saveInfo" className="text-gray-700 text-sm">
                            Save this information for faster check-out next time
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg mt-6"
                    >
                        Confirm Order
                    </button>
                </form>
            </div>
            <div className="w-[40%]  p-6 space-y-6">
                {/* Product Info */}
                <div className="space-y-2">
                    {/* <div className="flex justify-between text-gray-700">
                        <span>Product Name</span>
                        <span>BDT {subtotal}</span>
                    </div> */}
                    <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span>BDT  {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>BDT {subtotal}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input type="radio" id="bank" name="payment" className="accent-orange-500 size-5 overflow-hidden" />
                        <label htmlFor="bank" className="flex items-center gap-2 text-gray-700">
                            Bank
                            {/* Dummy payment icons */}
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                alt="Visa"
                                className="w-10 h-6 object-contain"
                            />
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/MasterCard_Logo.svg"
                                alt="MasterCard"
                                className="w-10 h-6 object-contain"
                            />
                            {/* Add more logos if you want */}
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            id="cod"
                            name="payment"
                            className="accent-orange-500 size-5"
                            defaultChecked
                        />
                        <label htmlFor="cod" className="text-gray-700">
                            Cash on delivery
                        </label>
                    </div>
                </div>

                {/* Privacy Policy */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                    <a href="#" className="underline text-blue-500 hover:text-blue-600">
                        privacy policy
                    </a>.
                </p>

                {/* Coupon Code */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Coupon Code"
                        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">
                        Apply Coupon
                    </button>
                </div>

                {/* Place Order Button */}
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold">
                    Place Order
                </button>
            </div>
        </div>
    );
}
