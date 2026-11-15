'use strict';
const helix=document.getElementById('heroDna');
for(let i=0;i<30;i++){
 const phase=i*.52,y=i*14.5+12,spread=Math.sin(phase)*75;
 const rung=document.createElement('div');rung.className='dna-rung';
 rung.style.cssText='top:'+(y+5)+'px;left:'+(105-Math.abs(spread))+'px;width:'+Math.max(3,Math.abs(spread)*2)+'px;opacity:' +(.45+.4*Math.abs(Math.cos(phase)))+';transform:rotate('+(Math.sin(phase)*7)+'deg)';
 helix.appendChild(rung);
 for(const side of [-1,1]){const node=document.createElement('div');node.className='dna-node';node.style.cssText='left:'+(98+side*spread)+'px;top:'+y+'px;color:'+(side===1?'#a1ebfa':'#baa1ff')+';background:currentColor;z-index:'+(side*spread>0?2:1)+';opacity:'+(side*spread>0?1:.72);helix.appendChild(node)}
}

const modal=document.getElementById('exhibitModal');
const content=document.getElementById('stageContent');
const nextBtn=document.getElementById('nextBtn');
const backBtn=document.getElementById('backBtn');
const steps=[
 {name:'Investigate',heading:'What’s hiding inside a strawberry?',sub:'Every strawberry is made of cells, and those cells contain DNA. Before we begin, make a prediction.'},
 {name:'Mash',heading:'First, mash the strawberry',sub:'Crushing the fruit breaks apart the soft tissue and exposes more cells. The DNA is still too small to see.'},
 {name:'Release',heading:'Mix in soap and salt',sub:'Soap helps disrupt cell membranes, releasing cellular contents. Salt helps DNA collect together during extraction.'},
 {name:'Filter',heading:'Separate the solid pulp',sub:'Pour the strawberry mixture through a coffee filter. Larger bits of fruit remain behind while liquid carrying DNA passes through.'},
 {name:'Precipitate',heading:'Carefully add cold alcohol',sub:'Gently layer cold rubbing alcohol over the filtered strawberry liquid. DNA is less soluble in alcohol and begins to gather at the boundary.'},
 {name:'Discover',heading:'Look for cloudy, white strands',sub:'The cloudy strings are clumps containing many DNA molecules, along with possible impurities. A single DNA helix is far too tiny to see.'},
 {name:'Reflect',heading:'Think like a scientist',sub:'Why did adding cold alcohol make the DNA easier to see?'}
];
let stage=0,prediction=null,answer=null,completed=false;
const q1=['DNA is only found in animals','DNA is found inside strawberry cells','DNA is only found in strawberry seeds'];
const q2=['DNA does not dissolve well in alcohol, so it clumps together','Alcohol creates new DNA','Alcohol turns strawberry juice into DNA'];
const svgStart='<svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Detailed illustration of a strawberry DNA extraction experiment"><defs><radialGradient id="scene" cx=".5" cy=".35" r=".85"><stop stop-color="#334b73"/><stop offset="1" stop-color="#131f3b"/></radialGradient><linearGradient id="glass" x1="0" x2="1"><stop stop-color="#cff4ff" stop-opacity=".44"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#c6eafa" stop-opacity=".45"/></linearGradient><linearGradient id="straw" x1=".1" y1=".1" x2=".9" y2=".9"><stop stop-color="#ff7481"/><stop offset=".45" stop-color="#db294e"/><stop offset="1" stop-color="#781936"/></linearGradient><linearGradient id="juice" x1="0" x2=".8" y1="0" y2="1"><stop stop-color="#f7a1b5"/><stop offset=".7" stop-color="#b43c69"/><stop offset="1" stop-color="#702c52"/></linearGradient><linearGradient id="alcohol" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#effdff" stop-opacity=".8"/><stop offset="1" stop-color="#b9e6ff" stop-opacity=".3"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="5"/></filter><filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="11" flood-color="#000" flood-opacity=".5"/></filter></defs><rect width="480" height="380" rx="20" fill="url(#scene)"/><ellipse cx="243" cy="327" rx="147" ry="19" fill="#06112d" opacity=".45"/><path d="M25 304H455" stroke="#91adca" stroke-opacity=".24"/>';
const strawberry=(()=>{
 const seeds=[];
 for(let row=0;row<8;row++){
  for(let col=0;col<7;col++){
   const y=142+row*17+(col%2)*3;
   const mid=239,half=80*(1-(row/10)**1.8);
   const x=mid+(col-3)*half/3.75+Math.sin(row*4+col*7)*2.4;
   if(x<166||x>315||y>273||((row===0)&&(col<2||col>4)))continue;
   const rot=-13+Math.sin(col*2+row)*18;
   seeds.push('<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+rot.toFixed(1)+')"><ellipse cy="1" rx="4.7" ry="6.1" fill="#7b1534" opacity=".32"/><ellipse rx="2.4" ry="4" fill="#f6d99a"/><path d="M-.8-2Q-2 0-1 2" fill="none" stroke="#fff2c4" stroke-width=".7" opacity=".8"/></g>');
  }
 }
 const calyx='<g filter="url(#shadow)"><path d="M237 110Q232 81 243 70" stroke="#47702e" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M239 111Q209 105 182 99Q183 127 220 130L238 119Z" fill="#608c33" stroke="#9ccc68" stroke-width="1.5"/><path d="M240 111Q264 88 294 91Q290 116 255 127Z" fill="#79a93c" stroke="#c8de82" stroke-width="1.5"/><path d="M239 111Q221 86 219 75Q244 79 253 109Z" fill="#80a840"/><path d="M240 115Q263 119 284 137Q254 141 233 123Z" fill="#4f7f2f"/><path d="M231 116Q215 125 197 144Q196 120 230 111Z" fill="#739e35"/><path d="M206 111L223 119M266 103L250 119M218 87L238 113" stroke="#c3de80" stroke-width="1.4" opacity=".6"/></g>';
 return '<g filter="url(#shadow)"><path d="M239 116C215 99 185 101 171 124C153 151 166 191 181 219C198 253 224 282 239 292C256 281 278 255 297 220C315 190 329 152 308 126C291 103 265 100 239 116Z" fill="url(#straw)" stroke="#ff9a9e" stroke-width="2"/><path d="M181 142Q194 115 228 133" fill="none" stroke="#ffb5ae" stroke-width="12" stroke-linecap="round" opacity=".26"/><path d="M285 139Q308 165 281 227" fill="none" stroke="#63152f" stroke-width="16" stroke-linecap="round" opacity=".23"/><path d="M184 155Q174 190 214 243" fill="none" stroke="#ffd1ae" stroke-width="2" opacity=".28"/>'+seeds.join('')+'</g>'+calyx;
})();
const jar=(filled,filtering,dna)=>'<g filter="url(#shadow)"><path d="M164 110H321L309 302Q305 319 289 320H196Q180 319 177 302Z" fill="url(#glass)" stroke="#cceafa" stroke-opacity=".8" stroke-width="4"/>'+(filled?'<path d="M178 '+(dna?210:175)+'H307L300 300Q298 309 290 311H196Q187 311 185 301Z" fill="url(#juice)" opacity=".88"/>':'')+(dna?'<path d="M174 144H315L311 207H177Z" fill="url(#alcohol)" opacity=".85"/><path d="M178 210Q238 201 308 210" stroke="#ffd8e0" stroke-width="4" fill="none"/>'+Array.from({length:13},(_,i)=>{const x=195+(i%5)*19,y=190+Math.floor(i/5)*14;return '<path d="M'+x+' '+y+'q10 -15 15 0t13 0" stroke="#fffaf3" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>'}).join(''):'')+'<ellipse cx="243" cy="110" rx="79" ry="13" fill="#d4f4ff" fill-opacity=".13" stroke="#d7f8ff" stroke-width="4"/><path d="M194 139L203 284" stroke="white" stroke-opacity=".24" stroke-width="8" stroke-linecap="round"/></g>';
const labScene=(kind)=>{
 let obj='';
 if(kind==='fruit')return '<div class="specimen-photo"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Strawberry_fruit_in_studio.jpg?width=900" alt="Photograph of a ripe strawberry with green leaves" /><span>REAL STRAWBERRY SPECIMEN</span></div>';
 if(kind==='mash')obj='<g filter="url(#shadow)"><path d="M129 150H351L338 283Q336 308 317 310H164Q144 308 143 287Z" fill="#d5edff" fill-opacity=".16" stroke="#d3efff" stroke-width="5"/><ellipse cx="240" cy="151" rx="112" ry="22" fill="#a7cfeb" fill-opacity=".14" stroke="#d3efff" stroke-width="5"/><path d="M148 208Q196 196 239 210T345 206L338 284Q332 300 312 302H165Q151 300 148 282Z" fill="url(#juice)" opacity=".96"/>'+Array.from({length:22},(_,i)=>{let x=165+(i*43)%150,y=222+(i*17)%58;return '<path d="M'+x+' '+y+'q7-6 13 1t14 4" fill="none" stroke="#fa8b94" stroke-width="5" opacity=".73"/>'}).join('')+'<path d="M206 75L236 223" stroke="#d9bd94" stroke-width="26" stroke-linecap="round"/><path d="M207 78L228 181" stroke="#f7e1ae" stroke-width="6" stroke-linecap="round" opacity=".7"/><ellipse cx="240" cy="310" rx="130" ry="12" fill="#02112b" opacity=".3"/></g>';
 if(kind==='mix')obj='<g>'+jar(true,false,false)+'<g filter="url(#shadow)"><rect x="44" y="123" width="88" height="145" rx="15" fill="#f2f5f8" stroke="#c4e2f3" stroke-width="4"/><rect x="55" y="169" width="66" height="69" rx="6" fill="#7caace"/><text x="88" y="188" text-anchor="middle" font-size="12" font-weight="bold" fill="#102a47">DISH</text><text x="88" y="204" text-anchor="middle" font-size="12" font-weight="bold" fill="#102a47">SOAP</text><rect x="70" y="98" width="35" height="27" rx="4" fill="#f5fafc" stroke="#c6e0ec" stroke-width="3"/><path d="M85 98V81H122" stroke="#b9d4e3" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="358" y="176" width="64" height="87" rx="8" fill="#eef3f8" stroke="#cae3f2" stroke-width="4"/><rect x="353" y="158" width="74" height="23" rx="7" fill="#d8e6f3"/><circle cx="374" cy="169" r="3" fill="#849eaf"/><circle cx="391" cy="169" r="3" fill="#849eaf"/><circle cx="407" cy="169" r="3" fill="#849eaf"/><text x="389" y="221" text-anchor="middle" font-size="12" font-weight="bold" fill="#52657c">SALT</text></g><path d="M230 163q7-20 13-2t13 2" stroke="#eafaff" stroke-width="5" fill="none" opacity=".56"/><circle cx="205" cy="201" r="5" fill="#effbff" opacity=".45"/><circle cx="278" cy="233" r="7" fill="#effbff" opacity=".33"/></g>';
 if(kind==='filter')obj='<g filter="url(#shadow)"><path d="M174 83H311L273 178H213Z" fill="#e7dfca" stroke="#fff5df" stroke-width="4"/><path d="M177 85Q244 108 309 85" fill="#e7d5ca" stroke="#fbe5e0" stroke-width="4"/><path d="M198 115H288L264 158H223Z" fill="#ad4365" opacity=".92"/><path d="M241 170V212" stroke="#ec9cb0" stroke-width="5" stroke-dasharray="6 9"/><path d="M194 215H290L284 306Q280 320 270 320H214Q204 320 201 306Z" fill="url(#glass)" stroke="#caebfa" stroke-width="4"/><path d="M202 263H284L280 304Q278 311 269 312H215Q210 311 208 303Z" fill="url(#juice)" opacity=".82"/></g>';
 if(kind==='alcohol')obj=jar(true,false,true)+'<g filter="url(#shadow)"><rect x="345" y="132" width="89" height="161" rx="13" fill="#c1e1f3" fill-opacity=".5" stroke="#d7effb" stroke-width="4"/><rect x="351" y="176" width="77" height="72" rx="6" fill="#ecf5fb"/><text x="389" y="196" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">COLD</text><text x="389" y="211" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">RUBBING</text><text x="389" y="226" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">ALCOHOL</text><rect x="369" y="105" width="40" height="27" rx="5" fill="#ecf5fb" stroke="#c8e6f4" stroke-width="3"/></g>';
 if(kind==='dna')obj=jar(true,false,true);
 if(kind==='cell')obj='<g filter="url(#shadow)"><circle cx="239" cy="195" r="117" fill="#e186b8" fill-opacity=".35" stroke="#ffb7d7" stroke-width="7"/><circle cx="239" cy="195" r="57" fill="#8054aa" stroke="#c3a2ee" stroke-width="6"/><path d="M211 185q17-55 39 0t27 17q-21-65-42-5t-29 8" stroke="#e1d5ff" stroke-width="7" stroke-linecap="round" fill="none"/>'+Array.from({length:10},(_,i)=>{const a=i*2*Math.PI/10;return '<ellipse cx="'+(239+88*Math.cos(a))+'" cy="'+(195+88*Math.sin(a))+'" rx="14" ry="7" transform="rotate('+(a*180/Math.PI)+' '+(239+88*Math.cos(a))+' '+(195+88*Math.sin(a))+')" fill="#ffd2aa" opacity=".7"/>'}).join('')+'</g>';
 return svgStart+'<circle cx="240" cy="172" r="145" fill="#7fb8ff" opacity=".07" filter="url(#glow)"/>'+obj+'<text x="240" y="354" text-anchor="middle" fill="#b4cae9" font-family="Arial,sans-serif" font-size="13" letter-spacing="2">'+({fruit:'FRESH STRAWBERRY',mash:'CRUSH THE FRUIT',mix:'LYSE THE CELLS',filter:'SEPARATE THE PULP',alcohol:'PRECIPITATE DNA',dna:'VISIBLE DNA CLUMPS',cell:'DNA INSIDE THE CELL'}[kind])+'</text></svg>';
};
function options(answers,selected){return '<div class="choices" role="group" aria-label="Choose an answer">'+answers.map((a,i)=>'<button type="button" class="choice '+(selected===i?'selected':'')+'" data-answer="'+i+'">'+a+'</button>').join('')+'</div>';}
function render(){
 const s=steps[stage];
 document.getElementById('progressStages').innerHTML=steps.map((x,i)=>'<span class="'+(i===stage?'active':'')+'">'+(i+1)+'. '+x.name+'</span>').join('');
 document.getElementById('progressBar').style.width=(((stage+1)/steps.length)*100)+'%';
 document.getElementById('stageCounter').textContent=(stage+1)+' of '+steps.length;
 backBtn.disabled=stage===0;
 nextBtn.disabled=(stage===0&&prediction===null)||(stage===6&&answer===null&&!completed);
 nextBtn.textContent=completed?'Close exhibit':stage===6?'Finish exhibit →':'Next step →';
 let left='<div class="stage-copy"><span class="stage-kicker">STEP '+String(stage+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0')+'</span><h2 id="exhibitTitle">'+s.heading+'</h2><p>'+s.sub+'</p>';
 let visual='fruit';
 if(stage===0){visual='fruit';left+=options(q1,prediction)+(prediction!==null?'<div class="feedback" role="status">'+(prediction===1?'That’s right!':'Interesting prediction!')+' Strawberry cells contain DNA, mainly inside their nuclei.</div>':'');}
 if(stage===1){visual='mash';left+='<div class="lab-tip"><strong>What happens?</strong> The berry becomes a soft pulp, exposing more of its cells. Crushing alone does not make the DNA visible.</div>';}
 if(stage===2){visual='mix';left+='<div class="lab-tip"><strong>Why both?</strong> Detergent breaks down lipid membranes. Salt helps shield DNA’s negative charges, making it easier for the DNA to come together.</div>';}
 if(stage===3){visual='filter';left+='<div class="lab-tip"><strong>Look closely:</strong> The filter catches solids, but dissolved DNA and other small molecules pass through with the liquid.</div>';}
 if(stage===4){visual='alcohol';left+='<div class="lab-tip"><strong>Important:</strong> Pour slowly to create a separate layer. Cold alcohol reduces DNA solubility, allowing clumps to appear at the interface.</div>';}
 if(stage===5){visual='dna';left+='<div class="lab-tip"><strong>What you actually see:</strong> Many DNA molecules clumped together, not an individual double helix. The extract can contain other material too.</div>';}
 if(stage===6){visual='cell';left+=options(q2,answer)+(answer!==null?'<div class="feedback" role="status">'+(answer===0?'Correct! ':'Not quite. ')+'Cold alcohol causes DNA to precipitate from the watery mixture.</div>':'');}
 if(completed){visual='dna';left='<div class="stage-copy"><span class="stage-kicker">EXHIBIT COMPLETE</span><h2 id="exhibitTitle">You’re a DNA detective!</h2><p>You followed the whole experiment, from crushing the strawberry to collecting DNA. Science starts with a question and grows through careful observation.</p><button class="button secondary" id="restartBtn" type="button">↺ Restart experiment</button></div>';}
 else left+='</div>';
 content.innerHTML='<div class="stage-layout enhanced-stage">'+left+'<div class="science-visual refined-visual">'+labScene(visual)+'</div></div>';
 content.scrollTop=0;
 content.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{if(stage===0)prediction=+b.dataset.answer;else answer=+b.dataset.answer;render()}));
 const restart=document.getElementById('restartBtn');if(restart)restart.addEventListener('click',reset);
}
function reset(){stage=0;prediction=null;answer=null;completed=false;render()}
function openModal(){reset();modal.hidden=false;document.body.classList.add('modal-open');document.getElementById('closeModal').focus()}
function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');document.getElementById('launchBtn').focus()}
document.getElementById('launchBtn').addEventListener('click',openModal);
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();if(e.key==='Tab'&&!modal.hidden){const list=[...modal.querySelectorAll('button:not(:disabled)')];if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
backBtn.addEventListener('click',()=>{if(stage>0){stage--;completed=false;render()}});
nextBtn.addEventListener('click',()=>{if(completed){closeModal();return}if(stage<steps.length-1)stage++;else{completed=true;try{localStorage.setItem('discovery-lab-dna-completed','true')}catch(e){}}render()});
