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
let stage=0,prediction=null,ingredients=new Set(),answer=null,completed=false;
const stageNames=['Investigate','Experiment','Discover','Think'];
const questions=[
 ['DNA is only inside animals','DNA is inside the strawberry’s cells','DNA is only in strawberry seeds'],
 ['The cold alcohol helps DNA clump together','The alcohol creates new DNA','The strawberry turns into alcohol']
];
function choices(options,selected,name){
 return '<div class="choices" role="group" aria-label="'+name+'">'+options.map((v,i)=>'<button class="choice '+(selected===i?'selected':'')+'" data-choice="'+i+'" type="button">'+v+'</button>').join('')+'</div>';
}
function render(){
 const progress=document.getElementById('progressStages');
 progress.innerHTML=stageNames.map((name,i)=>'<span class="'+(i===stage?'active':'')+'">'+String(i+1).padStart(2,'0')+' '+name+'</span>').join('');
 document.getElementById('progressBar').style.width=((stage+1)*25)+'%';
 document.getElementById('stageCounter').textContent=(stage+1)+' of 4';
 backBtn.disabled=stage===0;
 nextBtn.textContent=stage===3?'Finish exhibit ↗':'Continue →';
 if(stage===0){
 content.innerHTML='<div class="stage-layout"><div><span class="stage-kicker">01 / INVESTIGATE</span><h2 id="exhibitTitle">What’s hiding inside a strawberry?</h2><p>A strawberry is made of tiny living units called <strong>cells</strong>. Each cell carries instructions in a molecule called DNA. But where do you think the DNA is?</p>'+choices(questions[0],prediction,'Choose your prediction')+(prediction!==null?'<div class="feedback">'+(prediction===1?'Exactly!':'Good hypothesis!')+' DNA is stored inside strawberry cells, mostly in their nuclei. We’ll try to make some of it visible.</div>':'')+'</div><div class="science-visual"><span class="big-fruit" role="img" aria-label="Strawberry">🍓</span></div></div>';
 nextBtn.disabled=prediction===null;
 }else if(stage===1){
 const items=[['🥣','Crush'],['🫧','Soap'],['🧂','Salt'],['🧊','Cold alcohol']];
 const explanations=['Select a tool to begin.','Crushing breaks the fruit into a pulp and releases many cells.','Soap disrupts lipid cell membranes, helping release DNA.','Salt helps DNA strands gather together in the mixture.','Cold alcohol makes DNA much less soluble, so strands gather into visible clumps.'];
 content.innerHTML='<div class="stage-layout"><div><span class="stage-kicker">02 / EXPERIMENT</span><h2 id="exhibitTitle">Let’s uncover the DNA.</h2><p>Select each tool to see its role in this virtual extraction. Try all four to move to the next step.</p><div class="ingredient-grid" style="grid-template-columns:repeat(2,1fr)">'+items.map(([emoji,title],i)=>'<button class="ingredient '+(ingredients.has(i)?'used':'')+'" data-ingredient="'+i+'" aria-pressed="'+ingredients.has(i)+'"><span>'+emoji+'</span>'+title+(ingredients.has(i)?' ✓':'')+'</button>').join('')+'</div><div class="feedback">'+explanations[ingredients.size]+'</div></div><div class="science-visual"><div class="beaker" aria-label="Illustration of a container with extracted strawberry mixture"><div class="liquid" style="height:'+(28+ingredients.size*14)+'%"></div>'+(ingredients.size===4?'<div class="strand" style="left:25px"></div><div class="strand"></div><div class="strand"></div>':'')+'</div></div></div>';
 nextBtn.disabled=ingredients.size<4;
 }else if(stage===2){
 content.innerHTML='<div class="stage-layout"><div><span class="stage-kicker">03 / DISCOVER</span><h2 id="exhibitTitle">Those cloudy strands? That’s DNA!</h2><p>DNA dissolves in the watery fruit mixture, but it does not dissolve well in <strong>cold alcohol</strong>. When alcohol is gently added, DNA collects into whitish, stringy clumps near the boundary.</p><p class="science-note">Real extraction note: what you see is a mass of many DNA molecules, along with possible impurities. You cannot see a single DNA double helix with your eyes.</p><div class="feedback">Science surprise: Strawberries have eight sets of chromosomes, making them especially useful for classroom DNA extraction.</div></div><div class="science-visual"><div class="beaker"><div class="liquid" style="height:63%"></div><div class="strand" style="left:26px"></div><div class="strand"></div><div class="strand"></div></div></div></div>';
 nextBtn.disabled=false;
 }else if(completed){
 content.innerHTML='<div class="completion"><span class="completion-icon">✧</span><span class="stage-kicker">EXHIBIT COMPLETE</span><h2 id="exhibitTitle">You’re a DNA detective!</h2><p>You investigated a mystery, made a prediction, ran a virtual experiment, and explained the results. That’s how scientists think.</p><p class="science-note">Want another attempt? Restart the exhibit and test a different prediction.</p><button class="button secondary" id="restartBtn">↺ Restart exhibit</button></div>';
 nextBtn.textContent='Close exhibit';nextBtn.disabled=false;
 document.getElementById('restartBtn').addEventListener('click',restart);
 }else{
 content.innerHTML='<div class="stage-layout"><div><span class="stage-kicker">04 / THINK LIKE A SCIENTIST</span><h2 id="exhibitTitle">One last mystery.</h2><p>Why do we add <strong>cold alcohol</strong> to our strawberry mixture?</p>'+choices(questions[1],answer,'Answer the science question')+(answer!==null?'<div class="feedback">'+(answer===0?'Correct! ':'Not quite. ')+'DNA is much less soluble in cold alcohol, so many molecules collect into visible strands.</div>':'')+'</div><div class="science-visual"><span class="big-cell" role="img" aria-label="DNA symbol">🧬</span></div></div>';
 nextBtn.disabled=answer===null;
 }
 content.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{if(stage===0)prediction=Number(b.dataset.choice);else answer=Number(b.dataset.choice);render()}));
 content.querySelectorAll('[data-ingredient]').forEach(b=>b.addEventListener('click',()=>{ingredients.add(Number(b.dataset.ingredient));render()}));
}
function restart(){stage=0;prediction=null;ingredients.clear();answer=null;completed=false;render()}
function openModal(){restart();modal.hidden=false;document.body.classList.add('modal-open');document.getElementById('closeModal').focus()}
function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');document.getElementById('launchBtn').focus()}
document.getElementById('launchBtn').addEventListener('click',openModal);
document.getElementById('closeModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();if(e.key==='Tab'&&!modal.hidden){const list=[...modal.querySelectorAll('button:not(:disabled)')];if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
backBtn.addEventListener('click',()=>{if(stage>0){stage--;completed=false;render()}});
nextBtn.addEventListener('click',()=>{if(stage<3)stage++;else if(!completed){completed=true;try{localStorage.setItem('discovery-lab-dna-completed','true')}catch(e){}}else{closeModal();return}render()});