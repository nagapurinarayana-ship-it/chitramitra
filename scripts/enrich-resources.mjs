import fs from 'node:fs';
import path from 'node:path';

const ROOT='resources';
const TOPICS=['alphabet','numbers','shapes','colours','patterns','animals','birds','fruits','vegetables','body-parts','family','food','vehicles','school','community-helpers','nature','festivals','india','plants','farm-agriculture'];

const COPY={
  en:{title:'Practice pack',find:'Find & circle',match:'Match & sort',trace:'Trace & say',create:'Draw & create',challenge:'Quick challenge',tip:'Adult tip: ask the child to say the examples aloud before writing.',traceText:'Trace one example and say its name.',createText:'Draw one more example from this category.',challengeText:'Choose the best example and explain why.'},
  te:{title:'అభ్యాస ప్యాక్',find:'గుర్తించి వృత్తం పెట్టండి',match:'జత చేసి క్రమబద్ధీకరించండి',trace:'ట్రేస్ చేసి చెప్పండి',create:'గీయండి మరియు సృష్టించండి',challenge:'చిన్న సవాలు',tip:'పెద్దల సూచన: రాయించే ముందు ఉదాహరణల పేర్లు పిల్లతో చెప్పించండి.',traceText:'ఒక ఉదాహరణను ట్రేస్ చేసి దాని పేరు చెప్పండి.',createText:'ఈ విభాగానికి చెందిన మరో ఉదాహరణను గీయండి.',challengeText:'సరైన ఉదాహరణను ఎంచుకుని ఎందుకు ఎంచుకున్నారో చెప్పండి.'},
  hi:{title:'अभ्यास पैक',find:'ढूँढें और गोला लगाएँ',match:'मिलाएँ और क्रम दें',trace:'ट्रेस करें और बोलें',create:'चित्र बनाएँ',challenge:'छोटी चुनौती',tip:'बड़ों के लिए: लिखने से पहले बच्चे से उदाहरणों के नाम बोलने को कहें।',traceText:'एक उदाहरण को ट्रेस करें और उसका नाम बोलें।',createText:'इस विषय का एक और उदाहरण बनाएँ।',challengeText:'सही उदाहरण चुनें और बताएं कि आपने उसे क्यों चुना।'},
  ta:{title:'பயிற்சி தொகுப்பு',find:'கண்டுபிடித்து வட்டமிடுங்கள்',match:'பொருத்தி வரிசைப்படுத்துங்கள்',trace:'தடமிட்டு சொல்லுங்கள்',create:'வரைந்து உருவாக்குங்கள்',challenge:'சிறு சவால்',tip:'பெரியவர்களுக்கான குறிப்பு: எழுதுவதற்கு முன் குழந்தை உதாரணங்களின் பெயர்களை சொல்லட்டும்.',traceText:'ஒரு உதாரணத்தை தடமிட்டு அதன் பெயரை சொல்லுங்கள்.',createText:'இந்த தலைப்பில் இன்னொரு உதாரணத்தை வரையுங்கள்.',challengeText:'சரியான உதாரணத்தை தேர்ந்தெடுத்து ஏன் என்பதை சொல்லுங்கள்.'},
  kn:{title:'ಅಭ್ಯಾಸ ಪ್ಯಾಕ್',find:'ಹುಡುಕಿ ವೃತ್ತ ಹಾಕಿ',match:'ಹೊಂದಿಸಿ ವಿಂಗಡಿಸಿ',trace:'ಟ್ರೇಸ್ ಮಾಡಿ ಹೇಳಿ',create:'ಬಿಡಿಸಿ ರಚಿಸಿ',challenge:'ಸಣ್ಣ ಸವಾಲು',tip:'ವಯಸ್ಕರ ಸಲಹೆ: ಬರೆಯುವ ಮೊದಲು ಮಗುವಿಗೆ ಉದಾಹರಣೆಗಳ ಹೆಸರುಗಳನ್ನು ಹೇಳಲು ಹೇಳಿ.',traceText:'ಒಂದು ಉದಾಹರಣೆಯನ್ನು ಟ್ರೇಸ್ ಮಾಡಿ ಅದರ ಹೆಸರನ್ನು ಹೇಳಿ.',createText:'ಈ ವಿಷಯಕ್ಕೆ ಸೇರಿದ ಇನ್ನೊಂದು ಉದಾಹರಣೆಯನ್ನು ಬಿಡಿಸಿ.',challengeText:'ಸರಿಯಾದ ಉದಾಹರಣೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಏಕೆ ಎಂದು ಹೇಳಿ.'},
  ml:{title:'പരിശീലന പാക്ക്',find:'കണ്ടെത്തി വട്ടമിടുക',match:'ചേർത്ത് ക്രമപ്പെടുത്തുക',trace:'ട്രേസ് ചെയ്ത് പറയുക',create:'വരച്ച് സൃഷ്ടിക്കുക',challenge:'ചെറിയ വെല്ലുവിളി',tip:'മുതിർന്നവർക്കുള്ള കുറിപ്പ്: എഴുതുന്നതിന് മുമ്പ് ഉദാഹരണങ്ങളുടെ പേരുകൾ കുട്ടിയോട് പറയാൻ പറയുക.',traceText:'ഒരു ഉദാഹരണം ട്രേസ് ചെയ്ത് അതിന്റെ പേര് പറയുക.',createText:'ഈ വിഷയത്തിൽപ്പെട്ട മറ്റൊരു ഉദാഹരണം വരയ്ക്കുക.',challengeText:'ശരിയായ ഉദാഹരണം തിരഞ്ഞെടുത്ത് എന്തുകൊണ്ടെന്ന് പറയുക.'}
};

