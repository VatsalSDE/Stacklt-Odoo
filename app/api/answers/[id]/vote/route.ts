import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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

// POST /api/answers/[id]/vote - Vote on an answer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  try {
    const answerId = params.id;
    const body = await request.json();
    const { voteType } = body; // 'upvote' or 'downvote'

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "upvote" or "downvote"' },
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

    const userId = decoded.id;

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      );
    }

    // Check if user is trying to vote on their own answer
    if (answer.author.toString() === userId) {
      return NextResponse.json(
        { error: 'You cannot vote on your own answer' },
        { status: 400 }
      );
    }

    const upvotes = answer.votes.upvotes.map((id: any) => id.toString());
    const downvotes = answer.votes.downvotes.map((id: any) => id.toString());

    let updateOperation: any = {};

    if (voteType === 'upvote') {
      if (upvotes.includes(userId)) {
        // Remove upvote
        updateOperation = {
          $pull: { 'votes.upvotes': userId }
        };
      } else {
        // Add upvote and remove downvote if exists
        updateOperation = {
          $addToSet: { 'votes.upvotes': userId },
          $pull: { 'votes.downvotes': userId }
        };
      }
    } else {
      if (downvotes.includes(userId)) {
        // Remove downvote
        updateOperation = {
          $pull: { 'votes.downvotes': userId }
        };
      } else {
        // Add downvote and remove upvote if exists
        updateOperation = {
          $addToSet: { 'votes.downvotes': userId },
          $pull: { 'votes.upvotes': userId }
        };
      }
    }

    // Update the answer
    const updatedAnswer = await Answer.findByIdAndUpdate(
      answerId,
      updateOperation,
      { new: true }
    ).populate('author', 'username avatar reputation');

    // Calculate new vote count
    const newVoteCount = updatedAnswer.votes.upvotes.length - updatedAnswer.votes.downvotes.length;

    return NextResponse.json({
      message: 'Vote updated successfully',
      voteCount: newVoteCount,
      userVote: upvotes.includes(userId) ? 'upvote' : downvotes.includes(userId) ? 'downvote' : null
    });

  } catch (error) {
    console.error('Error voting on answer:', error);
    return NextResponse.json(
      { error: 'Failed to vote on answer' },
      { status: 500 }
    );
  }
} 