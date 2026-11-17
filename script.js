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
 {name:'Mix',heading:'Add detergent, salt, then stir',sub:'Add dish soap and salt to the mashed strawberry. Then stir gently to mix the ingredients before filtering. Soap helps disrupt cell membranes, while salt supports DNA precipitation later.'},
 {name:'Filter',heading:'Separate the solid pulp',sub:'Pour the strawberry mixture through a coffee filter. Larger bits of fruit remain behind while liquid carrying DNA passes through.'},
 {name:'Precipitate',heading:'Carefully add cold alcohol',sub:'Gently layer cold rubbing alcohol over the filtered strawberry liquid. DNA is less soluble in alcohol and begins to gather at the boundary.'},
 {name:'Discover',heading:'Watch the DNA appear',sub:'Keep the alcohol and strawberry extract in separate layers: do not stir them together. Look at the interface as cloudy DNA-rich strands precipitate and become visible.'},
 {name:'Reflect',heading:'Think like a scientist',sub:'Why did adding cold alcohol make the DNA easier to see?'}
];
let stage=0,prediction=null,answer=null,completed=false,dnaRevealed=false,pouring=false;
let interactionEpoch=0;
let microscopeLevel=0,spoolProgress=0,whatIfChoice=null,whatIfPrediction=null,whatIfSeen=false;
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


