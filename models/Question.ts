import mongoose, { CallbackWithoutResultAndOptionalError } from 'mongoose';

export interface IQuestion extends mongoose.Document {
  title: string;
  description: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  answers: mongoose.Types.ObjectId[];
  acceptedAnswer?: mongoose.Types.ObjectId;
  votes: {
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
  };
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  isHot: boolean;
  hasAcceptedAnswer: boolean;
  answerCount: number;
  voteCount: number;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  title: {
    type: String,
    required: [true, 'Question title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Question description is required'],
    minlength: [20, 'Description must be at least 20 characters long'],
  },
  tags: [{
    type: String,
    required: [true, 'At least one tag is required'],
    trim: true,
    lowercase: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  acceptedAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  },
  votes: {
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  isHot: {
    type: Boolean,
    default: false,
  },
  hasAcceptedAnswer: {
    type: Boolean,
    default: false,
  },
  answerCount: {
    type: Number,
    default: 0,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Virtual for calculating vote count
questionSchema.virtual('calculatedVoteCount').get(function (this: IQuestion) {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Virtual for calculating if question is hot
questionSchema.virtual('calculatedIsHot').get(function (this: IQuestion) {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo && (this.voteCount > 10 || this.answerCount > 5);
});

// Pre-save middleware to update computed fields
questionSchema.pre<IQuestion>('save', function (this: IQuestion, next: CallbackWithoutResultAndOptionalError) {
  this.voteCount = this.votes.upvotes.length - this.votes.downvotes.length;
  this.answerCount = this.answers.length;
  this.hasAcceptedAnswer = !!this.acceptedAnswer;
  this.isHot = (this as any).calculatedIsHot;
  next();
});

// Create indexes
questionSchema.index({ title: 'text', description: 'text' });
questionSchema.index({ tags: 1 });
questionSchema.index({ author: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ voteCount: -1 });
questionSchema.index({ answerCount: -1 });

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema); 