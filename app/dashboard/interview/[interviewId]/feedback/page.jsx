"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Feedback({ params }) {
  const router = useRouter();

  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);
      calculateOverallRating(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallRating = (data) => {
    if (!data || data.length === 0) {
      setOverallRating(0);
      return;
    }

    const total = data.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    const average = total / data.length;

    // overall score out of 10
    setOverallRating(average.toFixed(1));
  };

  if (loading) {
    return (
      <div className="p-10 text-gray-500 font-semibold">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="p-10">
      {feedbackList.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          {/* Header */}
          <h2 className="text-3xl font-bold text-green-500">
            Congratulations!
          </h2>

          <h2 className="font-bold text-2xl mt-1">
            Here is your interview feedback
          </h2>

          {/* Overall Rating */}
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating:{" "}
            <strong>{overallRating}/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answers, your answers &
            feedback for improvement
          </h2>

          {/* Feedback List */}
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                <span className="font-medium">{item.question}</span>
                <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="p-2 border rounded-lg text-red-600">
                    <strong>Rating:</strong> {item.rating}
                  </div>

                  <div className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer:</strong> {item.userAns}
                  </div>

                  <div className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </div>

                  <div className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback:</strong> {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <div className="mt-10">
        <Button onClick={() => router.replace("/dashboard")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
