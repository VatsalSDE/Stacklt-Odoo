import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

// GET /api/questions - List questions with filtering and sorting
export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'hot';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    let query: any = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build aggregation pipeline
    let pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'question',
          as: 'answers'
        }
      },
      {
        $addFields: {
          answerCount: { $size: '$answers' },
          voteCount: { $subtract: [{ $size: '$votes.upvotes' }, { $size: '$votes.downvotes' }] },
          hasAcceptedAnswer: { $in: ['$_id', '$answers.question'] },
          isHot: {
            $and: [
              { $gte: ['$createdAt', new Date(Date.now() - 24 * 60 * 60 * 1000)] },
              {
                $or: [
                  { $gt: [{ $subtract: [{ $size: '$votes.upvotes' }, { $size: '$votes.downvotes' }] }, 10] },
                  { $gt: [{ $size: '$answers' }, 5] }
                ]
              }
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          viewCount: 1,
          answerCount: 1,
          voteCount: 1,
          hasAcceptedAnswer: 1,
          isHot: 1,
          author: {
            _id: 1,
            username: 1,
            avatar: 1,
            reputation: 1
          }
        }
      }
    ];

    // Apply sorting based on filter
    switch (filter) {
      case 'newest':
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
      case 'hot':
        pipeline.push({ $sort: { isHot: -1, voteCount: -1, answerCount: -1 } });
        break;
      case 'unanswered':
        pipeline.push({ $match: { answerCount: 0 } });
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
      case 'votes':
        pipeline.push({ $sort: { voteCount: -1 } });
        break;
      default:
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    const questions = await Question.aggregate(pipeline);

    // Get total count for pagination
    const totalPipeline = [
      { $match: query },
      { $count: 'total' }
    ];
    const totalResult = await Question.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { title, description, tags } = body;

    // Validate required fields
    if (!title || !description || !tags || tags.length === 0) {
      return NextResponse.json(
        { error: 'Title, description, and at least one tag are required' },
        { status: 400 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Create the question
    const question = await Question.create({
      title,
      description,
      tags: tags.map((tag: string) => tag.toLowerCase()),
      author: decoded.id,
      votes: { upvotes: [], downvotes: [] }
    });

    // Populate author information
    await question.populate('author', 'username avatar reputation');

    return NextResponse.json({
      message: 'Question created successfully',
      question: {
        id: question._id,
        title: question.title,
        description: question.description,
        tags: question.tags,
        author: question.author,
        createdAt: question.createdAt,
        answerCount: 0,
        voteCount: 0,
        viewCount: 0,
        hasAcceptedAnswer: false,
        isHot: false
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
} 