import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./config";

const THEME={pageBg:"#0B1A2D",stageBg:"#0E1D33",card:"#13253D",border:"rgba(255,255,255,0.12)",text:"rgba(255,255,255,0.92)",textMut:"rgba(255,255,255,0.70)",accent:"#3B82F6"};
const styles={root:{display:"flex",minHeight:"100vh",background:THEME.pageBg,fontFamily:"Inter, system-ui"},content:{flex:1,display:"flex",justifyContent:"center",padding:24},stage:{width:1152,background:THEME.stageBg,borderRadius:16,border:`1px solid ${THEME.border}`,padding:24,position:"relative"},topbarRow:{display:"flex",alignItems:"center",gap:12,marginBottom:10},title:{fontSize:40,fontWeight:900,color:THEME.text,margin:"20px 0 6px"},breadcrumb:{color:THEME.textMut,fontWeight:600,marginBottom:18},formContainer:{display:"flex",gap:24,marginTop:20},formSection:{flex:1,display:"flex",flexDirection:"column",gap:16},formCard:{background:THEME.card,border:`1px solid ${THEME.border}`,borderRadius:12,padding:18},label:{color:THEME.textMut,fontSize:13,fontWeight:700,marginBottom:6},input:{width:"90%",background:"rgba(255,255,255,0.06)",color:THEME.text,border:`1px solid ${THEME.border}`,borderRadius:8,padding:"10px 12px",outline:"none"},textarea:{width:"95%",background:"rgba(255,255,255,0.06)",color:THEME.text,border:`1px solid ${THEME.border}`,borderRadius:8,padding:"10px 12px",outline:"none",minHeight:150,resize:"vertical"},radioLabel:{display:"flex",alignItems:"center",gap:8,color:THEME.text,fontWeight:600,cursor:"pointer"},radioInput:{appearance:"none",width:16,height:16,borderRadius:"50%",border:`2px solid ${THEME.border}`,position:"relative",outline:"none",cursor:"pointer",flexShrink:0},variableTags:{display:"flex",gap:8,flexWrap:"wrap",marginTop:10},tag:{background:"rgba(255,255,255,0.06)",border:`1px solid ${THEME.border}`,color:THEME.text,padding:"4px 8px",borderRadius:4,fontSize:12,cursor:"pointer"},previewSection:{flex:1,background:THEME.card,border:`1px solid ${THEME.border}`,borderRadius:12,padding:24},previewTitle:{color:THEME.text,fontSize:18,fontWeight:700,marginBottom:12},previewBody:{color:THEME.text,whiteSpace:"pre-wrap"}};

const EMPTY_FORM = { slug:"", name:"", subject:"", body:"", status:"Active", is_html:true };

