const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        attributes: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📦 Products in database:');
    console.log('=======================');
    
    if (allProducts.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Subcategory: ${product.subcategory || 'N/A'}`);
      console.log(`   Price: £${product.price}`);
      console.log(`   Approved: ${product.isApproved ? 'Yes' : 'No'}`);
      console.log(`   Owner: ${product.owner.firstName} ${product.owner.lastName} (${product.owner.email})`);
      console.log(`   Created: ${product.createdAt.toLocaleDateString()}`);
      console.log(`   Media Type: ${product.mediaType || 'N/A'}`);
      console.log(`   Image: ${product.productImage ? 'Yes' : 'No'}`);
      console.log(`   Video: ${product.productVideo ? 'Yes' : 'No'}`);
      console.log(`   Attributes: ${product.attributes.length}`);
      console.log('');
    });

    const pendingProducts = allProducts.filter(p => !p.isApproved);
    const approvedProducts = allProducts.filter(p => p.isApproved);

    console.log(`📊 Summary:`);
    console.log(`   Total Products: ${allProducts.length}`);
    console.log(`   Pending Approval: ${pendingProducts.length}`);
    console.log(`   Approved: ${approvedProducts.length}`);

  } catch (error) {
    console.error('❌ Error checking products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts(); 