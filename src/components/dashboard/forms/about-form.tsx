"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import type { Portfolio } from "@/db/schema";

interface AboutFormProps {
  portfolio: Portfolio;
  onUpdate: (data: Partial<Portfolio>) => void;
}

export function AboutForm({ portfolio, onUpdate }: AboutFormProps) {
  const [bio, setBio] = useState(portfolio.bio || "");
  const [location, setLocation] = useState(portfolio.location || "");
  const maxBioLength = 2000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold text-white">About</h2>
        <p className="mt-1 text-sm text-gray-400">
          Tell visitors about yourself, your background, and what drives you
        </p>
      </div>

      <div className="space-y-2">
        <Label>Bio / About Me</Label>
        <Textarea
          value={bio}
          onChange={(e) => {
            const value = e.target.value.slice(0, maxBioLength);
            setBio(value);
            onUpdate({ bio: value });
          }}
          placeholder="I'm a developer who loves creating elegant solutions to complex problems. Currently exploring the intersection of design and engineering..."
          rows={10}
          className="resize-none"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Write about yourself, your interests, and what makes you unique
          </span>
          <span
            className={bio.length > maxBioLength * 0.9 ? "text-amber-500" : ""}
          >
            {bio.length}/{maxBioLength}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            onUpdate({ location: e.target.value });
          }}
          placeholder="San Francisco, CA (or Remote)"
        />
        <p className="text-xs text-gray-500">
          City, State, Country, or "Remote"
        </p>
      </div>

      {/* Tips */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
        <h3 className="mb-2 text-sm font-medium text-white">
          Tips for a great bio:
        </h3>
        <ul className="space-y-1 text-xs text-gray-400">
          <li>• Keep it professional but personable</li>
          <li>• Mention your key skills and experience</li>
          <li>• Share what you&apos;re passionate about</li>
          <li>• Include what you&apos;re currently working on or learning</li>
        </ul>
      </div>
    </motion.div>
  );
}
