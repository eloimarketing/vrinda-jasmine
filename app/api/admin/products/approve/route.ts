import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { productId, action, reason } = await request.json();

    if (!productId || !action) {
      return NextResponse.json({ error: 'Product ID and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 });
    }

    // Find the product first to check if it exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let updatedProduct;

    if (action === 'approve') {
      // Update product to approved
      updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { 
          isApproved: true, 
          approvedAt: new Date(),
          approvedBy: user.id
        }
      });
    } else if (action === 'reject') {
      // For rejection, we could either delete the product or mark it as rejected
      // For now, let's delete it since there's no rejected status in the schema
      await prisma.product.delete({
        where: { id: productId }
      });
      
      return NextResponse.json({
        message: 'Product rejected and removed successfully',
        action: 'rejected'
      });
    }

    return NextResponse.json({
      message: `Product ${action}d successfully`,
      product: updatedProduct,
      action: action
    });

  } catch (error) {
    console.error('Error processing product action:', error);
    return NextResponse.json(
      { error: 'Failed to process product action' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        attributes: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      product: {
        ...product,
        attributes: product.attributes.reduce((acc: any, attr: any) => {
          acc[attr.attributeName] = attr.attributeValue;
          return acc;
        }, {})
      }
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 