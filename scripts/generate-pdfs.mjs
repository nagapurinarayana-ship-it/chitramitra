import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import vm from 'node:vm';
import { chromium } from 'playwright';

const ROOT=process.cwd();
const box={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(ROOT,'data.js'),'utf8'),box);
const D=box.window.CHITRAMITRA;
const languages=Object.keys(D.languages),topics=D.topics.map(([id])=>id),formats=Object.keys(D.formats);
const mime={'.html':'text/html; charset=utf-8','.pdf':'application/pdf','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};
const server=http.createServer((req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const file=path.resolve(ROOT,'.'+pathname);
    if(file!==ROOT&&!file.startsWith(ROOT+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
    const target=fs.existsSync(file)&&fs.statSync(file).isDirectory()?path.join(file,'index.html'):file;
    if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'content-type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(target).pipe(res);
  }catch{res.writeHead(400);res.end('Bad request');}
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
const address=server.address();
if(!address||typeof address==='string')throw new Error('Could not start local static server.');
const origin='http://127.0.0.1:'+address.port;
let browser;
let generated=0;
try{
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:794,height:1123},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',error=>{throw error;});
  for(const language of languages){
    for(const topic of topics){
      for(const format of formats){
        const relative='resources/'+language+'/'+topic+'/'+format+'.html';
        const input=path.join(ROOT,relative),output=path.join(ROOT,'resources',language,topic,format+'.pdf');
        if(!fs.existsSync(input))throw new Error('Missing source resource: '+relative);
        const response=await page.goto(origin+'/'+relative,{waitUntil:'load'});
        if(!response||!response.ok())throw new Error('Could not load resource: '+relative);
        await page.evaluate(()=>document.fonts?document.fonts.ready.then(()=>true):true);
        const sheet=page.locator('section.print-sheet[aria-label="Printable learning resource"]');
        if(await sheet.count()!==1)throw new Error('Printable sheet is missing or duplicated: '+relative);
        const contentBlocks=await sheet.locator('[data-content-key]').count();
        if(contentBlocks===0)throw new Error('Printable sheet has no identified resource content: '+relative);
        const visibleContent=await sheet.innerText();
        if(!visibleContent.trim())throw new Error('Printable sheet has no visible content: '+relative);
        const title=await page.title();
        if(!title||!title.includes('ChitraMitra'))throw new Error('Invalid resource title: '+relative);
        await page.emulateMedia({media:'print'});
        const bytes=Buffer.from(await page.pdf({format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,margin:{top:'0mm',right:'0mm',bottom:'0mm',left:'0mm'}}));
        if(bytes.subarray(0,5).toString('ascii')!=='%PDF-')throw new Error('Chromium did not generate a valid PDF: '+relative);
        if(bytes.length<700)throw new Error('PDF output appears empty: '+relative+' ('+bytes.length+' bytes)');
        fs.writeFileSync(output,bytes);
        generated++;
        if(generated%50===0)console.log('Generated '+generated+' A4 PDFs...');
      }
    }
  }
  await context.close();
}finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
const expected=languages.length*topics.length*formats.length;
if(generated!==expected)throw new Error('Expected '+expected+' PDFs, generated '+generated+'.');
console.log('PDF generation passed: '+generated+' non-empty A4 PDF files generated from the real printable sheets.');
