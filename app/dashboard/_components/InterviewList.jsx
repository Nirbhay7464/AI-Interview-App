"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { Button } from "@/components/ui/button";

/* ---------------- Animations ---------------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export default function InterviewList() {
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  /* -------- Fetch interviews (Newest → Oldest) -------- */
  const fetchInterviews = async () => {
    const result = await db.select().from(MockInterview);

    const sorted = result.sort((a, b) => {
      const [d1, m1, y1] = a.createdAt.split("-").map(Number);
      const [d2, m2, y2] = b.createdAt.split("-").map(Number);

      return (
        new Date(y2, m2 - 1, d2) -
        new Date(y1, m1 - 1, d1)
      );
    });

    setInterviews(sorted);
  };

  /* ---------------- Delete Interview ---------------- */
  const handleDelete = async (mockId) => {
    if (!window.confirm("Delete this interview permanently?")) return;

    try {
      setDeletingId(mockId);

      await db
        .delete(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, mockId));

      await db
        .delete(MockInterview)
        .where(eq(MockInterview.mockId, mockId));

      setInterviews((prev) =>
        prev.filter((item) => item.mockId !== mockId)
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (interviews.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-6">
        Previous Mock Interview
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {interviews.map((item) => (
            <motion.div
              key={item.mockId}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover={{ y: -4 }}
              className="
                relative
                p-5
                bg-white
                border
                rounded-xl
                shadow-sm
                transition
              "
            >
              {/* 🔴 DELETE BUTTON (CONSTANT + RED HOVER) */}
              <button
                onClick={() => handleDelete(item.mockId)}
                disabled={deletingId === item.mockId}
                className="
                  absolute
                  top-4
                  right-4
                  flex
                  items-center
                  justify-center
                  h-9
                  w-9
                  rounded-full
                  bg-red-50
                  text-red-600
                  transition-all
                  duration-200
                  hover:bg-red-600
                  hover:text-white
                  hover:scale-110
                  active:scale-95
                  disabled:opacity-50
                "
              >
                {deletingId === item.mockId ? (
                  <span className="text-xs">...</span>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>

              {/* Card Content */}
              <h3 className="text-lg font-bold text-primary capitalize">
                {item.jobPosition}
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                {item.jobExperience} Years Experience
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Created At: {item.createdAt}
              </p>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    router.push(
                      `/dashboard/interview/${item.mockId}/feedback`
                    )
                  }
                >
                  Feedback
                </Button>

                <Button
                  className="flex-1"
                  onClick={() =>
                    router.push(`/dashboard/interview/${item.mockId}`)
                  }
                >
                  Start
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
