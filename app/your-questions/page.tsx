"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  title: string;
  createdAt: string;
  answerCount: number;
  voteCount: number;
}

export default function YourQuestionsPage() {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!token) return;
      setLoading(true);
      const res = await fetch(`/api/questions?author=${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [token, user]);

  return (
    <div className="container mx-auto max-w-3xl py-16">
      <h1 className="text-3xl font-bold mb-8">Your Questions</h1>
      {loading ? (
        <div>Loading...</div>
      ) : questions.length === 0 ? (
        <div>No questions found.</div>
      ) : (
        <div className="space-y-4">
          {questions.map(q => (
            <div key={q._id} className="p-4 border rounded-lg bg-card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-lg font-bold"
                  style={{ fontWeight: "bold", fontStyle: "italic" }}
                >
                  {q.title}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <span><b>Answers:</b> {q.answerCount}</span>
                <span><b>Votes:</b> {q.voteCount}</span>
                <Button size="sm" variant="outline" onClick={() => router.push(`/questions/${q._id}`)}>View</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 