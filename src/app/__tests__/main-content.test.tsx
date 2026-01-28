import { render, screen, fireEvent } from "@testing-library/react";
import { MainContent } from "../main-content";

jest.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div>Chat Interface</div>,
}));

jest.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div>File Tree</div>,
}));

jest.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div>Code Editor</div>,
}));

jest.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div>Preview Frame</div>,
}));

jest.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div>Header Actions</div>,
}));

jest.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("MainContent - Toggle Buttons", () => {
  it("should render with Preview tab active by default", () => {
    render(<MainContent />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    expect(previewButton).toHaveAttribute("data-state", "active");
    expect(codeButton).toHaveAttribute("data-state", "inactive");

    expect(screen.getByText("Preview Frame")).toBeInTheDocument();
    expect(screen.queryByText("Code Editor")).not.toBeInTheDocument();
  });

  it("should switch to Code view when Code tab is clicked", () => {
    render(<MainContent />);

    const codeButton = screen.getByRole("tab", { name: /code/i });

    fireEvent.click(codeButton);

    expect(codeButton).toHaveAttribute("data-state", "active");
    expect(screen.getByText("Code Editor")).toBeInTheDocument();
    expect(screen.queryByText("Preview Frame")).not.toBeInTheDocument();
  });

  it("should switch back to Preview view when Preview tab is clicked", () => {
    render(<MainContent />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    fireEvent.click(codeButton);
    expect(screen.getByText("Code Editor")).toBeInTheDocument();

    fireEvent.click(previewButton);

    expect(previewButton).toHaveAttribute("data-state", "active");
    expect(screen.getByText("Preview Frame")).toBeInTheDocument();
    expect(screen.queryByText("Code Editor")).not.toBeInTheDocument();
  });

  it("should toggle multiple times without issues", () => {
    render(<MainContent />);

    const previewButton = screen.getByRole("tab", { name: /preview/i });
    const codeButton = screen.getByRole("tab", { name: /code/i });

    for (let i = 0; i < 5; i++) {
      fireEvent.click(codeButton);
      expect(screen.getByText("Code Editor")).toBeInTheDocument();

      fireEvent.click(previewButton);
      expect(screen.getByText("Preview Frame")).toBeInTheDocument();
    }
  });
});
