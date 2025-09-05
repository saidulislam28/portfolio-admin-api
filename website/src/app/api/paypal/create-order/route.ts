import { API_URL } from '@/config/config';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id } = await req.json(); // Get the request body

    console.log("hitting =========================>")

    const response = await fetch(`${API_URL}/api/v1/paypal/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    console.log('route data', data)
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ message: 'Error creating PayPal order' }, { status: 500 });
  }
}
