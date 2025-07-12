import Notification from '@/models/Notification';
import User from '@/models/User';

export async function createNotification({
  recipientId,
  senderId,
  type,
  questionId,
  answerId,
  content
}: {
  recipientId: string;
  senderId: string;
  type: 'answer' | 'comment' | 'mention' | 'vote' | 'accept';
  questionId?: string;
  answerId?: string;
  content: string;
}) {
  try {
    // Don't create notification if sender is the same as recipient
    if (senderId === recipientId) {
      return;
    }

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      question: questionId,
      answer: answerId,
      content
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

export async function createAnswerNotification(questionId: string, answerId: string, senderId: string) {
  try {
    // Get the question to find the author
    const Question = (await import('@/models/Question')).default;
    const question = await Question.findById(questionId).populate('author', 'username');
    
    if (!question) return;

    const sender = await User.findById(senderId).select('username');
    if (!sender) return;

    await createNotification({
      recipientId: question.author._id.toString(),
      senderId,
      type: 'answer',
      questionId,
      answerId,
      content: `${sender.username} answered your question "${question.title}"`
    });
  } catch (error) {
    console.error('Error creating answer notification:', error);
  }
}

export async function createAcceptNotification(questionId: string, answerId: string, senderId: string) {
  try {
    const Question = (await import('@/models/Question')).default;
    const Answer = (await import('@/models/Answer')).default;
    
    const question = await Question.findById(questionId).populate('author', 'username');
    const answer = await Answer.findById(answerId).populate('author', 'username');
    
    if (!question || !answer) return;

    const sender = await User.findById(senderId).select('username');
    if (!sender) return;

    await createNotification({
      recipientId: answer.author._id.toString(),
      senderId,
      type: 'accept',
      questionId,
      answerId,
      content: `${sender.username} accepted your answer on "${question.title}"`
    });
  } catch (error) {
    console.error('Error creating accept notification:', error);
  }
} 