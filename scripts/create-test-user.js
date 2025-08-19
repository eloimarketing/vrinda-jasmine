const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'supplier@test.com' }
    });

    if (existingUser) {
      console.log('✅ Test supplier user already exists:', existingUser.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create supplier user
    const supplierUser = await prisma.user.create({
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

    console.log('✅ Test supplier user created successfully:', supplierUser.email);
    console.log('User ID:', supplierUser.id);
    console.log('Role:', supplierUser.role);

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 