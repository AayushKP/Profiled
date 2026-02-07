"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Github,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Portfolio, ProjectData } from "@/db/schema";

interface ProjectsFormProps {
  portfolio: Portfolio;
  onUpdate: (data: Partial<Portfolio>) => void;
}

const emptyProject: ProjectData = {
  id: "",
  title: "",
  description: "",
  image: "",
  github: "",
  live: "",
  tags: [],
  featured: false,
};

export function ProjectsForm({ portfolio, onUpdate }: ProjectsFormProps) {
  const [projects, setProjects] = useState<ProjectData[]>(
    portfolio.projects || [],
  );
  const [editingProject, setEditingProject] = useState<ProjectData | null>(
    null,
  );
  const [showDialog, setShowDialog] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const saveProject = () => {
    if (!editingProject?.title) return;

    const updatedProject = {
      ...editingProject,
      id: editingProject.id || crypto.randomUUID(),
    };

    let newProjects: ProjectData[];
    if (projects.find((p) => p.id === updatedProject.id)) {
      newProjects = projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p,
      );
    } else {
      newProjects = [...projects, updatedProject];
    }

    setProjects(newProjects);
    onUpdate({ projects: newProjects });
    setShowDialog(false);
    setEditingProject(null);
    setTagInput("");
  };

  const deleteProject = (id: string) => {
    const newProjects = projects.filter((p) => p.id !== id);
    setProjects(newProjects);
    onUpdate({ projects: newProjects });
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      editingProject &&
      !editingProject.tags.includes(tagInput.trim())
    ) {
      setEditingProject({
        ...editingProject,
        tags: [...editingProject.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        tags: editingProject.tags.filter((t) => t !== tag),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Projects</h2>
          <p className="mt-1 text-sm text-gray-400">
            Showcase your best work and side projects
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject({ ...emptyProject, id: crypto.randomUUID() });
            setShowDialog(true);
          }}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center">
          <p className="text-gray-500">
            No projects yet. Add your first project!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/30 p-4"
              >
                <div className="cursor-grab text-gray-600">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{project.title}</h3>
                    {project.featured && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                    {project.description || "No description"}
                  </p>
                  {project.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{project.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setShowDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.id &&
              projects.find((p) => p.id === editingProject.id)
                ? "Edit Project"
                : "Add Project"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={editingProject?.title || ""}
                onChange={(e) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
                placeholder="My Awesome Project"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editingProject?.description || ""}
                onChange={(e) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, description: e.target.value } : null,
                  )
                }
                placeholder="A brief description of your project..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Image URL</Label>
              <Input
                value={editingProject?.image || ""}
                onChange={(e) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, image: e.target.value } : null,
                  )
                }
                placeholder="https://..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={editingProject?.github || ""}
                  onChange={(e) =>
                    setEditingProject((prev) =>
                      prev ? { ...prev, github: e.target.value } : null,
                    )
                  }
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label>Live Demo URL</Label>
                <Input
                  value={editingProject?.live || ""}
                  onChange={(e) =>
                    setEditingProject((prev) =>
                      prev ? { ...prev, live: e.target.value } : null,
                    )
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/50 p-3">
                {editingProject?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={editingProject?.featured || false}
                onCheckedChange={(checked) =>
                  setEditingProject((prev) =>
                    prev ? { ...prev, featured: checked } : null,
                  )
                }
              />
              <Label>Featured Project</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveProject} disabled={!editingProject?.title}>
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
