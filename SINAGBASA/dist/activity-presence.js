"use strict";

// Presence uses the existing activity RPC and its existing page_view event type.
// Reserved page prefixes distinguish presence from ordinary page visits.
const ACTIVITY_ACTIVE_MS=90000, ACTIVITY_FRESH_MS=75000;
let presenceSession=null, presenceLastInteraction=0, presenceToken=null;
let presenceLastSend=0, presenceBusy=false, presenceStopped=false;
let presenceLastState=null;
let presenceResumeRecorded=false;
let presenceAuthSubscribed=false;
const presenceInstance=crypto.randomUUID();

function ensurePresenceSession(){
  const user=window.sinagUser;
  if(!user)return null;
  if(presenceSession?.userId===user.id)return presenceSession;
  const key=`sinagbasa-activity-session:${user.id}`;
  let saved;
  try{saved=JSON.parse(sessionStorage.getItem(key)||"null");}catch{}
  const signedInAt=Date.parse(user.last_sign_in_at||"");
  if(!saved?.id || (signedInAt&&saved.signedInAt!==signedInAt)){
    saved={id:crypto.randomUUID(),userId:user.id,startedAt:signedInAt||Date.now(),signedInAt:signedInAt||null};
    try{sessionStorage.setItem(key,JSON.stringify(saved));}catch{}
  }
  presenceSession=saved;
  return saved;
}

window.activityLogPage=function(event,page){
  const session=ensurePresenceSession();
  if(!session||page.startsWith("presence/"))return page;
  if(event==="login"||event==="logout")return `session/${session.id}`;
  return `visit/${session.id}/${page}`;
};

function presencePayload(status){
  const session=ensurePresenceSession();
  if(!session)return null;
  const page=encodeURIComponent(route().join("/")||"home");
  return {p_event:"page_view",p_page:`presence/${session.id}/${presenceInstance}/${session.startedAt}/${status}/${page}`.slice(0,160),p_started_at:new Date(session.startedAt).toISOString(),p_duration:Math.max(0,Math.floor((Date.now()-presenceLastInteraction)/1000))};
}

async function sendPresence(forced){
  if(!window.sinagUser||!window.sinagSupabase||presenceStopped||presenceBusy)return;
  const status=forced || (document.visibilityState==="visible"&&Date.now()-presenceLastInteraction<ACTIVITY_ACTIVE_MS?"active":"idle");
  if(status==="idle"&&presenceLastState==="idle")return;
  const payload=presencePayload(status);if(!payload)return;
  presenceBusy=true;presenceLastSend=Date.now();
  try{
    const {data}=await window.sinagSupabase.auth.getSession();presenceToken=data.session?.access_token;
    const {error}=await window.sinagSupabase.rpc("record_activity",payload);
    if(error)console.error("Activity status update failed",error);
    else presenceLastState=status;
  }catch(error){console.error("Activity status update failed",error);}
  finally{presenceBusy=false;}
}

function notePresenceInteraction(event){
  if(event?.isTrusted===false||!window.sinagUser||document.visibilityState!=="visible"||presenceStopped)return;
  const wasIdle=Date.now()-presenceLastInteraction>=ACTIVITY_ACTIVE_MS;
  presenceLastInteraction=Date.now();
  if(wasIdle||Date.now()-presenceLastSend>=15000)void sendPresence();
}

async function startPresence(){
  if(!window.sinagUser)return;
  ensurePresenceSession();presenceStopped=false;
  if(!presenceAuthSubscribed&&window.sinagSupabase.auth.onAuthStateChange){
    window.sinagSupabase.auth.onAuthStateChange((_event,session)=>{presenceToken=session?.access_token||null;});
    presenceAuthSubscribed=true;
  }
  presenceLastInteraction=Date.now();
  if(!presenceResumeRecorded){
    try{
      const {data}=await window.sinagSupabase.auth.getSession();presenceToken=data.session?.access_token;
      const {error}=await window.sinagSupabase.rpc("record_activity",{p_event:"page_view",p_page:`resume/${presenceSession.id}/${presenceInstance}`,p_started_at:new Date().toISOString(),p_duration:0});
      if(!error)presenceResumeRecorded=true;
    }catch(error){console.error("Session resume update failed",error);}
  }
  await sendPresence();
}

window.addEventListener("sinagbasa:authenticated",startPresence);
for(const name of ["pointerdown","pointermove","keydown","input","scroll"]){
  window.addEventListener(name,notePresenceInteraction,{passive:true});
}
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState!=="visible")void sendPresence("idle");
  else void sendPresence();
});
window.addEventListener("online",()=>sendPresence());
setInterval(()=>sendPresence(),30000);
window.addEventListener("pagehide",()=>{
  if(presenceStopped)return;
  const payload=presencePayload("closed"),config=window.SINAGBASA_SUPABASE;
  presenceStopped=true;presenceResumeRecorded=false;
  if(payload&&presenceToken&&config){
    const headers={"Content-Type":"application/json",apikey:config.publishableKey,Authorization:`Bearer ${presenceToken}`};
    // Keep a durable exit record, independently of short-lived presence records.
    const exit={p_event:"logout",p_page:`exit/${presenceSession.id}/${presenceInstance}`,p_started_at:null,p_duration:0};
    fetch(`${config.url}/rest/v1/rpc/record_activity`,{method:"POST",keepalive:true,headers,body:JSON.stringify(exit)}).catch(()=>{});
    fetch(`${config.url}/rest/v1/rpc/record_activity`,{method:"POST",keepalive:true,headers,body:JSON.stringify(payload)}).catch(()=>{});
  }
});
window.addEventListener("pageshow",event=>{if(event.persisted)void startPresence();});
const activityLogout=window.finishActivityForLogout;
window.finishActivityForLogout=async function(){
  await sendPresence("closed");presenceStopped=true;
  return activityLogout?.();
};
setTimeout(()=>{if(window.sinagUser)void startPresence();},0);
