import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  ToolInvocationDisplay,
  getToolDisplayMessage,
} from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

// Tests for getToolDisplayMessage

test("getToolDisplayMessage returns 'Creating filename' for str_replace_editor create", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "create",
    path: "src/components/App.tsx",
  });
  expect(result).toBe("Creating App.tsx");
});

test("getToolDisplayMessage returns 'Editing filename' for str_replace_editor str_replace", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "str_replace",
    path: "src/components/Button.tsx",
  });
  expect(result).toBe("Editing Button.tsx");
});

test("getToolDisplayMessage returns 'Editing filename' for str_replace_editor insert", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "insert",
    path: "src/utils/helpers.ts",
  });
  expect(result).toBe("Editing helpers.ts");
});

test("getToolDisplayMessage returns 'Viewing filename' for str_replace_editor view", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "view",
    path: "package.json",
  });
  expect(result).toBe("Viewing package.json");
});

test("getToolDisplayMessage returns 'Undoing edit' for str_replace_editor undo_edit", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "undo_edit",
  });
  expect(result).toBe("Undoing edit");
});

test("getToolDisplayMessage returns 'Renaming old → new' for file_manager rename", () => {
  const result = getToolDisplayMessage("file_manager", {
    command: "rename",
    old_path: "src/Old.tsx",
    new_path: "src/New.tsx",
  });
  expect(result).toBe("Renaming Old.tsx → New.tsx");
});

test("getToolDisplayMessage returns 'Deleting filename' for file_manager delete", () => {
  const result = getToolDisplayMessage("file_manager", {
    command: "delete",
    path: "src/Obsolete.tsx",
  });
  expect(result).toBe("Deleting Obsolete.tsx");
});

test("getToolDisplayMessage returns raw tool name for unknown tool", () => {
  const result = getToolDisplayMessage("unknown_tool", { foo: "bar" });
  expect(result).toBe("unknown_tool");
});

test("getToolDisplayMessage returns tool name for missing args", () => {
  const result = getToolDisplayMessage("str_replace_editor", {});
  expect(result).toBe("str_replace_editor");
});

test("getToolDisplayMessage returns action without filename when path is missing", () => {
  const result = getToolDisplayMessage("str_replace_editor", {
    command: "create",
  });
  expect(result).toBe("Creating file");
});

test("getToolDisplayMessage returns 'Renaming file' when paths are missing", () => {
  const result = getToolDisplayMessage("file_manager", {
    command: "rename",
  });
  expect(result).toBe("Renaming file");
});

test("getToolDisplayMessage returns 'Deleting file' when path is missing", () => {
  const result = getToolDisplayMessage("file_manager", {
    command: "delete",
  });
  expect(result).toBe("Deleting file");
});

// Tests for ToolInvocationDisplay component

test("ToolInvocationDisplay shows spinner when state is not result", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Creating App.tsx")).toBeDefined();
  const container = screen.getByText("Creating App.tsx").closest("div");
  expect(container?.querySelector(".animate-spin")).toBeDefined();
});

test("ToolInvocationDisplay shows green dot when state is result with result", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
      result="Success"
    />
  );

  expect(screen.getByText("Creating App.tsx")).toBeDefined();
  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocationDisplay shows spinner when state is result but no result value", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Creating App.tsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolInvocationDisplay renders correct message text", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      args={{ command: "delete", path: "src/components/OldComponent.tsx" }}
      state="result"
      result={{ success: true }}
    />
  );

  expect(screen.getByText("Deleting OldComponent.tsx")).toBeDefined();
});
