# StackIt - Q&A Platform

A modern, collaborative question-and-answer platform built with Next.js, TypeScript, and MongoDB. StackIt provides a seamless experience for developers to ask questions, share knowledge, and build a community around programming topics.

## 🚀 Features

### Core Features
- **Ask Questions**: Create detailed questions with rich text formatting
- **Answer Questions**: Provide comprehensive answers with markdown support
- **Voting System**: Upvote and downvote questions and answers
- **Accept Answers**: Question owners can mark the best answer as accepted
- **Tagging System**: Organize content with relevant tags
- **Search & Filter**: Find questions by title, content, or tags
- **User Authentication**: Secure login and registration system
- **Real-time Notifications**: Get notified about answers, votes, and mentions

### Rich Text Editor
- Bold, Italic, Strikethrough formatting
- Numbered and bullet lists
- Emoji support
- Hyperlink insertion
- Image upload support
- Text alignment options

### User Roles
- **Guest**: View all questions and answers
- **User**: Register, login, post questions/answers, vote
- **Admin**: Moderate content (future enhancement)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **State Management**: React Context API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm, yarn, or pnpm

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo_Hackathon_2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/stackit
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas/Compass for cloud database
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Users
- Username, email, password (hashed)
- Avatar, reputation score
- Role (user/admin)

### Questions
- Title, description, tags
- Author reference
- Vote counts (upvotes/downvotes)
- View count, answer count
- Accepted answer reference

### Answers
- Content, author reference
- Question reference
- Vote counts
- Accepted status

### Notifications
- Recipient, sender references
- Type (answer, vote, accept, etc.)
- Content, read status

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Questions
- `GET /api/questions` - List questions with filtering
- `POST /api/questions` - Create new question
- `GET /api/questions/[id]` - Get question details
- `PUT /api/questions/[id]` - Update question
- `DELETE /api/questions/[id]` - Delete question

### Answers
- `GET /api/questions/[id]/answers` - Get answers for question
- `POST /api/questions/[id]/answers` - Create new answer

### Voting
- `POST /api/questions/[id]/vote` - Vote on question
- `POST /api/answers/[id]/vote` - Vote on answer

### Accepting Answers
- `POST /api/answers/[id]/accept` - Accept answer

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Mark notifications as read

### Tags
- `GET /api/tags` - Get all tags with usage counts

## 🎨 UI Components

The platform uses a modern, responsive design with:
- Glass morphism effects
- Smooth animations and transitions
- Dark/light theme support
- Mobile-first responsive design
- Accessible components from Radix UI

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Role-based access control
- CSRF protection (built into Next.js)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Set up MongoDB connection string
- Configure environment variables
- Build and deploy the Next.js application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

## 🎯 Future Enhancements

- Real-time chat/comments
- File upload support
- Advanced search with filters
- User profiles and reputation system
- Admin moderation tools
- Email notifications
- Social features (following, bookmarks)
- API rate limiting
- Caching layer 