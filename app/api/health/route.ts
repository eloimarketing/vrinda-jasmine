import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';

export async function GET() {
  // Check DB/Prisma connectivity
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'error';
  }

  return NextResponse.json({
    server: 'ok',
    prisma: dbStatus === 'ok' ? 'ok' : 'error',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
} 