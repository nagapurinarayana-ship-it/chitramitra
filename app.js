(function(){
const D=window.CHITRAMITRA;
const grid=document.getElementById("topicList"),lang=document.getElementById("language"),age=document.getElementById("age"),search=document.getElementById("search"),count=document.getElementById("count");
function render(){
 const q=search.value.trim().toLowerCase(),l=lang.value,a=age.value;
 const rows=D.topics.filter(function(x,ti){
  const id=x[0],n=x[1], ageFor=D.ages[ti%D.ages.length]||"3-4";
  if(a!=="all"&&ageFor!==a)return false;
  return !q||[id,n.en,n.te,n.hi,n.ta,n.kn,n.ml].join(" ").toLowerCase().includes(q);
 });
 count.textContent=rows.length+" learning topics";
 grid.innerHTML=rows.map(function(x,ti){
  const id=x[0],name=x[1][l],ageFor=D.ages[D.topics.findIndex(y=>y[0]===id)%D.ages.length]||"3-4";
  const icons={alphabet:"🔤",numbers:"🔢",shapes:"🔷",colours:"🎨",patterns:"🧩",animals:"🐘",birds:"🐦",fruits:"🍎",vegetables:"🥕","body-parts":"🙂",family:"👨‍👩‍👧",food:"🍚",vehicles:"🚌",school:"🎒","community-helpers":"🧑‍🚒",nature:"🌿",festivals:"🪔",india:"🇮🇳",plants:"🌱","farm-agriculture":"🌾"};
  return '<a class="home-topic-card" href="learn/'+l+'/'+id+'/"><span class="topic-icon">'+(icons[id]||"✨")+'</span><span class="topic-name">'+name+'</span><span class="topic-meta">'+ageFor+' · Individual activities</span><span class="topic-cta">Explore →</span></a>';
 }).join("")||"<p>No topic matches that search.</p>";
}
[lang,age,search].forEach(function(x){x.addEventListener("input",render);x.addEventListener("change",render)});const searchBtn=document.getElementById("searchBtn");if(searchBtn)searchBtn.addEventListener("click",render);
const menu=document.getElementById("menu"),nav=document.querySelector(".topbar nav");
if(menu&&nav){menu.setAttribute("aria-expanded","false");menu.onclick=function(){const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open))};nav.addEventListener("click",function(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false")})}
render();
})();