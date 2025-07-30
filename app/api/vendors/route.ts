import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/models/Vendor';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/authOptions';

// GET vendors with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    await connectDB();
    
    const vendors = await Vendor.find({ createdBy: session.user.email })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
      
    const total = await Vendor.countDocuments({ createdBy: session.user.email });
    
    return NextResponse.json({ 
      vendors, 
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

// POST create new vendor
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOption);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    await connectDB();
    
    const vendor = await Vendor.create({
      ...body,
      createdBy: session.user.email
    });
    
    return NextResponse.json(vendor, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vendor:', error);
    return NextResponse.json({ error: error.message || 'Failed to create vendor' }, { status: 500 });
  }
}