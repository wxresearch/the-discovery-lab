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
 {name:'Release',heading:'Add detergent, salt, then stir',sub:'Add dish soap and salt to the mashed strawberry. Then stir gently to mix the ingredients before filtering. Soap helps disrupt cell membranes, while salt supports DNA precipitation later.'},
 {name:'Filter',heading:'Separate the solid pulp',sub:'Pour the strawberry mixture through a coffee filter. Larger bits of fruit remain behind while liquid carrying DNA passes through.'},
 {name:'Precipitate',heading:'Carefully add cold alcohol',sub:'Gently layer cold rubbing alcohol over the filtered strawberry liquid. DNA is less soluble in alcohol and begins to gather at the boundary.'},
 {name:'Discover',heading:'Watch the DNA appear',sub:'Keep the alcohol and strawberry extract in separate layers: do not stir them together. Look at the interface as cloudy DNA-rich strands precipitate and become visible.'},
 {name:'Reflect',heading:'Think like a scientist',sub:'Why did adding cold alcohol make the DNA easier to see?'}
];
let stage=0,prediction=null,answer=null,completed=false,dnaRevealed=false,pouring=false;
let mixStirs=0;const requiredStirs=4;
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
 if(kind==='fruit')return '<div class="specimen-photo"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Bowl_of_Strawberries_%28Unsplash%29.jpg?width=900" alt="Photograph of a ripe strawberry with green leaves" /><span>REAL STRAWBERRY SPECIMEN</span></div>';
 if(kind==='mash')obj='<g filter="url(#shadow)"><path d="M129 150H351L338 283Q336 308 317 310H164Q144 308 143 287Z" fill="#d5edff" fill-opacity=".16" stroke="#d3efff" stroke-width="5"/><ellipse cx="240" cy="151" rx="112" ry="22" fill="#a7cfeb" fill-opacity=".14" stroke="#d3efff" stroke-width="5"/><path d="M148 208Q196 196 239 210T345 206L338 284Q332 300 312 302H165Q151 300 148 282Z" fill="url(#juice)" opacity=".96"/>'+Array.from({length:22},(_,i)=>{let x=165+(i*43)%150,y=222+(i*17)%58;return '<path d="M'+x+' '+y+'q7-6 13 1t14 4" fill="none" stroke="#fa8b94" stroke-width="5" opacity=".73"/>'}).join('')+'<path d="M206 75L236 223" stroke="#d9bd94" stroke-width="26" stroke-linecap="round"/><path d="M207 78L228 181" stroke="#f7e1ae" stroke-width="6" stroke-linecap="round" opacity=".7"/><ellipse cx="240" cy="310" rx="130" ry="12" fill="#02112b" opacity=".3"/></g>';
 if(kind==='mix')obj='<g>'+jar(true,false,false)+'<g filter="url(#shadow)"><rect x="44" y="123" width="88" height="145" rx="15" fill="#f2f5f8" stroke="#c4e2f3" stroke-width="4"/><rect x="55" y="169" width="66" height="69" rx="6" fill="#7caace"/><text x="88" y="188" text-anchor="middle" font-size="12" font-weight="bold" fill="#102a47">DISH</text><text x="88" y="204" text-anchor="middle" font-size="12" font-weight="bold" fill="#102a47">SOAP</text><rect x="70" y="98" width="35" height="27" rx="4" fill="#f5fafc" stroke="#c6e0ec" stroke-width="3"/><path d="M85 98V81H122" stroke="#b9d4e3" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="358" y="176" width="64" height="87" rx="8" fill="#eef3f8" stroke="#cae3f2" stroke-width="4"/><rect x="353" y="158" width="74" height="23" rx="7" fill="#d8e6f3"/><circle cx="374" cy="169" r="3" fill="#849eaf"/><circle cx="391" cy="169" r="3" fill="#849eaf"/><circle cx="407" cy="169" r="3" fill="#849eaf"/><text x="389" y="221" text-anchor="middle" font-size="12" font-weight="bold" fill="#52657c">SALT</text></g><path d="M230 163q7-20 13-2t13 2" stroke="#eafaff" stroke-width="5" fill="none" opacity=".56"/><circle cx="205" cy="201" r="5" fill="#effbff" opacity=".45"/><circle cx="278" cy="233" r="7" fill="#effbff" opacity=".33"/></g>';
 if(kind==='filter')obj='<g filter="url(#shadow)"><path d="M174 83H311L273 178H213Z" fill="#e7dfca" stroke="#fff5df" stroke-width="4"/><path d="M177 85Q244 108 309 85" fill="#e7d5ca" stroke="#fbe5e0" stroke-width="4"/><path d="M198 115H288L264 158H223Z" fill="#ad4365" opacity=".92"/><path d="M241 170V212" stroke="#ec9cb0" stroke-width="5" stroke-dasharray="6 9"/><path d="M194 215H290L284 306Q280 320 270 320H214Q204 320 201 306Z" fill="url(#glass)" stroke="#caebfa" stroke-width="4"/><path d="M202 263H284L280 304Q278 311 269 312H215Q210 311 208 303Z" fill="url(#juice)" opacity=".82"/></g>';
 if(kind==='alcohol')obj=jar(true,false,true)+'<g filter="url(#shadow)"><rect x="345" y="132" width="89" height="161" rx="13" fill="#c1e1f3" fill-opacity=".5" stroke="#d7effb" stroke-width="4"/><rect x="351" y="176" width="77" height="72" rx="6" fill="#ecf5fb"/><text x="389" y="196" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">COLD</text><text x="389" y="211" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">RUBBING</text><text x="389" y="226" fill="#284760" font-size="10" font-weight="bold" text-anchor="middle">ALCOHOL</text><rect x="369" y="105" width="40" height="27" rx="5" fill="#ecf5fb" stroke="#c8e6f4" stroke-width="3"/></g>';
 if(kind==='dna')obj=jar(true,false,true);
 if(kind==='cell')obj='<g filter="url(#shadow)"><circle cx="239" cy="195" r="117" fill="#e186b8" fill-opacity=".35" stroke="#ffb7d7" stroke-width="7"/><circle cx="239" cy="195" r="57" fill="#8054aa" stroke="#c3a2ee" stroke-width="6"/><path d="M211 185q17-55 39 0t27 17q-21-65-42-5t-29 8" stroke="#e1d5ff" stroke-width="7" stroke-linecap="round" fill="none"/>'+Array.from({length:10},(_,i)=>{const a=i*2*Math.PI/10;return '<ellipse cx="'+(239+88*Math.cos(a))+'" cy="'+(195+88*Math.sin(a))+'" rx="14" ry="7" transform="rotate('+(a*180/Math.PI)+' '+(239+88*Math.cos(a))+' '+(195+88*Math.sin(a))+')" fill="#ffd2aa" opacity=".7"/>'}).join('')+'</g>';
 return svgStart+'<circle cx="240" cy="172" r="145" fill="#7fb8ff" opacity=".07" filter="url(#glow)"/>'+obj+'<text x="240" y="354" text-anchor="middle" fill="#b4cae9" font-family="Arial,sans-serif" font-size="13" letter-spacing="2">'+({fruit:'FRESH STRAWBERRY',mash:'CRUSH THE FRUIT',mix:'LYSE THE CELLS',filter:'SEPARATE THE PULP',alcohol:'PRECIPITATE DNA',dna:'VISIBLE DNA CLUMPS',cell:'DNA INSIDE THE CELL'}[kind])+'</text></svg>';
};
function options(answers,selected){return '<div class="choices" role="group" aria-label="Choose an answer">'+answers.map((a,i)=>'<button type="button" class="choice '+(selected===i?'selected':'')+'" data-answer="'+i+'">'+a+'</button>').join('')+'</div>';}

