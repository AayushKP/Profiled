"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { debounce } from "@/lib/utils";
import { ResumeImportButton } from "@/components/dashboard/resume-import-button";
import type { Portfolio } from "@/db/schema";

interface BasicInfoFormProps {
  portfolio: Portfolio;
  onUpdate: (data: Partial<Portfolio>) => void;
}

export function BasicInfoForm({ portfolio, onUpdate }: BasicInfoFormProps) {
  const [username, setUsername] = useState(portfolio.username || "");
  const [fullName, setFullName] = useState(portfolio.fullName || "");
  const [title, setTitle] = useState(portfolio.title || "");
  const [resumeLink, setResumeLink] = useState(
    portfolio.socialLinks?.resume || "",
  );

  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameError, setUsernameError] = useState("");

  // Check username availability
  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (!value || value === portfolio.username) {
        setUsernameStatus("idle");
        return;
      }

      setUsernameStatus("checking");
      try {
        const res = await fetch("/api/check-username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: value,
            currentUserId: portfolio.userId,
          }),
        });
        const data = await res.json();

        if (data.available) {
          setUsernameStatus("available");
          setUsernameError("");
          // Only update the actual portfolio when username is available
          onUpdate({ username: value.toLowerCase().trim() });
        } else {
          setUsernameStatus(
            data.error?.includes("taken") ? "taken" : "invalid",
          );
          setUsernameError(data.error || "Username not available");
        }
      } catch {
        setUsernameStatus("idle");
      }
    }, 500),
    [portfolio.username, portfolio.userId, onUpdate],
  );

  useEffect(() => {
    if (username && username !== portfolio.username) {
      checkUsername(username);
    }
  }, [username, checkUsername, portfolio.username]);

  // Sync state with portfolio updates (e.g. from Resume Import)
  useEffect(() => {
    if (portfolio.fullName) setFullName(portfolio.fullName);
    if (portfolio.title) setTitle(portfolio.title);
    if (portfolio.socialLinks?.resume)
      setResumeLink(portfolio.socialLinks.resume);
  }, [portfolio.fullName, portfolio.title, portfolio.socialLinks]);

  const handleUsernameChange = (value: string) => {
    const formatted = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setUsername(formatted);
    // Don't call onUpdate immediately for username, let checkUsername handle it
  };

  const handleResumeChange = (value: string) => {
    setResumeLink(value);
    onUpdate({
      socialLinks: {
        ...portfolio.socialLinks,
        resume: value,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Basic Information
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Set up your portfolio basics and profile information
          </p>
        </div>
        <ResumeImportButton
          onImport={onUpdate}
          className="w-full justify-center sm:w-auto"
        />
      </div>

      <div className="space-y-6">
        {/* Profile Image & Heatmap Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={portfolio.profileImage || undefined} />
              <AvatarFallback className="bg-amber-500/20 text-2xl text-amber-500">
                {fullName?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">Profile Image</p>
              <p className="text-xs text-gray-500">
                Profile image is synced from your Google account
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2 p-4 rounded-lg border border-white/5 bg-[#111]">
            <Label className="text-sm font-medium text-white">GitHub Heatmap</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Show contribution graph</span>
              <Switch
                checked={portfolio.showGithubHeatmap ?? true}
                onCheckedChange={(checked) => onUpdate({ showGithubHeatmap: checked })}
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Username (for subdomain)
            <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Input
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="yourname"
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {usernameStatus === "checking" && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
              {usernameStatus === "available" && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          {usernameError && (
            <p className="text-xs text-red-400">{usernameError}</p>
          )}
          {usernameStatus === "available" && (
            <p className="text-xs text-green-400">Username is available!</p>
          )}
          <p className="text-xs text-yellow-400/80">
            Your portfolio will be available on{" "}
            <span className="font-medium">
              {username || "username"}.profiled.site
            </span>
          </p>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Full Name
            <span className="text-red-400">*</span>
          </Label>
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              onUpdate({ fullName: e.target.value });
            }}
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Contact Email
            <span className="text-red-400">*</span>
          </Label>
          <Input
            value={portfolio.email}
            disabled
            className="cursor-not-allowed opacity-50"
          />
          <p className="text-xs text-gray-500">
            Email cannot be changed and is synced from your account
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            Title / Role
            <span className="text-red-400">*</span>
          </Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onUpdate({ title: e.target.value });
            }}
            placeholder="Full Stack Developer"
          />
          <p className="text-xs text-gray-500">
            Your professional title or role
          </p>
        </div>

        {/* Resume Link */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            Resume / CV Link
          </Label>
          <div className="relative">
            <Input
              value={resumeLink}
              onChange={(e) => handleResumeChange(e.target.value)}
              placeholder="https://drive.google.com/your-resume.pdf"
              className="pr-10"
            />
            {resumeLink && (
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Link to your resume (Google Drive, Dropbox, or any public URL)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
