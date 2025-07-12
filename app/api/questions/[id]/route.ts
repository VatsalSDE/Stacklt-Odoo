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

// GET /api/questions/[id] - Get question details with answers
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const questionId = params.id;

    // Increment view count
    await Question.findByIdAndUpdate(questionId, { $inc: { viewCount: 1 } });

    // Get question with author and answers
    const question = await Question.findById(questionId)
      .populate('author', 'username avatar reputation')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation'
        },
        options: { sort: { isAccepted: -1, createdAt: -1 } }
      });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Calculate vote counts
    const voteCount = question.votes.upvotes.length - question.votes.downvotes.length;
    const answerCount = question.answers.length;
    const hasAcceptedAnswer = question.acceptedAnswer != null;

    return NextResponse.json({
      question: {
        id: question._id,
        title: question.title,
        description: question.description,
        tags: question.tags,
        author: question.author,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        viewCount: question.viewCount,
        answerCount,
        voteCount,
        hasAcceptedAnswer,
        isHot: question.isHot,
        answers: question.answers.map((answer: any) => ({
          id: answer._id,
          content: answer.content,
          author: answer.author,
          createdAt: answer.createdAt,
          isAccepted: answer.isAccepted,
          voteCount: answer.votes.upvotes.length - answer.votes.downvotes.length
        }))
      }
    });

  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PUT /api/questions/[id] - Update question (only by author)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const questionId = params.id;
    const body = await request.json();
    const { title, description, tags } = body;

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

    // Find question and check ownership
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (question.author.toString() !== decoded.id) {
      return NextResponse.json(
        { error: 'Not authorized to edit this question' },
        { status: 403 }
      );
    }

    // Update question
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        title,
        description,
        tags: tags.map((tag: string) => tag.toLowerCase())
      },
      { new: true }
    ).populate('author', 'username avatar reputation');

    return NextResponse.json({
      message: 'Question updated successfully',
      question: updatedQuestion
    });

  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE /api/questions/[id] - Delete question (only by author or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const questionId = params.id;

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

    // Find question and check ownership
    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (question.author.toString() !== decoded.id && decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this question' },
        { status: 403 }
      );
    }

    // Delete question and all its answers
    await Answer.deleteMany({ question: questionId });
    await Question.findByIdAndDelete(questionId);

    return NextResponse.json({
      message: 'Question deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
} 