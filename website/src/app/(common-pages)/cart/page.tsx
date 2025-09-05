'use client'
import React from 'react'
import Link from 'next/link'
import { useCart } from 'react-use-cart';
import { FaMinus, FaPlus } from 'react-icons/fa';

export default function page() {


  const {
    isEmpty,
    totalUniqueItems,
    items,
    updateItemQuantity,
    removeItem,
  } = useCart();

  console.log("items >>>>>>>>>", items)



  const subtotal = items.reduce((total, item: any) => {
    return total + (item.price * item?.quantity);
  }, 0);


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Cart Table */}
      <div className="overflow-x-auto max-w-7xl mx-auto">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4"></th>
              <th className="p-4 font-semibold text-gray-700"></th>
              <th className="p-4 font-semibold text-gray-700">Product</th>
              <th className="p-4 font-semibold text-gray-700">Price</th>
              <th className="p-4 font-semibold text-gray-700">Quantity</th>
              <th className="p-4 font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {
              items?.map((item: any) => (
                <tr key={item?.id} className="border-b">
                  <td className="p-4">
                    <button onClick={() => removeItem(item?.id)} className="text-gray-400 hover:text-red-500">&times;</button>
                  </td>
                  <td className="p-4 ">
                    <img
                      src={item?.image}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded"
                    />

                  </td>
                  <td className="p-4 text-gray-700">{item?.title}</td>
                  <td className="p-4 text-gray-700">BDT {item?.price}</td>
                  <td className="p-4 gap-2">

                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity ?? 0) - 1)}
                    >
                      <FaMinus />
                    </button>
                    <span className="px-4 border-2 py-2 mx-4">{item?.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(item.id, (item.quantity ?? 0) + 1)}
                    >
                      <FaPlus />
                    </button>
                  </td>
                  <td className="p-4 text-gray-700">BDT {Number(item?.price) * Number(item?.quantity)}</td>
                </tr>

              ))
            }

          </tbody>
        </table>
      </div>

      {/* Cart Totals */}
      <div className="mt-10 max-w-md mr-auto">
        <h2 className="text-2xl font-semibold mb-6">Cart Totals</h2>
        <div className="space-y-4 border p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-800">BDT {subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping Fee</span>
            <span className="text-green-600 font-medium">FREE!!!</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-4">
            <span>Total</span>
            <span>BDT {subtotal}</span>
          </div>
          <Link href={'/checkout'}>
            <button
              disabled={items.length <= 0}

              className={`w-full py-3 rounded-lg mt-6 text-white ${items.length <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
