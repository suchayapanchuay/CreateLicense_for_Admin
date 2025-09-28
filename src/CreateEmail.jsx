// src/pages/CreateNewTemplate.jsx
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

const THEME = {
  pageBg: "#0B1A2D",
  stageBg: "#0E1D33",
  card: "#13253D",
  border: "rgba(255,255,255,0.12)",
  text: "rgba(255,255,255,0.92)",
  textMut: "rgba(255,255,255,0.70)",
  textFaint: "rgba(255,255,255,0.55)",
  accent: "#3B82F6",
  btn: "#3B82F6",
  btnText: "#fff",
};

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  /* Topbar */
  topbarRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },

  title: { fontSize: 40, fontWeight: 900, color: THEME.text, margin: "20px 0 6px" },
  breadcrumb: { color: THEME.textMut, fontWeight: 600, marginBottom: 18 },

  formContainer: { display: "flex", gap: "24px", marginTop: "20px" },
  formSection: { flex: 1, display: "flex", flexDirection: "column", gap: "16px" },
  formCard: { background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 18 },

  label: { color: THEME.textMut, fontSize: 13, fontWeight: 700, marginBottom: 6 },
  input: {
    width: "90%", background: "rgba(255,255,255,0.06)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none",
  },
  textarea: {
    width: "95%", background: "rgba(255,255,255,0.06)", color: THEME.text,
    border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 12px", outline: "none",
    minHeight: "150px", resize: "vertical"
  },

  statusRadios: { display: "flex", gap: "24px", alignItems: "center" },
  radioLabel: { display: "flex", alignItems: "center", gap: "8px", color: THEME.text, fontWeight: 600, cursor: "pointer" },
  radioInput: {
    appearance: "none", width: "16px", height: "16px", borderRadius: "50%",
    border: `2px solid ${THEME.border}`, position: "relative", outline: "none",
    cursor: "pointer", flexShrink: 0,
  },

  variableTags: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" },
  tag: {
    background: "rgba(255,255,255,0.06)", border: `1px solid ${THEME.border}`,
    color: THEME.textMut, padding: "4px 8px", borderRadius: "4px", fontSize: "12px",
    cursor: "pointer",
  },

  previewSection: { flex: 1, background: THEME.card, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 24 },
  previewTitle: { color: THEME.text, fontSize: 18, fontWeight: 700, marginBottom: 12 },
  previewBody: { color: THEME.textMut, fontSize: 14, whiteSpace: "pre-wrap" },

  editorToolbar: {
    display: "flex", gap: "10px", padding: "8px", border: `1px solid ${THEME.border}`,
    borderRadius: "8px 8px 0 0", background: "rgba(255,255,255,0.06)", marginTop: 10
  },
  editorBtn: { background: "none", border: "none", cursor: "pointer", color: THEME.textMut, fontSize: "18px", padding: "4px" },

  actions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 },
  btnCancel: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#8B9EB8", color: "#fff" },
  btnSave: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
};

const MOCK_TEMPLATE_DATA = {
  name: "License Expiry",
  subject: "Your License Will Expire Soon",
  status: "Active",
  body: "Hello {{user_name}},\n\nYour license ({{license_key}}) will expire on {{expiry_date}}.\n\nPlease renew it soon.",
};

const MOCK_VARS = {
  user_name: "John Doe",
  license_key: "ABCD-EFGH-IJKL",
  expiry_date: "31 Dec 2025",
};