export default function CreateNewTemplate(){
  const navigate=useNavigate();
  const [form,setForm]=useState(EMPTY_FORM);
  const [varsList,setVarsList]=useState({client:[],license:[],meta:[],examples:[]});
  const [preview,setPreview]=useState({subject:"",body:""});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const bodyRef = useRef(null);

  const previewVars = useMemo(() => ({
    client:{first_name:"Suchaya",last_name:"Panchuay",email:"user@example.com",username:"suchaya",plain_password:"Passw0rd!"},
    license:{license_key:"AAAAA-BBBBB-CCCCC-DDDDD",term:"trial",product_sku:"SMART_AUDIT_TRIAL",expires_at:"2025-12-31T15:00:00"},
    meta:{app_name:"SmartAudit",portal_url:"http://localhost:3000"}
  }), []);

  useEffect(()=>{
    const ctrl = new AbortController();
    (async()=>{
      try{
        const r=await fetch(`${API_BASE}/email-templates/variables/list`, { signal: ctrl.signal });
        if (r.ok) setVarsList(await r.json());
      }catch(e){ /* ignore */ }
    })();
    return ()=>ctrl.abort();
  },[]);

  // Debounce preview
  useEffect(()=>{
    const ctrl = new AbortController();
    const t = setTimeout(async ()=>{
      try{
        const r=await fetch(`${API_BASE}/email-templates/render/preview`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          signal: ctrl.signal,
          body:JSON.stringify({subject:form.subject,body:form.body,variables:previewVars})
        });
        if(r.ok){ setPreview(await r.json()); }
      }catch(e){/* ignore */}
    }, 250);
    return ()=>{ clearTimeout(t); ctrl.abort(); };
  },[form.subject,form.body,previewVars]);

  const handleChange=e=>{
    const {name,value,type,checked}=e.target;
    setForm(f=>({...f,[name]: type==="checkbox" ? checked : value }));
  };

  // Insert tag at caret
  const handleInsert=(tag)=>{
    const inserted=`{{${tag}}}`;
    setForm(f=>{
      const ta = bodyRef.current;
      if (!ta) return {...f, body: `${f.body}${f.body && !f.body.endsWith("\n") ? "\n" : ""}${inserted}`};
      const start = ta.selectionStart ?? f.body.length;
      const end   = ta.selectionEnd ?? f.body.length;
      const before = f.body.slice(0, start);
      const after  = f.body.slice(end);
      const newVal = before + inserted + after;
      // set caret after insert (async setState)
      requestAnimationFrame(()=>{
        const pos = start + inserted.length;
        ta.focus();
        ta.setSelectionRange(pos, pos);
      });
      return {...f, body: newVal};
    });
  };

  const handleSave=async()=>{
    setSaving(true); setErr("");
    try{
      if(!form.slug || !form.name || !form.subject) throw new Error("Please fill slug, name, and subject.");
      const r=await fetch(`${API_BASE}/email-templates`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(form)
      });
      if(!r.ok) throw new Error(await r.text());
      alert("Template created.");
      navigate("/email-template");
    }catch(e){ setErr(String(e?.message||e)); }
    finally{ setSaving(false); }
  };

  const PreviewBody = () => {
    if (form.is_html) {
      // ควร sanitize HTML ฝั่งเซิร์ฟเวอร์ก่อนส่งกลับมา preview.body
      return <div style={styles.previewBody} dangerouslySetInnerHTML={{__html: preview.body || "(preview body)"}} />;
    }
    return <div style={styles.previewBody}>{preview.body || "(preview body)"}</div>;
  };

  return(
    <div style={styles.root}>
      <Sidebar/>
      <div style={styles.content}>
        <div style={styles.stage}>
          <div style={styles.topbarRow}><div style={{flex:1}}><Topbar placeholder="Search templates" onSearchChange={()=>{}} defaultFilter="all" onViewAllPath="/Noti"/></div></div>
          <div style={styles.title}>Setting / Logs</div>
          <div style={styles.breadcrumb}>
            <span >Setting / Logs</span>
            &nbsp;&gt;&nbsp;<span style={{cursor:"pointer"}} onClick={()=>navigate("/email-template")}>Email Template</span>
            &nbsp;&gt;&nbsp;<span style={{color:"#9CC3FF"}}>Create New Template</span>
          </div>

          <div style={styles.formContainer}>
            {/* Form */}
            <div style={styles.formSection}>
              <div style={styles.formCard}>
                {err && <div style={{color:"#FCA5A5",fontWeight:800,marginBottom:10}}>{err}</div>}
                <div style={styles.label}>Slug</div>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="welcome" style={styles.input}/>
                <div style={styles.label}>Name</div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Welcome / Credentials + License" style={styles.input}/>
                <div style={styles.label}>Subject</div>
                <input name="subject" value={form.subject} onChange={handleChange} placeholder="[{{meta.app_name}}] Your account & license" style={styles.input}/>

                <div style={{display:"flex",gap:18,alignItems:"center",marginTop:10}}>
                  <div style={styles.label}>Status</div>
                  {["Active","Draft","Disabled"].map(s=>(
                    <label key={s} style={styles.radioLabel}>
                      <input type="radio" name="status" value={s} checked={form.status===s} onChange={handleChange} style={styles.radioInput}/>
                      {s}
                    </label>
                  ))}
                </div>

                <div style={{marginTop:10, display:"flex", alignItems:"center", gap:8, color:THEME.text}}>
                  <input id="is_html" type="checkbox" name="is_html" checked={form.is_html} onChange={handleChange}/>
                  <label htmlFor="is_html">Send as HTML (recommend)</label>
                </div>

                <div style={{marginTop:12, ...styles.label}}>Body</div>
                <textarea ref={bodyRef} name="body" value={form.body} onChange={handleChange} style={styles.textarea} placeholder="HTML or Text. Use {{client.first_name}} etc."/>

                {/* variable tags */}
                <div style={{marginTop:8}}>
                  <div style={styles.label}>Variables</div>
                  <div style={styles.variableTags}>
                    {["client","license","meta"].flatMap(ns => (varsList[ns]||[]).map(key => (
                      <div key={`${ns}.${key}`} style={styles.tag} onClick={()=>handleInsert(`${ns}.${key}`)}>
                        {`{{${ns}.${key}}}`}
                      </div>
                    )))}
                  </div>
                </div>

                <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:18}}>
                  <button style={{borderRadius:8,padding:"10px 14px",fontWeight:800,cursor:"pointer",border:"none",background:"#8B9EB8",color:"#fff"}} onClick={()=>navigate("/email-template")}>Cancel</button>
                  <button style={{borderRadius:8,padding:"10px 14px",fontWeight:800,cursor:"pointer",border:"none",background:THEME.accent,color:"#fff"}} disabled={saving} onClick={handleSave}>{saving?"Saving...":"Save Template"}</button>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div style={styles.previewSection}>
              <div style={styles.previewTitle}>{preview.subject || "(preview subject)"}</div>
              <PreviewBody/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
