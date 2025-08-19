const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'marketingeloi@mail.com' }
    });

    if (existingUser) {
      console.log('✅ Admin user already exists:', existingUser.email);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('@G0ldC0in123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
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

    console.log('✅ Admin user created successfully:', adminUser.email);
    console.log('User ID:', adminUser.id);
    console.log('Role:', adminUser.role);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 