export default function CreateNewTemplate() {
  const navigate = useNavigate();
  const onSearchNoop = () => {};

  const [form, setForm] = useState(MOCK_TEMPLATE_DATA);
  const [previewContent, setPreviewContent] = useState("");
  const editorRef = useRef(null);

  // live preview
  useEffect(() => {
    let newContent = form.body;
    for (const [key, value] of Object.entries(MOCK_VARS)) {
      newContent = newContent.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    setPreviewContent(newContent);
  }, [form.body]);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    // รองรับ radio (status)
    const v = type === "radio" ? e.target.value : value;
    setForm((f) => ({ ...f, [name]: v }));
  };

  const handleTagClick = (tag) => {
    const editor = editorRef.current;
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const inserted = `{{${tag}}}`;
    const newBody = form.body.substring(0, start) + inserted + form.body.substring(end);
    setForm((f) => ({ ...f, body: newBody }));
    // วาง caret หลัง tag
    requestAnimationFrame(() => {
      editor.focus();
      editor.selectionStart = editor.selectionEnd = start + inserted.length;
    });
  };

  const handleSave = () => {
    alert("Template saved!");
    console.log("Saving template:", form);
  };

  //const handleCancel = () => navigate("/setting/email-template");

  // demo editor commands (ใช้กับ contenteditable จะโอเคกว่า แต่คงตามโค้ดเดิม)
  const handleRichText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          {/* Topbar (統一ใช้คอมโพเนนต์เดียวกับหน้าอื่น) */}
          <div style={styles.topbarRow}>
            <div style={{ flex: 1 }}>
              <Topbar
                placeholder="Search templates"
                onSearchChange={onSearchNoop}
                defaultFilter="all"
                onViewAllPath="/Noti"
              />
            </div>
          </div>

          {/* Heading & Breadcrumb */}
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting")}>Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/email-template")}>Email Template</span>
            &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Create New Template</span>
          </div>

          <div style={styles.formContainer}>
            {/* Form */}
            <div style={styles.formSection}>
              <div style={styles.formCard}>
                <div style={styles.label}>Create New Template</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={styles.label}>Name</div>
                    <input type="text" name="name" value={form.name} onChange={handleFormChange} style={styles.input} />
                  </div>

                  <div>
                    <div style={styles.label}>Subject</div>
                    <input type="text" name="subject" value={form.subject} onChange={handleFormChange} style={styles.input} />
                  </div>

                  <div>
                    <div style={styles.label}>Status</div>
                    <div style={styles.statusRadios}>
                      <label style={styles.radioLabel}>
                        <input type="radio" name="status" value="Active" checked={form.status === "Active"} onChange={handleFormChange} style={styles.radioInput} />
                        Active
                      </label>
                      <label style={styles.radioLabel}>
                        <input type="radio" name="status" value="Draft" checked={form.status === "Draft"} onChange={handleFormChange} style={styles.radioInput} />
                        Draft
                      </label>
                      <label style={styles.radioLabel}>
                        <input type="radio" name="status" value="Disabled" checked={form.status === "Disabled"} onChange={handleFormChange} style={styles.radioInput} />
                        Disabled
                      </label>
                    </div>
                  </div>
                </div>

                {/* variable tags */}
                <div style={styles.variableTags}>
                  {Object.keys(MOCK_VARS).map((tag) => (
                    <div key={tag} style={styles.tag} onClick={() => handleTagClick(tag)}>
                      {`{{${tag}}}`}
                    </div>
                  ))}
                </div>

                {/* editor toolbar */}
                <div style={styles.editorToolbar}>
                  <button style={styles.editorBtn} onClick={() => handleRichText("bold")}><b>B</b></button>
                  <button style={styles.editorBtn} onClick={() => handleRichText("italic")}><i>I</i></button>
                  <button style={styles.editorBtn} onClick={() => handleRichText("underline")}><u>U</u></button>
                  <button style={styles.editorBtn} onClick={() => handleRichText("justifyLeft")}>&#8801;</button>
                  <button style={styles.editorBtn} onClick={() => handleRichText("justifyCenter")}>&#8802;</button>
                  <button style={styles.editorBtn} onClick={() => handleRichText("justifyRight")}>&#8803;</button>
                </div>

                <textarea
                  ref={editorRef}
                  name="body"
                  value={form.body}
                  onChange={handleFormChange}
                  style={{ ...styles.textarea, borderRadius: "0 0 8px 8px" }}
                />
              </div>

              {/* Actions */}
              <div style={styles.actions}>
                <button style={styles.btnCancel} onClick={() => navigate("/email-template")}>Cancel</button>
                <button style={styles.btnSave} onClick={handleSave}>Save Template</button>
              </div>
            </div>

            {/* Live Preview */}
            <div style={styles.previewSection}>
              <div style={styles.previewTitle}>{form.subject}</div>
              <div style={styles.previewBody}>{previewContent}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
