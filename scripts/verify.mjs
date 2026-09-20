import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { contentFor } from './content-model.mjs';

const root=process.cwd();
const requiredAssets=['styles.css','learn.css','resource.css','app.js','data.js','health.txt'];
for(const asset of requiredAssets) if(!fs.existsSync(path.join(root,asset))) throw new Error(`Missing production asset: ${asset}`);

const source=fs.readFileSync(path.join(root,'data.js'),'utf8');
const box={window:{}};
vm.runInNewContext(source,box);
const D=box.window.CHITRAMITRA;
const langs=Object.keys(D.languages),topics=D.topics,formats=Object.keys(D.formats);

if(langs.length!==6||topics.length!==20||formats.length!==5) throw new Error(`Frozen matrix mismatch: ${langs.length}x${topics.length}x${formats.length}`);
if(!D.languages.en||D.languages.en.native!=='English') throw new Error('English language definition missing');
for(const [id,n] of topics){
  if(!n.en) throw new Error(`English topic missing: ${id}`);
  const c=contentFor(id);
  if(id==='alphabet'&&!c.groups) throw new Error('Alphabet source must contain native character groups');
  if(id!=='alphabet'&&c.examples.length<12) throw new Error(`Topic ${id} needs at least 12 learning items`);
}
for(const f of formats) if(!D.formats[f].label.en) throw new Error(`English format label missing: ${f}`);
if(!D.ui.en) throw new Error('English UI strings missing');

const missing=[];
const badVisual=[];
for(const l of langs) for(const [t] of topics) for(const f of formats){
  const p=path.join(root,'resources',l,t,`${f}.html`);
  if(!fs.existsSync(p)){missing.push(p);continue}
  const x=fs.readFileSync(p,'utf8');
  for(const needle of ['<title>','canonical','application/ld+json','window.print']) if(!x.includes(needle)) throw new Error(`${p} missing ${needle}`);
  if(x.includes('children ages 3–8')) throw new Error(`${p} has stale age range`);
  if(t==='festivals'&&f==='colouring'){if(!x.includes('festival-colouring')) badVisual.push(l+'/'+t+'/'+f)}
  else if(t==='alphabet'){if(!x.includes('alphabet-pack')) badVisual.push(l+'/'+t+'/'+f)}
  else if(!x.includes(`data-content-key="${l}-${t}-${f}"`)) badVisual.push(l+'/'+t+'/'+f);
}
if(missing.length) throw new Error(`Missing ${missing.length} resources`);
if(badVisual.length) throw new Error(`Topic content mismatch in ${badVisual.length} resources; first: ${badVisual.slice(0,5).join(', ')}`);

const learnRoot=path.join(root,'learn');
if(!fs.existsSync(learnRoot)) throw new Error('Individual learning pages directory missing');
let topicPages=0,itemPages=0;
for(const l of langs) for(const [t] of topics){
  const dir=path.join(learnRoot,l,t);
  if(!fs.existsSync(path.join(dir,'index.html'))) throw new Error(`Missing individual learning topic page: ${dir}/index.html`);
  topicPages++;
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(!e.isDirectory()) continue;
    const p=path.join(dir,e.name,'index.html');
    if(!fs.existsSync(p)) throw new Error(`Missing individual learning item page: ${p}`);
    itemPages++;
  }
}
if(topicPages!==120||itemPages<1) throw new Error(`Learning coverage mismatch: ${topicPages} topic pages, ${itemPages} item pages`);

const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const sitemapCount=(sitemap.match(/<url>/g)||[]).length;
if(sitemapCount<721) throw new Error(`Expected expanded sitemap with learning URLs, got ${sitemapCount}`);
if(!sitemap.includes('https://chitramitra.pages.dev/')) throw new Error('Sitemap base URL mismatch');
if(!fs.readFileSync(path.join(root,'resource.css'),'utf8').includes('@page{size:A4')) throw new Error('A4 print CSS missing');

console.log(`Verification passed: frozen 600-resource matrix + ${topicPages} learning topic pages + ${itemPages} individual item pages + production assets.`);