const actions={mash:0,soap:false,salt:false,filter:false,alcohol:0};
const maxMash=7,maxPour=5;
const labStates={
 1:{id:'mash',title:'Drag the masher over the fruit',tip:'Press and move the masher around the bowl. Each stroke breaks down more strawberry tissue.'},
 2:{id:'mix',title:'Add soap, add salt, and stir',tip:'Add soap and salt to the SAME bowl, then stir gently four times before filtering.'},
 3:{id:'filter',title:'Filter the prepared strawberry mixture',tip:'You already added dish soap and salt. Drag the mixed extract onto the paper-lined funnel. Pulp stays in the filter; the liquid passes into the jar.'},
 4:{id:'alcohol',title:'Carefully layer the cold alcohol',tip:'Tap “Pour a little alcohol” to see an actual pouring animation, or drag the bottle to the jar. Keep the two layers separate; do not stir. Real rubbing alcohol requires adult supervision.'}
};
function stageReady(){return stage===0?prediction!==null&&microscopeLevel===3:stage===1?actions.mash>=maxMash:stage===2?actions.soap&&actions.salt&&mixStirs>=requiredStirs:stage===3?actions.filter:stage===4?actions.alcohol>=maxPour:stage===5?dnaRevealed&&spoolProgress>=5:stage===6?answer!==null&&whatIfSeen:true;}
function pct(n,d){return Math.round(n/d*100);}
function bowlScene(mode){
 return '<div class="lab-vessel mash-bowl" data-dropzone="'+(mode==='mash'?'mash':'mix')+'"><svg class="mash-scene" viewBox="0 0 260 250" role="img" aria-label="Glass bowl with strawberry pieces and mashed pulp contained inside"><defs><linearGradient id="bowlGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#d8f4ff" stop-opacity=".3"/><stop offset=".42" stop-color="#c6eafd" stop-opacity=".05"/><stop offset="1" stop-color="#92bedf" stop-opacity=".32"/></linearGradient><linearGradient id="pulpGradient" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#f8778c"/><stop offset=".53" stop-color="#d63a5e"/><stop offset="1" stop-color="#982049"/></linearGradient><clipPath id="bowlInner"><path d="M21 48 Q29 185 56 212 Q83 239 130 239 Q177 239 204 212 Q232 177 239 48Z"/></clipPath></defs><ellipse cx="131" cy="242" rx="99" ry="7" fill="#07112b" opacity=".45"/><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48Z" fill="url(#bowlGlass)" stroke="none"/><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48" fill="none" stroke="#b5d4e9" stroke-width="5"/><g clip-path="url(#bowlInner)"><path d="M21 138 Q70 129 130 137 Q182 128 239 138 L245 258H15Z" fill="url(#pulpGradient)"/><path d="M21 139 Q75 128 130 136 Q192 128 239 138" stroke="#ffb4bb" stroke-width="5" opacity=".75" fill="none"/><g class="pulp-chunks" style="--mash:'+(actions.mash/maxMash)+'">'+Array.from({length:17},(_,i)=>{const x=40+(i*43)%183,y=149+(i*37)%71;return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(6+i%4*2)+'" ry="'+(4+i%3*2)+'" fill="'+(i%3===0?'#ff98a3':i%3===1?'#bd244d':'#f66579')+'" opacity=".8"/>'}).join('')+'</g><g class="pulp-fibers" style="--mash:'+(actions.mash/maxMash)+'">'+Array.from({length:24},(_,i)=>{let x=36+(i*47)%188,y=150+(i*23)%76;return '<path d="M'+x+' '+y+'q8-5 13 2" stroke="'+(i%2?'#ffadb5':'#9a1943')+'" fill="none" stroke-width="2" opacity=".65"/>'}).join('')+'</g><path d="M40 78L49 203" stroke="#eefbff" stroke-width="8" opacity=".12" stroke-linecap="round"/></g><path d="M18 48 Q23 188 55 216 Q85 244 130 244 Q177 244 207 216 Q238 181 242 48" fill="none" stroke="#dcf7ff" stroke-opacity=".43" stroke-width="4"/><path d="M17 48 A113 23 0 0 1 243 48" fill="none" stroke="#d1edf8" stroke-width="7"/><path d="M36 46 Q125 19 225 44" stroke="white" stroke-opacity=".35" stroke-width="3" fill="none"/>'+(mode==='mix'&&actions.soap?'<g class="soap-foam"><ellipse cx="131" cy="136" rx="101" ry="12" fill="#ffe7eb" fill-opacity=".48"/><circle cx="75" cy="133" r="8" fill="#fffafc" fill-opacity=".82"/><circle cx="112" cy="130" r="6" fill="#fffafc" fill-opacity=".72"/><circle cx="163" cy="130" r="9" fill="#fffafc" fill-opacity=".84"/><circle cx="198" cy="134" r="5" fill="#fffafc" fill-opacity=".78"/></g>':'')+(mode==='mix'&&actions.salt?'<g class="salt-fall"><circle cx="85" cy="148" r="2.3" fill="#fff8e5"/><circle cx="111" cy="153" r="1.8" fill="#fff8e5"/><circle cx="138" cy="161" r="2" fill="#fff8e5"/><circle cx="164" cy="148" r="2.3" fill="#fff8e5"/><circle cx="185" cy="162" r="1.8" fill="#fff8e5"/></g>':'')+'</svg></div>';
}
function alcoholVesselScene(showDNA){
 return '<div class="lab-vessel alcohol-station" data-dropzone="alcohol"><svg class="alcohol-scene" viewBox="0 0 260 260" role="img" aria-label="Open glass vessel with filtered strawberry extract and cold alcohol layered on top"><defs><linearGradient id="alcoholGlass" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c4ebff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#b7dff4" stop-opacity=".35"/></linearGradient><linearGradient id="alcoholPink" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e58ba5"/><stop offset="1" stop-color="#a63866"/></linearGradient><clipPath id="alcoholInterior"><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47Z"/></clipPath></defs><ellipse cx="130" cy="237" rx="100" ry="8" fill="#03112b" opacity=".36"/><g clip-path="url(#alcoholInterior)"><path d="M38 154Q130 151 222 154V233H38Z" fill="url(#alcoholPink)"/><rect x="39" y="'+(154-actions.alcohol/maxPour*49)+'" width="182" height="'+(actions.alcohol/maxPour*49)+'" fill="#c1e9f6" fill-opacity=".7"/>'+(actions.alcohol>=maxPour?'<path d="M75 155q16-12 29 0t27-1t27 0t27 1" fill="none" stroke="#fff8ed" stroke-width="3" opacity=".8"/>':'')+'</g><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47Z" fill="url(#alcoholGlass)" stroke="none"/><path d="M42 47V178Q42 227 130 227Q218 227 218 178V47" fill="none" stroke="#c9e9f8" stroke-width="5"/><ellipse cx="130" cy="47" rx="88" ry="15" fill="#bedef2" fill-opacity=".09" stroke="#d4effb" stroke-width="5"/>'+(showDNA?'<g class="dna-precipitate-svg '+(dnaRevealed?'shown':'')+'"><path d="M68 116 Q86 97 101 117 T137 114 T174 111 T200 116" fill="none" stroke="#fff9e8" stroke-width="4" stroke-linecap="round"/><path d="M81 128 Q99 108 119 124 T162 121 T187 128" fill="none" stroke="#f5f5e8" stroke-width="3" stroke-linecap="round"/><path d="M94 110 Q104 101 113 112 M149 119 Q158 106 169 115" fill="none" stroke="#fff8ef" stroke-width="3" stroke-linecap="round"/></g>':'')+'</svg></div>';
}
function labMarkup(){
 if(!labStates[stage])return '';
 const item=labStates[stage];
 const progress=stage===1?pct(actions.mash,maxMash):stage===2?Math.round((Number(actions.soap)+Number(actions.salt)+mixStirs/requiredStirs)/3*100):stage===3?(actions.filter?100:0):pct(actions.alcohol,maxPour);
 const ready=progress===100;
 const tool=stage===1?'<div class="lab-tool masher" role="button" tabindex="0" aria-label="Drag masher through the strawberry pulp" data-tool="mash"><span class="tool-top"></span><span class="tool-shaft"></span><span class="tool-base"></span></div>':
 stage===2?'<div class="lab-tool reagent-tool soap-prop '+(actions.soap?'tool-done':'')+'" role="button" tabindex="0" aria-label="Drag dish soap into the bowl" data-tool="soap"><svg viewBox="0 0 88 166" aria-hidden="true"><defs><linearGradient id="soapBody" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#3c9ba8"/><stop offset=".5" stop-color="#a5e6de"/><stop offset="1" stop-color="#357f90"/></linearGradient></defs><path d="M36 23V12h17V5h23v12H57v9" fill="none" stroke="#c7e8ef" stroke-width="7" stroke-linecap="round"/><rect x="18" y="24" width="53" height="132" rx="18" fill="url(#soapBody)" stroke="#d3f4f1" stroke-width="2"/><rect x="23" y="78" width="43" height="46" rx="7" fill="#f2faf5"/><text x="44" y="96" text-anchor="middle" font-size="15" font-weight="bold" fill="#1b5666">DISH</text><text x="44" y="115" text-anchor="middle" font-size="15" font-weight="bold" fill="#1b5666">SOAP</text><path d="M27 38Q34 30 40 35" stroke="#f2ffff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/></svg></div><div class="lab-tool reagent-tool salt-prop '+(actions.salt?'tool-done':'')+'" role="button" tabindex="0" aria-label="Drag salt into the bowl" data-tool="salt"><svg viewBox="0 0 74 126" aria-hidden="true"><defs><linearGradient id="saltBody" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#dae6ee"/><stop offset=".5" stop-color="#fff"/><stop offset="1" stop-color="#c5d7df"/></linearGradient></defs><rect x="12" y="32" width="50" height="89" rx="12" fill="url(#saltBody)" stroke="#cfe4eb" stroke-width="3"/><rect x="8" y="19" width="58" height="20" rx="6" fill="#a9c2cf" stroke="#e6f1f7" stroke-width="3"/><circle cx="24" cy="27" r="2.2" fill="#536f80"/><circle cx="37" cy="27" r="2.2" fill="#536f80"/><circle cx="50" cy="27" r="2.2" fill="#536f80"/><rect x="17" y="61" width="40" height="36" rx="5" fill="#fff8ef"/><text x="37" y="83" font-size="17" font-weight="bold" fill="#304758" text-anchor="middle">SALT</text></svg></div>'+((actions.soap&&actions.salt)?'<div class="lab-tool lab-stirrer" role="button" tabindex="0" aria-label="Stir the strawberry mixture" data-tool="stir"><span class="stir-handle"></span></div>':''):
 stage===3?'<div class="lab-tool mixing-cup '+(actions.filter?'tool-done':'')+'" role="button" tabindex="0" aria-label="Pour the strawberry mixture containing soap and salt through the filter" data-tool="filter"><span class="cup-mixture"></span><span class="cup-label">MIXED<br>EXTRACT</span></div>':
 '<div class="lab-tool bottle alcohol '+(ready?'tool-done':'')+'" role="button" tabindex="0" aria-label="Pour cold alcohol into jar" data-tool="alcohol"><span class="lid"></span><span class="bottle-label">COLD<br>ALCOHOL</span></div>';
 const vessel=(stage===1||stage===2)?bowlScene(stage===1?'mash':'mix'):
 stage===3?'<div class="lab-vessel filter-station" data-dropzone="filter"><svg class="filter-scene" viewBox="0 0 290 310" role="img" aria-label="Coffee filter in a funnel above a glass receiving jar. '+(actions.filter?'Strawberry residue remains in the filter and filtered extract collects in the jar.':'The filter is ready, and the receiving jar is still empty.')+'"><defs><linearGradient id="filGlass" x1="0" x2="1"><stop stop-color="#b7e4ff" stop-opacity=".32"/><stop offset=".5" stop-color="#cfeeff" stop-opacity=".06"/><stop offset="1" stop-color="#c4eaff" stop-opacity=".4"/></linearGradient><linearGradient id="filLiquid" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#d77b9e"/><stop offset="1" stop-color="#a33d71"/></linearGradient><clipPath id="jarInterior"><path d="M93 174H204L200 283Q200 296 187 298H110Q99 297 98 284Z"/></clipPath></defs><ellipse cx="151" cy="298" rx="101" ry="10" fill="#050f2e" opacity=".37"/><path d="M87 170H210L204 284Q202 302 187 303H109Q94 302 92 284Z" fill="url(#filGlass)" stroke="#d5edfc" stroke-width="5"/><g clip-path="url(#jarInterior)">'+(actions.filter?'<path d="M96 253Q148 250 205 253V313H96Z" fill="url(#filLiquid)"/><path d="M95 253Q151 248 205 253" fill="none" stroke="#f6b1c1" stroke-width="3"/>':'')+'</g><ellipse cx="148" cy="170" rx="61" ry="9" fill="#bfe8fb" fill-opacity=".13" stroke="#d5edfc" stroke-width="4"/><path d="M64 42H232L167 157H129Z" fill="#acd1df" fill-opacity=".37" stroke="#bedfee" stroke-width="5" stroke-linejoin="round"/><path d="M82 51H215L164 141H131Z" fill="#f5ebd8" stroke="#fff5e4" stroke-width="3" stroke-linejoin="round"/><path d="M86 64Q148 77 211 64" stroke="#d2c7af" stroke-width="2" fill="none"/>'+(actions.filter?'<path d="M91 72Q147 67 205 72L184 107Q166 113 147 108Q126 115 107 106Z" fill="#9e3f5e"/><path d="M111 82Q126 76 141 84T174 82" stroke="#da7b87" stroke-width="6" fill="none" opacity=".7"/><circle cx="145" cy="92" r="5" fill="#7a2a48"/><circle cx="164" cy="100" r="4" fill="#cc6b7f"/>':'')+'<path d="M148 153V170" stroke="#c1e0ef" stroke-width="5" opacity=".7"/>'+(actions.filter?'<path d="M148 155v18" stroke="#e1a6b7" stroke-width="3" stroke-dasharray="3 4"/>':'')+'</svg><span class="filter-residue-label">'+(actions.filter?'PULP REMAINS IN FILTER':'FILTER READY')+'</span></div>':
 alcoholVesselScene(false);
 return '<div class="hands-on"><div class="lab-status"><div class="lab-status-top"><span class="lab-status-label">'+(stage===1?'MASH THE STRAWBERRY':stage===2?'ADD SOAP · SALT · STIR':stage===3?'FILTER THE EXTRACT':'LAYER THE ALCOHOL')+'</span><strong class="lab-status-value">'+progress+'%</strong></div><div class="activity-track"><div id="activityFill" style="width:'+progress+'%"></div></div><div class="lab-instruction">'+item.tip+'</div></div><div class="lab-workbench" id="workbench" aria-label="Interactive laboratory equipment"><div class="bench-surface"></div><div class="target-ring"></div>'+vessel+tool+(stage===1?'<svg class="bowl-liquid-front" viewBox="0 0 260 250" aria-hidden="true"><defs><clipPath id="mashLiquidFrontClip"><path d="M21 48 Q29 185 56 212 Q83 239 130 239 Q177 239 204 212 Q232 177 239 48Z"/></clipPath></defs><g clip-path="url(#mashLiquidFrontClip)"><path d="M21 138 Q70 129 130 137 Q182 128 239 138 L245 258 H15 Z" fill="#c94266" fill-opacity=".30"/></g></svg>':'')+(stage===1||stage===2?'<svg class="bowl-front-lip" viewBox="0 0 260 250" aria-hidden="true"><path d="M17 48 A113 23 0 0 0 243 48" fill="none" stroke="#d1edf8" stroke-width="7"/></svg>':'')+(stage===3?'<svg class="filter-pour-stream" viewBox="0 0 290 310" aria-hidden="true"><path d="M126 6 Q133 24 145 53" fill="none" stroke="#e6a2b5" stroke-width="9" stroke-linecap="round"/></svg>':'')+(stage===4?'<svg class="pour-stream" viewBox="0 0 260 260" aria-hidden="true"><path class="alcohol-flow" d="M74 3 Q89 31 111 76" fill="none" stroke="#c7f4ff" stroke-width="6" stroke-linecap="round"/></svg>':stage===2?'<div class="reagent-pour" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="mix-surface-ripple" aria-hidden="true"></div>':'')+'</div><div class="lab-controls"><button type="button" id="assistBtn" class="button secondary">'+(stage===1?'Mash once':stage===2?(actions.soap?(actions.salt?'Stir mixture':'Add salt'):'Add detergent'):stage===3?'Pour through filter':'Pour a little alcohol')+'</button><span class="lab-result" id="labResult" role="status">'+(ready?'✓ Step complete. Continue when ready.':'Drag the tool, or use the action button.')+'</span></div></div>';
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
function pulpGeometry(bench){
 const svg=bench.querySelector('.mash-scene');
 if(!svg||!svg.getScreenCTM())return null;
 const matrix=svg.getScreenCTM();
 const inverse=matrix.inverse();
 const toScreen=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix)};
 const toLocal=(x,y)=>{const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(inverse)};
 const contains=(x,y)=>{
  const p=toLocal(x,y);
  if(p.y<157||p.y>211)return false;
  const halfWidth=84*Math.sqrt(Math.max(.08,1-Math.pow((p.y-155)/102,2)));
  return Math.abs(p.x-130)<Math.max(28,halfWidth-18);
 };
 return {toScreen,toLocal,contains};
}
function toolHeadPoint(el,type){
 const part=type==='mash'?el.querySelector('.tool-base'):type==='stir'?el.querySelector('.stir-handle'):el;
 if(!part)return null;
 const r=part.getBoundingClientRect();
 if(type==='soap'||type==='salt')return {x:r.left+r.width/2,y:r.top+r.height*.18};
 return {x:r.left+r.width/2,y:r.bottom-(type==='mash'?r.height*.5:5)};
}
function placeMasherInPulp(bench){
 const el=bench.querySelector('.lab-tool.masher');
 const g=pulpGeometry(bench);
 if(!el||!g)return;
 const dest=g.toScreen(130,182);
 const point=toolHeadPoint(el,'mash');
 if(!point)return;
 const dx=dest.x-point.x,dy=dest.y-point.y;
 el.style.left=(el.offsetLeft+dx)+'px';
 el.style.top=(el.offsetTop+dy)+'px';
 const shaft=el.querySelector('.tool-shaft');
 if(shaft){
  const surface=g.toScreen(130,137).y;
  const rect=shaft.getBoundingClientRect();
  const threshold=Math.max(0,Math.min(100,(surface-rect.top)/rect.height*100));
  shaft.style.setProperty('--shaft-submerge-at',threshold.toFixed(1)+'%');
 }
}
function startMashAnimation(){
 if(pouring||stage!==1||actions.mash>=maxMash)return;
 const bench=content.querySelector('#workbench');
 const el=bench&&bench.querySelector('.masher');
 const g=bench&&pulpGeometry(bench);
 if(!el||!g){applyAction('mash');return;}
 pouring=true;
 const ticket=interactionEpoch;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=reduced?1:560;
 const swing=el.animate([
  {transform:'translate(0,0)',offset:0},
  {transform:'translate(-10px,-5px) rotate(-5deg)',offset:.2},
  {transform:'translate(11px,3px) rotate(5deg)',offset:.48},
  {transform:'translate(-7px,5px) rotate(-4deg)',offset:.72},
  {transform:'translate(0,0)',offset:1}
 ],{duration,easing:'ease-in-out',fill:'none'});
 bench.classList.add('mash-in-progress');
 bench.querySelectorAll('.pulp-chunks,.pulp-fibers').forEach(chunk=>chunk.animate([
  {transform:'translateX(0)',offset:0},
  {transform:'translateX(-7px)',offset:.25},
  {transform:'translateX(7px)',offset:.55},
  {transform:'translateX(0)',offset:1}
 ],{duration,easing:'ease-in-out'}));
 swing.onfinish=()=>{if(ticket!==interactionEpoch)return;pouring=false;applyAction('mash')};
 swing.oncancel=()=>{pouring=false};
}
function bowlContact(bench,tool,xRatio=.5,yRatio=.44,anchor='bottom'){
 const geometry=pulpGeometry(bench);
 if(!geometry||!tool)return;
 const target=geometry.toScreen(260*xRatio,250*yRatio);
 const bounds=tool.getBoundingClientRect();
 const pointX=bounds.left+bounds.width*.5;
 const pointY=anchor==='top'?bounds.top+bounds.height*.15:bounds.bottom-8;
 tool.style.setProperty('--target-x',(target.x-pointX).toFixed(1)+'px');
 tool.style.setProperty('--target-y',(target.y-pointY).toFixed(1)+'px');
}
function runIngredientAnimation(type){
 if(pouring||stage!==2||!['soap','salt'].includes(type))return;
 if(type==='soap'&&actions.soap)return;
 if(type==='salt'&&(!actions.soap||actions.salt))return;
 const bench=content.querySelector('#workbench');
 const bottle=bench&&bench.querySelector('[data-tool="'+type+'"]');
 const g=bench&&pulpGeometry(bench);
 if(!bottle||!g){applyAction(type);return;}
 pouring=true;
 const ticket=interactionEpoch;
 const isSoap=type==='soap';
 const b=bottle.getBoundingClientRect();
 const angle=isSoap?65:-65;
 const start=g.toScreen(isSoap?53:190,isSoap?22:28);
 const end=g.toScreen(isSoap?65:185,139);
 let dx,dy;
 if(isSoap){
  const pivotX=b.left+b.width*.5,pivotY=b.top+b.height*.15;
  const nozzleX=b.left+b.width*(76/88),nozzleY=b.top+b.height*(16/166);
  const rad=angle*Math.PI/180;
  const rotatedX=pivotX+(nozzleX-pivotX)*Math.cos(rad)-(nozzleY-pivotY)*Math.sin(rad);
  const rotatedY=pivotY+(nozzleX-pivotX)*Math.sin(rad)+(nozzleY-pivotY)*Math.cos(rad);
  dx=start.x-rotatedX;
  dy=start.y-rotatedY;
 }else{
  const rim=g.toScreen(226,48);
  dx=rim.x+20-(b.left+b.width/2);
  dy=rim.y+3-(b.top+b.height/2);
 }
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=reduced?1:1050;
 const stream=bench.querySelector('.reagent-pour');
 if(stream){
  const br=bench.getBoundingClientRect();
  stream.style.left=(start.x-br.left-8)+'px';
  stream.style.top=(start.y-br.top)+'px';
  stream.style.height=Math.max(20,end.y-start.y)+'px';
  stream.style.setProperty('--drop-distance',Math.max(20,end.y-start.y)+'px');
 }
 const transform=(x,y,r)=>'translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+r+'deg)';
 bench.classList.add('adding-'+type);
 const anim=bottle.animate([
  {transform:transform(0,0,0),offset:0},
  {transform:transform(dx,dy,0),offset:.28},
  {transform:transform(dx,dy,angle),offset:.43},
  {transform:transform(dx,dy,angle),offset:.73},
  {transform:transform(dx,dy,0),offset:.87},
  {transform:transform(0,0,0),offset:1}
 ],{duration,easing:'ease-in-out',fill:'none'});
 anim.onfinish=()=>{if(ticket!==interactionEpoch)return;pouring=false;applyAction(type)};
 anim.oncancel=()=>{pouring=false};
}
function startStirAnimation(){
 if(pouring||stage!==2||!actions.soap||!actions.salt||mixStirs>=requiredStirs)return;
 pouring=true;
 const ticket=interactionEpoch;
 const bench=content.querySelector('#workbench');
 const stirrer=bench&&bench.querySelector('.lab-stirrer');
 if(!stirrer){pouring=false;applyAction('stir');return;}
 stirrer.classList.add('auto-stir');
 bench.classList.add('stir-in-progress');
 let called=false;
 const finish=()=>{if(called||ticket!==interactionEpoch)return;called=true;pouring=false;applyAction('stir')};
 stirrer.addEventListener('animationend',finish,{once:true});
 setTimeout(finish,680);
}
function startFilterAnimation(){
 if(pouring||stage!==3||actions.filter)return;
 const bench=content.querySelector('#workbench');
 const cup=bench&&bench.querySelector('.mixing-cup');
 const filter=bench&&bench.querySelector('.filter-scene');
 const stream=bench&&bench.querySelector('.filter-pour-stream');
 if(!bench||!cup||!filter||!stream){return;}
 pouring=true;
 const ticket=interactionEpoch;
 const matrix=filter.getScreenCTM();
 if(!matrix){pouring=false;return;}
 const svgPoint=(x,y)=>{const p=filter.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix)};
 const spot=svgPoint(92,-5);
 const cupRect=cup.getBoundingClientRect();
 const dx=spot.x-(cupRect.left+cupRect.width/2);
 const dy=spot.y-(cupRect.top+cupRect.height/2);
 const station=filter.getBoundingClientRect(),benchRect=bench.getBoundingClientRect();
 stream.style.left=(station.left-benchRect.left)+'px';
 stream.style.top=(station.top-benchRect.top)+'px';
 stream.style.width=station.width+'px';
 stream.style.height=station.height+'px';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=reduced?1:1350;
 const pose=(x,y,deg)=>'translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+deg+'deg)';
 bench.classList.add('filter-pouring');
 const motion=cup.animate([
  {transform:pose(0,0,0),offset:0},
  {transform:pose(dx,dy,0),offset:.23},
  {transform:pose(dx,dy,67),offset:.36},
  {transform:pose(dx,dy,67),offset:.76},
  {transform:pose(dx,dy,0),offset:.88},
  {transform:pose(0,0,0),offset:1}
 ],{duration,easing:'ease-in-out',fill:'none'});
 const path=stream.querySelector('path');
 if(path){
  path.animate([
   {opacity:0,strokeDashoffset:105,offset:0},
   {opacity:0,strokeDashoffset:105,offset:.34},
   {opacity:1,strokeDashoffset:0,offset:.43},
   {opacity:1,strokeDashoffset:0,offset:.74},
   {opacity:0,strokeDashoffset:105,offset:.84},
   {opacity:0,strokeDashoffset:105,offset:1}
  ],{duration,easing:'linear',fill:'none'});
 }
 motion.onfinish=()=>{if(ticket!==interactionEpoch)return;pouring=false;applyAction('filter')};
 motion.oncancel=()=>{pouring=false};
}
function startPourAnimation(){
 if(pouring||stage!==4||actions.alcohol>=maxPour)return;
 const bench=content.querySelector('#workbench');
 const bottle=bench&&bench.querySelector('.lab-tool.alcohol');
 const vessel=bench&&bench.querySelector('.alcohol-scene');
 const stream=bench&&bench.querySelector('.pour-stream');
 if(!bench||!bottle||!vessel){applyAction('alcohol');return;}
 pouring=true;
 const ticket=interactionEpoch;
 const matrix=vessel.getScreenCTM();
 const svgPoint=(x,y)=>{const p=vessel.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(matrix)};
 const mouth=svgPoint(72,42);
 const b=bottle.getBoundingClientRect();
 const dx=mouth.x-28-(b.left+b.width/2),dy=mouth.y-(b.top+b.height/2);
 if(stream){
  const v=vessel.getBoundingClientRect(),w=bench.getBoundingClientRect();
  stream.style.left=(v.left-w.left)+'px';
  stream.style.top=(v.top-w.top)+'px';
  stream.style.width=v.width+'px';
  stream.style.height=v.height+'px';
  stream.classList.add('visible');
 }
 bench.classList.add('is-pouring');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const duration=reduced?1:1150;
 const pose=(x,y,r)=>'translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+r+'deg)';
 const motion=bottle.animate([
  {transform:pose(0,0,0),offset:0},
  {transform:pose(dx,dy,0),offset:.24},
  {transform:pose(dx,dy,68),offset:.38},
  {transform:pose(dx,dy,68),offset:.76},
  {transform:pose(dx,dy,0),offset:.88},
  {transform:pose(0,0,0),offset:1}
 ],{duration,easing:'ease-in-out',fill:'none'});
 motion.onfinish=()=>{if(ticket!==interactionEpoch)return;pouring=false;applyAction('alcohol')};
 motion.oncancel=()=>{pouring=false};
}
function placeStirrerInBowl(bench){
 const bowl=bench.querySelector('.mash-bowl');
 const stirrer=bench.querySelector('.lab-stirrer');
 if(!bowl||!stirrer)return;
 const b=bowl.getBoundingClientRect();
 const w=bench.getBoundingClientRect();
 const rodHeight=stirrer.offsetHeight;
 const x=b.left-w.left+b.width*.51;
 const pulpY=b.top-w.top+b.height*.76;
 const surfaceY=b.top-w.top+b.height*(137/250);
 const rodTop=pulpY-rodHeight+8;
 stirrer.style.left=(x-stirrer.offsetWidth/2)+'px';
 stirrer.style.top=rodTop+'px';
 stirrer.style.setProperty('--submerge-at',Math.max(0,Math.min(100,(surfaceY-rodTop)/rodHeight*100)).toFixed(1)+'%');
}
function alignBowlElements(bench){
 const bowl=bench.querySelector('.mash-bowl');
 const overlay=bench.querySelector('.bowl-front-lip');
 const liquidOverlay=bench.querySelector('.bowl-liquid-front');
 const stream=bench.querySelector('.reagent-pour');
 if(!bowl)return;
 if(overlay){
  overlay.style.left=bowl.offsetLeft+'px';
  overlay.style.top=bowl.offsetTop+'px';
  overlay.style.width=bowl.offsetWidth+'px';
  overlay.style.height=bowl.offsetHeight+'px';
 }
 if(liquidOverlay){
  liquidOverlay.style.left=bowl.offsetLeft+'px';
  liquidOverlay.style.top=bowl.offsetTop+'px';
  liquidOverlay.style.width=bowl.offsetWidth+'px';
  liquidOverlay.style.height=bowl.offsetHeight+'px';
 }
 if(stream){
  const g=pulpGeometry(bench);
  if(g){
   const start=g.toScreen(130,83),end=g.toScreen(130,138);
   const rect=bench.getBoundingClientRect();
   stream.style.left=(start.x-rect.left-10)+'px';
   stream.style.top=(start.y-rect.top)+'px';
   stream.style.height=Math.max(20,end.y-start.y)+'px';
   stream.style.setProperty('--drop-distance',Math.max(20,end.y-start.y)+'px');
  }
 }
}
function bindHandsOn(){
 const bench=content.querySelector('#workbench');
 if(!bench)return;
 alignBowlElements(bench);
 placeMasherInPulp(bench);
 placeStirrerInBowl(bench);
 const controls=content.querySelector('.lab-controls');
 if(controls){bench.appendChild(controls);controls.classList.add('bench-controls');}
 const assist=content.querySelector('#assistBtn');
 assist.addEventListener('click',()=>{
  if(stage===1)startMashAnimation();
  else if(stage===2){if(!actions.soap)runIngredientAnimation('soap');else if(!actions.salt)runIngredientAnimation('salt');else startStirAnimation();}
  else if(stage===3)startFilterAnimation();
  else startPourAnimation();
 });
 bench.querySelectorAll('.lab-tool').forEach(el=>{
  const type=el.dataset.tool;
  const bowlTools=['mash','stir','soap','salt'].includes(type);
  let dragging=false,startX=0,startY=0,strokeCount=0,lastStroke=0,prior=null;
  let entered=false,validAtEnd=false,initialTip=null,validDX=0,validDY=0;
  let pending=null,frame=0;
  const target=bench.querySelector('[data-dropzone]');
  const geometry=bowlTools?pulpGeometry(bench):null;
  const chunks=type==='mash'?[...bench.querySelectorAll('.pulp-chunks,.pulp-fibers')]:[];
  let dropRect=null;
  const nonBowlHit=(x,y)=>dropRect&&x>=dropRect.left&&x<=dropRect.right&&y>=dropRect.top&&y<=dropRect.bottom;
  const tipValid=(p)=>{
   if(!geometry||!p)return false;
   if(type==='mash'||type==='stir')return geometry.contains(p.x,p.y);
   const local=geometry.toLocal(p.x,p.y);
   return local.x>=63&&local.x<=196&&local.y>=20&&local.y<=112;
  };
  const updateDrag=(clientX,clientY)=>{
   if(!dragging)return;
   let dx=clientX-startX,dy=clientY-startY;
   if(bowlTools){
    let current={x:initialTip.x+dx,y:initialTip.y+dy};
    let valid=tipValid(current);
    if(!valid&&entered){
     dx=validDX;dy=validDY;
     current={x:initialTip.x+dx,y:initialTip.y+dy};
     valid=tipValid(current);
    }
    validAtEnd=Boolean(valid);
    bench.classList.toggle('target-active',validAtEnd);
    if(validAtEnd){
     entered=true;validDX=dx;validDY=dy;
     if(type==='mash'||type==='stir'){
      const distance=prior?Math.hypot(current.x-prior.x,current.y-prior.y):0;
      if(distance>=7&&performance.now()-lastStroke>=145){
       lastStroke=performance.now();
       strokeCount=Math.min(type==='mash'?maxMash:requiredStirs,strokeCount+1);
       if(type==='mash'){
        const ratio=Math.min(1,(actions.mash+strokeCount)/maxMash);
        chunks.forEach(node=>node.style.setProperty('--mash',ratio));
       }
      }
      prior=current;
     }
    }else prior=null;
   }else{
    validAtEnd=Boolean(nonBowlHit(clientX,clientY));
    bench.classList.toggle('target-active',validAtEnd);
   }
   el.style.transform='translate('+dx.toFixed(1)+'px,'+dy.toFixed(1)+'px)';
  };
  el.addEventListener('pointerdown',e=>{
   if(pouring||el.classList.contains('tool-done'))return;
   if(type==='salt'&&!actions.soap)return;
   if(type==='stir'&&!(actions.soap&&actions.salt))return;
   e.preventDefault();
   dragging=true;strokeCount=0;lastStroke=0;entered=false;prior=null;
   startX=e.clientX;startY=e.clientY;
   initialTip=toolHeadPoint(el,type);
   dropRect=target.getBoundingClientRect();
   validAtEnd=Boolean(bowlTools&&tipValid(initialTip));
   if(validAtEnd){entered=true;prior=initialTip;validDX=0;validDY=0;}
   el.setPointerCapture(e.pointerId);el.classList.add('dragging');
  });
  el.addEventListener('pointermove',e=>{
   if(!dragging)return;
   pending={x:e.clientX,y:e.clientY};
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    const point=pending;
    pending=null;
    if(point)updateDrag(point.x,point.y);
   });
  });
  const cleanup=()=>{
   if(frame){cancelAnimationFrame(frame);frame=0}
   pending=null;
   dragging=false;prior=null;
   el.style.transform='';
   el.classList.remove('dragging');
   bench.classList.remove('target-active');
  };
  el.addEventListener('pointerup',e=>{
   if(!dragging)return;
   if(frame){cancelAnimationFrame(frame);frame=0}
   updateDrag(e.clientX,e.clientY);
   const hit=validAtEnd;
   cleanup();
   if(type==='mash'){
    if(strokeCount>0){actions.mash=Math.min(maxMash,actions.mash+strokeCount);render(true)}
   }else if(type==='stir'){
    if(strokeCount>0){mixStirs=Math.min(requiredStirs,mixStirs+strokeCount);render(true)}
   }else if(hit){
    if(type==='soap'||type==='salt')runIngredientAnimation(type);
    else if(type==='alcohol')startPourAnimation();
    else if(type==='filter')startFilterAnimation();
   }
  });
  el.addEventListener('pointercancel',cleanup);
  el.addEventListener('keydown',e=>{
   if(e.key!=='Enter'&&e.key!==' ')return;
   e.preventDefault();
   if(type==='mash')startMashAnimation();
   else if(type==='stir')startStirAnimation();
   else if(type==='soap'||type==='salt')runIngredientAnimation(type);
   else if(type==='alcohol')startPourAnimation();
   else if(type==='filter')startFilterAnimation();
  });

 });
}
const microscopeViews=[
 {title:'Strawberry',caption:'A strawberry is made of many tiny cells.',graphic:'<g transform="translate(120 110) scale(.9) translate(-120 -110)"><path d="M120 52 C91 46 75 65 76 96 C76 131 94 164 120 185 C146 164 164 132 164 96 C165 65 149 46 120 52 Z" fill="#E95B79" stroke="#FF9FB0" stroke-width="4"/><path d="M120 51 C109 39 96 39 87 48 M120 51 C131 39 144 39 153 48 M120 49 V34" fill="none" stroke="#7DDBBB" stroke-width="8" stroke-linecap="round"/><path d="M120 51 L105 62 M120 51 L135 62" stroke="#7DDBBB" stroke-width="6" stroke-linecap="round"/><g fill="#FFE8A8">'+[[101,74],[120,72],[139,75],[94,91],[112,90],[130,91],[146,92],[90,110],[108,109],[125,109],[144,110],[96,128],[114,128],[132,128],[102,146],[121,146],[136,144],[113,164],[126,163]].map(([x,y])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="2.6" ry="3.2"/>').join('')+'</g></g>'},
 {title:'Cells',caption:'Plant cells fit together like tiny rooms, each enclosed by a cell wall.',graphic:'<defs><clipPath id="microCellLens"><circle cx="120" cy="110" r="91"/></clipPath></defs><g clip-path="url(#microCellLens)" transform="translate(120 110) scale(.82) translate(-120 -110)"><g fill="#438080" fill-opacity=".43" stroke="#8CE4D4" stroke-width="4" stroke-linejoin="round"><path d="M56 59L117 48L121 111L71 123L45 94Z"/><path d="M126 48L188 64L198 119L123 115L121 111Z"/><path d="M71 125L121 114L137 177L74 178L49 147Z"/><path d="M124 118L198 122L186 177L139 180Z"/></g><g fill="#B3A7EF" stroke="#D6CAFF" stroke-width="2"><circle cx="87" cy="88" r="9"/><circle cx="164" cy="85" r="9"/><circle cx="95" cy="150" r="9"/><circle cx="164" cy="150" r="9"/></g></g>'},
 {title:'Nucleus',caption:'Inside a plant cell, the nucleus contains chromosomes made of DNA.',graphic:'<g><rect x="48" y="39" width="144" height="144" rx="25" fill="#44817F" fill-opacity=".26" stroke="#8AD7D0" stroke-width="4"/><path d="M59 62Q120 45 179 63M62 158Q119 175 181 157" fill="none" stroke="#9DD7DC" stroke-width="2" opacity=".45"/><circle cx="120" cy="110" r="52" fill="#665A9C" stroke="#C5B8F0" stroke-width="5"/><circle cx="120" cy="110" r="44" fill="#7565A8" fill-opacity=".48"/><g fill="none" stroke="#E1D8FF" stroke-width="4.5" stroke-linecap="round"><path d="M87 95Q104 75 118 97T150 97"/><path d="M91 125Q106 143 123 123T151 125"/><path d="M99 107Q113 91 133 109T142 137"/></g><circle cx="112" cy="115" r="8" fill="#BDADEB" opacity=".75"/></g>'},
 {title:'DNA',caption:'DNA is a double helix: two strands linked by paired bases.',graphic:(()=>{
  const x1=y=>120+43*Math.sin((y-25)/160*Math.PI*4+.35);
  const x2=y=>120-43*Math.sin((y-25)/160*Math.PI*4+.35);
  const strand=x=>Array.from({length:85},(_,i)=>(i?'L':'M')+x(25+i*2).toFixed(1)+' '+(25+i*2)).join(' ');
  const pairs=Array.from({length:13},(_,i)=>{
   const y=31+i*13;
   const a=x1(y),b=x2(y);
   const colors=['#A8E5EA','#C3B4F4','#95DACA','#B9D9F4'];
   return '<line x1="'+a.toFixed(1)+'" y1="'+y+'" x2="'+b.toFixed(1)+'" y2="'+y+'" stroke="'+colors[i%4]+'" stroke-width="4" stroke-linecap="round"/>';
  }).join('');
  return '<g fill="none">'+pairs+'<path d="'+strand(x1)+'" stroke="#5CD8C6" stroke-width="7" stroke-linecap="round"/><path d="'+strand(x2)+'" stroke="#B8A5F8" stroke-width="7" stroke-linecap="round"/></g>';
 })()}
];
function microscopeMarkup(){
 const v=microscopeViews[microscopeLevel];
 return '<div class="micro-card"><div class="micro-top"><span>MICROSCOPE STATION</span><span>'+String(microscopeLevel+1)+' / 4</span></div><svg class="micro-window" viewBox="0 0 240 220" role="img" aria-label="'+v.title+' illustration"><circle cx="120" cy="110" r="100" fill="#14293C" stroke="#71D8CB" stroke-width="5"/>'+v.graphic+'</svg><h3>'+v.title+'</h3><p>'+v.caption+'</p><div class="micro-controls"><button type="button" class="button secondary" id="microBack" '+(microscopeLevel===0?'disabled':'')+'>← Back</button><button type="button" class="button primary" id="microNext" '+(microscopeLevel===3?'disabled':'')+'>'+(microscopeLevel===3?'Finished ✓':'Zoom closer →')+'</button></div></div>';
}

function spoolMarkup(){
 return '<div class="spool-station"><div class="spool-visual">'+alcoholVesselScene(true)+'<div class="spool-tool '+(spoolProgress?'has-dna':'')+'" id="spoolTool" role="button" tabindex="0" aria-label="Move the collection rod through the DNA" style="--spool:'+spoolProgress+'"><span class="spool-rod"></span><span class="spool-strands">〰〰</span></div></div><div class="spool-controls"><p>Gently move the collection rod through the pale strands. Collect 5 samples of visible DNA-rich material.</p><div class="spool-track"><div style="width:'+(spoolProgress/5*100)+'%"></div></div><span aria-live="polite">'+spoolProgress+' / 5 collected</span><button type="button" class="button secondary" id="collectDna" '+(spoolProgress>=5?'disabled':'')+'>'+(spoolProgress>=5?'DNA collected ✓':'Gently wind the DNA')+'</button></div></div>';
}
const whatIfTests=[
 {label:'Cold alcohol',question:'What happens with properly chilled alcohol?',choices:['More visible DNA-rich strands can form','Alcohol creates new DNA'],correct:0,result:'Cold alcohol can help DNA precipitate from the watery extract.'},
 {label:'Warm alcohol',question:'What may happen if the alcohol is warm?',choices:['DNA often precipitates less effectively','Warm alcohol creates more DNA'],correct:0,result:'Warm alcohol may reduce visible precipitation. The result also depends on concentration and sample conditions.'},
 {label:'No dish soap',question:'What changes if detergent is skipped?',choices:['Less DNA may be released from cells','The DNA becomes blue'],correct:0,result:'Detergent helps disrupt cell membranes. Without it, extraction may be less effective.'}
];
function whatIfMarkup(){
 const t=whatIfChoice===null?null:whatIfTests[whatIfChoice];
 return '<div class="whatif-card"><div class="micro-top"><span>WHAT-IF LAB</span><span>CHANGE ONE VARIABLE</span></div><p>Choose one condition, predict the outcome, and reveal the scientific explanation.</p><div class="whatif-options">'+whatIfTests.map((x,i)=>'<button type="button" class="whatif-choice '+(whatIfChoice===i?'active':'')+'" data-whatif="'+i+'">'+x.label+'</button>').join('')+'</div>'+(t?'<h3>'+t.question+'</h3><div class="whatif-predictions">'+t.choices.map((v,i)=>'<button type="button" class="choice '+(whatIfPrediction===i?'selected':'')+'" data-whatif-predict="'+i+'">'+v+'</button>').join('')+'</div><button type="button" class="button primary" id="revealWhatIf" '+(whatIfPrediction===null||whatIfSeen?'disabled':'')+'>Reveal result</button>'+(whatIfSeen?'<div class="whatif-result" role="status"><strong>'+(whatIfPrediction===t.correct?'Great prediction!':'Here’s what the evidence suggests:')+'</strong> '+t.result+'</div>':''):'<p class="whatif-empty">Select a condition to begin.</p>')+'</div>';
}
function certificateMarkup(){
 const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
 return '<div class="certificate-screen"><div class="dna-certificate" id="dnaCertificate"><div class="cert-icon">✧</div><span>THE DISCOVERY LAB · EXHIBIT 001</span><h3>DNA Detective</h3><p>Certificate of Discovery</p><strong>Strawberry DNA Extraction</strong><div class="cert-line"></div><small>Completed '+date+'</small><small>Explore · Experiment · Discover</small></div><p>You explored strawberry cells, extracted DNA, collected visible strands, and tested a scientific prediction.</p><div class="cert-actions"><button type="button" class="button primary" id="saveCertificate">Save certificate</button><button class="button secondary" id="restartBtn" type="button">↺ Try again</button></div></div>';
}
function saveCertificate(){
 const date=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
 const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;');
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="640" viewBox="0 0 1000 640"><rect width="1000" height="640" fill="#101D30"/><rect x="35" y="35" width="930" height="570" rx="30" fill="#172F42" stroke="#62E3C2" stroke-width="4"/><circle cx="500" cy="160" r="58" fill="#244E59" stroke="#B6A3F8" stroke-width="4"/><text x="500" y="180" text-anchor="middle" fill="#62E3C2" font-size="65">✧</text><text x="500" y="268" text-anchor="middle" fill="#62E3C2" font-family="Arial" font-size="22" letter-spacing="5">THE DISCOVERY LAB</text><text x="500" y="355" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="78" font-weight="bold">DNA Detective</text><text x="500" y="406" text-anchor="middle" fill="#D4E7EB" font-family="Arial" font-size="27">Certificate of Discovery</text><text x="500" y="468" text-anchor="middle" fill="#B6A3F8" font-family="Arial" font-size="28">Strawberry DNA Extraction</text><path d="M320 505H680" stroke="#62E3C2" stroke-width="3"/><text x="500" y="548" text-anchor="middle" fill="#D4E7EB" font-family="Arial" font-size="22">Completed '+esc(date)+'</text></svg>';
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='discovery-lab-dna-detective.svg';document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
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
 if(stage===0)left+='<div class="lab-tip">Explore all four microscope views, then make your prediction to begin the experiment.</div>';
 if(stage===5&&dnaRevealed)left+='<div class="lab-tip">Now collect five small samples with the virtual collection rod. The strands represent clumps of DNA-rich material, not single molecules.</div>';
 if(stage===6)left+='<div class="lab-tip">Answer the question, then explore one what-if scenario to complete the exhibit.</div>';
 if(stage===5)left+='<div class="lab-tip"><strong>What you actually see:</strong> Many DNA molecules clumped together, not an individual double helix. The extract can contain other material too. Do not stir the alcohol into the strawberry liquid.</div>';
 if(stage===6)left+=options(q2,answer)+(answer!==null?'<div class="feedback" role="status">'+(answer===0?'Correct! ':'Not quite. ')+'Cold alcohol causes DNA to precipitate from the watery mixture.</div>':'');
 if(completed)left='<div class="stage-copy"><span class="stage-kicker">EXHIBIT COMPLETE</span><h2 id="exhibitTitle">Your discovery is complete!</h2><p>You explored the world inside a strawberry, extracted DNA, collected the strands, and tested a scientific prediction.</p></div>';
 else left+='</div>';
 let right;
 if(completed)right=certificateMarkup();
 else if(stage===0)right=microscopeMarkup();
 else if(stage===6)right=whatIfMarkup();
 else if(stage===5)right='<div class="dna-reveal-scene">'+(dnaRevealed?spoolMarkup():'<div class="lab-workbench dna-watch-bench">'+alcoholVesselScene(true)+'</div><p class="dna-stage-caption">Two layers, not stirred together.</p><button type="button" class="button primary" id="revealDna">Watch DNA precipitate</button>')+'</div>';
 else if(labStates[stage])right=labMarkup();
 else right=labScene(stage===0?'fruit':stage===6?'cell':'dna');
 content.innerHTML='<div class="stage-layout enhanced-stage '+(labStates[stage]?'interactive-layout':'')+'">'+left+'<div class="science-visual refined-visual '+(labStates[stage]?'interactive-visual':'')+'">'+right+'</div></div>';
 if(labStates[stage]){
  const status=content.querySelector('.lab-status');
  const copy=content.querySelector('.stage-copy');
  if(status&&copy)copy.appendChild(status);
 }
 content.scrollTop=preserveScroll?Math.min(prior,Math.max(0,content.scrollHeight-content.clientHeight)):0;
 content.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>{if(stage===0)prediction=+b.dataset.answer;else answer=+b.dataset.answer;render()}));
 const restart=content.querySelector('#restartBtn');if(restart)restart.addEventListener('click',reset);
 const save=content.querySelector('#saveCertificate');if(save)save.addEventListener('click',saveCertificate);
 const microNext=content.querySelector('#microNext');if(microNext)microNext.addEventListener('click',()=>{microscopeLevel=Math.min(3,microscopeLevel+1);render(true)});
 const microBack=content.querySelector('#microBack');if(microBack)microBack.addEventListener('click',()=>{microscopeLevel=Math.max(0,microscopeLevel-1);render(true)});
 const spool=()=>{if(spoolProgress>=5)return;spoolProgress++;render(true)};
 const collect=content.querySelector('#collectDna');if(collect)collect.addEventListener('click',spool);
 const rod=content.querySelector('#spoolTool');
 if(rod){
  const visual=rod.closest('.spool-visual');
  const glass=visual&&visual.querySelector('.alcohol-scene');
  const matrix=glass&&glass.getScreenCTM();
  if(matrix){
   const localToScreen=(x,y)=>{
    const point=glass.createSVGPoint();
    point.x=x;point.y=y;
    return point.matrixTransform(matrix);
   };
   const inverse=matrix.inverse();
   const screenToLocal=(x,y)=>{
    const point=glass.createSVGPoint();
    point.x=x;point.y=y;
    return point.matrixTransform(inverse);
   };
   const visualBounds=visual.getBoundingClientRect();
   let tipX=130,tipY=152;
   const position=(x,y)=>{
    tipX=Math.max(110,Math.min(150,x));
    tipY=Math.max(137,Math.min(171,y));
    const screen=localToScreen(tipX,tipY);
    rod.style.left=(screen.x-visualBounds.left-rod.offsetWidth/2)+'px';
    rod.style.top=(screen.y-visualBounds.top-rod.offsetHeight+5)+'px';
    rod.style.transform='none';
   };
   position(tipX,tipY);
   let pointer=null,startLocal=null,initialX=0,initialY=0,moved=false;
   rod.addEventListener('pointerdown',e=>{
    if(spoolProgress>=5)return;
    pointer=e.pointerId;
    startLocal=screenToLocal(e.clientX,e.clientY);
    initialX=tipX;initialY=tipY;moved=false;
    rod.setPointerCapture(pointer);
    rod.classList.add('dragging');
    e.preventDefault();
   });
   rod.addEventListener('pointermove',e=>{
    if(pointer!==e.pointerId)return;
    const point=screenToLocal(e.clientX,e.clientY);
    const x=initialX+point.x-startLocal.x;
    const y=initialY+point.y-startLocal.y;
    if(Math.hypot(x-initialX,y-initialY)>5)moved=true;
    position(x,y);
   });
   const release=e=>{
    if(pointer!==e.pointerId)return;
    pointer=null;
    rod.classList.remove('dragging');
    spool();
   };
   rod.addEventListener('pointerup',release);
   rod.addEventListener('pointercancel',()=>{pointer=null;rod.classList.remove('dragging');position(130,152)});
   rod.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();spool()}});
  }
 }
 content.querySelectorAll('[data-whatif]').forEach(b=>b.addEventListener('click',()=>{whatIfChoice=+b.dataset.whatif;whatIfPrediction=null;whatIfSeen=false;render(true)}));
 content.querySelectorAll('[data-whatif-predict]').forEach(b=>b.addEventListener('click',()=>{whatIfPrediction=+b.dataset.whatifPredict;whatIfSeen=false;render(true)}));
 const revealTest=content.querySelector('#revealWhatIf');if(revealTest)revealTest.addEventListener('click',()=>{if(whatIfChoice!==null&&whatIfPrediction!==null){whatIfSeen=true;render(true)}});
 bindHandsOn();
 const reveal=content.querySelector('#revealDna');if(reveal)reveal.addEventListener('click',()=>{dnaRevealed=true;render(true)});
}
function reset(){interactionEpoch++;stage=0;prediction=null;answer=null;completed=false;microscopeLevel=0;spoolProgress=0;whatIfChoice=null;whatIfPrediction=null;whatIfSeen=false;actions.mash=0;actions.soap=false;actions.salt=false;actions.filter=false;actions.alcohol=0;mixStirs=0;dnaRevealed=false;pouring=false;render()}
function openModal(){reset();modal.hidden=false;document.body.classList.add('modal-open');document.getElementById('closeModal').focus()}
function closeModal(){interactionEpoch++;pouring=false;modal.hidden=true;document.body.classList.remove('modal-open');document.getElementById('launchBtn').focus()}
document.getElementById('launchBtn').addEventListener('click',openModal);
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();if(e.key==='Tab'&&!modal.hidden){const list=[...modal.querySelectorAll('button:not(:disabled),[role="button"][tabindex="0"]')].filter(el=>!el.closest('[hidden]'));if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
backBtn.addEventListener('click',()=>{if(stage>0){interactionEpoch++;pouring=false;stage--;completed=false;render()}});
nextBtn.addEventListener('click',()=>{if(!stageReady()&&!completed)return;if(completed){closeModal();return}interactionEpoch++;pouring=false;if(stage<steps.length-1)stage++;else{completed=true;try{localStorage.setItem('discovery-lab-dna-completed','true')}catch(e){}}render()});
