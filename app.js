(function(){
const D=window.CHITRAMITRA;
const grid=document.getElementById('grid'),lang=document.getElementById('language'),age=document.getElementById('age'),search=document.getElementById('search'),count=document.getElementById('count');
let fmt='all',topicFilter='';
function cards(){
  const q=search.value.trim().toLowerCase(),l=lang.value,a=age.value;
  let rows=[];
  D.topics.forEach(([id,n],ti)=>Object.keys(D.formats).forEach((f,fi)=>{
    const resourceAge=D.ages[(ti+fi)%D.ages.length];
    if(a!=='all'&&resourceAge!==a)return;
    if(fmt!=='all'&&f!==fmt)return;
    if(topicFilter&&id!==topicFilter)return;
    if(q&&!([id,n.en,n.te,n.hi,n.ta,n.kn,n.ml,D.formats[f].en,D.formats[f].label[l]].join(' ').toLowerCase().includes(q)))return;
    rows.push({id,n,f,age:resourceAge});
  }));
  count.textContent=`${rows.length} resources`;
  grid.innerHTML=rows.slice(0,80).map(x=>{
    const title=x.n[l]+' — '+D.formats[x.f].label[l];
    const url=`resources/${l}/${x.id}/${x.f}.html`;
    return `<article class="resource-card"><span class="tag">${D.formats[x.f].label[l]}</span><h3>${title}</h3><p>Printable ${D.formats[x.f].en.toLowerCase()} for children, available in English and Indian languages.</p><div class="meta"><span>${D.languages[l].native}</span><span>${x.age}</span></div><a href="${url}">Preview & print →</a></article>`;
  }).join('')||'<p>No resources match those choices yet.</p>';
}
function renderTopics(){
  const tl=document.getElementById('topicList');
  tl.innerHTML=D.topics.map(([id,n])=>`<a href="#resources" data-topic="${id}">${n[lang.value]}</a>`).join('');
  tl.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{
    e.preventDefault(); topicFilter=a.dataset.topic; search.value=''; cards(); document.getElementById('resources').scrollIntoView({behavior:'smooth'});
  }));
}
document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');fmt=b.dataset.format;cards()});
[lang,age,search].forEach(x=>x.addEventListener('input',()=>{if(x===search)topicFilter='';cards()}));
document.getElementById('searchBtn').onclick=()=>{
  topicFilter='';
  age.value='all';
  document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));
  const allFormat=document.querySelector('button[data-format="all"]');
  if(allFormat)allFormat.classList.add('active');
  fmt='all';
  document.getElementById('resources').scrollIntoView({behavior:'smooth'});
  cards();
};
lang.addEventListener('change',renderTopics);
const menu=document.getElementById('menu'),nav=document.querySelector('.topbar nav');
if(menu&&nav){menu.setAttribute('aria-expanded','false');menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')};nav.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu')})}
renderTopics();cards();
})();