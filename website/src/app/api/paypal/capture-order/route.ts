import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { orderId } = await req.json();

    // Make a request to the PayPal capture order endpoint
    const response = await fetch(`${process.env.API_URL}/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    // Parse the response from PayPal
    const data = await response.json();

    // Return the response with status 200 and the data from PayPal
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json({ message: 'Error capturing PayPal order' }, { status: 500 });
  }
}
