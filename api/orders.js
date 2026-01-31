import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    return NextResponse.json({ 
      success: true, 
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase()
    })

  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Erreur" },
      { status: 500 }
    )
  }
}
