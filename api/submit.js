import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fullName, email, meterNumber, address } = req.body;

  if (!fullName || !email || !meterNumber || !address) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('beneficiariess')
      .insert([
        {
          full_name: fullName,
          email: email,
          meter_number: meterNumber,
          address: address
        }
      ])
      select();

    if (error) {
      // Handle unique constraint error for duplicate meter numbers
      if (error.code === '23505') {
        return res.status(400).json({ error: 'This meter number has already been registered.' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    return res.status(500).json({ error: 'Database error: ' + err.message });
  }
}