const examplesFallback={alphabet:['A','B','C'],numbers:['1','2','3'],shapes:['Circle','Square','Triangle'],colours:['Red','Blue','Yellow'],patterns:['○ △ ○ △','□ ○ □ ○','★ ● ★ ●'],animals:['Cat','Dog','Elephant'],birds:['Bird','Parrot','Peacock'],fruits:['Apple','Banana','Mango'],vegetables:['Carrot','Tomato','Leafy greens'],'body-parts':['Eyes','Hands','Feet'],family:['Child','Mother','Father'],food:['Rice','Fruit','Milk'],vehicles:['Bus','Car','Train'],school:['Book','Pencil','School'],'community-helpers':['Doctor','Teacher','Police'],nature:['Sun','Tree','Cloud'],festivals:['Diya','Rangoli','Happy Diwali'],india:['India','Flag','Lotus'],plants:['Leaf','Flower','Tree'],'farm-agriculture':['Tractor','Wheat','Farmer']};

const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function topicFromFile(file){return file.split(path.sep)[2]}
function languageFromFile(file){return file.split(path.sep)[1]}

function svgFor(topic,words){
  const labels=words.slice(0,3).map(esc);
  const common='<g fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">';
  const end='</g>';
  let body=`${common}<rect x="55" y="45" width="590" height="145" rx="24"/>${end}`;
  if(['alphabet','numbers','colours'].includes(topic)) body=`${common}<circle cx="130" cy="115" r="58"/><circle cx="350" cy="115" r="58"/><circle cx="570" cy="115" r="58"/>${end}`;
  if(topic==='shapes') body=`${common}<circle cx="130" cy="115" r="58"/><rect x="292" y="57" width="116" height="116"/><path d="M510 173 L570 57 L630 173 Z"/>${end}`;
  if(topic==='patterns') body=`${common}<circle cx="95" cy="115" r="42"/><path d="M170 155 L215 75 L260 155 Z"/><circle cx="335" cy="115" r="42"/><path d="M410 155 L455 75 L500 155 Z"/><circle cx="575" cy="115" r="42"/>${end}`;
  if(['animals','birds'].includes(topic)) body=`${common}<circle cx="130" cy="115" r="58"/><circle cx="350" cy="115" r="58"/><circle cx="570" cy="115" r="58"/><path d="M90 75 L75 45 M170 75 L185 45 M310 100 Q350 65 390 100 M530 100 Q570 65 610 100"/>${end}`;
  if(['fruits','vegetables','plants'].includes(topic)) body=`${common}<path d="M130 65 Q75 115 130 175 Q185 115 130 65 Z"/><path d="M350 65 Q295 115 350 175 Q405 115 350 65 Z"/><path d="M570 65 Q515 115 570 175 Q625 115 570 65 Z"/>${end}`;
  if(topic==='body-parts') body=`${common}<circle cx="130" cy="75" r="38"/><path d="M130 115 L130 175 M90 140 L170 140"/><path d="M350 65 Q305 100 335 160 Q350 180 365 160 Q395 100 350 65 Z"/><path d="M570 55 L545 175 L595 175 Z"/>${end}`;
  if(topic==='family') body=`${common}<circle cx="130" cy="70" r="30"/><path d="M85 180 Q130 105 175 180"/><circle cx="350" cy="60" r="42"/><path d="M290 190 Q350 100 410 190"/><circle cx="570" cy="75" r="28"/><path d="M530 180 Q570 115 610 180"/>${end}`;
  if(topic==='vehicles') body=`${common}<rect x="55" y="90" width="170" height="65" rx="12"/><circle cx="100" cy="170" r="20"/><circle cx="180" cy="170" r="20"/><rect x="285" y="80" width="175" height="75" rx="8"/><circle cx="330" cy="170" r="20"/><circle cx="420" cy="170" r="20"/><path d="M520 90 L625 90 L625 155 L520 155 Z"/><circle cx="545" cy="170" r="18"/><circle cx="600" cy="170" r="18"/>${end}`;
  if(topic==='school') body=`${common}<path d="M55 95 L170 40 L285 95 L170 145 Z"/><path d="M85 105 L85 185 L255 185 L255 105"/><path d="M145 185 L145 135 L195 135 L195 185"/><rect x="355" y="65" width="270" height="120"/><path d="M355 125 L625 125 M490 65 L490 185"/>${end}`;
  if(topic==='community-helpers') body=`${common}<circle cx="130" cy="75" r="34"/><path d="M80 190 Q130 110 180 190"/><path d="M100 145 L160 145 M130 115 L130 175"/><circle cx="350" cy="75" r="34"/><path d="M300 190 Q350 110 400 190"/><path d="M320 150 L380 150"/><path d="M570 45 L570 190 M520 85 L620 85 M535 125 L605 125"/>${end}`;
  if(topic==='nature') body=`${common}<circle cx="105" cy="75" r="42"/><path d="M55 175 Q105 120 155 175"/><path d="M300 185 L350 65 L400 185 Z"/><path d="M500 100 Q540 55 580 100 Q620 55 660 100 L660 145 L500 145 Z"/>${end}`;
  if(topic==='india') body=`${common}<path d="M125 40 L175 75 L160 155 L120 195 L85 145 L100 75 Z"/><rect x="300" y="60" width="100" height="125"/><path d="M300 102 L400 102 M300 143 L400 143"/><circle cx="350" cy="123" r="13"/><path d="M570 185 L570 55 M515 105 Q570 55 625 105 Q570 140 515 105 Z"/>${end}`;
  if(topic==='farm-agriculture') body=`${common}<rect x="55" y="95" width="155" height="65" rx="10"/><circle cx="100" cy="178" r="23"/><circle cx="175" cy="178" r="17"/><path d="M80 95 L115 60 L175 60 L205 95"/><path d="M310 185 L310 65 M350 185 L350 65 M390 185 L390 65 M430 185 L430 65"/><path d="M520 185 Q570 70 620 185 M520 145 Q570 105 620 145"/>${end}`;
  return `<svg viewBox="0 0 700 235" role="img" aria-label="${esc(topic)} printable practice art">${body}<g fill="currentColor" font-family="system-ui,sans-serif" font-size="23" text-anchor="middle"><text x="130" y="220">${labels[0]||''}</text><text x="350" y="220">${labels[1]||''}</text><text x="570" y="220">${labels[2]||''}</text></g></svg>`;
}

