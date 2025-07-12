import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
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

// GET /api/questions/[id]/answers - Get answers for a question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const questionId = params.id;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Get answers with author information
    const answers = await Answer.find({ question: questionId })
      .populate('author', 'username avatar reputation')
      .sort({ isAccepted: -1, createdAt: -1 });

    const formattedAnswers = answers.map((answer: any) => ({
      id: answer._id,
      content: answer.content,
      author: answer.author,
      createdAt: answer.createdAt,
      isAccepted: answer.isAccepted,
      voteCount: answer.votes.upvotes.length - answer.votes.downvotes.length
    }));

    return NextResponse.json({
      answers: formattedAnswers,
      count: formattedAnswers.length
    });

  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}

// POST /api/questions/[id]/answers - Create a new answer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const questionId = params.id;
    const body = await request.json();
    const { content } = body;

    // Validate required fields
    if (!content || content.trim().length < 5) {
      return NextResponse.json(
        { error: 'Answer content must be at least 5 characters long' },
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

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Create the answer
    const answer = await Answer.create({
      question: questionId,
      author: decoded.id,
      content: content.trim(),
      votes: { upvotes: [], downvotes: [] }
    });

    // Add answer to question's answers array
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: answer._id }
    });

    // Create notification for the question author
    const { createAnswerNotification } = await import('@/lib/notifications');
    await createAnswerNotification(questionId, answer._id.toString(), decoded.id);

    // Populate author information
    await answer.populate('author', 'username avatar reputation');

    return NextResponse.json({
      message: 'Answer created successfully',
      answer: {
        id: answer._id,
        content: answer.content,
        author: answer.author,
        createdAt: answer.createdAt,
        isAccepted: false,
        voteCount: 0
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    );
  }
} 