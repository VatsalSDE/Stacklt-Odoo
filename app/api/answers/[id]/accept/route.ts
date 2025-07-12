import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
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

// POST /api/answers/[id]/accept - Accept an answer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const answerId = params.id;

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

    const userId = decoded.id;

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }

    // Find the question
    const question = await Question.findById(answer.question);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the question owner
    if (question.author.toString() !== userId) {
      return NextResponse.json(
        { error: 'Only the question owner can accept answers' },
        { status: 403 }
      );
    }

    // Check if answer is already accepted
    if (answer.isAccepted) {
      return NextResponse.json(
        { error: 'Answer is already accepted' },
        { status: 400 }
      );
    }

    // Unaccept any previously accepted answer for this question
    await Answer.updateMany(
      { question: answer.question },
      { isAccepted: false }
    );

    // Accept this answer
    await Answer.findByIdAndUpdate(answerId, { isAccepted: true });

    // Update question to mark as having accepted answer
    await Question.findByIdAndUpdate(answer.question, {
      acceptedAnswer: answerId,
      hasAcceptedAnswer: true
    });

    // Create notification for the answer author
    const { createAcceptNotification } = await import('@/lib/notifications');
    await createAcceptNotification(answer.question.toString(), answerId, decoded.id);

    return NextResponse.json({
      message: 'Answer accepted successfully'
    });

  } catch (error) {
    console.error('Error accepting answer:', error);
    return NextResponse.json(
      { error: 'Failed to accept answer' },
      { status: 500 }
    );
  }
} 