const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
walk(ROOT);

for(const file of files){
  const topic=topicFromFile(file);
  if(!TOPICS.includes(topic)) continue;
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-enhanced-category')) continue;
  const lang=languageFromFile(file);
  const c=COPY[lang]||COPY.en;
  const examplesMatch=html.match(/<p class="examples"><strong>.*?<\/strong>\s*([^<]+)<\/p>/);
  const words=(examplesMatch?examplesMatch[1].split(' • ').map(x=>x.trim()).filter(Boolean):examplesFallback[topic]).slice(0,3);
  while(words.length<3) words.push(words[words.length-1]||'');
  const cards=[
    [c.find,`${words[0]}  •  ${words[1]}`],
    [c.match,`${words[0]}  ↔  ${words[1]}  ↔  ${words[2]}`],
    [c.trace,c.traceText],
    [c.create,c.createText],
    [c.challenge,c.challengeText]
  ];
  const panel=`<section class="enhanced-category" data-enhanced-category="${topic}"><h2>${esc(c.title)}</h2><div class="enhanced-art">${svgFor(topic,words)}</div><div class="enhanced-cards">${cards.map(([h,t],i)=>`<article><b>${i+1}. ${esc(h)}</b><span>${esc(t)}</span></article>`).join('')}</div><p class="enhanced-tip">${esc(c.tip)}</p><div class="drawbox" aria-label="printable drawing space"></div></section>`;
  html=html.replace('<section class="resource-info">',`${panel}<section class="resource-info">`);
  fs.writeFileSync(file,html);
}
console.log(`Enhanced ${files.length} generated resources with category-specific practice packs.`);
