// 公共基础布局
function layout(title, content, scripts) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  :root {
    --sakura: #ffb7c5; --pink: #f0a0c0; --pink-deep: #d4788e; --pink-dark: #b0506a;
    --text: #4a2a38; --muted: #9a6a7c; --soft: #c08090;
    --card-bg: rgba(255,255,255,0.7); --card-border: rgba(212,120,142,0.2);
    --input-bg: rgba(255,255,255,0.85);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
    background: linear-gradient(170deg, #fff0f5 0%, #ffe4ec 28%, #ffd6e4 52%, #ffe8f0 76%, #fff0f5 100%);
    color: var(--text); line-height:1.7; min-height:100vh;
  }
  body::before {
    content:''; position:fixed; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(circle at 10% 15%, rgba(255,183,197,0.45) 0%, transparent 50%),
      radial-gradient(circle at 90% 55%, rgba(240,160,192,0.4) 0%, transparent 55%),
      radial-gradient(circle at 50% 82%, rgba(255,200,215,0.35) 0%, transparent 45%),
      radial-gradient(circle at 72% 8%, rgba(255,183,197,0.4) 0%, transparent 40%);
  }
  nav {
    position:sticky; top:0; z-index:50;
    background:rgba(255,245,250,0.75); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
    border-bottom:1px solid rgba(212,120,142,0.15); padding:0.75rem 1.5rem;
  }
  nav .inner { max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; }
  nav .brand {
    font-size:1.1rem; font-weight:800; letter-spacing:2px;
    background:linear-gradient(135deg, #e8789a, #d4788e, #c0607a);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  nav a { color:var(--soft); text-decoration:none; font-size:0.9rem; margin-left:1.25rem; transition:color 0.2s; }
  nav a:hover { color:var(--pink-dark); }
  .container { max-width:1100px; margin:0 auto; padding:2rem 1.5rem; position:relative; z-index:1; }
  .card {
    background:var(--card-bg); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
    border:1px solid var(--card-border); border-radius:1rem;
    box-shadow:0 2px 16px rgba(180,80,100,0.06);
  }
  .card:hover { border-color:rgba(212,120,142,0.4); }
  .btn {
    display:inline-block; padding:0.55rem 1.5rem; border-radius:0.6rem;
    font-weight:600; font-size:0.9rem; text-decoration:none; cursor:pointer; transition:all 0.2s; border:none;
  }
  .btn-primary {
    background:linear-gradient(135deg, #e8789a 0%, #d4788e 50%, #c0607a 100%);
    color:#fff; box-shadow:0 2px 10px rgba(200,90,120,0.25);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(200,90,120,0.35); }
  .btn-outline {
    border:1.5px solid var(--pink-deep); color:var(--pink-dark); background:rgba(255,255,255,0.5);
  }
  .btn-outline:hover { background:rgba(212,120,142,0.08); }
  .btn-sm { padding:0.35rem 0.9rem; font-size:0.8rem; }
  .input {
    width:100%; padding:0.6rem 0.85rem; border-radius:0.6rem;
    border:1.5px solid rgba(212,120,142,0.25); background:var(--input-bg);
    color:var(--text); font-size:0.9rem; font-family:inherit; transition:border 0.2s;
  }
  .input:focus { outline:none; border-color:var(--pink-deep); box-shadow:0 0 0 3px rgba(212,120,142,0.1); }
  footer {
    border-top:1px solid rgba(212,120,142,0.15); padding:1.5rem;
    text-align:center; font-size:0.75rem; color:var(--muted);
  }
  .badge { display:inline-block; padding:0.15rem 0.55rem; border-radius:9999px; font-size:0.75rem; font-weight:500; }
  .badge-active { background:rgba(180,200,140,0.3); color:#6a8a4a; }
  .badge-inactive { background:rgba(200,140,140,0.3); color:#b06060; }
  .hero-title {
    font-size:2.6em; letter-spacing:4px; font-weight:800; text-align:center;
    background:linear-gradient(135deg, #e8789a 0%, #d4788e 50%, #c0607a 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .toast {
    position:fixed; bottom:1.5rem; right:1.5rem; z-index:100;
    padding:0.6rem 1.2rem; border-radius:0.6rem; font-size:0.85rem;
    font-weight:500; color:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.15);
  }
  .toast-ok { background:#7ab87a; }
  .toast-err { background:#d47878; }
  pre.code-block {
    background:#2d1e24; color:#f0c0d0; border-radius:0.75rem;
    padding:1.25rem; overflow-x:auto; font-size:0.85rem; line-height:1.6;
  }
  .code-inline {
    background:rgba(212,120,142,0.1); padding:0.15rem 0.5rem; border-radius:0.35rem;
    font-size:0.85em; color:var(--pink-dark);
  }
</style>
</head>
<body>
<nav>
  <div class="inner">
    <a href="/" class="brand">Shinsekai Resource Station</a>
    <div>
      <a href="/">首页</a>
      <a href="/voices">语音库</a>
      <a href="/resources">角色&amp;背景包</a>
      <a href="/charge">充值</a>
      <span id="nav-auth">
        <a href="/login">登录</a>
        <a href="/register" class="btn btn-primary btn-sm" style="margin-left:0.5rem">注册</a>
      </span>
      <span id="nav-user" style="display:none">
        <a href="/console">控制台</a>
        <a href="#" onclick="logout();return false" style="color:var(--muted)">登出</a>
      </span>
    </div>
  </div>
</nav>
<main>${content}</main>
<footer>
  <p>&copy; 2026 End0rph1nww &middot; <a href="https://github.com/End0rph1nww/shinsekai-resource" style="color:var(--soft);text-decoration:none;">GitHub</a> &middot; <a href="https://github.com/End0rph1nww/shinsekai-resource/blob/main/LICENSE" style="color:var(--soft);text-decoration:none;">MIT License</a></p>
</footer>
<script>
function checkAuth() {
  const token = localStorage.getItem('access_token');
  if (token) {
    document.getElementById('nav-auth').style.display = 'none';
    document.getElementById('nav-user').style.display = '';
  }
}
checkAuth();
function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/';
}
</script>
${scripts || ''}
</body>
</html>`;
}

// 各页面定义
const pages = {
  '/': layout('Shinsekai Resource Station', /* html */`
    <section style="text-align:center; padding:4.5rem 1.5rem 3rem; position:relative;">
      <h1 class="hero-title">Shinsekai Resource Station</h1>
      <p style="font-size:0.95rem; color:var(--muted); max-width:600px; margin:0.85rem auto 1.25rem; line-height:1.8;">
        Shinsekai 开源项目的资源共享站<br>
        提供音色库、角色库等资源存储与 TTS API 代理，服务 Shinsekai 桌面助手的开发与测试
      </p>
      <p style="font-size:0.82rem; color:var(--muted); max-width:540px; margin:0 auto 1.5rem; line-height:1.7;">
        本站为社区公益性质，仅收取维持服务的必要费用<br>
        所有收入用于覆盖上游 API 成本与服务器开销，不作商业运营
      </p>
      <div style="display:flex; justify-content:center; gap:0.75rem;">
        <a href="/register" class="btn btn-primary" style="padding:0.65rem 2rem; font-size:1rem;">立即注册</a>
      </div>
      <div style="display:flex; justify-content:center; gap:0.75rem; margin-top:1.2rem; flex-wrap:wrap;">
        <a href="/voices" style="display:inline-block; padding:0.55rem 1.6rem; border-radius:9999px; background:linear-gradient(135deg, #f0b0c0, #e898a8); color:#fff; text-decoration:none; font-size:0.88rem; font-weight:600; transition:all 0.2s;" onmouseover="this.style.boxShadow='0 4px 15px rgba(212,120,142,0.3)'" onmouseout="this.style.boxShadow=''">🌸 浏览语音库</a>
        <a href="/resources" style="display:inline-block; padding:0.55rem 1.6rem; border-radius:9999px; background:linear-gradient(135deg, #f0b0c0, #e898a8); color:#fff; text-decoration:none; font-size:0.88rem; font-weight:600; transition:all 0.2s;" onmouseover="this.style.boxShadow='0 4px 15px rgba(212,120,142,0.3)'" onmouseout="this.style.boxShadow=''">📦 浏览社区角色包 & 背景包资源</a>
      </div>
      <p style="margin-top:2rem; font-size:0.85rem; color:var(--muted); line-height:2;" id="counts-line">
        🌸 已有 <strong style="color:var(--pink-dark);" id="count-voices">-</strong> 个 Voice ID 可供调用<br>
        🎭 <strong style="color:var(--pink-dark);" id="count-chars">-</strong> 个角色包 · 🖼️ <strong style="color:var(--pink-dark);" id="count-bgs">-</strong> 个背景包
      </p>
      <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); font-size:1.4em; opacity:0.6;">🌸</div>
    </section>
  `, /* scripts */`
    <script>
    (async function(){
      try{
        const res=await fetch('/api/resources');
        const all=await res.json();
        document.getElementById('count-voices').textContent=all.filter(r=>r.type==='voice').length;
        document.getElementById('count-chars').textContent=all.filter(r=>r.type==='character_pack').length;
        document.getElementById('count-bgs').textContent=all.filter(r=>r.type==='background_pack').length;
      }catch(e){}
    })();
    </script>
  `),

  '/voices': layout('语音库 · Shinsekai Resource Station', /* html */`
    <section class="container">
      <h1 style="font-size:1.6rem; font-weight:700; margin-bottom:0.3rem;">🎤 语音库</h1>
      <p style="color:var(--muted); margin-bottom:1.5rem; font-size:0.9rem;">浏览可用的 Voice ID，点击卡片即可复制到剪贴板</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem;">
        <input type="text" id="search" class="input" style="max-width:280px;" placeholder="搜索 Voice ID 或名称..." oninput="filter()">
        <div id="tag-filters" style="display:flex; flex-wrap:wrap; gap:0.35rem;"></div>
      </div>
      <div id="voice-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1rem;">
        <p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">🌸 加载中…</p>
      </div>
    </section>
  `, /* scripts */`
    <script>
    let allVoices=[], allTags=new Set();
    async function load(){
      try{
        const res=await fetch('/api/resources?type=voice');
        allVoices=await res.json();
        allVoices.forEach(v=>{if(v.tags&&Array.isArray(v.tags))v.tags.forEach(t=>allTags.add(t))});
        renderTags(); render(allVoices);
      }catch(e){console.error(e);}
    }
    function renderTags(){
      const el=document.getElementById('tag-filters');
      el.innerHTML=Array.from(allTags).sort().map(t=>'<button onclick="filterByTag(\\''+t+'\\')" style="padding:0.25rem 0.7rem; border-radius:9999px; font-size:0.75rem; border:1.5px solid rgba(212,120,142,0.25); background:rgba(255,255,255,0.5); color:var(--pink-dark); cursor:pointer; transition:all 0.2s;">'+t+'</button>').join('');
    }
    function filter(){
      const q=document.getElementById('search').value.toLowerCase();
      render(allVoices.filter(v=>v.resource_id.toLowerCase().includes(q)||v.display_name.toLowerCase().includes(q)));
    }
    function filterByTag(tag){document.getElementById('search').value=tag;filter();}
    function copyId(id){navigator.clipboard.writeText(id).then(()=>toast('已复制: '+id));}
    function render(voices){
      const grid=document.getElementById('voice-grid');
      if(!voices.length){grid.innerHTML='<p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">暂无结果</p>';return;}
      grid.innerHTML=voices.map(v=>'<div class="card" style="padding:1.1rem; cursor:pointer;" onclick="copyId(\\''+v.resource_id+'\\')">'+
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">'+
        '<h3 style="font-family:monospace; font-size:0.95rem; color:var(--pink-dark);">'+v.resource_id+'</h3>'+
        '<span style="font-size:0.7rem; color:var(--muted);">点击复制</span></div>'+
        '<p style="font-size:0.85rem; color:var(--text); margin-bottom:0.3rem;">'+(v.display_name||v.resource_id)+'</p>'+
        '<p style="font-size:0.75rem; color:var(--muted); margin-bottom:0.6rem;">'+(v.description||'')+'</p>'+
        '<div style="display:flex; flex-wrap:wrap; gap:0.25rem;">'+(v.tags||[]).map(t=>'<span style="padding:0.15rem 0.5rem; border-radius:9999px; font-size:0.7rem; background:rgba(212,120,142,0.1); color:var(--pink-dark);">'+t+'</span>').join('')+'</div>'+
        (v.preview_url?'<audio controls style="margin-top:0.75rem; width:100%; height:1.75rem;" src="'+v.preview_url+'"></audio>':'')+
        '</div>').join('');
    }
    function toast(msg){
      const el=document.createElement('div');
      el.className='toast toast-ok';el.textContent=msg;document.body.appendChild(el);
      setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 0.3s';setTimeout(()=>el.remove(),300);},2000);
    }
    load();
    </script>
  `),

  '/resources': layout('资源下载 · Shinsekai Resource Station', /* html */`
    <section class="container">
      <h1 style="font-size:1.6rem; font-weight:700; margin-bottom:0.3rem;">📦 资源下载</h1>
      <p style="color:var(--muted); margin-bottom:0.5rem; font-size:0.9rem;">社区贡献的角色包与背景包资源。资源由社区成员上传分享，请自行甄别适用性。</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.75rem; margin-bottom:1.5rem; align-items:center;">
        <input type="text" id="search" class="input" style="max-width:260px;" placeholder="搜索资源名称..." oninput="filter()">
        <div style="display:flex; gap:0.5rem;">
          <button class="tab-btn active" data-type="" onclick="setType(this,'')">全部</button>
          <button class="tab-btn" data-type="character_pack" onclick="setType(this,'character_pack')">🎭 角色包</button>
          <button class="tab-btn" data-type="background_pack" onclick="setType(this,'background_pack')">🖼️ 背景包</button>
        </div>
      </div>
      <div id="resource-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:1rem;">
        <p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">🌸 加载中…</p>
      </div>
    </section>
  `, /* scripts */`
    <style>
    .tab-btn{padding:0.4rem 1rem;border-radius:9999px;font-size:0.82rem;border:1.5px solid rgba(212,120,142,0.25);background:rgba(255,255,255,0.5);color:var(--pink-dark);cursor:pointer;transition:all 0.2s;}
    .tab-btn.active{background:var(--pink);color:#fff;border-color:var(--pink);}
    .dl-btn{display:inline-flex;align-items:center;gap:0.3rem;padding:0.4rem 1.1rem;border-radius:9999px;font-size:0.8rem;background:linear-gradient(135deg,var(--pink),var(--pink-deep));color:#fff;text-decoration:none;transition:all 0.2s;width:100%;justify-content:center;box-sizing:border-box;}
    .dl-btn:hover{opacity:0.85;transform:translateY(-1px);box-shadow:0 4px 12px rgba(212,120,142,0.25);}
    .meta-row{display:flex;flex-wrap:wrap;gap:0.4rem 0.8rem;font-size:0.73rem;color:var(--muted);}
    .password-badge{display:inline-block;padding:0.1rem 0.5rem;border-radius:4px;font-size:0.73rem;background:rgba(212,120,142,0.08);color:var(--pink-dark);font-family:monospace;}
    </style>
    <script>
    let allResources=[],activeType='';
    async function load(){
      try{
        const[chars,bgs]=await Promise.all([
          fetch('/api/resources?type=character_pack').then(r=>r.json()),
          fetch('/api/resources?type=background_pack').then(r=>r.json()),
        ]);
        allResources=[...chars,...bgs];render(allResources);
      }catch(e){console.error(e);}
    }
    function setType(btn,type){
      activeType=type;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');filter();
    }
    function filter(){
      const q=document.getElementById('search').value.toLowerCase();
      let items=allResources;
      if(activeType)items=items.filter(r=>r.type===activeType);
      if(q)items=items.filter(r=>r.display_name.toLowerCase().includes(q)||r.resource_id.toLowerCase().includes(q)||(r.description||'').toLowerCase().includes(q));
      render(items);
    }
    function typeLabel(t){return t==='character_pack'?'🎭 角色包':'🖼️ 背景包';}
    function render(items){
      const grid=document.getElementById('resource-grid');
      if(!items.length){grid.innerHTML='<p style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">🌸 暂无匹配资源</p>';return;}
      grid.innerHTML=items.map(r=>{
        let meta={};
        try{const t=r.tags;if(t&&typeof t==='object'&&!Array.isArray(t))meta=t;}catch(e){}
        return '<div class="card" style="padding:1.2rem; display:flex; flex-direction:column; gap:0.65rem;">'+
          '<div style="display:flex; justify-content:space-between; align-items:flex-start;">'+
          '<span style="font-size:0.7rem; padding:0.15rem 0.6rem; border-radius:9999px; background:rgba(212,120,142,0.1); color:var(--pink-dark);">'+typeLabel(r.type)+'</span>'+
          (meta.time?'<span style="font-size:0.7rem; color:var(--muted);">'+meta.time+'</span>':'')+
          '</div>'+
          '<h3 style="font-size:1.02rem; color:var(--text); line-height:1.3; margin:0;">'+r.display_name+'</h3>'+
          '<p style="font-size:0.8rem; color:var(--muted); line-height:1.55; flex:1; margin:0;">'+(r.description||'')+'</p>'+
          '<div class="meta-row">'+
          (meta.uploader?'<span>👤 '+meta.uploader+'</span>':'')+
          (meta.password?'<span>🔑 <span class="password-badge">'+meta.password+'</span></span>':'')+
          '</div>'+
          '<a href="'+r.download_url+'" class="dl-btn" target="_blank" rel="noopener">⬇ 下载</a>'+
          '</div>';
      }).join('');
    }
    load();
    </script>
  `),

  '/charge': layout('账户充值 · Shinsekai Resource Station', /* html */`
    <section class="container" style="max-width:520px;">
      <h1 style="font-size:1.6rem; font-weight:700; margin-bottom:0.3rem;">💰 账户充值</h1>
      <p style="color:var(--muted); margin-bottom:1.5rem; font-size:0.9rem;">通过 Stripe 安全支付为账户充值 · 支持银行卡、支付宝</p>
      <div class="card" style="padding:1.5rem;">
        <div id="auth-prompt" style="display:none; text-align:center; padding:2rem 0;">
          <p style="color:var(--muted); margin-bottom:1rem;">请先登录后充值</p>
          <a href="/login" class="btn btn-primary">前往登录</a>
        </div>
        <div id="amount-step">
          <label style="display:block; font-size:0.85rem; color:var(--muted); margin-bottom:0.5rem;">选择充值金额</label>
          <div id="amount-presets" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.5rem; margin-bottom:1rem;"></div>
          <label style="display:block; font-size:0.85rem; color:var(--muted); margin-bottom:0.5rem;">或输入自定义金额</label>
          <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:1.5rem;">
            <input type="number" id="custom-amount" class="input" style="flex:1;" placeholder="自定义金额（元）" min="1" step="0.01" value="10">
            <span style="color:var(--muted); font-size:0.85rem;">CNY</span>
          </div>
          <button type="button" id="submit-btn" class="btn btn-primary" style="width:100%; padding:0.75rem; font-size:1rem;">前往支付</button>
          <p style="text-align:center; font-size:0.7rem; color:var(--muted); margin-top:0.75rem;">🔒 支付由 Stripe 安全处理</p>
        </div>
        <div id="checkout-step" style="display:none;">
          <button type="button" id="back-btn" class="btn btn-outline btn-sm" style="margin-bottom:1rem;">← 返回修改金额</button>
          <div id="checkout-container" style="min-height:380px;"></div>
        </div>
      </div>
    </section>
  `, /* scripts */`
    <script src="https://js.stripe.com/v3/"></script>
    <style>
    .preset-btn{padding:0.5rem;border-radius:0.5rem;border:1.5px solid rgba(212,120,142,0.25);background:rgba(255,255,255,0.5);color:var(--text);font-size:0.85rem;cursor:pointer;transition:all 0.2s;text-align:center;}
    .preset-btn:hover{border-color:var(--pink-deep);}
    .preset-btn.selected{border-color:var(--pink-deep);background:rgba(212,120,142,0.08);font-weight:600;}
    </style>
    <script>
    const presets=[{label:'¥5 小试',value:5},{label:'¥10 入门',value:10},{label:'¥20 实惠',value:20},{label:'¥50 常用',value:50},{label:'¥100 充裕',value:100},{label:'¥200 壕',value:200}];
    let selectedAmount=null,stripe=null,embeddedCheckout=null;
    function init(){
      const token=localStorage.getItem('access_token');
      if(!token){document.getElementById('auth-prompt').style.display='';document.getElementById('amount-step').style.display='none';return;}
      stripe=Stripe('pk_test_51TXNlu5idc26fCUVbE8inaUL5WLr78kU7suvBkbZgWAQyVQWQjPrlWvoO2wIuwUa00gEufgCnjeYpUENJm6Q6zvk00ggYEKgdf');
      const grid=document.getElementById('amount-presets');
      grid.innerHTML=presets.map(p=>'<button type="button" class="preset-btn" data-amount="'+p.value+'">'+p.label+'</button>').join('');
      grid.querySelectorAll('.preset-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          grid.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('selected'));
          btn.classList.add('selected');selectedAmount=parseFloat(btn.dataset.amount);
          document.getElementById('custom-amount').value='';
        });
      });
      document.getElementById('custom-amount').addEventListener('input',()=>{grid.querySelectorAll('.preset-btn').forEach(b=>b.classList.remove('selected'));selectedAmount=null;});
      document.getElementById('submit-btn').addEventListener('click',createSession);
      document.getElementById('back-btn').addEventListener('click',goBack);
    }
    async function createSession(){
      const amount=selectedAmount||parseFloat(document.getElementById('custom-amount').value);
      if(!amount||amount<1){alert('请选择或输入充值金额（不低于 1 元）');return;}
      const btn=document.getElementById('submit-btn');btn.disabled=true;btn.textContent='正在创建订单...';
      try{
        const token=localStorage.getItem('access_token');
        const res=await fetch('/charge/create-session',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({amount:amount})});
        if(!res.ok){const err=await res.json();alert(err.detail||'创建订单失败');btn.disabled=false;btn.textContent='前往支付';return;}
        const data=await res.json();
        if(embeddedCheckout){embeddedCheckout.destroy();embeddedCheckout=null;}
        document.getElementById('amount-step').style.display='none';
        document.getElementById('checkout-step').style.display='';
        document.getElementById('submit-btn').textContent='前往支付';document.getElementById('submit-btn').disabled=false;
        embeddedCheckout=await stripe.initEmbeddedCheckout({clientSecret:data.client_secret,onComplete:()=>{embeddedCheckout=null;window.location.href='/charge/success';}});
        embeddedCheckout.mount('#checkout-container');
      }catch(err){alert('网络错误: '+err.message);btn.disabled=false;btn.textContent='前往支付';}
    }
    function goBack(){if(embeddedCheckout){embeddedCheckout.destroy();embeddedCheckout=null;}document.getElementById('amount-step').style.display='';document.getElementById('checkout-step').style.display='none';document.getElementById('checkout-container').innerHTML='';}
    init();
    </script>
  `),

  '/console': layout('控制台 · Shinsekai Resource Station', /* html */`
    <section class="container">
      <h1 style="font-size:1.6rem; font-weight:700; margin-bottom:1.5rem;">⚙ 用户控制台</h1>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-bottom:2rem;">
        <div class="card" style="padding:1.25rem;"><p style="font-size:0.8rem; color:var(--muted);">剩余余额</p><p style="font-size:1.6rem; font-weight:700; color:#6a8a4a;" id="info-balance">-</p><p style="font-size:0.7rem; color:var(--muted);">字符</p></div>
        <div class="card" style="padding:1.25rem;"><p style="font-size:0.8rem; color:var(--muted);">累计用量</p><p style="font-size:1.6rem; font-weight:700;" id="info-used">-</p><p style="font-size:0.7rem; color:var(--muted);">字符</p></div>
        <div class="card" style="padding:1.25rem;"><p style="font-size:0.8rem; color:var(--muted);">账户状态</p><p style="font-size:1.6rem; font-weight:700;" id="info-status">-</p></div>
      </div>
      <div class="card" style="padding:1.25rem; margin-bottom:1.5rem;">
        <p style="font-size:0.85rem; color:var(--muted); margin-bottom:0.5rem;">API 接入地址</p>
        <div style="display:flex; gap:0.75rem; align-items:center;">
          <code class="code-inline" style="flex:1; word-break:break-all;" id="api-base-url">-</code>
          <button onclick="navigator.clipboard.writeText(document.getElementById('api-base-url').textContent);toast('已复制')" class="btn btn-primary btn-sm">复制</button>
        </div>
        <p style="font-size:0.75rem; color:var(--muted); margin-top:0.5rem;">TTS 端点：<code class="code-inline" id="tts-endpoint">-</code></p>
      </div>
      <div class="card" style="padding:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 style="font-size:1.1rem; font-weight:700;">API Keys</h2>
          <button onclick="createKey()" class="btn btn-primary btn-sm">+ 创建 Key</button>
        </div>
        <div id="keys-list" style="font-size:0.85rem; color:var(--muted);">请先登录</div>
      </div>
      <div id="key-modal" style="display:none; position:fixed; inset:0; z-index:100; align-items:center; justify-content:center; background:rgba(0,0,0,0.35);">
        <div class="card" style="padding:1.5rem; max-width:460px; width:90%;">
          <h3 style="font-size:1.1rem; font-weight:700; margin-bottom:0.5rem;">API Key 已创建</h3>
          <p style="font-size:0.8rem; color:#d47878; margin-bottom:0.75rem;">⚠ 这是唯一一次显示完整 Key，请立即复制保存！</p>
          <input type="text" id="new-key-text" class="input" style="font-family:monospace; font-size:0.8rem; margin-bottom:0.75rem;" readonly onclick="this.select();navigator.clipboard.writeText(this.value)">
          <div style="text-align:right;"><button onclick="document.getElementById('key-modal').style.display='none'" class="btn btn-primary btn-sm">知道了</button></div>
        </div>
      </div>
    </section>
  `, /* scripts */`
    <script>
    const token=localStorage.getItem('access_token');
    if(!token){window.location.href='/login';}
    const baseUrl=window.location.origin+'/';
    document.getElementById('api-base-url').textContent=baseUrl;
    document.getElementById('tts-endpoint').textContent=baseUrl+'v1/t2a_v2';
    async function apiAuth(path,opts={}){
      const res=await fetch(path,{headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,...(opts.headers||{})},...opts});
      if(res.status===401){localStorage.clear();window.location.href='/login';return;}
      if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.detail||'请求失败');}
      return res.json();
    }
    async function loadInfo(){
      try{
        const me=await apiAuth('/users/me');
        document.getElementById('info-balance').textContent=me.balance.toLocaleString();
        document.getElementById('info-used').textContent=me.used_total.toLocaleString();
        document.getElementById('info-status').textContent=me.is_active?'正常':'已禁用';
        document.getElementById('info-status').style.color=me.is_active?'#6a8a4a':'#d47878';
      }catch(e){console.error(e);}
    }
    async function loadKeys(){
      try{
        const keys=await apiAuth('/keys');
        const el=document.getElementById('keys-list');
        if(!keys.length){el.innerHTML='<p style="color:var(--muted);">暂无 API Key，点击上方按钮创建</p>';return;}
        el.innerHTML=keys.map(k=>'<div style="display:flex; justify-content:space-between; align-items:center; padding:0.7rem 0; border-bottom:1px solid rgba(212,120,142,0.12);">'+
          '<div><span style="font-family:monospace; font-size:0.85rem;">'+k.key_prefix+'...</span>'+
          '<span style="font-size:0.75rem; color:var(--muted); margin-left:0.5rem;">'+(k.name||'')+'</span>'+
          '<span class="badge '+(k.is_active?'badge-active':'badge-inactive')+'" style="margin-left:0.5rem;">'+(k.is_active?'活跃':'已撤销')+'</span>'+
          '<br><span style="font-size:0.7rem; color:var(--muted);">创建于 '+new Date(k.created_at).toLocaleDateString('zh-CN')+'</span></div>'+
          (k.is_active?'<button onclick="revokeKey('+k.id+')" style="background:none; border:none; color:#d47878; cursor:pointer; font-size:0.8rem;">撤销</button>':'')+'</div>').join('');
      }catch(e){console.error(e);}
    }
    async function createKey(){
      const name=prompt('Key 标签（可选）:')||'';
      try{
        const data=await apiAuth('/keys',{method:'POST',body:JSON.stringify({name})});
        document.getElementById('new-key-text').value=data.key;
        document.getElementById('key-modal').style.display='flex';loadKeys();
      }catch(e){toast(e.message,false);}
    }
    async function revokeKey(id){if(!confirm('确定撤销此 Key？'))return;try{await apiAuth('/keys/'+id,{method:'DELETE'});loadKeys();toast('Key 已撤销');}catch(e){toast(e.message,false);}}
    function toast(msg,ok=true){
      const el=document.createElement('div');el.className='toast '+(ok?'toast-ok':'toast-err');
      el.textContent=msg;document.body.appendChild(el);
      setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 0.3s';setTimeout(()=>el.remove(),300);},2500);
    }
    loadInfo();loadKeys();
    </script>
  `),

  '/login': layout('登录 · Shinsekai Resource Station', /* html */`
    <section style="max-width:380px; margin:0 auto; padding:4rem 1.5rem;">
      <h1 style="text-align:center; font-size:1.5rem; font-weight:700; margin-bottom:1.5rem;">用户登录</h1>
      <div class="card" style="padding:1.75rem;">
        <div id="error-box" style="display:none; padding:0.6rem 0.9rem; border-radius:0.5rem; margin-bottom:1rem; font-size:0.85rem; background:rgba(220,120,120,0.12); border:1px solid rgba(200,100,100,0.3); color:#b05050;"></div>
        <form onsubmit="doLogin(event)">
          <label style="font-size:0.85rem; color:var(--muted); display:block; margin-bottom:0.3rem;">邮箱</label>
          <input type="email" id="email" class="input" style="margin-bottom:1rem;" placeholder="your@email.com" required>
          <label style="font-size:0.85rem; color:var(--muted); display:block; margin-bottom:0.3rem;">密码</label>
          <input type="password" id="password" class="input" style="margin-bottom:1.25rem;" placeholder="至少8位" required>
          <button type="submit" class="btn btn-primary" style="width:100%;">登录</button>
        </form>
        <p style="text-align:center; font-size:0.85rem; color:var(--muted); margin-top:1rem;">还没有账号？<a href="/register" style="color:var(--pink-deep);">立即注册</a></p>
      </div>
    </section>
  `, /* scripts */`
    <script>
    async function doLogin(e){
      e.preventDefault();
      const box=document.getElementById('error-box');box.style.display='none';
      try{
        const res=await fetch('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value,password:document.getElementById('password').value})});
        if(!res.ok){const d=await res.json();throw new Error(d.detail||'登录失败');}
        const data=await res.json();
        localStorage.setItem('access_token',data.access_token);
        localStorage.setItem('refresh_token',data.refresh_token);
        window.location.href='/console';
      }catch(e){box.textContent=e.message;box.style.display='block';}
    }
    </script>
  `),

  '/register': layout('注册 · Shinsekai Resource Station', /* html */`
    <section style="max-width:380px; margin:0 auto; padding:4rem 1.5rem;">
      <h1 style="text-align:center; font-size:1.5rem; font-weight:700; margin-bottom:1.5rem;">用户注册</h1>
      <div class="card" style="padding:1.75rem;">
        <div id="error-box" style="display:none; padding:0.6rem 0.9rem; border-radius:0.5rem; margin-bottom:1rem; font-size:0.85rem; background:rgba(220,120,120,0.12); border:1px solid rgba(200,100,100,0.3); color:#b05050;"></div>
        <form onsubmit="doRegister(event)">
          <label style="font-size:0.85rem; color:var(--muted); display:block; margin-bottom:0.3rem;">邮箱</label>
          <input type="email" id="email" class="input" style="margin-bottom:1rem;" placeholder="your@email.com" required>
          <label style="font-size:0.85rem; color:var(--muted); display:block; margin-bottom:0.3rem;">昵称（可选）</label>
          <input type="text" id="nickname" class="input" style="margin-bottom:1rem;" placeholder="怎么称呼你">
          <label style="font-size:0.85rem; color:var(--muted); display:block; margin-bottom:0.3rem;">密码</label>
          <input type="password" id="password" class="input" style="margin-bottom:1.25rem;" placeholder="至少8位" minlength="8" required>
          <button type="submit" class="btn btn-primary" style="width:100%;">注册</button>
        </form>
        <p style="text-align:center; font-size:0.85rem; color:var(--muted); margin-top:1rem;">已有账号？<a href="/login" style="color:var(--pink-deep);">去登录</a></p>
      </div>
    </section>
  `, /* scripts */`
    <script>
    async function doRegister(e){
      e.preventDefault();
      const box=document.getElementById('error-box');box.style.display='none';
      try{
        const res=await fetch('/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value,nickname:document.getElementById('nickname').value,password:document.getElementById('password').value})});
        if(!res.ok){const d=await res.json();throw new Error(d.detail||'注册失败');}
        const lr=await fetch('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value,password:document.getElementById('password').value})});
        const data=await lr.json();
        localStorage.setItem('access_token',data.access_token);
        localStorage.setItem('refresh_token',data.refresh_token);
        window.location.href='/console';
      }catch(e){box.textContent=e.message;box.style.display='block';}
    }
    </script>
  `),
};

// 需要代理到 VPS 后端的路径前缀
const API_ROUTES = ['/api/', '/auth/', '/keys/', '/v1/', '/charge/', '/admin/', '/info', '/health', '/users/', '/t2a_v2'];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 代理 API/认证/管理/充值回调 请求到 VPS 后端
    const shouldProxy = API_ROUTES.some(r => {
      if (path === r || path === r.replace(/\/$/, '')) return true;
      if (path.startsWith(r)) return true;
      return false;
    });

    if (shouldProxy) {
      const backendUrl = env.BACKEND_URL + path + url.search;
      const proxyRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      return fetch(proxyRequest);
    }

    // 静态页面
    const page = pages[path];
    if (page) {
      return new Response(page, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // 404 → 首页
    return new Response(pages['/'] || 'Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
