import React, { useState } from "react";
import PostComposer from "./components/PostComposer";
import DraftManager from "./components/DraftManager";
import { useDrafts } from "./hooks/useDrafts";

export default function App() {
  const draftsApi = useDrafts();
  const [editingDraftId, setEditingDraftId] = useState(null);

  const editingDraft = draftsApi.drafts.find((d) => d.id === editingDraftId) || null;

  function handleEditDraft(id) {
    setEditingDraftId(id);
  }

  function handleDraftSaved() {
    setEditingDraftId(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "40px 16px" }}>
      <PostComposer
        draftsApi={draftsApi}
        editingDraft={editingDraft}
        onDraftSaved={handleDraftSaved}
      />
      <DraftManager
        draftsApi={draftsApi}
        editingDraftId={editingDraftId}
        onEditDraft={handleEditDraft}
      />
    </div>
  );
}
