const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 Users in database:');
    console.log('=====================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });

    console.log(`Total users: ${users.length}`);

  } catch (error) {
    console.error('❌ Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 