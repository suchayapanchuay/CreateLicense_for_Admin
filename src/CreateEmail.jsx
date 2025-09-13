import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./SideBar";
import { FiSearch} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

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

/* MOCK NOTIFICATIONS */
const NOTI_ITEMS = [
  { id: 1, type: "trial", title: "Trial Request", client: "Client A", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 15, read: false },
  { id: 2, type: "trial", title: "Trial Request", client: "Client B", product: "Smart Audit", requested: "31 Aug 2025", durationDays: 7, read: true },
  { id: 3, type: "purchase", title: "Purchase Request", client: "Client C", product: "Smart Audit", requested: "31 Aug 2025", read: false },
];

const styles = {
  root: { display: "flex", minHeight: "100vh", background: THEME.pageBg, fontFamily: "Inter, system-ui" },
  content: { flex: 1, display: "flex", justifyContent: "center", padding: 24 },
  stage: { width: 1152, background: THEME.stageBg, borderRadius: 16, border: `1px solid ${THEME.border}`, padding: 24, position: "relative" },

  topbar: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: `1px solid ${THEME.border}`, padding: "6px 10px", borderRadius: 10, minWidth: 200, color: THEME.text },
  searchInput: { border: "none", outline: "none", background: "transparent", color: THEME.text, width: "100%" },

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
  radioLabel: {
    display: "flex", alignItems: "center", gap: "8px", color: THEME.text,
    fontWeight: 600, cursor: "pointer",
  },
  radioInput: {
    appearance: "none", width: "16px", height: "16px", borderRadius: "50%",
    border: `2px solid ${THEME.border}`, position: "relative", outline: "none",
    cursor: "pointer", flexShrink: 0,
    "&:checked": {
      backgroundColor: THEME.accent,
      border: `2px solid ${THEME.accent}`,
      "&::before": {
        content: '""', width: "8px", height: "8px", borderRadius: "50%",
        backgroundColor: "white", position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
      },
    },
  },
  
  variableTags: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" },
  tag: {
    background: "rgba(255,255,255,0.06)", border: `1px solid ${THEME.border}`,
    color: THEME.textMut, padding: "4px 8px", borderRadius: "4px", fontSize: "12px",
    cursor: "pointer",
  },
  
  previewSection: {
    flex: 1, background: THEME.card, border: `1px solid ${THEME.border}`,
    borderRadius: 12, padding: 24,
  },
  previewTitle: { color: THEME.text, fontSize: 18, fontWeight: 700, marginBottom: 12 },
  previewBody: { color: THEME.textMut, fontSize: 14, whiteSpace: "pre-wrap" },

  editorToolbar: {
    display: "flex", gap: "10px", padding: "8px", border: `1px solid ${THEME.border}`,
    borderRadius: "8px 8px 0 0", background: "rgba(255,255,255,0.06)",
    marginTop: 10
  },
  editorBtn: {
    background: "none", border: "none", cursor: "pointer", color: THEME.textMut,
    fontSize: "18px", padding: "4px"
  },

  actions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 },
  btnCancel: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: "#8B9EB8", color: "#fff" },
  btnSave: { borderRadius: 8, padding: "10px 14px", fontWeight: 800, cursor: "pointer", border: "none", background: THEME.accent, color: "#fff" },
  
  /* Notifications */
  notiPanelWrap: { position: "absolute", top: 90, right: 36, width: 560, background: "#0E2240", border: `1px solid ${THEME.border}`, borderRadius: 10, boxShadow: "0 14px 34px rgba(0,0,0,.4)", color: THEME.text, zIndex: 60, overflow: "hidden" },
  notiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${THEME.border}`, fontWeight: 900, fontSize: 22 },
  notiSelectWrap: { position: "relative", display: "inline-block" },
  notiSelect: { appearance: "none", WebkitAppearance: "none", MozAppearance: "none", background: "#183154", color: THEME.text, border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "10px 40px 10px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  selectCaretNoti: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: THEME.textMut, fontSize: 18 },
  notiClose: { cursor: "pointer" },
  notiList: { maxHeight: 560, overflowY: "auto" },
  notiItem: { padding: "16px", borderBottom: `1px solid ${THEME.border}` },
  notiBadge: { fontSize: 13, color: THEME.textMut, marginBottom: 6 },
  notiClient: { fontSize: 22, fontWeight: 800, marginBottom: 4, color: THEME.text },
  notiMetaRow: { display: "flex", justifyContent: "flex-start", gap: 6, color: THEME.textFaint, fontSize: 14, marginTop: 8 },
  notiBtn: { marginTop: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, padding: "8px 12px", borderRadius: 8, fontWeight: 700, cursor: "pointer" },
  notiFooter: { display: "flex", justifyContent: "flex-end", padding: "14px 18px", color: "#7DD3FC", fontWeight: 800, cursor: "pointer", borderTop: `1px solid ${THEME.border}` },
};

const MOCK_TEMPLATE_DATA = {
    name: "License Expiry",
    subject: "Your License Will Expire Soon",
    status: "Active",
    body: "Hello {{user_name}},\n\nYour license (ABCD-EFGH-IJKL) will expire on 31 Dec 2025.\n\nPlease renew it soon.",
};

const MOCK_VARS = {
    user_name: "John Doe",
    license_key: "ABCD-EFGH-IJKL",
    expiry_date: "31 Dec 2025"
};

export default function CreateNewTemplate() {
    const navigate = useNavigate();
    const [form, setForm] = useState(MOCK_TEMPLATE_DATA);
    const [previewContent, setPreviewContent] = useState("");
    const [showNoti, setShowNoti] = useState(false);
    const notiRef = useRef(null);
    const editorRef = useRef(null);

    useEffect(() => {
        // Update preview whenever form.body or MOCK_VARS changes
        let newContent = form.body;
        for (const [key, value] of Object.entries(MOCK_VARS)) {
            newContent = newContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        setPreviewContent(newContent);
    }, [form.body]);

    useEffect(() => {
        const onClick = (e) => { if (notiRef.current && !notiRef.current.contains(e.target)) setShowNoti(false); };
        const onEsc = (e) => { if (e.key === "Escape") setShowNoti(false); };
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onEsc);
        };
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleTagClick = (tag) => {
        const editor = editorRef.current;
        if (!editor) return;

        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const newBody = form.body.substring(0, start) + `{{${tag}}}` + form.body.substring(end);
        setForm({ ...form, body: newBody });
    };

    const handleSave = () => {
        alert("Template saved!");
        console.log("Saving template:", form);
    };

    const handleCancel = () => {
        navigate("/setting/email-template");
    };

    const handleRichText = (command, value = null) => {
        const editor = editorRef.current;
        if (!editor) return;
        
        document.execCommand(command, false, value);
    };
    
    return (
        <div style={styles.root}>
            <Sidebar />
            <div style={styles.content}>
                <div style={styles.stage}>
                    {/* Topbar */}
                    <div style={styles.topbar}>
                        <div style={styles.searchBox}>
                            <FiSearch />
                            <input placeholder="Search" style={styles.searchInput} />
                        </div>
                        <div onClick={() => setShowNoti((v) => !v)} style={{ cursor: "pointer" }}>
                            <IoMdNotificationsOutline size={24} color={THEME.text} />
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    {showNoti && (
                        <div style={styles.notiPanelWrap} ref={notiRef}>
                            <div style={styles.notiHead}>
                                <span>Notifications ({NOTI_ITEMS.length})</span>
                                <IoClose size={22} onClick={() => setShowNoti(false)} style={styles.notiClose} />
                            </div>
                            <div style={styles.notiList}>
                                {NOTI_ITEMS.map((n) => (
                                    <div key={n.id} style={styles.notiItem}>
                                        <div style={styles.notiBadge}>{n.title}</div>
                                        <div style={styles.notiClient}>{n.client}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Heading and Breadcrumb */}
                    <div style={styles.title}>Setting / Logs</div>
                    <div style={styles.breadcrumb}>
                        <span style={{ cursor: "pointer" }} onClick={() => navigate("/setting")}>Setting / Logs</span>
                        &nbsp;&gt;&nbsp;<span style={{ cursor: "pointer" }} onClick={() => navigate("/email-template")}>Email Template</span>
                        &nbsp;&gt;&nbsp;<span style={{ color: "#9CC3FF" }}>Create New Template</span>
                    </div>

                    <div style={styles.formContainer}>
                        {/* Form Section */}
                        <div style={styles.formSection}>
                            <div style={styles.formCard}>
                                <div style={styles.label}>Create New Template</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div>
                                        <div style={styles.label}>Name</div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <div style={styles.label}>Subject</div>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={form.subject}
                                            onChange={handleFormChange}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <div style={styles.label}>Status</div>
                                        <div style={styles.statusRadios}>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Active"
                                                    checked={form.status === "Active"}
                                                    onChange={handleFormChange}
                                                    style={styles.radioInput}
                                                /> Active
                                            </label>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Draft"
                                                    checked={form.status === "Draft"}
                                                    onChange={handleFormChange}
                                                    style={styles.radioInput}
                                                /> Draft
                                            </label>
                                            <label style={styles.radioLabel}>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="Disabled"
                                                    checked={form.status === "Disabled"}
                                                    onChange={handleFormChange}
                                                    style={styles.radioInput}
                                                /> Disabled
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.variableTags}>
                                    {Object.keys(MOCK_VARS).map(tag => (
                                        <div key={tag} style={styles.tag} onClick={() => handleTagClick(tag)}>
                                            {`{{${tag}}}`}
                                        </div>
                                    ))}
                                </div>
                                {/* The editor toolbar is not fully functional in this simple example */}
                                <div style={styles.editorToolbar}>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('bold')}><b>B</b></button>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('italic')}><i>I</i></button>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('underline')}><u>U</u></button>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('justifyLeft')}><span style={{ fontFamily: "serif" }}>&#8801;</span></button>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('justifyCenter')}><span style={{ fontFamily: "serif" }}>&#8802;</span></button>
                                    <button style={styles.editorBtn} onClick={() => handleRichText('justifyRight')}><span style={{ fontFamily: "serif" }}>&#8803;</span></button>
                                </div>
                                <textarea
                                    ref={editorRef}
                                    name="body"
                                    value={form.body}
                                    onChange={handleFormChange}
                                    style={{...styles.textarea, borderRadius: "0 0 8px 8px"}}
                                />
                            </div>

                            {/* Actions */}
                            <div style={styles.actions}>
                                <button style={styles.btnCancel} onClick={handleCancel}>Cancle</button>
                                <button style={styles.btnSave} onClick={handleSave}>Save Template</button>
                            </div>
                        </div>

                        {/* Live Preview Section */}
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