/* Hands-on lab interactions: native pointer events work with mouse, pen and touch.
   A button alternative makes every stage usable without dragging. */
const actions={mash:0,soap:false,salt:false,filter:false,alcohol:0};
const maxMash=7,maxPour=5;
const labStates={
 1:{id:'mash',title:'Drag the masher over the fruit',tip:'Press and move the masher around the bowl. Each stroke breaks down more strawberry tissue.'},
 2:{id:'mix',title:'Add soap, add salt, and stir',tip:'Add soap and salt to the SAME bowl, then stir gently four times before filtering.'},
 3:{id:'filter',title:'Filter the prepared strawberry mixture',tip:'You already added dish soap and salt. Drag the mixed extract onto the paper-lined funnel. Pulp stays in the filter; the liquid passes into the jar.'},
 4:{id:'alcohol',title:'Carefully layer the cold alcohol',tip:'Tap “Pour a little alcohol” to see an actual pouring animation, or drag the bottle to the jar. Keep the two layers separate; do not stir. Real rubbing alcohol requires adult supervision.'}
};
function stageReady(){return stage===0?prediction!==null:stage===1?actions.mash>=maxMash:stage===2?actions.soap&&actions.salt&&mixStirs>=requiredStirs:stage===3?actions.filter:stage===4?actions.alcohol>=maxPour:stage===5?dnaRevealed:stage===6?answer!==null:true;}
function pct(n,d){return Math.round(n/d*100);}
function bowlScene(mode){
 return '<div class="lab-vessel mash-bowl" data-dropzone="'+(mode==='mash'?'mash':'mix')+'"><svg class="mash-scene" viewBox="0 0 260 250" role="img" aria-label="Glass bowl with strawberry pieces and mashed pulp contained inside"><defs><linearGradient id="bowlGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d8f4ff" stop-opacity=".3"/><stop offset=".42" stop-color="#c6eafd" stop-opacity=".05"/><stop offset="1" stop-color="#92bedf" stop-opacity=".32"/></linearGradient><linearGradient id="pulpGradient" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#f8778c"/><stop offset=".53" stop-color="#d63a5e"/><stop offset="1" stop-color="#982049"/></linearGradient><clipPath id="bowlInner"><path d="M21 48 Q29 185 56 212 Q83 239 130 239 Q177 239 204 212 Q232 177 239 48Z"/></clipPath></defs><ellipse cx="131" cy="242" rx="99" ry="7" fill="#07112b" opacity=".45"/><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48Z" fill="url(#bowlGlass)" stroke="none"/><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48" fill="none" stroke="#b5d4e9" stroke-width="5"/><g clip-path="url(#bowlInner)"><path d="M21 138 Q70 129 130 137 Q182 128 239 138 L245 258H15Z" fill="url(#pulpGradient)"/><path d="M21 139 Q75 128 130 136 Q192 128 239 138" stroke="#ffb4bb" stroke-width="5" opacity=".75" fill="none"/><g class="pulp-chunks" style="--mash:'+(actions.mash/maxMash)+'">'+Array.from({length:17},(_,i)=>{const x=40+(i*43)%183,y=149+(i*37)%71;return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(6+i%4*2)+'" ry="'+(4+i%3*2)+'" fill="'+(i%3===0?'#ff98a3':i%3===1?'#bd244d':'#f66579')+'" opacity=".8"/>'}).join('')+'</g><g class="pulp-fibers" style="--mash:'+(actions.mash/maxMash)+'">'+Array.from({length:24},(_,i)=>{let x=36+(i*47)%188,y=150+(i*23)%76;return '<path d="M'+x+' '+y+'q8-5 13 2" stroke="'+(i%2?'#ffadb5':'#9a1943')+'" fill="none" stroke-width="2" opacity=".65"/>'}).join('')+'</g><path d="M40 78L49 203" stroke="#eefbff" stroke-width="8" opacity=".12" stroke-linecap="round"/></g><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48" fill="none" stroke="#dcf7ff" stroke-opacity=".43" stroke-width="4"/><ellipse cx="130" cy="48" rx="113" ry="23" fill="#b2d7ed" fill-opacity=".09" stroke="#d1edf8" stroke-width="7"/><path d="M36 46 Q125 19 225 44" stroke="white" stroke-opacity=".35" stroke-width="3" fill="none"/>'+(mode==='mix'&&actions.soap?'<g class="soap-foam"><ellipse cx="131" cy="136" rx="101" ry="12" fill="#ffe7eb" fill-opacity=".48"/><circle cx="75" cy="133" r="8" fill="#fffafc" fill-opacity=".82"/><circle cx="112" cy="130" r="6" fill="#fffafc" fill-opacity=".72"/><circle cx="163" cy="130" r="9" fill="#fffafc" fill-opacity=".84"/><circle cx="198" cy="134" r="5" fill="#fffafc" fill-opacity=".78"/></g>':'')+(mode==='mix'&&actions.salt?'<g class="salt-fall"><circle cx="85" cy="148" r="2.3" fill="#fff8e5"/><circle cx="111" cy="153" r="1.8" fill="#fff8e5"/><circle cx="138" cy="161" r="2" fill="#fff8e5"/><circle cx="164" cy="148" r="2.3" fill="#fff8e5"/><circle cx="185" cy="162" r="1.8" fill="#fff8e5"/></g>':'')+'</svg></div>';
}
function labMarkup(){
 if(!labStates[stage])return '';
 const item=labStates[stage];
 const progress=stage===1?pct(actions.mash,maxMash):stage===2?Math.round((Number(actions.soap)+Number(actions.salt)+mixStirs/requiredStirs)/3*100):stage===3?(actions.filter?100:0):pct(actions.alcohol,maxPour);
 const ready=progress===100;
 const tool=stage===1?'<div class="lab-tool masher" role="button" tabindex="0" aria-label="Drag masher through the strawberry pulp" data-tool="mash"><span class="tool-top"></span><span class="tool-shaft"></span><span class="tool-base"></span></div>':
 stage===2?'<div class="lab-tool reagent-tool soap-prop '+(actions.soap?'tool-done':'')+'" role="button" tabindex="0" aria-label="Drag dish soap into the bowl" data-tool="soap"><svg viewBox="0 0 88 166" aria-hidden="true"><defs><linearGradient id="soapBody" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#3c9ba8"/><stop offset=".5" stop-color="#a5e6de"/><stop offset="1" stop-color="#357f90"/></linearGradient></defs><path d="M36 23V12h17V5h23v12H57v9" fill="none" stroke="#c7e8ef" stroke-width="7" stroke-linecap="round"/><rect x="18" y="24" width="53" height="132" rx="18" fill="url(#soapBody)" stroke="#d3f4f1" stroke-width="2"/><rect x="23" y="78" width="43" height="46" rx="7" fill="#f2faf5"/><text x="44" y="96" text-anchor="middle" font-size="15" font-weight="bold" fill="#1b5666">DISH</text><text x="44" y="115" text-anchor="middle" font-size="15" font-weight="bold" fill="#1b5666">SOAP</text><path d="M27 38Q34 30 40 35" stroke="#f2ffff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/></svg></div><div class="lab-tool reagent-tool salt-prop '+(actions.salt?'tool-done':'')+'" role="button" tabindex="0" aria-label="Drag salt into the bowl" data-tool="salt"><svg viewBox="0 0 74 126" aria-hidden="true"><defs><linearGradient id="saltBody" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dae6ee"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#c5d7df"/></linearGradient></defs><rect x="12" y="32" width="50" height="89" rx="12" fill="url(#saltBody)" stroke="#cfe4eb" stroke-width="3"/><rect x="8" y="19" width="58" height="20" rx="6" fill="#a9c2cf" stroke="#e6f1f7" stroke-width="3"/><circle cx="24" cy="27" r="2.2" fill="#536f80"/><circle cx="37" cy="27" r="2.2" fill="#536f80"/><circle cx="50" cy="27" r="2.2" fill="#536f80"/><rect x="17" y="61" width="40" height="36" rx="5" fill="#fff8ef"/><text x="37" y="83" font-size="17" font-weight="bold" fill="#304758" text-anchor="middle">SALT</text></svg></div>'+((actions.soap&&actions.salt)?'<div class="lab-tool lab-stirrer" role="button" tabindex="0" aria-label="Stir the strawberry mixture" data-tool="stir"><span class="stir-handle"></span><span class="stir-head"></span></div>':''):
 stage===3?'<div class="lab-tool mixing-cup '+(actions.filter?'tool-done':'')+'" role="button" tabindex="0" aria-label="Pour the strawberry mixture containing soap and salt through the filter" data-tool="filter"><span class="cup-mixture"></span><span class="cup-label">MIXED<br>EXTRACT</span></div>':
 '<div class="lab-tool bottle alcohol '+(ready?'tool-done':'')+'" role="button" tabindex="0" aria-label="Pour cold alcohol into jar" data-tool="alcohol"><span class="lid"></span><span class="bottle-label">COLD<br>ALCOHOL</span></div>';
 const vessel=(stage===1||stage===2)?bowlScene(stage===1?'mash':'mix'):
 stage===3?'<div class="lab-vessel filter-station" data-dropzone="filter"><svg class="filter-scene" viewBox="0 0 290 310" role="img" aria-label="Coffee filter in a funnel above a glass receiving jar. '+(actions.filter?'Strawberry residue remains in the filter and filtered extract collects in the jar.':'The filter is ready, and the receiving jar is still empty.')+'"><defs><linearGradient id="filGlass" x1="0" x2="1"><stop stop-color="#b7e4ff" stop-opacity=".32"/><stop offset=".5" stop-color="#cfeeff" stop-opacity=".06"/><stop offset="1" stop-color="#c4eaff" stop-opacity=".4"/></linearGradient><linearGradient id="filLiquid" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#d77b9e"/><stop offset="1" stop-color="#a33d71"/></linearGradient><clipPath id="jarInterior"><path d="M93 174H204L200 283Q200 296 187 298H110Q99 297 98 284Z"/></clipPath></defs><ellipse cx="151" cy="298" rx="101" ry="10" fill="#050f2e" opacity=".37"/><path d="M87 170H210L204 284Q202 302 187 303H109Q94 302 92 284Z" fill="url(#filGlass)" stroke="#d5edfc" stroke-width="5"/><g clip-path="url(#jarInterior)">'+(actions.filter?'<path d="M96 253Q148 250 205 253V313H96Z" fill="url(#filLiquid)"/><path d="M95 253Q151 248 205 253" fill="none" stroke="#f6b1c1" stroke-width="3"/>':'')+'</g><ellipse cx="148" cy="170" rx="61" ry="9" fill="#bfe8fb" fill-opacity=".13" stroke="#d5edfc" stroke-width="4"/><path d="M64 42H232L167 157H129Z" fill="#acd1df" fill-opacity=".37" stroke="#bedfee" stroke-width="5" stroke-linejoin="round"/><path d="M82 51H215L164 141H131Z" fill="#f5ebd8" stroke="#fff5e4" stroke-width="3" stroke-linejoin="round"/><path d="M86 64Q148 77 211 64" stroke="#d2c7af" stroke-width="2" fill="none"/>'+(actions.filter?'<path d="M91 72Q147 67 205 72L184 107Q166 113 147 108Q126 115 107 106Z" fill="#9e3f5e"/><path d="M111 82Q126 76 141 84T174 82" stroke="#da7b87" stroke-width="6" fill="none" opacity=".7"/><circle cx="145" cy="92" r="5" fill="#7a2a48"/><circle cx="164" cy="100" r="4" fill="#cc6b7f"/>':'')+'<path d="M148 153V170" stroke="#c1e0ef" stroke-width="5" opacity=".7"/>'+(actions.filter?'<path d="M148 155v18" stroke="#e1a6b7" stroke-width="3" stroke-dasharray="3 4"/>':'')+'</svg><span class="filter-residue-label">'+(actions.filter?'PULP REMAINS IN FILTER':'FILTER READY')+'</span></div>':
 '<div class="lab-vessel alcohol-station" data-dropzone="alcohol"><svg class="alcohol-scene" viewBox="0 0 260 260" role="img" aria-label="Open glass vessel with filtered strawberry extract and cold alcohol layered on top"><defs><linearGradient id="alcoholGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c4ebff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#b7dff4" stop-opacity=".35"/></linearGradient><linearGradient id="alcoholPink" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e58ba5"/><stop offset="1" stop-color="#a63866"/></linearGradient><clipPath id="alcoholInterior"><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47Z"/></clipPath></defs><ellipse cx="130" cy="237" rx="100" ry="8" fill="#03112b" opacity=".36"/><g clip-path="url(#alcoholInterior)"><path d="M38 154Q130 151 222 154V233H38Z" fill="url(#alcoholPink)"/><rect x="39" y="'+(154-actions.alcohol/maxPour*49)+'" width="182" height="'+(actions.alcohol/maxPour*49)+'" fill="#c1e9f6" fill-opacity=".7"/>'+(actions.alcohol>=maxPour?'<path d="M75 155q16-12 29 0t27-1t27 0t27 1" fill="none" stroke="#fff8ed" stroke-width="3" opacity=".8"/>':'')+'</g><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47Z" fill="url(#alcoholGlass)" stroke="none"/><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47" fill="none" stroke="#c9e9f8" stroke-width="5"/><ellipse cx="130" cy="47" rx="88" ry="15" fill="#bedef2" fill-opacity=".09" stroke="#d4effb" stroke-width="5"/></svg></div>';
 return '<div class="hands-on"><div class="lab-status"><div class="lab-status-top"><span class="lab-status-label">'+(stage===1?'MASH THE STRAWBERRY':stage===2?'ADD SOAP · SALT · STIR':stage===3?'FILTER THE EXTRACT':'LAYER THE ALCOHOL')+'</span><strong class="lab-status-value">'+progress+'%</strong></div><div class="activity-track"><div id="activityFill" style="width:'+progress+'%"></div></div><div class="lab-instruction">'+item.tip+'</div></div><div class="lab-workbench" id="workbench" aria-label="Interactive laboratory equipment"><div class="bench-surface"></div><div class="target-ring"></div>'+vessel+tool+(stage===4?'<div class="pour-stream" aria-hidden="true"></div>':'')+'</div><div class="lab-controls"><button type="button" id="assistBtn" class="button secondary">'+(stage===1?'Mash once':stage===2?(actions.soap?(actions.salt?'Stir mixture':'Add salt'):'Add detergent'):stage===3?'Pour through filter':'Pour a little alcohol')+'</button><span class="lab-result" id="labResult" role="status">'+(ready?'✓ Step complete. Continue when ready.':'Drag the tool, or use the action button.')+'</span></div></div>';
}
function applyAction(type){
 if(type==='mash')actions.mash=Math.min(maxMash,actions.mash+1);
 if(type==='soap')actions.soap=true;
 if(type==='salt'&&actions.soap)actions.salt=true;
 if(type==='stir'&&actions.soap&&actions.salt)mixStirs=Math.min(requiredStirs,mixStirs+1);
 if(type==='filter')actions.filter=true;
 if(type==='alcohol')actions.alcohol=Math.min(maxPour,actions.alcohol+1);
 render(true);
}
function startMashAnimation(){
 if(pouring||stage!==1||actions.mash>=maxMash)return;
 pouring=true;
 const bench=content.querySelector('#workbench');
 const masher=bench&&bench.querySelector('.lab-tool.masher');
 if(!masher){pouring=false;applyAction('mash');return;}
 // Calculate the target from the actual bowl and masher positions rather than
 // using fixed pixel offsets (which miss the bowl on different screen sizes).
 const bowl=bench.querySelector('.mash-bowl');
 const head=masher.querySelector('.tool-base');
 if(bowl&&head){
  const bowlRect=bowl.getBoundingClientRect();
  const headRect=head.getBoundingClientRect();
  const targetX=bowlRect.left+bowlRect.width*.5;
  // The berry mixture is in the lower half of the SVG bowl, not at its rim.
  const targetY=bowlRect.top+bowlRect.height*.76;
  const headX=headRect.left+headRect.width*.5;
  const headY=headRect.top+headRect.height*.5;
  masher.style.setProperty('--mash-dx',(targetX-headX).toFixed(1)+'px');
  masher.style.setProperty('--mash-dy',(targetY-headY).toFixed(1)+'px');
 }
 masher.classList.add('auto-mash');
 bench.classList.add('mash-in-progress');
 let finished=false;
 const finish=()=>{if(finished)return;finished=true;pouring=false;applyAction('mash')};
 masher.addEventListener('animationend',finish,{once:true});
 setTimeout(finish,920);
}
function startStirAnimation(){
 if(pouring||stage!==2||!actions.soap||!actions.salt||mixStirs>=requiredStirs)return;
 pouring=true;
 const bench=content.querySelector('#workbench');
 const stirrer=bench&&bench.querySelector('.lab-stirrer');
 if(!stirrer){pouring=false;applyAction('stir');return;}
 stirrer.classList.add('auto-stir');
 let called=false;
 const finish=()=>{if(called)return;called=true;pouring=false;applyAction('stir')};
 stirrer.addEventListener('animationend',finish,{once:true});
 setTimeout(finish,850);
}
function startPourAnimation(){
 if(pouring||stage!==4||actions.alcohol>=maxPour)return;
 pouring=true;
 const bench=content.querySelector('#workbench');
 if(!bench){pouring=false;applyAction('alcohol');return;}
 const bottle=bench.querySelector('.lab-tool.alcohol');
 const stream=bench.querySelector('.pour-stream');
 bench.classList.add('is-pouring');
 if(stream)stream.classList.add('visible');
 if(bottle)bottle.classList.add('pour-tilt');
 const done=()=>{pouring=false;applyAction('alcohol')};
 // The animation finishes before the pouring action changes the liquid level.
 const target=stream||bottle;
 if(target){let ended=false;const finish=()=>{if(ended)return;ended=true;done()};target.addEventListener('animationend',finish,{once:true});setTimeout(finish,1050);}
 else done();
}
function bindHandsOn(){
 const bench=content.querySelector('#workbench');
 if(!bench)return;
 const controls=content.querySelector('.lab-controls');
 if(controls){bench.appendChild(controls);controls.classList.add('bench-controls');}
 const assist=content.querySelector('#assistBtn');
 assist.addEventListener('click',()=>{
  if(stage===1)startMashAnimation();
  else if(stage===2){if(!actions.soap)applyAction('soap');else if(!actions.salt)applyAction('salt');else startStirAnimation();}
  else if(stage===3)applyAction('filter');
  else startPourAnimation();
 });
 bench.querySelectorAll('.lab-tool').forEach(el=>{
  let dragging=false,originX=0,originY=0,last=0,strokes=0;
  const type=el.dataset.tool;
  const target=bench.querySelector('[data-dropzone]');
  const inside=(x,y)=>{
   const box=target.getBoundingClientRect();
   return x>=box.left-12&&x<=box.right+12&&y>=box.top-15&&y<=box.bottom+15;
  };
  el.addEventListener('pointerdown',e=>{
   if(pouring||el.classList.contains('tool-done'))return;
   if(type==='salt'&&!actions.soap)return;
   if(type==='stir'&&!(actions.soap&&actions.salt))return;
   e.preventDefault();dragging=true;last=0;strokes=0;
   originX=e.clientX;originY=e.clientY;
   el.setPointerCapture(e.pointerId);el.classList.add('dragging');
  });
  el.addEventListener('pointermove',e=>{
   if(!dragging)return;
   const dx=e.clientX-originX,dy=e.clientY-originY;
   el.style.transform='translate('+dx+'px,'+dy+'px) rotate('+(type==='mash'?-12:dx>10?25:0)+'deg)';
   const isInside=inside(e.clientX,e.clientY);
   bench.classList.toggle('target-active',isInside);
   if(type==='mash'&&isInside&&Math.hypot(dx,dy)>22&&Date.now()-last>240){
    last=Date.now();strokes++;const ratio=Math.min(1,strokes/maxMash);
    bench.querySelectorAll('.pulp-chunks,.pulp-fibers').forEach(p=>p.style.setProperty('--mash',ratio));
   }
  });
  function finish(e){
   if(!dragging)return;
   dragging=false;
   const hit=inside(e.clientX,e.clientY);
   el.classList.remove('dragging');bench.classList.remove('target-active');el.style.transform='';
   if(hit){
    if(type==='mash'){actions.mash=Math.min(maxMash,actions.mash+Math.max(1,strokes));render(true);}
    else if(type==='alcohol')startPourAnimation();
    else applyAction(type);
   }
  }
  el.addEventListener('pointerup',finish);
  el.addEventListener('pointercancel',()=>{dragging=false;el.style.transform='';el.classList.remove('dragging');bench.classList.remove('target-active')});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(type==='alcohol')startPourAnimation();else if(type==='mash')startMashAnimation();else if(type==='stir')startStirAnimation();else if(type!=='salt'||actions.soap)applyAction(type)}});
 });
}
function render(preserveScroll=false){
 const prior=content.scrollTop;
 const s=steps[stage];
 document.getElementById('progressStages').innerHTML=steps.map((x,i)=>'<span class="'+(i===stage?'active':'')+'">'+(i+1)+'. '+x.name+'</span>').join('');
 document.getElementById('progressBar').style.width=(((stage+1)/steps.length)*100)+'%';
 document.getElementById('stageCounter').textContent=(stage+1)+' of '+steps.length;
 backBtn.disabled=stage===0;
 nextBtn.disabled=!stageReady();
 nextBtn.textContent=completed?'Close exhibit':stage===6?'Finish exhibit →':'Next step →';
 let left='<div class="stage-copy"><span class="stage-kicker">STEP '+String(stage+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0')+'</span><h2 id="exhibitTitle">'+s.heading+'</h2><p>'+s.sub+'</p>';
 if(stage===0)left+=options(q1,prediction)+(prediction!==null?'<div class="feedback" role="status">'+(prediction===1?'That’s right!':'Interesting prediction!')+' Strawberry cells contain DNA, mainly inside their nuclei.</div>':'');
 if(stage===5)left+='<div class="lab-tip"><strong>What you actually see:</strong> Many DNA molecules clumped together, not an individual double helix. The extract can contain other material too. Do not stir the alcohol into the strawberry liquid.</div>';
 if(stage===6)left+=options(q2,answer)+(answer!==null?'<div class="feedback" role="status">'+(answer===0?'Correct! ':'Not quite. ')+'Cold alcohol causes DNA to precipitate from the watery mixture.</div>':'');
 if(completed)left='<div class="stage-copy"><span class="stage-kicker">EXHIBIT COMPLETE</span><h2 id="exhibitTitle">You’re a DNA detective!</h2><p>You mashed the fruit, released the DNA, filtered the pulp, and made DNA precipitate. Every successful scientist starts with careful observations.</p><button class="button secondary" id="restartBtn" type="button">↺ Restart experiment</button></div>';
 else left+='</div>';
 let right;
 if(completed)right=labScene('dna');
 else if(stage===5)right='<div class="dna-reveal-scene"><div class="dna-layered-vessel"><div class="dna-pink-layer"></div><div class="dna-clear-layer"></div><div class="dna-precipitate '+(dnaRevealed?'shown':'')+'"><i></i><i></i><i></i><i></i><i></i></div><div class="dna-glass-rim"></div></div><p class="dna-stage-caption">'+(dnaRevealed?'Cloudy strands collect at the interface.':'Two layers, not stirred together.')+'</p><button type="button" class="button primary" id="revealDna" '+(dnaRevealed?'disabled':'')+'>'+(dnaRevealed?'DNA visible ✓':'Watch DNA precipitate')+'</button></div>';
 else if(labStates[stage])right=labMarkup();
 else right=labScene(stage===0?'fruit':stage===6?'cell':'dna');
 content.innerHTML='<div class="stage-layout enhanced-stage '+(labStates[stage]?'interactive-layout':'')+'">'+left+'<div class="science-visual refined-visual '+(labStates[stage]?'interactive-visual':'')+'">'+right+'</div></div>';
 content.scrollTop=preserveScroll?Math.min(prior,content.scrollHeight-content.clientHeight):0;
 content.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{if(stage===0)prediction=+b.dataset.answer;else answer=+b.dataset.answer;render()}));
 const restart=content.querySelector('#restartBtn');if(restart)restart.addEventListener('click',reset);
 bindHandsOn();
 const reveal=content.querySelector('#revealDna');if(reveal)reveal.addEventListener('click',()=>{dnaRevealed=true;render(true)});
}
function reset(){stage=0;prediction=null;answer=null;completed=false;actions.mash=0;actions.soap=false;actions.salt=false;actions.filter=false;actions.alcohol=0;mixStirs=0;dnaRevealed=false;pouring=false;render()}
function openModal(){reset();modal.hidden=false;document.body.classList.add('modal-open');document.getElementById('closeModal').focus()}
function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');document.getElementById('launchBtn').focus()}
document.getElementById('launchBtn').addEventListener('click',openModal);
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();if(e.key==='Tab'&&!modal.hidden){const list=[...modal.querySelectorAll('button:not(:disabled),[role="button"][tabindex="0"]')].filter(el=>!el.closest('[hidden]'));if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
backBtn.addEventListener('click',()=>{if(stage>0){stage--;completed=false;render()}});
nextBtn.addEventListener('click',()=>{if(!stageReady()&&!completed)return;if(completed){closeModal();return}if(stage<steps.length-1)stage++;else{completed=true;try{localStorage.setItem('discovery-lab-dna-completed','true')}catch(e){}}render()});
