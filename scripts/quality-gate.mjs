import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const fail=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const must=(ok,msg)=>{if(!ok)fail.push(msg)};
const htmlFiles=[];
function walk(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);const full=path.join(root,p);const st=fs.statSync(full);if(st.isDirectory())walk(p);else if(name.endsWith('.html'))htmlFiles.push(p)}}
walk('resources');

const box={window:{}};vm.runInNewContext(read('data.js'),box);const D=box.window.CHITRAMITRA;
const langs=Object.keys(D.languages),formats=Object.keys(D.formats);
must(langs.length===6,'Language matrix must contain exactly 6 languages');
must(D.topics.length===20,'Topic matrix must contain exactly 20 topics');
must(formats.length===5,'Format matrix must contain exactly 5 formats');
must(htmlFiles.length===601,'Generated HTML count must be 601 including resources/index.html');

const index=read('index.html'),app=read('app.js'),styles=read('styles.css'),resourceCss=read('resource.css');
must(index.includes('id="language"')&&index.includes('id="age"')&&index.includes('id="search"'),'Primary controls missing');
must(index.includes('id="searchBtn"'),'Search button missing');
must(index.includes('id="menu"'),'Mobile menu button missing');
must((index.match(/<button\b/g)||[]).length>=7,'Expected resource filter/search/menu buttons missing');
must(app.includes('searchBtn')&&app.includes('filters button')&&app.includes('topicList'),'Interactive resource controls not wired');
must(app.includes("menu.onclick")&&app.includes('nav.classList.toggle'),'Mobile menu is not wired');
must(app.includes('topicFilter')&&app.includes('data-topic'),'Topic filtering is not wired');
must(styles.includes('.topbar nav.open'),'Mobile menu open state styling missing');
must(resourceCss.includes('@page{size:A4'),'A4 print CSS missing');
must(!/WorthGo/i.test(index+app+styles+read('data.js')),'Legacy WorthGo branding leaked into primary UI');
must(!/lorem ipsum|coming soon|TODO|FIXME/i.test(index+app+styles),'Placeholder content remains in primary UI');

for(const l of langs)for(const [t,n] of D.topics)for(const f of formats){
  const p=`resources/${l}/${t}/${f}.html`;
  must(fs.existsSync(path.join(root,p)),`Missing resource: ${p}`);
  if(fs.existsSync(path.join(root,p))){
    const x=read(p);
    must(x.includes(`<html lang="${l}">`),`Wrong language markup: ${p}`);
    must(x.includes('window.print()'),`Print action missing: ${p}`);
    must(x.includes('aria-label="Printable learning resource"'),`Printable region missing: ${p}`);
    must(!x.includes('children ages 3–8'),`Stale age copy: ${p}`);
  }
}

const sitemap=read('sitemap.xml');
must((sitemap.match(/<url>/g)||[]).length===601,'Sitemap must contain exactly 601 URLs');
must(sitemap.includes('https://chitramitra.pages.dev/'),'Sitemap base URL mismatch');

if(fail.length){console.error(`QUALITY GATE FAILED (${fail.length}):`);for(const x of fail.slice(0,80))console.error(`- ${x}`);process.exit(1)}
console.log(`Quality gate passed: ${htmlFiles.length} HTML files, 6 languages, 20 topics, 5 formats, interactive controls and print-ready resources validated.`);
