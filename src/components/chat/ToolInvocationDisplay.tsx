"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

function getFilename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1];
}

export function getToolDisplayMessage(
  toolName: string,
  args: Record<string, unknown>
): string {
  if (toolName === "str_replace_editor") {
    const command = args.command as string | undefined;
    const path = args.path as string | undefined;
    const filename = path ? getFilename(path) : "";

    switch (command) {
      case "create":
        return filename ? `Creating ${filename}` : "Creating file";
      case "str_replace":
        return filename ? `Editing ${filename}` : "Editing file";
      case "insert":
        return filename ? `Editing ${filename}` : "Editing file";
      case "view":
        return filename ? `Viewing ${filename}` : "Viewing file";
      case "undo_edit":
        return "Undoing edit";
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string | undefined;

    if (command === "rename") {
      const oldPath = args.old_path as string | undefined;
      const newPath = args.new_path as string | undefined;
      const oldFilename = oldPath ? getFilename(oldPath) : "";
      const newFilename = newPath ? getFilename(newPath) : "";
      if (oldFilename && newFilename) {
        return `Renaming ${oldFilename} → ${newFilename}`;
      }
      return "Renaming file";
    }

    if (command === "delete") {
      const path = args.path as string | undefined;
      const filename = path ? getFilename(path) : "";
      return filename ? `Deleting ${filename}` : "Deleting file";
    }

    return toolName;
  }

  return toolName;
}

export function ToolInvocationDisplay({
  toolName,
  args,
  state,
  result,
}: ToolInvocationDisplayProps) {
  const message = getToolDisplayMessage(toolName, args);
  const isComplete = state === "result" && result !== undefined;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
