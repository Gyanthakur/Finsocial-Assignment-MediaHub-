const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  try {
    // Create admin user with YOUR email
    const adminPassword = await bcryptjs.hash('Gyan1234', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'gps.96169@gmail.com' },
      update: {
        password: adminPassword,
        role: 'ADMIN',
        name: 'Admin User',
        bio: 'Platform Administrator'
      },
      create: {
        email: 'gps.96169@gmail.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        bio: 'Platform Administrator'
      }
    });

    console.log('✅ Created/Updated admin account:', admin.email);
    console.log('   Role: ' + admin.role);

    // Create test user account
    const userPassword = await bcryptjs.hash('User123!', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: userPassword,
        name: 'Test User',
        role: 'USER',
        bio: 'Content Creator'
      }
    });

    console.log('✅ Created test user account:', user.email);

    console.log('\n📝 LOGIN CREDENTIALS:\n');
    console.log('🛡️  ADMIN LOGIN (YOUR ACCOUNT):');
    console.log('   Email: gps.96169@gmail.com');
    console.log('   Password: Gyan1234\n');
    
    console.log('👤 TEST USER LOGIN:');
    console.log('   Email: user@example.com');
    console.log('   Password: User123!\n');

    console.log('🔗 Access Links:');
    console.log('   Admin Portal: http://localhost:3000/login?admin=true');
    console.log('   User Login: http://localhost:3000/login');
    console.log('   Admin Dashboard: http://localhost:3000/dashboard/admin\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

