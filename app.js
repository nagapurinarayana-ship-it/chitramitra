(function(){
'use strict';
const D=window.CHITRAMITRA;
const grid=document.getElementById('topicList');
const lang=document.getElementById('language');
const search=document.getElementById('search');
const count=document.getElementById('count');
const summary=document.getElementById('searchSummary');
const DEFAULT_FORMATS={alphabet:'colouring',numbers:'worksheet',shapes:'colouring',colours:'colouring',patterns:'worksheet',animals:'colouring',birds:'colouring',fruits:'colouring',vegetables:'colouring','body-parts':'chart',family:'colouring',food:'colouring',vehicles:'colouring',school:'worksheet','community-helpers':'chart',nature:'colouring',festivals:'colouring',india:'chart',plants:'chart','farm-agriculture':'worksheet'};
const ICONS={alphabet:'🔤',numbers:'🔢',shapes:'△',colours:'🎨',patterns:'◐',animals:'🐘',birds:'🐦',fruits:'🥭',vegetables:'🥕','body-parts':'🙂',family:'♡',food:'🍚',vehicles:'🚌',school:'✏','community-helpers':'✚',nature:'🌿',festivals:'🪔',india:'🇮🇳',plants:'🌱','farm-agriculture':'🌾'};
const TOPIC_TERMS={
 alphabet:['letter','letters','alphabet','alphabets','a z','a to z','abc','a b c','varnamala','aksharamala','aksharalu','అక్షరమాల','అక్షరాలు','అచ్చులు','హల్లులు','వర్ణమాల','वर्णमाला','अक्षरमाला','स्वर','व्यंजन','எழுத்துக்கள்','எழுத்துகள்','அகரவரிசை','உயிரெழுத்துகள்','மெய்யெழுத்துகள்','ಅಕ್ಷರಮಾಲೆ','ಅಕ್ಷರಗಳು','ಸ್ವರಗಳು','ವ್ಯಂಜನಗಳು','അക്ഷരമാല','സ്വരങ്ങൾ','വ്യഞ്ജനങ്ങൾ'],
 numbers:['number','numbers','count','counting','math','maths','numerals','సంఖ్యలు','లెక్కలు','गिनती','संख्या','अंक','எண்கள்','எண்ணிக்கை','ಸಂಖ್ಯೆಗಳು','ಎಣಿಕೆ','സംഖ്യകൾ','എണ്ണൽ'],
 shapes:['shape','shapes','circle','square','triangle','rectangle','ఆకారాలు','आकार','வடிவங்கள்','ಆಕಾರಗಳು','ആകൃതികൾ'],
 colours:['colour','colours','color','colors','రంగులు','रंग','வண்ணங்கள்','ಬಣ್ಣಗಳು','നിറങ്ങൾ'],
 patterns:['pattern','patterns','sequence','sequences','నమూనాలు','पैटर्न','வடிவமைப்புகள்','ಮಾದರಿಗಳು','പാറ്റേണുകൾ'],
 animals:['animal','animals','pet','wildlife','జంతువులు','जानवर','விலங்குகள்','ಪ್ರಾಣಿಗಳು','മൃഗങ്ങൾ'],
 birds:['bird','birds','పక్షులు','पक्षी','பறவைகள்','ಪಕ್ಷಿಗಳು','പക്ഷികൾ'],
 fruits:['fruit','fruits','mango','apple','banana','పండ్లు','फल','பழங்கள்','ಹಣ್ಣುಗಳು','പഴങ്ങൾ'],
 vegetables:['vegetable','vegetables','veggie','కూరగాయలు','सब्जियां','सब्ज़ियाँ','காய்கறிகள்','ತರಕಾರಿಗಳು','പച്ചക്കറികൾ'],
 'body-parts':['body','body parts','human body','శరీర భాగాలు','शरीर के अंग','உடல் உறுப்புகள்','ದೇಹದ ಅಂಗಗಳು','ശരീരഭാഗങ്ങൾ'],
 family:['family','relations','mother','father','కుటుంబం','परिवार','குடும்பம்','ಕುಟುಂಬ','കുടുംബം'],
 food:['food','meals','rice','పాలు','ఆహారం','भोजन','உணவு','ಆಹಾರ','ഭക്ഷണം'],
 vehicles:['vehicle','vehicles','transport','వాహనాలు','वाहन','வாகனங்கள்','ವಾಹನಗಳು','വാഹനങ്ങൾ'],
 school:['school','school things','stationery','పాఠశాల','स्कूल','பள்ளி','ಶಾಲೆ','സ്കൂൾ'],
 'community-helpers':['community helpers','helper','doctor','teacher','firefighter','సమాజ సహాయకులు','समुदाय सहायक','சமூக உதவியாளர்கள்','ಸಮುದಾಯ ಸಹಾಯಕರು','സമൂഹ സഹായികൾ'],
 nature:['nature','weather','sun','tree','ప్రకృతి','प्रकृति','இயற்கை','ಪ್ರಕೃತಿ','പ്രകൃതി'],
 festivals:['festival','festivals','indian festivals','diwali','deepavali','sankranti','pongal','ugadi','dussehra','navratri','holi','onam','పండుగలు','त्योहार','திருவிழாக்கள்','ಹಬ್ಬಗಳು','ഉത്സവങ്ങൾ','தீபாவளி','రంగవల్లి','முகப்பு கோலம்'],
 india:['india','indian','national','map of india','భారతదేశం','भारत','இந்தியா','ಭಾರತ','ഇന്ത്യ'],
 plants:['plant','plants','seed','leaf','మొక్కలు','पौधे','தாவரங்கள்','ಸಸ್ಯಗಳು','ചെടികൾ'],
 'farm-agriculture':['farm','farms','farming','agriculture','farmer','tractor','వ్యవసాయం','कृषि','விவசாயம்','ಕೃಷಿ','കൃഷി']
};
const FORMAT_TERMS={
 chart:['chart','charts','poster','reference chart','చార్ట్','పట్టిక','चार्ट','விளக்கப்படம்','ಚಾರ್ಟ್','ചാർട്ട്'],
 worksheet:['worksheet','work sheet','worksheets','practice sheet','practice worksheet','workbook','పనిపత్రం','వర్క్‌షీట్','वर्कशीट','பணித்தாள்','ಅಭ್ಯಾಸ ಪತ್ರಿಕೆ','പരിശീലന പത്രം'],
 colouring:['colouring','coloring','coloured','colored','colured','colouring page','coloring page','రంగులు వేయడం','రంగులు వేసే','रंग भरना','வண்ணம் தீட்டுதல்','ಬಣ್ಣ ಹಚ್ಚುವುದು','നിറം കൊടുക്കൽ'],
 tracing:['tracing','trace','handwriting','writing practice','writing sheet','write letters','ట్రేసింగ్','రాయడం','लिखावट','लेखन अभ्यास','எழுத்துப் பயிற்சி','ಬರೆಯುವ ಅಭ್ಯಾಸ','കൈയെഴുത്ത്'],
 flashcard:['flashcard','flashcards','flash card','flash cards','ఫ్లాష్‌కార్డ్','फ्लैशकार्ड','ஃப்ளாஷ்கார்டு','ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್','ഫ്ലാഷ്‌കാർഡ്']
};
const LANGUAGE_TERMS={en:['english'],te:['telugu','తెలుగు','aksharamala','aksharalu'],hi:['hindi','हिंदी','हिन्दी','varnamala','देवनागरी'],ta:['tamil','தமிழ்'],kn:['kannada','ಕನ್ನಡ','aksharamale'],ml:['malayalam','മലയാളം']};
const SCRIPT_LANGUAGES=[['te',3072,3199],['hi',2304,2431],['ta',2944,3071],['kn',3200,3327],['ml',3328,3455]];
const NOISE=['print','printable','printables','download','pdf','a4','free','for','kids','kid','children','child','in','the','and','please','sheet','page','pages','to','with','be','s'];
const normalize=value=>String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const allTerms=Object.values(FORMAT_TERMS).flat().concat(Object.values(LANGUAGE_TERMS).flat(),NOISE);
function termInQuery(query,term){const q=' '+normalize(query)+' ',t=' '+normalize(term)+' ';return !!normalize(term)&&q.includes(t)}
function detectFormat(query){for(const format of Object.keys(FORMAT_TERMS)){if(FORMAT_TERMS[format].some(term=>termInQuery(query,term)))return format;for(const l of Object.keys(D.languages)){if(termInQuery(query,D.formats[format].label[l]))return format}}return null}
function detectLanguage(query){for(const l of Object.keys(LANGUAGE_TERMS)){if(LANGUAGE_TERMS[l].some(term=>termInQuery(query,term)))return l}for(const l of Object.keys(D.languages)){if(termInQuery(query,D.languages[l].native)||termInQuery(query,D.languages[l].name))return l}for(const character of query){const point=character.codePointAt(0);for(const [language,start,end] of SCRIPT_LANGUAGES)if(point>=start&&point<=end)return language}return null}
function cleanQuery(query){let out=' '+normalize(query)+' ';const terms=allTerms.concat(Object.values(D.formats).flatMap(x=>Object.values(x.label)));terms.sort((a,b)=>normalize(b).length-normalize(a).length);for(const term of terms){const n=normalize(term);if(n)out=out.split(' '+n+' ').join(' ')}return out.trim()}
function matchesTopic(topic,q){if(!q)return true;const id=topic[0],names=Object.values(topic[1]);const corpus=normalize([id,...names,...(TOPIC_TERMS[id]||[])].join(' '));if(corpus.includes(q))return true;if(id==='alphabet'&&/^(a b c|a b c s|abc|abcs|a z|a to z)$/.test(q))return true;const qTokens=q.split(' ').filter(Boolean);return qTokens.length>0&&qTokens.every(token=>corpus.split(' ').includes(token))}
function formatName(format,language){return D.formats[format]?.label?.[language]||D.formats[format]?.en||format}
function card(topic,language,format){
 const id=topic[0],name=topic[1][language]||topic[1].en,fmt=format||DEFAULT_FORMATS[id]||'worksheet';
 const pdf='/resources/'+language+'/'+id+'/'+fmt+'.pdf';
 const preview='/resources/'+language+'/'+id+'/'+fmt+'.html';
 const collection='/resources/'+language+'/'+id+'/';
 const icon=ICONS[id]||'✎';
 return '<article class="home-topic-card" data-topic="'+id+'"><div class="topic-card-top"><span class="topic-icon" aria-hidden="true">'+icon+'</span><span class="topic-format">'+formatName(fmt,language)+'</span></div><h3 class="topic-name">'+name+'</h3><p class="topic-meta">A4 PDF · Free</p><div class="topic-actions"><a class="direct-download" href="'+pdf+'" download="'+id+'-'+fmt+'-a4.pdf">↓ Download A4 PDF</a><div class="topic-secondary"><a class="preview-link" href="'+preview+'">Preview</a><a class="all-formats" href="'+collection+'">All printables</a></div></div></article>';
}
function render(){
 const raw=search.value.trim(),format=detectFormat(raw),inferred=detectLanguage(raw);
 const language=inferred||lang.value||'en',q=cleanQuery(raw);
 if(inferred)lang.value=inferred;
 const rows=D.topics.filter(topic=>matchesTopic(topic,q));
 count.textContent=rows.length+' printable topics';
 summary.hidden=!raw;
 summary.textContent=raw?(rows.length?'Showing '+(format?formatName(format,language)+' PDFs':'printable resources')+' for “'+raw+'”':'No exact matches for “'+raw+'”'):'';
 grid.innerHTML=rows.map(topic=>card(topic,language,format)).join('');
 if(!rows.length)grid.innerHTML='<div class="empty-results"><span aria-hidden="true">⌕</span><h3>No matching printables yet</h3><p>Try a different word, search in another language, or choose one of the popular searches above.</p><button type="button" id="clearSearch">Clear search</button></div>';
}
const form=document.getElementById('searchForm');
form.addEventListener('submit',event=>{event.preventDefault();render();document.getElementById('printables').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})});
search.addEventListener('input',render);
lang.addEventListener('change',render);
document.querySelectorAll('[data-quick-search]').forEach(button=>button.addEventListener('click',()=>{search.value=button.dataset.quickSearch;render();document.getElementById('printables').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}));
grid.addEventListener('click',event=>{if(event.target.closest('#clearSearch')){search.value='';render();search.focus()}});
const menu=document.getElementById('menu'),nav=document.querySelector('.topbar nav');
if(menu&&nav){menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};nav.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')})}
const params=new URLSearchParams(location.search);if(params.has('q'))search.value=params.get('q')||'';
render();
})();