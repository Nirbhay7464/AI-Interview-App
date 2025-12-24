"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";

import { generateInterviewQuestions } from "@/utils/GeminiAIModals";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [open, setOpen] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const prompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Generate interview questions with answers in JSON format.`;

      const response = await generateInterviewQuestions(prompt);

      const result = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(response),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (result?.[0]?.mockId) {
        setOpen(false);
        router.push(`/dashboard/interview/${result[0].mockId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
  onClick={() => setOpen(true)}
  className="w-full max-w-sm p-12 border rounded-lg bg-secondary cursor-pointer hover:shadow-md transition-shadow"
>

        <h2 className="text-lg font-semibold text-center">
          + Add New Interview
        </h2>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us about your job interview
            </DialogTitle>

            <DialogDescription asChild>
              <form onSubmit={onSubmit} className="space-y-5 mt-4">
                <div>
                  <label className="block mb-1">
                    Job Role / Position
                  </label>
                  <Input
                    required
                    placeholder="Full Stack Developer"
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Job Description / Tech Stack
                  </label>
                  <Textarea
                    placeholder="React, Node.js, MySQL"
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setJobExperience(e.target.value)
                    }
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddNewInterview;
