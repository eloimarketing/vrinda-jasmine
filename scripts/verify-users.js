const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function verifyAndCreateUsers() {
  try {
    console.log('🔍 Checking existing users...\n');

    // Check admin user
    let adminUser = await prisma.user.findUnique({
      where: { email: 'marketingeloi@mail.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Creating...');
      const hashedPassword = await bcrypt.hash('@G0ldC0in123', 12);
      adminUser = await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'marketingeloi@mail.com',
          password: hashedPassword,
          phoneNumber: '+1234567890',
          role: 'ADMIN',
          isVerified: true,
        }
      });
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('👤 Admin User Details:');
    console.log('   Email: marketingeloi@mail.com');
    console.log('   Password: @G0ldC0in123');
    console.log('   Role:', adminUser.role);
    console.log('   ID:', adminUser.id);
    console.log('');

    // Check supplier user
    let supplierUser = await prisma.user.findUnique({
      where: { email: 'supplier@test.com' }
    });

    if (!supplierUser) {
      console.log('❌ Supplier user not found. Creating...');
      const hashedPassword = await bcrypt.hash('password123', 12);
      supplierUser = await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'Supplier',
          email: 'supplier@test.com',
          password: hashedPassword,
          phoneNumber: '+1234567890',
          role: 'SUPPLIER',
          isVerified: true,
        }
      });
      console.log('✅ Supplier user created successfully');
    } else {
      console.log('✅ Supplier user already exists');
    }

    console.log('🏪 Supplier User Details:');
    console.log('   Email: supplier@test.com');
    console.log('   Password: password123');
    console.log('   Role:', supplierUser.role);
    console.log('   ID:', supplierUser.id);
    console.log('');

    // Test password verification
    console.log('🔐 Testing password verification...');
    
    const adminPasswordValid = await bcrypt.compare('@G0ldC0in123', adminUser.password);
    const supplierPasswordValid = await bcrypt.compare('password123', supplierUser.password);
    
    console.log('   Admin password valid:', adminPasswordValid ? '✅' : '❌');
    console.log('   Supplier password valid:', supplierPasswordValid ? '✅' : '❌');
    
    if (adminPasswordValid && supplierPasswordValid) {
      console.log('\n🎉 All users are ready for login!');
    } else {
      console.log('\n⚠️  Some password verifications failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAndCreateUsers();
