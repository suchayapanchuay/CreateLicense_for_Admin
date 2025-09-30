import React from "react";
import Sidebar from "./SideBar";
import { IoPencilOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { API_BASE } from "./config";

const THEME = { pageBg:"#0B1A2D", stageBg:"#0E1D33", card:"#13253D", border:"rgba(255,255,255,0.12)", text:"rgba(255,255,255,0.92)", textMut:"rgba(255,255,255,0.70)", accent:"#3B82F6", btn:"#3B82F6", btnText:"#fff" };

const styles = { /* (เหมือนของเดิมทุกบรรทัด) */ 
  root:{display:"flex",minHeight:"100vh",background:THEME.pageBg,fontFamily:"Inter, system-ui"},
  content:{flex:1,display:"flex",justifyContent:"center",padding:24},
  stage:{width:1152,background:THEME.stageBg,borderRadius:16,border:`1px solid ${THEME.border}`,padding:24,position:"relative"},
  topbarRow:{display:"flex",alignItems:"center",gap:12,marginBottom:10},
  title:{fontSize:40,fontWeight:900,color:THEME.text,margin:"20px 0 6px"},
  breadcrumb:{color:THEME.textMut,fontWeight:600,marginBottom:18},
  btn:{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",borderRadius:8,fontWeight:700,cursor:"pointer",border:"none"},
  btnPrimary:{background:THEME.accent,color:THEME.btnText},
  tableWrap:{background:THEME.card,border:`1px solid ${THEME.border}`,borderRadius:12,overflow:"hidden",marginTop:20},
  header:{background:"rgba(255, 255, 255, 0.06)",display:"grid",gridTemplateColumns:"2.6fr 3fr 2fr 1.2fr 1fr",padding:"12px 16px",color:THEME.text,fontWeight:700},
  row:{display:"grid",gridTemplateColumns:"2.6fr 3fr 2fr 1.2fr 1fr",alignItems:"center",padding:"16px 16px",borderTop:`1px solid ${THEME.border}`},
  cell:{color:THEME.textMut,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",fontWeight:500},
  templateName:{color:THEME.text,fontWeight:700},
  subjectLine:{color:THEME.textMut,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},
  statusBadge:{display:"inline-block",padding:"6px 10px",borderRadius:999,fontWeight:700,fontSize:12},
  statusActive:{color:"#10B981",background:"rgba(16, 185, 129, 0.1)"},
  statusDraft:{color:"#FBBF24",background:"rgba(251, 191, 36, 0.1)"},
  statusDisabled:{color:"#EF4444",background:"rgba(239, 68, 68, 0.1)"},
  actionBtn:{width:34,height:34,display:"grid",placeItems:"center",borderRadius:999,border:`1px solid ${THEME.border}`,background:"transparent",color:THEME.textMut,cursor:"pointer"},
  pagination:{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,marginTop:20,color:THEME.textMut},
  paginationCurrent:{fontWeight:700,color:THEME.text,background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"8px 12px"},
};

export default function EmailTemplate() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([]);
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/email-templates`);
        if (!r.ok) throw new Error(await r.text());
        setItems(await r.json());
      } catch (e) { setErr(String(e?.message||e)); }
    })();
  }, []);

  const getStatusStyle = (s) => s==="Active"?styles.statusActive: s==="Draft"?styles.statusDraft: styles.statusDisabled;

  return (
    <div style={styles.root}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbarRow}><div style={{flex:1}}><Topbar placeholder="Search templates" onSearchChange={()=>{}} defaultFilter="all" onViewAllPath="/Noti" /></div></div>
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}><span style={{cursor:"pointer"}} onClick={()=>navigate("/setting")}>Setting / Logs</span>&nbsp;&gt;&nbsp;<span style={{color:"#9CC3FF"}}>Email Template</span></div>

          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
            <button style={{...styles.btn,...styles.btnPrimary}} onClick={()=>navigate("/email-template/create-email")}>+ Create New Template</button>
          </div>

          {err && <div style={{color:"#FCA5A5",marginBottom:12,fontWeight:800}}>{err}</div>}

          <div style={styles.tableWrap}>
            <div style={styles.header}><div>Template Name</div><div>Subject Line</div><div>Last Updated</div><div>Status</div><div>Actions</div></div>
            {items.map(t=>(
              <div key={t.id} style={styles.row}>
                <div style={{...styles.cell,...styles.templateName}}>{t.name} <span style={{opacity:.7}}>({t.slug})</span></div>
                <div style={{...styles.cell,...styles.subjectLine}}>{t.subject}</div>
                <div style={styles.cell}>{t.updated_at?.slice(0,16).replace("T"," ")}</div>
                <div><span style={{...styles.statusBadge,...getStatusStyle(t.status)}}>{t.status}</span></div>
                <div><button style={styles.actionBtn} onClick={()=>navigate(`/email-template/edit-email/${t.id}`)}><IoPencilOutline size={18}/></button></div>
              </div>
            ))}
            {!items.length && <div style={{padding:16,color:"#9CA3AF"}}>No templates</div>}
          </div>

          <div style={styles.pagination}><span>&lt;</span><span style={styles.paginationCurrent}>1</span><span>&gt;</span></div>
        </div>
      </div>
    </div>
  );
}
