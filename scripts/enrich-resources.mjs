import fs from 'node:fs';
import path from 'node:path';
import { contentFor } from './content-model.mjs';

const ROOT='resources';
const TOPICS=['numbers','shapes','colours','patterns','animals','birds','fruits','vegetables','body-parts','family','food','vehicles','school','community-helpers','nature','india','plants','farm-agriculture'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function topicFromFile(file){return file.split(path.sep)[2]}
function languageFromFile(file){return file.split(path.sep)[1]}

function svgFor(topic,words){
  const labels=words.slice(0,3).map(esc);
  const common='<g fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">';
  const end='</g>';
  let body=common+'<rect x="55" y="45" width="590" height="145" rx="24"/>'+end;
  if(['numbers','colours'].includes(topic)) body=common+'<circle cx="130" cy="115" r="58"/><circle cx="350" cy="115" r="58"/><circle cx="570" cy="115" r="58"/>'+end;
  if(topic==='shapes') body=common+'<circle cx="130" cy="115" r="58"/><rect x="292" y="57" width="116" height="116"/><path d="M510 173 L570 57 L630 173 Z"/>'+end;
  if(topic==='patterns') body=common+'<circle cx="95" cy="115" r="42"/><path d="M170 155 L215 75 L260 155 Z"/><circle cx="335" cy="115" r="42"/><path d="M410 155 L455 75 L500 155 Z"/><circle cx="575" cy="115" r="42"/>'+end;
  if(['animals','birds'].includes(topic)) body=common+'<circle cx="130" cy="115" r="58"/><circle cx="350" cy="115" r="58"/><circle cx="570" cy="115" r="58"/><path d="M90 75 L75 45 M170 75 L185 45 M310 100 Q350 65 390 100 M530 100 Q570 65 610 100"/>'+end;
  if(['fruits','vegetables','plants'].includes(topic)) body=common+'<path d="M130 65 Q75 115 130 175 Q185 115 130 65 Z"/><path d="M350 65 Q295 115 350 175 Q405 115 350 65 Z"/><path d="M570 65 Q515 115 570 175 Q625 115 570 65 Z"/>'+end;
  if(topic==='body-parts') body=common+'<circle cx="130" cy="75" r="38"/><path d="M130 115 L130 175 M90 140 L170 140"/><path d="M350 65 Q305 100 335 160 Q350 180 365 160 Q395 100 350 65 Z"/><path d="M570 55 L545 175 L595 175 Z"/>'+end;
  if(topic==='family') body=common+'<circle cx="130" cy="70" r="30"/><path d="M85 180 Q130 105 175 180"/><circle cx="350" cy="60" r="42"/><path d="M290 190 Q350 100 410 190"/><circle cx="570" cy="75" r="28"/><path d="M530 180 Q570 115 610 180"/>'+end;
  if(topic==='vehicles') body=common+'<rect x="55" y="90" width="170" height="65" rx="12"/><circle cx="100" cy="170" r="20"/><circle cx="180" cy="170" r="20"/><rect x="285" y="80" width="175" height="75" rx="8"/><circle cx="330" cy="170" r="20"/><circle cx="420" cy="170" r="20"/><path d="M520 90 L625 90 L625 155 L520 155 Z"/><circle cx="545" cy="170" r="18"/><circle cx="600" cy="170" r="18"/>'+end;
  if(topic==='school') body=common+'<path d="M55 95 L170 40 L285 95 L170 145 Z"/><path d="M85 105 L85 185 L255 185 L255 105"/><path d="M145 185 L145 135 L195 135 L195 185"/><rect x="355" y="65" width="270" height="120"/><path d="M355 125 L625 125 M490 65 L490 185"/>'+end;
  if(topic==='community-helpers') body=common+'<circle cx="130" cy="75" r="34"/><path d="M80 190 Q130 110 180 190"/><path d="M100 145 L160 145 M130 115 L130 175"/><circle cx="350" cy="75" r="34"/><path d="M300 190 Q350 110 400 190"/><path d="M320 150 L380 150"/><path d="M570 45 L570 190 M520 85 L620 85 M535 125 L605 125"/>'+end;
  if(topic==='nature') body=common+'<circle cx="105" cy="75" r="42"/><path d="M55 175 Q105 120 155 175"/><path d="M300 185 L350 65 L400 185 Z"/><path d="M500 100 Q540 55 580 100 Q620 55 660 100 L660 145 L500 145 Z"/>'+end;
  if(topic==='india') body=common+'<path d="M125 40 L175 75 L160 155 L120 195 L85 145 L100 75 Z"/><rect x="300" y="60" width="100" height="125"/><path d="M300 102 L400 102 M300 143 L400 143"/><circle cx="350" cy="123" r="13"/><path d="M570 185 L570 55 M515 105 Q570 55 625 105 Q570 140 515 105 Z"/>'+end;
  if(topic==='farm-agriculture') body=common+'<rect x="55" y="95" width="155" height="65" rx="10"/><circle cx="100" cy="178" r="23"/><circle cx="175" cy="178" r="17"/><path d="M80 95 L115 60 L175 60 L205 95"/><path d="M310 185 L310 65 M350 185 L350 65 M390 185 L390 65 M430 185 L430 65"/><path d="M520 185 Q570 70 620 185 M520 145 Q570 105 620 145"/>'+end;
  return '<svg viewBox="0 0 700 235" role="img" aria-label="'+esc(topic)+' printable outline illustration">'+body+'<g fill="currentColor" font-family="system-ui,sans-serif" font-size="23" text-anchor="middle"><text x="130" y="220">'+(labels[0]||'')+'</text><text x="350" y="220">'+(labels[1]||'')+'</text><text x="570" y="220">'+(labels[2]||'')+'</text></g></svg>';
}

const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
walk(ROOT);
let enhanced=0;
for(const file of files){
  if(path.basename(file)!=='colouring.html') continue;
  const topic=topicFromFile(file);
  if(!TOPICS.includes(topic)) continue;
  const language=languageFromFile(file);
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('data-enhanced-art="'+topic+'"')) continue;
  const opening='<div class="colouring" data-content-key="'+language+'-'+topic+'-colouring">';
  if(!html.includes(opening)) throw new Error('Missing colouring print region: '+file);
  const words=contentFor(topic,language).examples.slice(0,3);
  const art='<div class="enhanced-art" data-enhanced-art="'+topic+'">'+svgFor(topic,words)+'</div>';
  const replacement=opening.replace('class="colouring"','class="colouring has-enhanced-art"')+art;
  html=html.replace(opening,replacement);
  fs.writeFileSync(file,html);
  enhanced++;
}
const expected=6*TOPICS.length;
if(enhanced!==expected) throw new Error('Expected '+expected+' colouring illustrations, embedded '+enhanced+'.');
console.log('Embedded '+enhanced+' topic-specific outline illustrations inside A4 colouring sheets.');
