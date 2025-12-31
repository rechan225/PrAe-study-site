// Simple localStorage-based checklist + small helpers
const STORAGE_KEY = "prae_checklist_v1";

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}

function saveState(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function initChecklist(){
  const boxes = qsa('[data-task-id]');
  if(!boxes.length) return;

  const state = loadState();

  boxes.forEach(item=>{
    const id = item.getAttribute('data-task-id');
    const input = qs('input[type="checkbox"]', item);
    const card = item;

    if(state[id] === true){
      input.checked = true;
      card.classList.add("done");
    }

    input.addEventListener("change", ()=>{
      const next = loadState();
      next[id] = input.checked;
      saveState(next);

      card.classList.toggle("done", input.checked);
      updateProgress();
    });
  });

  const resetBtn = qs('[data-reset-checklist]');
  if(resetBtn){
    resetBtn.addEventListener("click", ()=>{
      if(!confirm("确定要清空所有打勾记录吗？")) return;
      localStorage.removeItem(STORAGE_KEY);
      boxes.forEach(item=>{
        const input = qs('input[type="checkbox"]', item);
        input.checked = false;
        item.classList.remove("done");
      });
      updateProgress();
    });
  }

  updateProgress();
}

function updateProgress(){
  const items = qsa('[data-task-id]');
  if(!items.length) return;

  const done = items.filter(i => qs('input', i).checked).length;
  const total = items.length;
  const percent = total ? Math.round(done / total * 100) : 0;

  const meter = qs('[data-progress-text]');
  if(meter) meter.textContent = `进度：${done}/${total}（${percent}%）`;

  const bar = qs('[data-progress-bar]');
  if(bar) bar.style.width = `${percent}%`;
}

function setActiveNav(){
  const here = location.pathname.split("/").pop() || "index.html";
  qsa(".nav a").forEach(a=>{
    const href = a.getAttribute("href");
    if(href === here) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  initChecklist();
});
