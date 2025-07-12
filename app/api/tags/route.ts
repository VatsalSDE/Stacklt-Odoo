import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';

// GET /api/tags - Get all tags with usage counts
export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Aggregate to get all tags with their counts
    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    return NextResponse.json({
      tags: tags.map(tag => ({
        name: tag.name,
        count: tag.count
      }))
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
} 