import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { nom, prenom, email, phone, items, total } = req.body;

    if (!nom || !prenom || !email || !phone || !items || !total) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          nom,
          prenom,
          email,
          phone,
          items: JSON.stringify(items),
          total: parseFloat(total),
          status: 'pending',
          paid: false
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Erreur' });
    }

    return res.status(201).json({
      success: true,
      order_id: data[0].id
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
