import mongoose from 'mongoose';

export interface IAnswer extends mongoose.Document {
  question: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  votes: {
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
  };
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new mongoose.Schema<IAnswer>({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    minlength: [5, 'Answer must be at least 5 characters long'],
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
  isAccepted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Create indexes
answerSchema.index({ question: 1 });
answerSchema.index({ author: 1 });
answerSchema.index({ createdAt: -1 });

export default mongoose.models.Answer || mongoose.model<IAnswer>('Answer', answerSchema); 