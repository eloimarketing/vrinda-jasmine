const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminAccess() {
  try {
    console.log('🔍 Testing Admin Access and Product Approval System');
    console.log('==================================================');
    
    // Check admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'marketingeloi@mail.com' }
    });

    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   Name: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Verified: ${adminUser.isVerified ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Admin user not found');
    }

    // Check pending products
    const pendingProducts = await prisma.product.findMany({
      where: { isApproved: false },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    console.log('\n📦 Pending Products:');
    if (pendingProducts.length === 0) {
      console.log('   No products pending approval');
    } else {
      pendingProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name}`);
        console.log(`      ID: ${product.id}`);
        console.log(`      Category: ${product.category}`);
        console.log(`      Price: £${product.price}`);
        console.log(`      Owner: ${product.owner.firstName} ${product.owner.lastName}`);
        console.log(`      Created: ${product.createdAt.toLocaleDateString()}`);
      });
    }

    // Check approved products
    const approvedProducts = await prisma.product.findMany({
      where: { isApproved: true }
    });

    console.log('\n✅ Approved Products:');
    console.log(`   Total: ${approvedProducts.length}`);

    console.log('\n🎯 Next Steps:');
    console.log('   1. Login as admin with: marketingeloi@mail.com / @G0ldC0in123');
    console.log('   2. Go to /admin/products');
    console.log('   3. You should see the pending product for approval');
    console.log('   4. Click "Approve" to approve the product');

  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminAccess(); 