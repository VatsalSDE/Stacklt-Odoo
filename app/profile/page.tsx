"use client"

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  title: string;
  createdAt: string;
  answerCount: number;
  voteCount: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [avatar, setAvatar] = useState(user?.avatar || "/placeholder-user.jpg");
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) return;
      setLoading(true);
      const res = await fetch(`/api/questions?author=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [user]);

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10 text-center">Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Profile Details */}
        <div className="col-span-1 bg-card rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border border-primary/10">
          <Avatar className="h-28 w-28 shadow-lg ring-4 ring-primary/10">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <input
            type="text"
            className="text-2xl font-bold text-center bg-transparent border-b border-muted focus:outline-none focus:border-primary mb-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={!editing}
          />
          <div className="flex flex-col gap-1 w-full text-center">
            <span className="font-semibold text-primary/80">{user?.email}</span>
            <span className="text-sm text-muted-foreground">Reputation: <b>{user?.reputation}</b></span>
            <span className="text-sm text-muted-foreground">Role: <b>{user?.role}</b></span>
          </div>
          <div className="w-full mt-4">
            <label className="font-semibold">Bio:</label>
            <div
              className="w-full min-h-[60px] border-2 border-dashed border-primary/30 rounded-xl p-4 bg-gradient-to-br from-background via-primary/5 to-primary/10 shadow-inner flex items-center gap-3 text-muted-foreground text-base mt-2"
              contentEditable={editing}
              suppressContentEditableWarning
              onInput={e => setBio((e.target as HTMLDivElement).innerText)}
              style={{ minHeight: 60 }}
            >
              {(!bio && !editing) && (
                <span className="flex items-center gap-2 text-primary/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                  <span>Add a short bio about yourself...</span>
                </span>
              )}
              {bio && !editing && <span>{bio}</span>}
            </div>
          </div>
          <div className="flex gap-4 mt-6 w-full justify-center">
            <Button onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
            <Button disabled={!editing} variant="default">Save</Button>
          </div>
        </div>
        {/* User's Questions */}
        <div className="col-span-1 md:col-span-2 bg-card rounded-2xl shadow-xl p-8 border border-primary/10">
          <h2 className="text-2xl font-bold mb-6 text-primary">Your Questions</h2>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading...</div>
          ) : questions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No questions found.</div>
          ) : (
            <div className="space-y-4">
              {questions.map(q => (
                <div key={q._id} className="p-5 rounded-xl border border-primary/10 bg-gradient-to-br from-background via-primary/5 to-primary/10 shadow flex flex-col md:flex-row md:items-center gap-2 hover:shadow-lg transition-all">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-primary mb-1">{q.title}</div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                      <span>Answers: <b>{q.answerCount}</b></span>
                      <span>Votes: <b>{q.voteCount}</b></span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/questions/${q._id}`)}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 