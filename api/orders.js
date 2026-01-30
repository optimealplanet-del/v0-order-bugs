import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface OrderProduct {
  title: string
  price: number
  qty: number
}

interface OrderRequest {
  firstName: string
  lastName: string
  email: string
  whatsapp: string
  products: OrderProduct[]
  totalAmount: number
  paymentMethod: string
  language?: string
  couponCode?: string
  discountAmount?: number
}

export async function POST(request: Request) {
  try {
    const orderData: OrderRequest = await request.json()

    const supabase = await createClient()

    // Préparer les items en JSON
    const itemsArray = orderData.products.map(p => ({
      title: p.title,
      price: p.price,
      qty: p.qty
    }))

    // Créer la commande avec les BONS noms de colonnes
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        nom: orderData.lastName,           // ✅ CORRECT
        prenom: orderData.firstName,        // ✅ CORRECT
        email: orderData.email,             // ✅ CORRECT
        phone: orderData.whatsapp,          // ✅ CORRECT
        items: itemsArray,                  // ✅ CORRECT (JSONB)
        total: orderData.totalAmount,       // ✅ CORRECT
        status: "pending",
        paid: false
      })
      .select("id")
      .single()

    if (orderError) {
      console.error("[Order Error]:", orderError)
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id 
    })

  } catch (err) {
    console.error("[Exception]:", err)
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la commande" },
      { status: 500 }
    )
  }
}
