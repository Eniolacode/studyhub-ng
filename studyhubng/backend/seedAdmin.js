const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seedAdmin() {
  const email = 'admin@gmail.com';
  const password = 'admin123456789@77';
  const name = 'Platform Admin';

  console.log(`🚀 Seeding Admin User: ${email}...`);

  // Check if admin already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    console.log('ℹ️ Admin user already exists. Updating password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    await supabase
      .from('users')
      .update({ password_hash: hashedPassword, role: 'admin' })
      .eq('email', email);
    
    console.log('✅ Admin password updated.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email,
        password_hash: hashedPassword,
        role: 'admin'
      }
    ]);

  if (error) {
    console.error('❌ Error seeding admin:', error.message);
  } else {
    console.log('✅ Admin user created successfully!');
  }
}

seedAdmin();
