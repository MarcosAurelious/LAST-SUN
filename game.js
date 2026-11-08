'use strict';
(()=>{
// THE LAST SUN — V4.2 SIGNATURE BOSS ATTACKS
const W=960,H=540,GRAV=1750;let LEVEL_W=9600,ARENA_X=8640,GATE_X=9250,stageNum=1,startStage=1;
const cv=document.getElementById('game'),ctx=cv.getContext('2d');
const mem=(navigator.deviceMemory||4),dpr=window.devicePixelRatio||1;const SC=mem<=2?1:(matchMedia('(pointer:coarse)').matches?Math.min(1.5,dpr):Math.max(1,Math.min(2,dpr)));cv.width=Math.round(W*SC);cv.height=Math.round(H*SC);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
const ANCH=window.__ANCH||{},STRIPS=window.__STRIPS||{};let sprFlash=false;
const $=id=>document.getElementById(id);
const IMG={},SRC=window.__ASSETS||{},FEET=window.__FEET||{};






SRC.boss2='asset-40.png';
SRC.boss3='asset-41.png';
SRC.boss4='asset-42.png';
SRC.boss5='asset-43.png';
SRC.boss6='asset-44.png';
SRC.water_tile='asset-45.webp';
SRC.serpent_die='asset-46.webp';   // the two death poses, re-cut whole (they overhang the 4x4 grid in asset-16)
let loaded=0;const total=Object.keys(SRC).length;
for(const k in SRC){const im=new Image();im.onload=im.onerror=()=>{loaded++;const ls=$('loadStatus');if(ls)ls.textContent=loaded<total?`Loading artwork ${loaded}/${total}`:'Ready. Choose your warrior.';};im.src=SRC[k];IMG[k]=im;}
const CELL=Object.assign({itza:[192,175.5],balam:[192,175.5],soldier:[192,160],crossbow:[192,160],panther:[192,160],eagle:[192,160],jaguar:[192,160]},window.__CELLS2||{});
for(let n=2;n<=6;n++){const im=new Image();} Object.assign(CELL,{serpent_die:[300,192]});ANCH.serpent_die=[[0.5,0.786],[0.5,0.833]];Object.assign(CELL,{boss2:[313.5,313.5],boss3:[313.5,313.5],boss4:[313.5,313.5],boss5:[328,299.75],boss6:[328,299.75]});
const clamp=(v,a,b)=>v<a?a:v>b?b:v,rnd=(a=0,b=1)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const R=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
function circ(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill()}
function poly(pts,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill()}
function text(t,x,y,size,color='#ffe9b0',align='left',font='900'){ctx.font=`${font} ${size}px "Trebuchet MS",system-ui,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle='#000c';ctx.fillText(t,x+2,y+2);ctx.fillStyle=color;ctx.fillText(t,x,y)}
const boxHit=(a,b)=>a.x1>b.x0&&a.x0<b.x1&&a.y1>b.y0&&a.y0<b.y1;

// ----------------------------------------------------------- LEVEL GEOMETRY (per stage)
const S=(x,y,w,kind='earth',h)=>({x,y,w,h:h||(H+80-y),kind});
const P=(x,y,w,kind='wood')=>({x,y,w,kind,oneway:true});
const STAGES={
 1:{name:'THE VILLAGE UNDER SIEGE',levelW:9600,arenaX:8640,gateX:9250,water:{x0:2660,x1:3780,surf:448},bridge:[2660,9],
  solids:()=>[S(0,430,1820),S(1930,430,730),S(2300,368,220,'stone',62),S(2660,494,1120,'bed'),
   S(3780,430,620),S(4100,330,180,'stone',100),S(4510,430,530),S(5040,380,300),S(5460,430,700),S(5900,350,130,'stone',80),
   S(6160,430,2240),S(6500,396,1500,'temple',34),S(6620,362,1260,'temple',34),S(6740,328,1020,'temple',34),S(6860,294,780,'temple',34),
   S(8400,430,1200),S(9250,118,390,'gate')],
  platforms:()=>[P(480,322,190),P(780,250,170),P(1110,320,220),P(1460,272,190),P(2040,330,160),
   P(3880,320,170,'stone'),P(4600,322,160,'stone'),P(4820,248,170,'stone'),P(5560,300,200,'stone'),
   P(6280,318,150),P(6930,196,210,'stone'),P(7340,180,220,'stone'),P(8100,316,180),P(8700,316,170,'stone'),P(8980,250,170,'stone')],
  decor:[['totem',300],['torch',640],['banner',1010],['torch',1250],['torch',1700],['palm',1880],['banner',2150],['torch',2560],
   ['banner',4300],['torch',4700],['pillar',5180],['totem',5700],['torch',6100],['banner',6700],['torch',7000],['banner',7500],['torch',7900],['totem',8150],['torch',8500],['banner',8800]],
  placed:[['rifle',1000,430],['panther',1150,430],['sniper',870,250],['pike',1380,430],['rifle',1580,430],['cross',1220,320],['panther',1700,430],['sniper',1550,272],
   ['rifle',2380,368],['cross',2110,330],['eagle',2700,0],['eagle',3050,0],['eagle',3350,0],['cross',3960,320],['rifle',3820,430],['totem',4050,430],
   ['cannon',4190,330],['pike',4360,430],['spike',4660,430],['sniper',4700,322],['bat',4750,0],['sniper',4900,248],['panther',4950,430],['bat',5150,0],['rifle',5200,380],['arrow',5310,380],
   ['jaguar',5800,430],['cannon',5965,350],['sniper',5650,300],
   ['spike',6330,430],['panther',6400,430],['cross',6340,318],['eagle',6600,0],['rifle',6760,328],['pike',6990,294],['sniper',7020,196],['bat',7150,0],['cross',7440,180],['eagle',7300,0],['rifle',7600,294],['cannon',7520,294],['totem',7700,328],['panther',7900,396],['eagle',8000,0],['rifle',8200,430],['sniper',8180,316]],
  capsules:[[500,'S'],[2500,'M'],[4250,'F'],[5330,'B'],[6480,'L'],[7680,'S'],[8600,'M']],
  boulders:[4560,5560],
  runners:[[250,2620,2.6],[3780,8380,2.3]],flyers:[[600,2600,7,.35],[2600,3800,4.5,.25],[3800,6200,6,.55],[6200,8400,5,.4]]},
 2:{name:'THE JUNGLE PURSUIT',levelW:9000,arenaX:8040,gateX:8920,water:{x0:2510,x1:3400,surf:448},bridge:null,
  solids:()=>[S(0,430,1500,'moss'),S(1610,430,900,'moss'),S(1900,370,260,'stone',60),S(2510,494,890,'bed'),
   S(3400,430,1200,'moss'),S(3700,360,300,'stone',70),S(4720,430,1800,'moss'),S(5300,372,240,'stone',58),
   S(6520,400,300,'stone',30),S(6820,430,2180,'moss'),S(8920,40,240,'lab')],
  platforms:()=>[P(700,320,170),P(1050,250,160),P(1250,320,180),P(2600,410,140),P(2850,380,130),P(3100,410,150),
   P(3500,300,160,'stone'),P(3760,250,170,'stone'),P(4250,310,170,'stone'),P(4900,320,180,'stone'),P(5650,300,180,'stone'),P(6000,240,170,'stone'),
   P(7100,320,190),P(7400,250,170,'stone'),P(7800,320,170),P(8150,320,160,'metal'),P(8420,260,160,'metal'),P(8680,200,240,'metal')],
  decor:[['palm',200],['totem',560],['palm',1550],['torch',2200],['palm',2460],['totem',3450],['torch',4150],['palm',4680],['pillar',5100],['torch',5600],['palm',6460],['totem',6900],['torch',7500],['lamp',7950],['lamp',8300],['lamp',8600],['gsmoke',6300,318],['gsmoke',7650,318],['gsmoke',8300,318],['boil',8200,320],['boil',8735,200],['gsmoke',8735,150],['gsmoke',8480,262]],
  placed:[['serpent',820,430],['spike',1000,430],['cross',1100,250],['pike',1350,430],['sniper',1340,320],['bat',1450,0],['leopard',1750,430],
   ['serpent',2020,370],['spike',2300,430],['bat',2400,0],['bat',2700,0],['eagle',2900,0],['serpent',3170,410],['bat',3300,0],
   ['eagle',3900,0],['eagle',4100,0],['eagle',6800,0],['bat',5000,0],['pike',3560,430],['cross',3580,300],['sniper',3840,250],['pod',4300,430],['bat',4400,0],['totem',4560,430],
   ['leopard',4950,430],['pike',5200,430],['arrow',5510,372],['sniper',5730,300],['pod',5950,430],['serpent',6080,240],['bat',6300,0],['totem',6440,430],['leopard',6650,400],
   ['pike',3480,430],['spike',6300,430],['pike',7000,430],['arrow',7250,430],['cross',7480,430],['pike',7650,430],['sniper',7800,430],['spike',8300,430],['cross',8560,430],['cross',7190,320],['spike',7300,430],['sniper',7480,250],['bat',7600,0],['serpent',7850,320],['leopard',7950,430]],
  capsules:[[400,'S'],[2300,'L'],[3800,'M'],[5200,'F'],[6600,'B'],[7600,'S']],
  boulders:[4800,7150],
  runners:[[300,2500,3.6],[3400,7900,3.2]],flyers:[[300,2500,5.5,.7],[2500,3400,4,.45],[3400,8000,5,.65]]}
};

// Levels 3-6: new terrain maps with camera-linked encounters and platforming.
function adventureStage(name,n,bossName){
 const depth=n===3,city=n===4,capital=n===5,lab=n===6;
 const floor=lab?'lab':capital?'temple':depth?'stone':city?'stone':'moss';
 const base=depth?458:capital?416:lab?430:430;
 const blocks=[S(0,base,1450,floor),S(1550,base,910,floor),S(2470,base+42,790,'bed'),S(3260,base,1100,floor),S(4460,base,1430,floor),S(5980,base,1550,floor),S(7600,base,1100,floor),S(8490,90,300,'gate')];
 if(capital||city){blocks.push(S(3550,354,180,'temple',76),S(3750,308,180,'temple',122),S(3970,272,180,'temple',158),S(6250,380,580,'temple',50),S(6400,342,380,'temple',88),S(6530,300,220,'temple',130))}
 if(depth){blocks.push(S(3900,370,160,'stone',88),S(4050,330,150,'stone',128),S(6660,380,210,'stone',78))}
 const ledges=[P(400,326,185),P(690,258,180),P(1030,320,170),P(1710,320,210),P(2150,265,180),P(2630,394,145,'stone'),P(2880,375,150,'stone'),P(3160,395,140,'stone'),P(3560,280,175,'stone'),P(3910,222,165,'stone'),P(4230,310,180,'stone'),P(4620,296,190,'stone'),P(5010,230,160,'stone'),P(5470,310,200,'stone'),P(6090,265,190,'stone'),P(6440,218,185,'stone'),P(6850,270,180,'stone'),P(7350,310,180,'stone'),P(7700,290,170,'stone'),P(8090,320,180,'stone')];
 const candidates=depth?['bat','bat','serpent','leopard','bat','cross','pike']:city?['pike','cross','jaguar','eagle','panther','rifle','serpent']:capital?['leopard','jaguar','leopard','cross','pike','eagle','rifle']:['pike','cross','pod','stasis','rifle','sci','tank'];
 const placed=[];for(let x=690,i=0;x<7850;x+=280+(i%3)*75,i++){
  const t=candidates[i%candidates.length],g=groundAtStage(blocks,x)||base;
  placed.push([t,x,(t==='bat'||t==='eagle')?0:g]);
  if(i%5===2)placed.push([i%2?'arrow':'spike',x+120,g]);
  if(lab&&i%6===0)placed.push(['tank',x+150,g]);
   if(depth&&i%7===4)placed.push(['boulder',x+105,g]);
   if(city&&i%6===3)placed.push(['totem',x+100,g]);
   if(capital&&i%6===2)placed.push(['cannon',x+120,g]);
   if(lab&&i%5===2)placed.push(['cauldron',x+110,g]);
 }
 const deco=[];for(let x=190,i=0;x<8400;x+=480,i++)deco.push([lab?(i%2?'lamp':'pillar'):depth?(i%2?'torch':'pillar'):capital?(i%2?'banner':'torch'):city?(i%2?'banner':'totem'):(i%2?'palm':'torch'),x]);
 return {name,levelW:8700,arenaX:7740,gateX:8490,water:{x0:2470,x1:3260,surf:448},bridge:null,
 solids:()=>blocks,platforms:()=>ledges,decor:deco,placed,capsules:[[540,'M'],[2210,'S'],[3540,'F'],[4890,'L'],[6250,'B'],[7260,'M']],boulders:[4100,6410],
 runners:[[250,2350,3.5],[3310,7800,3.1]],flyers:[[300,2300,7,.8],[3300,7660,6,depth?.85:.45]],bossName};
}
function groundAtStage(sol,x){let r=null;for(const s of sol){if(x>=s.x&&x<s.x+s.w&&s.kind!=='gate'&&(r===null||s.y<r))r=s.y}return r}
STAGES[3]=adventureStage('CAVES & CENOTES',3,'THE CENOTE ABOMINATION');
STAGES[4]=adventureStage('PYRAMIDS & JUNGLE CITIES',4,'THE FEATHERED GUARDIAN');
STAGES[5]=adventureStage('BATTLE FOR THE CAPITAL',5,'THE SIEGE WARLORD');
STAGES[6]=adventureStage('SHIPWRECK LABORATORY',6,'THE MAD ALCHEMIST');
const CHAPTERS={1:'Protect the peaceful village as wild beasts and conquistadors close in.',2:'Hunt the retreating invaders through thick jungle and deadly ambush traps.',3:'Descend into flooded cenotes and battle the monsters bred beneath the earth.',4:'Cross ancient jungle cities and climb the temple terraces.',5:'Defend the burning capital against the siege and its mutant warlord.',6:'Storm the wrecked-ship laboratory and destroy the Alchemist’s experiments.'};
let unlocked=1;try{unlocked=clamp(Number(localStorage.getItem('lastSunUnlocked'))||1,1,6)}catch(e){};
function unlockStage(n){unlocked=Math.max(unlocked,Math.min(6,n));try{localStorage.setItem('lastSunUnlocked',unlocked)}catch(e){}}


let SOLIDS=[],PLATFORMS=[],LADDERS=[],WATER={x0:0,x1:0,surf:448},BRIDGE=[],DECOR=[],PLACED=[],CAPSULES=[],RUNNER_ZONES=[],BOULDERS=[],STG=STAGES[1];
function loadStage(n){stageNum=n;STG=STAGES[n];LEVEL_W=STG.levelW;ARENA_X=STG.arenaX;GATE_X=STG.gateX;SOLIDS=STG.solids();PLATFORMS=STG.platforms();
 LADDERS=PLATFORMS.filter((p,i)=>i%3!==2).map(p=>({x:p.x+p.w*.5,top:p.y,bottom:Math.min(groundAtStage(SOLIDS,p.x+p.w*.5)??p.y+200,p.y+200)})).filter(l=>l.bottom-l.top>52);
 WATER=STG.water;DECOR=(STG.decor||[]);PLACED=STG.placed;CAPSULES=STG.capsules;RUNNER_ZONES=STG.runners;BOULDERS=STG.boulders;buildBridge()}
function buildBridge(){BRIDGE=[];if(!STG.bridge)return;const[x0,n]=STG.bridge;for(let i=0;i<n;i++)BRIDGE.push({x:x0+i*90,y:430,w:90,oneway:true,bridge:true,state:0,t:0})}
function groundAt(x){let best=null;for(const s of SOLIDS)if(s.kind!=='gate'&&s.kind!=='lab'&&x>=s.x&&x<=s.x+s.w&&(best===null||s.y<best))best=s.y;return best}

// ----------------------------------------------------------- STATE
let mode='title',numPlayers=1,soloHero='itza',difficulty='warrior',konami=false;
let camX=0,shake=0,time=0,players=[],enemies=[],pbul=[],ebul=[],fx=[],medals=[],placedDone,capDone,boulderDone,runnerT=0,flyT=3,boss=null,stageT=0,flash=0,banner=null,endT=0;
const inp=[{},{}];
function resetStage(keep){loadStage(stageNum);camX=0;shake=0;time=0;stageT=0;enemies=[];pbul=[];ebul=[];fx=[];medals=[];placedDone=new Set();capDone=new Set();boulderDone=new Set();runnerT=2;flyT=4;boss=null;flash=0;endT=0;
 if(!keep){players=[];const heroes=numPlayers===2?['itza','balam']:[soloHero];heroes.forEach((h,i)=>players.push(makePlayer(i,h)))}
 else for(const p of players){if(p.state==='out'||p.lives<=0)p.lives=3;Object.assign(p,{x:130+p.i*70,y:-40-p.i*40,vx:0,vy:0,state:'alive',inv:2,hp:3,dive:false,crouch:false,drop:0,spin:0,jumping:false,climbing:false,landT:0,hurtAnimT:0,jumpsUsed:0,jumpGraceT:0})}
 showBanner('STAGE '+stageNum,CHAPTERS[stageNum],2.5);
}
function makePlayer(i,hero){return{i,hero,x:130+i*70,y:-40-i*40,vx:0,vy:0,w:24,h:76,dir:1,onGround:false,drop:0,lives:konami?30:3,hp:3,inv:2,weapon:'N',fireCD:0,state:'alive',deadT:0,ax:1,ay:0,crouch:false,water:false,dive:false,spin:0,anim:0,score:0,firing:0,barrier:0,nextLife:20000,ground:null,jumpHeld:false,climbing:false,slashCD:0,meleeCD:0,attackT:0,attackKind:'',attackHit:false,landT:0,hurtAnimT:0,jumpsUsed:0,jumpGraceT:0}}
function showBanner(a,b,t){banner={a,b,t,max:t}}

// ----------------------------------------------------------- PHYSICS
function surfaces(){const out=PLATFORMS.slice();for(const b of BRIDGE)if(b.state===0||(b.state===1&&b.t<.3))out.push(b);return out}
function physics(b,dt,step=38){
 let nx=b.x+b.vx*dt;b.hitWall=false;
 for(const s of SOLIDS){if(nx+b.w/2>s.x&&nx-b.w/2<s.x+s.w&&b.y>s.y+.5&&b.y-b.h<s.y+s.h){
   if(b.onGround&&s.y>=b.y-step&&s.kind!=='gate'){b.y=s.y}else{nx=b.vx>0||nx<s.x?s.x-b.w/2-.01:s.x+s.w+b.w/2+.01;b.hitWall=true}}}
 b.x=nx;b.vy=Math.min(b.vy+GRAV*dt,1150);
 const py=b.y;let ny=b.y+b.vy*dt;b.onGround=false;b.ground=null;
 if(b.vy>=0){let best=1e9,surf=null;
  for(const s of SOLIDS)if(b.x+b.w/2>s.x&&b.x-b.w/2<s.x+s.w&&py<=s.y+.5&&ny>=s.y&&s.y<best){best=s.y;surf=s}
  if(!(b.drop>0))for(const p of surfaces())if(b.x>p.x-3&&b.x<p.x+p.w+3&&py<=p.y+.5&&ny>=p.y&&p.y<best){best=p.y;surf=p}
  if(surf){ny=best;b.vy=0;b.onGround=true;b.ground=surf}
 }else{for(const s of SOLIDS)if(b.x+b.w/2>s.x&&b.x-b.w/2<s.x+s.w&&py-b.h>=s.y+s.h-.5&&ny-b.h<s.y+s.h){ny=s.y+s.h+b.h;b.vy=0}}
 b.y=ny;
}
const inWater=b=>b.x>WATER.x0&&b.x<WATER.x1&&b.y>WATER.surf+10;

// ----------------------------------------------------------- AUDIO (synth sfx + chiptune)
let ac=null,master=null,soundOn=true,musicNode=null,seqStep=0,nextNote=0,musicTrack='stage';
function audio(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.gain.value=.55;master.connect(ac.destination)}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac}
function tone(f,d,type='square',vol=.06,slide=.6,when=0){if(!soundOn||!audio())return;const t=ac.currentTime+when,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide!==1)o.frequency.exponentialRampToValueAtTime(Math.max(20,f*slide),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02)}
let noiseBuf=null;
function noise(d,vol=.12,hp=400,when=0){if(!soundOn||!audio())return;if(!noiseBuf){noiseBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const a=noiseBuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}const t=ac.currentTime+when,s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=noiseBuf;f.type='highpass';f.frequency.value=hp;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+d+.02)}
const SFX={shot:()=>tone(880,.06,'square',.035,.5),spread:()=>{tone(700,.08,'sawtooth',.03,.4);noise(.05,.04,2000)},laser:()=>tone(1400,.25,'sawtooth',.04,.25),fire:()=>{tone(300,.18,'triangle',.06,1.8);noise(.12,.05,900)},
 jump:()=>tone(300,.12,'square',.035,1.6),hit:()=>{noise(.06,.07,1500);tone(220,.05,'square',.03,.5)},boom:()=>{noise(.5,.22,120);tone(90,.4,'sawtooth',.07,.35)},
 die:()=>{for(let i=0;i<5;i++)tone(600-i*90,.14,'square',.05,.6,i*.09)},power:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.12,'square',.05,1,i*.07))},eshot:()=>tone(240,.08,'square',.025,.7),
 clink:()=>{tone(1800,.05,'square',.03,.8);tone(2400,.04,'square',.02,.8,.02)},cannon:()=>{noise(.25,.14,200);tone(120,.2,'square',.05,.4)},roar:()=>{noise(.6,.14,300);tone(110,.6,'sawtooth',.08,.5)},life:()=>{[784,988,1175,1568].forEach((f,i)=>tone(f,.15,'triangle',.06,1,i*.09))}};
// ===== SOUNDTRACK: Mexican rock revenge — Phrygian-dominant riffs, distorted guitar, gallop bass, mariachi trumpets =====
const mtof=n=>440*Math.pow(2,(n-69)/12);
let musBus=null,fxSend=null,distCurve=null,nBuf=null;
function musInit(){if(musBus||!ac)return;musBus=ac.createGain();musBus.gain.value=.85;musBus.connect(master);
 const d=ac.createDelay(1);d.delayTime.value=.31;const fb=ac.createGain();fb.gain.value=.3;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;
 fxSend=ac.createGain();fxSend.gain.value=.3;fxSend.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(musBus);
 distCurve=new Float32Array(2048);for(let i=0;i<2048;i++){const x=i/1024-1;distCurve[i]=Math.tanh(x*5)*.9}
 nBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const a=nBuf.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
function adsr(g,t,a,pk,hold,rel){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+a);g.gain.setValueAtTime(pk,t+a+hold);g.gain.exponentialRampToValueAtTime(.0001,t+a+hold+rel)}
function guitar(m,t,len,open,acc){const g=ac.createGain(),ws=ac.createWaveShaper(),lp=ac.createBiquadFilter(),hp=ac.createBiquadFilter();ws.curve=distCurve;lp.type='lowpass';lp.frequency.value=open?3000:1100;hp.type='highpass';hp.frequency.value=90;
 for(const[iv,dt]of[[0,-6],[0,6],[7,-3],[12,4]]){const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m+iv);o.detune.value=dt;const og=ac.createGain();og.gain.value=.55;o.connect(og);og.connect(ws);o.start(t);o.stop(t+len+.12)}
 ws.connect(hp);hp.connect(lp);lp.connect(g);g.connect(musBus);adsr(g,t,.004,acc?.085:.05,open?len*.7:.01,open?len*.5:.07)}
function trumpet(m,t,len,vol=.055){const g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(700,t);lp.frequency.exponentialRampToValueAtTime(3400,t+.05);lp.frequency.exponentialRampToValueAtTime(2000,t+.25);
 const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=5.8;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(mtof(m)*.014,t+Math.min(.35,len));lfo.connect(lg);lfo.start(t);lfo.stop(t+len+.1);
 for(const[ty,dt,v]of[['sawtooth',0,1],['sawtooth',9,.7],['square',-5,.35]]){const o=ac.createOscillator(),og=ac.createGain();o.type=ty;o.detune.value=dt;o.frequency.setValueAtTime(mtof(m-1),t);o.frequency.exponentialRampToValueAtTime(mtof(m),t+.035);lg.connect(o.frequency);og.gain.value=v*.4;o.connect(og);og.connect(lp);o.start(t);o.stop(t+len+.1)}
 lp.connect(g);g.connect(musBus);g.connect(fxSend);adsr(g,t,.025,vol,Math.max(.02,len-.08),.07)}
function pluck(m,t,vol=.05){const g=ac.createGain(),o=ac.createOscillator(),o2=ac.createOscillator();o.type='triangle';o2.type='sine';o.frequency.value=mtof(m);o2.frequency.value=mtof(m+12);o.connect(g);o2.connect(g);g.connect(musBus);g.connect(fxSend);adsr(g,t,.003,vol,.01,.5);o.start(t);o2.start(t);o.stop(t+.6);o2.stop(t+.6)}
function bassN(m,t,len){const g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;for(const ty of['square','triangle']){const o=ac.createOscillator();o.type=ty;o.frequency.value=mtof(m);o.connect(lp);o.start(t);o.stop(t+len+.05)}lp.connect(g);g.connect(musBus);adsr(g,t,.004,.11,len*.5,len*.4)}
function nz(t,d,vol,type,f,q=1){const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nBuf;fl.type=type;fl.frequency.value=f;fl.Q.value=q;s.connect(fl);fl.connect(g);g.connect(musBus);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);s.start(t,Math.random()*.5);s.stop(t+d+.02)}
function kick(t,v=.55){const o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.11);o.connect(g);g.connect(musBus);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.start(t);o.stop(t+.25)}
function snare(t,v=.22){nz(t,.16,v,'bandpass',1900,.7);const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(160,t+.05);o.connect(g);g.connect(musBus);g.gain.setValueAtTime(.14,t);g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.1)}
const L=s=>s.trim().split(/\s+/).map(t=>t==='-'?-1:+t);
const SONGS={
 stage:{bpm:150,roots:[40,41,40,41,45,43,41,40],gtr:'X..x.xx.x.xx.x.x',bass:'x..x..o.x..x..o.',k:'x.....x.x.....x.',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',t:'................',
  lead:L(`76 - - - 77 - 76 - 74 - 72 - 71 - - -   72 - 71 - 72 - 74 - 77 - - - 76 - - -
          76 - - - 77 - 76 - 74 - 72 - 71 - 68 -   69 - - - - - - - 0 0 71 72 74 - 76 -
          81 - - - 79 - 77 - 76 - - - 77 - 76 -   74 - - - 76 - 74 - 71 - - - 0 0 74 -
          72 - 74 - 72 - 71 - 69 - - - 71 - 72 -   71 - - - - - - - 68 - 71 - 76 - - -`)},
 boss:{bpm:176,roots:[40,40,36,38,40,40,41,40],gtr:'Xxxxx.xxXxxx.xxx',bass:'x.xox.xox.xox.xo',k:'x.x...x.x.x...x.',s:'....x.......x..x',h:'xxxxxxxxxxxxxxxx',t:'................',
  lead:L(`76 - 76 - 76 - 77 - 76 - - - 0 0 0 0   76 - 76 - 76 - 79 - 77 - 76 - 74 - - -
          72 - - - 74 - 72 - 71 - - - 68 - - -   74 - - - 72 - - - 71 - - - 0 0 0 0
          81 - 80 - 81 - 83 - 84 - - - 83 - 81 -   80 - - - 77 - - - 76 - - - 0 0 0 0
          77 - 76 - 74 - 72 - 74 - 72 - 71 - 69 -   68 - - - 71 - - - 76 - - - - - - -`)},
 story:{bpm:88,story:true,roots:[45,43,41,40],chords:[[57,60,64],[55,59,62],[53,57,60],[52,56,59]],k:'x.......x.......',s:'................',h:'................',t:'....x.......x...',
  lead:L(`76 - - - - - - - 74 - - - 72 - - -   71 - - - - - - - 74 - - - 71 - - -
          69 - - - - - - - 72 - - - 69 - - -   68 - - - - - - - - - - - 0 0 0 0`)}};
function musicTick(){if(!soundOn||!ac||(mode!=='play'&&mode!=='cut'))return;musInit();
 const S=SONGS[musicTrack]||SONGS.stage,sp=60/S.bpm/4,T=(musicTrack==='stage'&&stageNum===2)?3:0,nb=S.roots.length*16;
 if(nextNote<ac.currentTime)nextNote=ac.currentTime+.05;
 while(nextNote<ac.currentTime+.2){const i=seqStep%nb,bar=Math.floor(i/16),st=i%16,t=nextNote,root=S.roots[bar]+T;
  if(S.story){const ch=S.chords[bar];pluck(ch[[0,1,2,1,0,2,1,2][st%8]]+12+T,t);if(st===0)bassN(root,t,sp*14)}
  else{const gc=S.gtr[st];if(gc==='X'||gc==='x'){let n=1;if(gc==='X')while(n<4&&S.gtr[st+n]==='.')n++;guitar(root+12,t,sp*n,gc==='X',st===0)}
   const bc=S.bass[st];if(bc==='x')bassN(root,t,sp*.9);else if(bc==='o')bassN(root+12,t,sp*.9)}
  if(S.k[st]==='x')kick(t);if(S.s[st]==='x')snare(t);if(S.h[st]==='x')nz(t,.03,.045,'highpass',7500);if(S.t[st]==='x')nz(t,.12,.05,'highpass',9000);
  if(!S.story&&bar%4===3&&st>=12)snare(t,.12);
  const ln=S.lead[i%S.lead.length];if(ln>0){let n=1;while(S.lead[(i+n)%S.lead.length]===-1&&n<32)n++;trumpet(ln+T,t,sp*n*.95,S.story?.05:.055);if(!S.story&&musicTrack==='boss')trumpet(ln+T-4,t,sp*n*.95,.03)}
  seqStep++;nextNote+=sp}}
setInterval(musicTick,40);

// ----------------------------------------------------------- FX
function spark(x,y,c,n=8,p=160,size=3){for(let i=0;i<n;i++){const a=rnd(0,6.283),v=rnd(.25,1)*p;fx.push({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,life:rnd(.25,.6),max:.6,c,s:rnd(size*.6,size*1.4)})}}
function boom(x,y,size=1){fx.push({k:'boom',x,y,t:0,max:.5+size*.15,s:size});spark(x,y,'#ffd25a',10*size,220*size,3);spark(x,y,'#ff6a2a',6*size,160*size,4);shake=Math.max(shake,4*size);SFX.boom()}
function popText(x,y,t,c='#fff1b8'){fx.push({k:'txt',x,y,t,c,life:.9,max:.9})}

// ----------------------------------------------------------- PLAYER
const WEAP={N:{rate:.16,spd:640,max:4,name:'OBSIDIAN DART'},M:{rate:.075,spd:700,max:14,name:'MACUAHUITL RAPID'},S:{rate:.24,spd:560,max:25,name:'SUN SPREAD'},F:{rate:.28,spd:420,max:4,name:'FIRE SERPENT'},L:{rate:.42,spd:1050,max:1,name:'JADE LASER'}};
const COMBAT_BALANCE={2:{hp:90,adds:10},3:{hp:108,adds:11},4:{hp:122,adds:12},5:{hp:145,adds:13}};
const HERO={itza:{name:'ITZÁ',col:'#ffcf58',col2:'#ff8a2a',idle:[0,8],run:[9,11],fire:2,up:5,diag:6,down:2,crouch:7,spin:10,dh:148,sq:1},
 balam:{name:'BALAM',col:'#c27bff',col2:'#6be2ff',idle:[0,8],run:[9,2],fire:3,up:0,diag:6,down:3,crouch:5,spin:13,dh:132,sq:.86}};
function updatePlayer(p,dt){
 const k=inp[p.i];
 if(p.state==='out')return;
 if(p.state==='dead'){k.jumpP=false;p.deadT-=dt;p.vy+=GRAV*.8*dt;p.x+=p.vx*dt;p.y=Math.min(p.y+p.vy*dt,H+200);p.spin+=dt*12;if(p.deadT<=0)respawn(p);return}
 for(const f of['inv','fireCD','firing','drop','barrier','slashCD','meleeCD','attackT','landT','hurtAnimT','jumpGraceT'])p[f]=Math.max(0,(p[f]||0)-dt);
 if(k.slashP){k.slashP=false;startStrike(p,'slash')}
 if(k.meleeP){k.meleeP=false;startStrike(p,'melee')}
 updateStrikeImpact(p);
 const mx=(k.r?1:0)-(k.l?1:0);
  // W or touch-stick up engages nearby ladders. The Up Arrow remains JUMP.
  const ladder=LADDERS.find(l=>Math.abs(l.x-p.x)<28&&p.y>=l.top-12&&p.y<=l.bottom+18);
  if(ladder&&(k.u||k.d)&&!(k.jumpP&&k.u)){
   if(Math.abs(p.x-ladder.x)>3)p.x+=(ladder.x-p.x)*Math.min(1,dt*13);
   p.climbing=true;p.vy=0;p.vx=0;p.jumping=false;p.spin=0;
   p.y=clamp(p.y+(k.d?225:-225)*dt,ladder.top,ladder.bottom);
   p.onGround=p.y<=ladder.top+1;p.ground=p.onGround?PLATFORMS.find(q=>Math.abs(q.y-ladder.top)<1&&ladder.x>=q.x&&ladder.x<=q.x+q.w):null;if(p.onGround){p.jumpsUsed=0;p.jumpGraceT=0;}
   p.anim+=dt*6;p.h=76;p.crouch=false;p.dive=false;p.ax=p.dir;p.ay=-1;
   if(k.fire&&p.fireCD<=0)shoot(p);
   k.jumpP=false;return;
  }
  if(p.climbing){p.climbing=false;p.vy=Math.min(0,p.vy);}

 p.water=inWater(p)&&p.onGround;
 p.crouch=!!k.d&&p.onGround&&!mx&&!p.water&&!k.u;
 p.dive=!!k.d&&p.water&&!mx;
 if(mx)p.dir=mx;
 const targetVX=(p.crouch||p.dive)?0:mx*(p.water?150:230);
 // Responsive acceleration and braking keep movement fluid without slippery controls.
 const movementEase=targetVX===0?24:19;
 p.vx+=(targetVX-p.vx)*(1-Math.exp(-movementEase*dt));
 if(Math.abs(p.vx)<.12)p.vx=0;
 // Two separate taps: launch from the ground, then press again in midair to double jump.
 // Landing refreshes the ability; holding Jump never triggers a second jump.
 if(p.onGround){p.jumpsUsed=0;p.jumpGraceT=0;}
 if(k.jumpP){k.jumpP=false;
  if(p.onGround&&!p.dive){
   if(k.d&&p.ground&&p.ground.oneway){p.drop=.26;p.onGround=false;p.y+=2;p.jumpsUsed=0}
   else{p.vy=-655;p.onGround=false;p.jumping=true;p.jumpsUsed=1;p.jumpGraceT=.12;SFX.jump()}}
  else if(!p.onGround&&p.jumping&&p.jumpsUsed===1&&!p.climbing&&!p.dive){
   p.vy=-615;p.jumpsUsed=2;p.jumpGraceT=.12;p.spin=0;p.landT=0;
   fx.push({k:'jumpBurst',x:p.x,y:p.y-24,t:0,max:.28,c:HERO[p.hero].col});
   spark(p.x,p.y-21,HERO[p.hero].col,10,140,3);
   SFX.jump();tone(660,.11,'triangle',.035,1.5);
  }
 }
 if(!k.jump&&p.jumpGraceT<=0&&p.vy<-260)p.vy=-260; // variable jump height with quick-tap grace
 p.h=p.crouch?38:p.dive?20:(!p.onGround&&p.jumping?46:76);
 // 8-way aim, Contra style
 let ax=p.dir,ay=0;
 if(p.onGround){if(k.u){ay=-1;ax=mx?p.dir:0}else if(k.d&&mx){ay=1}}
 else{if(k.u){ay=-1;ax=mx?p.dir:0}else if(k.d){ay=1;ax=mx?p.dir:0}}
 p.ax=ax;p.ay=ay;
 const previousGround=p.onGround,previousVy=p.vy;
 physics(p,dt);
 if(p.onGround){p.jumpsUsed=0;p.jumpGraceT=0;if(!previousGround&&previousVy>90)p.landT=.13;}
 if(!p.onGround)p.spin+=dt*16*p.dir;else{p.spin=0;p.jumping=false}
 const left=camX+16,right=boss?GATE_X-16:camX+W-16;
 if(p.x<left)p.x=left;if(p.x>right)p.x=right;
 if(p.y>H+70){kill(p);return}
 if(p.onGround&&Math.abs(p.vx)>5)p.anim+=dt*(p.water?7.9:13.35)*Math.min(1,Math.abs(p.vx)/185);
 if(k.fire&&p.fireCD<=0&&!p.dive)shoot(p);
 // pickups
 for(const m of medals)if(!m.taken&&Math.abs(m.x-p.x)<32&&m.y>p.y-p.h-14&&m.y-28<p.y){m.taken=true;takeMedal(p,m.l)}
 if(p.score>=p.nextLife){p.lives++;p.nextLife+=50000;SFX.life();popText(p.x,p.y-110,'1UP','#8fffc0')}
}
function startStrike(p,kind){
 if(p.state!=='alive'||p.dive)return;
 const cd=kind==='slash'?'slashCD':'meleeCD';if(p[cd]>0)return;
 p[cd]=kind==='slash'?.48:.30;
 p.attackT=kind==='slash'?.29:.20;
 p.attackKind=kind;p.attackDir=p.dir;
 p.attackHit=false;p.attackHitDone=false;p.attackSerial=(p.attackSerial||0)+1;
 SFX.clink();
}
function updateStrikeImpact(p){
 if(p.attackT<=0||p.attackHitDone||p.state!=='alive')return;
 const slash=p.attackKind==='slash',dur=slash?.29:.20;
 const progress=1-p.attackT/dur;
 // The damage window starts after the wind-up and closes before recovery.
 if(progress<.26)return;
 if(progress>.73){p.attackHitDone=true;return}
 const dir=p.attackDir||p.dir,range=slash?112:67,vertical=slash?105:72,damage=slash?5:3;
 let didHit=false;
 for(const e of enemies){if(e.dead||e.hp<=0)continue;
   const dx=e.x-p.x,dy=(e.y-(e.h||64)*.5)-(p.y-48);
   if(dx*dir>=-16&&dx*dir<range+e.w*.3&&Math.abs(dy)<vertical){
      damageEnemy(e,damage,{own:p.i,x:e.x,y:e.y-e.h*.5,force:true,k:p.attackKind,dir});
      didHit=true;
   }
 }
 if(didHit){
   p.attackHit=p.attackHitDone=true;
   spark(p.x+dir*(slash?66:39),p.y-61,HERO[p.hero].col,slash?9:6,130,2);
   shake=Math.max(shake,slash?3:2);
 }
}
function drawStrike(p){if(p.state!=='alive'||p.attackT<=0)return;
 const d=p.dir,k=p.attackKind,progress=1-p.attackT/(k==='slash'?.29:.20);
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.sin(progress*Math.PI)*.9;
 if(k==='slash'){
   ctx.strokeStyle=HERO[p.hero].col;ctx.lineWidth=8+4*Math.sin(progress*Math.PI);
   ctx.beginPath();ctx.arc(p.x+d*24,p.y-65,69,d===1?-.95:Math.PI-.9,d===1?1.12:Math.PI+.99,d<0);ctx.stroke();
   ctx.strokeStyle='#fff4c8';ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha*=.35;ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+d*24,p.y-65,86,d===1?-1.2:Math.PI-1.2,d===1?1.28:Math.PI+1.28,d<0);ctx.stroke();
 }else{
   ctx.fillStyle=HERO[p.hero].col;ctx.beginPath();ctx.ellipse(p.x+d*47,p.y-57,24+progress*14,13+progress*9,0,0,Math.PI*2);ctx.fill();
   ctx.fillStyle='#fffbd1';ctx.beginPath();ctx.ellipse(p.x+d*52,p.y-57,10,6,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}
function muzzle(p){const d=p.dir,ax=p.ax,ay=p.ay;
 if(p.crouch)return[p.x+d*46,p.y-27];
 if(!p.onGround)return[p.x+ax*30,p.y-24+ay*30];
 if(ay<0&&ax===0)return[p.x+d*8,p.y-122];
 if(ay<0)return[p.x+d*38,p.y-100];
 if(ay>0)return[p.x+d*38,p.y-36];
 return[p.x+d*46,p.y-64]}
function shoot(p){const w=WEAP[p.weapon];let ax=p.ax,ay=p.ay;if(p.crouch){ax=p.dir;ay=0}const m=Math.hypot(ax,ay)||1;ax/=m;ay/=m;
 const mine=pbul.filter(b=>b.own===p.i).length;if(p.weapon!=='L'&&mine>=w.max)return;
 p.fireCD=w.rate;p.firing=Math.max(.24,w.rate+.1);const[x,y]=muzzle(p),h=HERO[p.hero];
 if(p.weapon==='S'){for(let i=-2;i<=2;i++){const a=Math.atan2(ay,ax)+i*.13;pbul.push({own:p.i,k:'s',x,y,vx:Math.cos(a)*w.spd,vy:Math.sin(a)*w.spd,life:1.2,dmg:1,r:5,c:h.col})}SFX.spread()}
 else if(p.weapon==='L'){for(let i=pbul.length-1;i>=0;i--)if(pbul[i].own===p.i&&pbul[i].k==='l')pbul.splice(i,1);pbul.push({own:p.i,k:'l',x,y,vx:ax*w.spd,vy:ay*w.spd,ux:ax,uy:ay,len:10,life:1.1,dmg:2,r:6,c:'#8dffb7',hits:new Set()});SFX.laser()}
 else if(p.weapon==='F'){pbul.push({own:p.i,k:'f',bx:x,by:y,x,y,vx:ax*w.spd,vy:ay*w.spd,ux:ax,uy:ay,t:0,life:1.4,dmg:2,r:9,c:'#ff7a2a'});SFX.fire()}
 else{pbul.push({own:p.i,k:'n',x,y,vx:ax*w.spd,vy:ay*w.spd,life:1.1,dmg:1,r:p.weapon==='M'?4:4.5,c:h.col});SFX.shot()}
}
function takeMedal(p,l){SFX.power();p.score+=500;if(l==='B'){p.barrier=12;popText(p.x,p.y-120,'JAGUAR SPIRIT!','#ffe17a')}else{p.weapon=l;popText(p.x,p.y-120,WEAP[l].name,'#ffe17a')}}
function hurtPlayer(p){if(p.state!=='alive'||p.inv>0||p.barrier>0||p.dive)return;
 if(difficulty==='warrior'){p.hp--;p.inv=1.3;p.hurtAnimT=.16;SFX.hit();spark(p.x,p.y-50,'#ffd8b0',12);shake=5;if(p.hp>0)return}
 kill(p)}
function kill(p){if(p.state!=='alive')return;p.state='dead';p.deadT=1.5;p.vy=-480;p.vx=-p.dir*150;p.lives--;p.weapon='N';p.barrier=0;SFX.die();spark(p.x,p.y-50,HERO[p.hero].col,22,260);shake=7;flash=.15}
function respawn(p){if(p.lives<=0){p.state='out';if(players.every(q=>q.state==='out'))gameOver();return}
 let x=camX+140;for(let t=0;t<30&&groundAt(x)===null;t++)x+=30;
 if(groundAt(x)===null&&x>WATER.x0&&x<WATER.x1+200)x=Math.max(camX+60,x);
 Object.assign(p,{state:'alive',x,y:-30,vx:0,vy:0,hp:3,inv:2.6,spin:0,drop:0,jumpsUsed:0,jumpGraceT:0,jumping:false,onGround:false})}

// ----------------------------------------------------------- ENEMIES
const EDEF={runner:{hp:1,w:30,h:84,sc:100},rifle:{hp:2,w:30,h:84,sc:200},sniper:{hp:2,w:30,h:62,sc:300},cross:{hp:2,w:30,h:84,sc:250},panther:{hp:3,w:74,h:50,sc:300},eagle:{hp:2,w:64,h:46,sc:300},jaguar:{hp:26,w:48,h:96,sc:3000},cannon:{hp:10,w:56,h:44,sc:800},capsule:{hp:1,w:54,h:34,sc:500},bcannon:{hp:18,w:60,h:46,sc:2000},bcore:{hp:90,w:96,h:120,sc:10000},wallman:{hp:2,w:30,h:84,sc:300},
 pike:{hp:4,w:32,h:86,sc:400},bat:{hp:1,w:52,h:36,sc:200},serpent:{hp:7,w:56,h:84,sc:600},leopard:{hp:5,w:80,h:56,sc:500},totem:{hp:10,w:56,h:110,sc:800},arrow:{hp:8,w:56,h:120,sc:700},spike:{hp:999,w:90,h:30,sc:0},boulder:{hp:12,w:86,h:86,sc:500},pod:{hp:16,w:100,h:150,sc:1500},stasis:{hp:14,w:90,h:150,sc:1200},minibrute:{hp:10,w:52,h:96,sc:800},cauldron:{hp:10,w:100,h:90,sc:600},tank:{hp:6,w:80,h:150,sc:400},sci:{hp:45,w:44,h:100,sc:8000},brute:{hp:80,w:84,h:146,sc:10000}};
function spawn(type,x,y,extra={}){const d=EDEF[type];const e=Object.assign({type,x,y,vx:0,vy:0,w:d.w,h:d.h,hp:d.hp,max:d.hp,dir:-1,t:rnd(0,1),cd:rnd(.8,1.8),anim:rnd(0,4),gait:rnd(0,4),hurt:0,stun:0,staggerCD:0,hitSide:0,onGround:false,state:'idle',dead:false},extra);enemies.push(e);return e}
function nearestPlayer(x,y){let best=null,bd=1e9;for(const p of players)if(p.state==='alive'){const d=Math.hypot(p.x-x,(p.y-40)-y);if(d<bd){bd=d;best=p}}return best}
function eshoot(x,y,tx,ty,spd,k='ball',extra={}){const dx=tx-x,dy=ty-y,m=Math.hypot(dx,dy)||1;ebul.push(Object.assign({k,x,y,vx:dx/m*spd,vy:dy/m*spd,life:4,r:k==='ball'?5:k==='bolt'?4:k==='shell'?8:10},extra))}
function onScreen(e,pad=0){return e.x>camX-pad&&e.x<camX+W+pad}
// V4.2: Telegraphed ranged shots. The aim point is locked before firing so a dodge is meaningful.
function telegraphShot(e,p,dt,windup,fire){
 if(e.aimT>0){
  e.aimT=Math.max(0,e.aimT-dt);
  if(e.aimT===0){fire(e.aimX,e.aimY);e.fireT=.24;e.aimX=null;e.aimY=null;}
  return;
 }
 if(!p||e.cd>0||!onScreen(e,-10))return;
 e.aimT=windup;e.aimMax=windup;e.aimX=p.x;e.aimY=p.y-p.h*.55;
 e.vx=0;e.walking=false;
}

function damageEnemy(e,dmg,src){if(e.dead||e.hp<=0)return;if(e.type==='bcore'&&boss&&boss.coreShield>0){spark(e.x,e.y-60,'#9ee',3,80);return}
 if(e.type==='pike'&&src&&!src.force&&(e.state==='guard'||e.state==='idle')&&src.vx&&Math.sign(src.vx)===-e.dir&&Math.abs(src.vy||0)<Math.abs(src.vx)*1.2&&src.k!=='f'){e.blockT=.15;spark(src.x,src.y,'#dfe6ff',5,120,2);SFX.clink();return}
 const wasHp=e.hp;e.hp-=dmg;e.hurt=(e.bossSprite||e.garrison)? .22:.21;
 const heavy=src&&(src.k==='slash'||src.k==='melee');
 const mobile=['runner','rifle','cross','sniper','wallman','pike','panther','leopard','jaguar','bat','eagle','serpent','sci','brute','minibrute'].includes(e.type);
 if(mobile&&e.hp>0){
   if(e.bossSprite||e.garrison){
      // Bosses only briefly recoil, with a resistance cooldown.
      if(heavy&&(e.staggerCD||0)<=0){e.stun=Math.max(e.stun||0,.065);e.staggerCD=.58;}
   }else{
      e.stun=Math.max(e.stun||0,heavy?.125:.055);
   }
 }
 e.hitSide=(src&&src.dir)||((src&&src.x<e.x)?1:-1);
 // Small knockback for ordinary mobile enemies; do not displace bosses or stationary hazards.
 if(src&&(src.k==='slash'||src.k==='melee')&&!e.bossSprite&&!e.garrison&&['runner','rifle','cross','sniper','pike','panther','leopard','jaguar','bat','serpent'].includes(e.type)){
  e.x+=e.hitSide*(src.k==='slash'?12:7);e.vx=e.hitSide*(src.k==='slash'?50:30);
 }
 if(e.bossSprite&&e.hp>0&&!e.enraged&&wasHp>e.max*.5&&e.hp<=e.max*.5){
   e.enraged=true;shake=Math.max(shake,6);spark(e.x,e.y-110,'#ff944a',24,185,3);
   popText(e.x,e.y-188,'ENRAGED!','#ffbf70');SFX.roar();
 }
 if(e.bossSprite&&e.hp>0){const q=Math.floor(e.hp/(e.max/4)),oldq=Math.floor(wasHp/(e.max/4));if(q<oldq){shake=Math.max(shake,5);spark(e.x,e.y-95,'#ffefab',14,165,3);popText(e.x,e.y-190,'STAGGER','#ffe18a')}}
 SFX.hit();spark(src?src.x:e.x,src?src.y:e.y-40,'#ffe1a0',src&&src.k==='slash'?9:6,145,2);
 if(e.hp<=0){e.dead=true;e.deadT=0;if(boss&&boss.kind===3&&boss.actor===e)bossDefeated();const sc=EDEF[e.type].sc;const owner=players[src&&src.own!=null?src.own:0]||players[0];owner.score+=sc;popText(e.x,e.y-(e.h||60)-10,String(sc));
  if(e.type==='capsule'){boom(e.x,e.y,.8);medals.push({x:e.x,y:e.y,vx:60,vy:-420,l:e.l,w:30,h:26,onGround:false,taken:false,t:0})}
  else if(['cannon','bcannon','jaguar'].includes(e.type))boom(e.x,e.y-20,1.4);
  else if(e.type==='bcore'){bossDefeated()}
  else if(e.type==='stasis'||e.type==='minibrute'){fxStrip('fx_boom',e.x,e.y,e.type==='stasis'?200:130,.8);SFX.boom()}
  else if(e.type==='brute'&&e.bossSprite&&stageNum!==6){spark(e.x,e.y-40,'#e8c48a',30,240);spark(e.x,e.y-70,'#ffb36b',16,200)}
  else if(e.type==='sci'||e.type==='brute'){spark(e.x,e.y-60,'#c8ff6a',30,260);fxStrip('fx_boom',e.x,e.y,220,.9);boom(e.x,e.y-60,1.5);if(boss&&boss.kind===2&&boss.sci.dead&&boss.brute&&boss.brute.dead)bossDefeated()}
  else if(['totem','arrow','pod','boulder','cauldron'].includes(e.type))boom(e.x,e.y-50,1.1)
  else if(e.type==='tank'){boom(e.x,e.y-80,1);fxStrip('fx_boom',e.x,e.y,190,.8);spark(e.x,e.y-80,'#9dff4a',30,280,4);medals.push({x:e.x,y:e.y-90,vx:-80,vy:-380,l:pick(['S','M','F','L','B']),w:30,h:26,onGround:false,taken:false,t:0})}
  else{spark(e.x,e.y-40,'#ffcf80',10,180);e.vy=-320;e.vx=(src&&src.vx>0?1:-1)*120}
  if(e.type==='jaguar')showBanner('JAGUAR WARRIOR','FREED FROM THE CURSE',2)}}
function updateEnemy(e,dt){
 e.t+=dt;e.hurt=Math.max(0,e.hurt-dt);e.anim+=dt;
 e.gait=(e.gait||0)+Math.min(1.4,Math.abs(e.vx||0)/185)*8.5*dt;
 e.blockT=Math.max(0,(e.blockT||0)-dt);
 e.staggerCD=Math.max(0,(e.staggerCD||0)-dt);
 const p=nearestPlayer(e.x,e.y-40);
 if(e.dead){e.deadT+=dt;if(['runner','rifle','cross','sniper','wallman','panther','jaguar','pike','serpent','leopard','sci','brute','minibrute'].includes(e.type)){e.vy+=GRAV*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;{const g=groundAt(e.x);if(g!==null&&e.y>g&&e.vy>0&&e.y-g<40){e.y=g;e.vy=0;e.vx=0}}}
  else if(e.type==='eagle'||e.type==='bat'){e.vy+=GRAV*.6*dt;e.y+=e.vy*dt;e.x+=e.vx*dt}
  return e.deadT>(['cannon','bcannon','totem','arrow','pod'].includes(e.type)?999:e.bossSprite?3.3:1.3)}
 // Normal enemies have short, readable recoil; boss wind-ups are not chain-stunnable.
 if(e.stun>0){
   e.stun=Math.max(0,e.stun-dt);
   e.vx*=Math.exp(-12*dt);
   if(['runner','rifle','cross','sniper','wallman','pike','panther','leopard','jaguar','serpent','sci','brute','minibrute'].includes(e.type))physics(e,dt,40);
   return false;
 }
 switch(e.type){
 case'runner':{if(e.state==='idle'){e.state='run';e.dir=e.fromLeft?1:-1}
  e.vx=e.dir*165;physics(e,dt,40);
  if(e.onGround){const ahead=groundAt(e.x+e.dir*30);const plat=surfaces().some(s=>e.x+e.dir*30>s.x&&e.x+e.dir*30<s.x+s.w&&Math.abs(s.y-e.y)<2);
   if(e.hitWall||(ahead===null&&!plat&&Math.random()<.5)){e.vy=-560;e.onGround=false}}
  if(p&&!e.shot&&Math.abs(p.x-e.x)<380&&Math.random()<dt*.35){e.shot=true;eshoot(e.x+e.dir*30,e.y-56,e.x+e.dir*400,e.y-56,250);SFX.eshot()}
  if(e.y>H+80||e.x<camX-140||e.x>camX+W+160)return true;break}
 case'rifle':case'cross':case'wallman':{physics(e,dt);if(p&&!(e.aimT>0))e.dir=p.x<e.x?-1:1;
  if(e.type==='rifle'&&p&&!e.aimT&&Math.abs(p.x-e.x)>260&&Math.abs(p.x-e.x)<520&&e.onGround&&e.cd>.6){const nx=e.x+e.dir*40;if(groundAt(nx)===e.y||e.ground&&e.ground.oneway&&nx>e.ground.x&&nx<e.ground.x+e.ground.w){e.vx=e.dir*60;e.walking=true}else{e.vx=0;e.walking=false}}else{e.vx=0;e.walking=false}
  e.cd=Math.max(0,e.cd-dt);e.fireT=Math.max(0,(e.fireT||0)-dt);
  telegraphShot(e,p,dt,e.type==='cross'?.52:.38,(tx,ty)=>{const bx=e.x+e.dir*44,by=e.y-60;
    if(e.type==='cross'){eshoot(bx,by,tx,ty,300,'bolt');e.cd=rnd(1.8,2.6)}else{eshoot(bx,by,tx,ty,270);e.cd=rnd(1.3,2.1)}
    SFX.eshot();spark(bx,by,'#ffe08a',4,70,2)});
  if(e.y>H+80)return true;if(e.x<camX-200)return true;break}
 case'sniper':{physics(e,dt);if(p&&!e.aimT)e.dir=p.x<e.x?-1:1;e.cd=Math.max(0,e.cd-dt);e.fireT=Math.max(0,(e.fireT||0)-dt);
  telegraphShot(e,p,dt,.68,(tx,ty)=>{const bx=e.x+e.dir*42,by=e.y-46;
    eshoot(bx,by,tx,ty,290);e.cd=rnd(1.5,2.3);SFX.eshot();spark(bx,by,'#ffe08a',6,80,2)});
  if(e.x<camX-200)return true;break}
 case'panther':case'leopard':{if(!p)break;const LP=e.type==='leopard';if(e.state==='idle'){e.dir=p.x<e.x?-1:1;if(Math.abs(p.x-e.x)<560){e.state='run';SFX.roar()}}
  else if(e.state==='run'){if(LP&&Math.sign(p.x-e.x)!==e.dir&&Math.abs(p.x-e.x)>120&&e.onGround)e.dir=-e.dir;e.vx=e.dir*(LP?285:240);if(e.onGround&&Math.abs(p.x-e.x)<(LP?290:250)&&e.cd<=0){e.vy=LP?-600:-560;e.vx=e.dir*(LP?380:330);e.state='leap';e.onGround=false;e.cd=1.2}}
  else if(e.state==='leap'&&e.onGround){e.state='run';e.dir=p.x<e.x?-1:1}
  e.cd-=dt;physics(e,dt,40);if(e.hitWall&&e.onGround){e.vy=-520}
  if(e.y>H+80||e.x<camX-220)return true;break}
 case'eagle':{if(e.state==='idle'){e.state='fly';e.y=e.fy??rnd(90,150);e.x=camX+W+60+(e.off||0)}
  if(e.state==='fly'){e.x-=200*dt;e.y+=Math.sin(e.t*4)*40*dt;if(p&&e.x-p.x<330&&e.x>p.x){e.state='dive';const dx=p.x-e.x,dy=(p.y-50)-e.y,m=Math.hypot(dx,dy);e.vx=dx/m*430;e.vy=dy/m*430}}
  else if(e.state==='dive'){e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.y>(p?p.y-40:400)||e.y>400){e.state='up';e.vx=-260;e.vy=-300}}
  else{e.x+=e.vx*dt;e.y+=e.vy*dt;e.vy+=60*dt}
  if(e.x<camX-150||e.y<-150)return true;break}
 case'jaguar':{if(!p)break;physics(e,dt);
  if(e.state==='idle'){if(onScreen(e,-80)){e.state='roar';e.st=1.1;SFX.roar();showBanner('MINI BOSS','CURSED JAGUAR WARRIOR',2.2);shake=6}}
  else{e.st-=dt*(e.enraged?1.17:1);
   if(e.state==='roar'&&e.st<=0){e.state='walk';e.st=rnd(1.2,2)}
   else if(e.state==='walk'){e.dir=p.x<e.x?-1:1;e.vx=e.dir*90;if(e.st<=0){e.vx=0;const r=Math.random();if(Math.abs(p.x-e.x)<150){e.state='slash';e.st=.55;e.hitDone=false}else if(r<.45){e.state='wave';e.st=.6;e.waveDone=false}else{e.state='dash';e.st=.55;e.vx=e.dir*430;e.vy=-200}}}
   else if(e.state==='slash'){e.vx=0;if(e.st<.3&&!e.hitDone){e.hitDone=true;for(const q of players)if(q.state==='alive'&&Math.abs(q.x-(e.x+e.dir*60))<70&&q.y>e.y-120&&q.y-q.h<e.y)hurtPlayer(q);spark(e.x+e.dir*60,e.y-60,'#ffd04a',12,200)}if(e.st<=0){e.state='walk';e.st=rnd(1,1.8)}}
   else if(e.state==='wave'){e.vx=0;if(e.st<.3&&!e.waveDone){e.waveDone=true;eshoot(e.x+e.dir*50,e.y-48,e.x+e.dir*500,e.y-48,330,'wave',{dir:e.dir});eshoot(e.x+e.dir*50,e.y-48,e.x+e.dir*500,e.y-110,300,'wave',{dir:e.dir});SFX.cannon()}if(e.st<=0){e.state='walk';e.st=rnd(1,1.6)}}
   else if(e.state==='dash'){if(e.st<=0||e.hitWall){e.vx=0;e.state='walk';e.st=rnd(.9,1.5)}}}
  if(e.y>H+60){e.hp=0;e.dead=true;e.deadT=2}
  break}
 case'cannon':case'bcannon':{if(!p)break;const tx=p.x-e.x,ty=(p.y-40)-(e.y-18);let want=Math.atan2(ty,tx);
  if(e.type==='bcannon'){if(want<0)want+=Math.PI*2;want=clamp(want,Math.PI*.55,Math.PI*1.25)}
  const step=Math.PI/6;want=Math.round(want/step)*step;e.ang=e.ang==null?want:e.ang+clamp(((want-e.ang+Math.PI*3)%(Math.PI*2))-Math.PI,-2*dt,2*dt);
  e.cd-=dt;e.fireT=Math.max(0,(e.fireT||0)-dt);
  if(e.cd<=0&&onScreen(e,-20)&&Math.hypot(tx,ty)<700){const bx=e.x+Math.cos(e.ang)*40,by=e.y-18+Math.sin(e.ang)*40;
   if(e.type==='bcannon'){ebul.push({k:'shell',x:bx,y:by,vx:Math.cos(e.ang)*rnd(260,380),vy:Math.sin(e.ang)*300-220,g:true,life:4,r:9});e.cd=rnd(1.4,2)}
   else{ebul.push({k:'shell',x:bx,y:by,vx:Math.cos(e.ang)*240,vy:Math.sin(e.ang)*240,life:4,r:7});e.cd=rnd(1.6,2.3)}
   e.fireT=.2;SFX.cannon();spark(bx,by,'#ffc56a',8,120,3)}
  break}
 case'pike':{physics(e,dt);if(!p)break;const dx=p.x-e.x,ad=Math.abs(dx);e.st=(e.st??1)-dt*(e.enraged?1.17:1);
  if(e.state==='idle'){if(onScreen(e,-30)){e.state='guard';e.st=rnd(.6,1.2)}}
  else if(e.state==='guard'){e.dir=dx<0?-1:1;e.vx=ad>120?e.dir*70:0;const nx=e.x+e.dir*30;if(e.vx&&groundAt(nx)===null&&!(e.ground&&e.ground.oneway&&nx>e.ground.x&&nx<e.ground.x+e.ground.w))e.vx=0;
   if(e.st<=0){e.vx=0;if(ad<150){e.state='wind';e.st=.42}else if(ad<340&&Math.random()<.5){e.state='windDash';e.st=.42}else e.st=rnd(.5,1)}}
  else if(e.state==='wind'){e.vx=0;if(e.st<=0){e.state='thrust';e.st=.35;e.hitDone=false}}
  else if(e.state==='windDash'){e.vx=0;if(e.st<=0){e.state='dash';e.st=.5;e.vx=e.dir*360;e.hitDone=false;SFX.jump()}}
  else if(e.state==='thrust'||e.state==='dash'){if(e.state==='thrust')e.vx=0;
   if(e.st<.23&&!e.hitDone)for(const q of players)if(q.state==='alive'&&Math.abs(q.x-(e.x+e.dir*70))<60&&q.y>e.y-90&&q.y-q.h<e.y-20){hurtPlayer(q);e.hitDone=true}
   if(e.st<=0||e.hitWall){e.vx=0;e.state='guard';e.st=rnd(.8,1.4)}}
  if(e.y>H+80||e.x<camX-200)return true;break}
 case'bat':{if(e.state==='idle'){e.state='fly';e.x=camX+W+40+(e.off||0);e.y=e.fy??rnd(70,170);e.by=e.y}
  if(e.state==='fly'){e.x-=150*dt;if(p)e.by+=clamp((p.y-100)-e.by,-60,60)*dt;e.y=e.by+Math.sin(e.t*7)*26;
   if(p&&Math.abs(p.x-e.x)<240&&e.t>.8){e.state='swoop';const dx=p.x-e.x,dy=(p.y-45)-e.y,m=Math.hypot(dx,dy)||1;e.vx=dx/m*380;e.vy=dy/m*380;e.st=.9}}
  else if(e.state==='swoop'){e.x+=e.vx*dt;e.y+=e.vy*dt;e.st-=dt;if(e.st<=0||e.y>420){e.state='away';e.vy=-220;e.vx=-200}}
  else{e.x+=e.vx*dt;e.y+=e.vy*dt}
  if(e.x<camX-120||e.y<-120||e.x>camX+W+200)return true;break}
 case'serpent':{physics(e,dt);if(!p)break;e.dir=p.x<e.x?-1:1;e.st=(e.st??1)-dt;const ad=Math.abs(p.x-e.x);
  if(e.state==='idle'){if(onScreen(e,-20)){e.state='coil';e.st=rnd(.6,1.2)}}
  else if(e.state==='coil'&&e.st<=0){if(ad<150){e.state='lunge';e.st=.5;e.hitDone=false}else{e.state='spitW';e.st=.45}}
  else if(e.state==='spitW'&&e.st<=0){e.state='spit';e.st=.3;eshoot(e.x+e.dir*55,e.y-72,p.x,p.y-40,280,'venom');eshoot(e.x+e.dir*55,e.y-72,p.x+e.dir*60,p.y-110,250,'venom');SFX.eshot()}
  else if(e.state==='spit'&&e.st<=0){e.state='coil';e.st=rnd(1.1,1.8)}
  else if(e.state==='lunge'){if(e.st<.35&&!e.hitDone){e.hitDone=true;for(const q of players)if(q.state==='alive'&&Math.abs(q.x-(e.x+e.dir*80))<60&&q.y>e.y-110&&q.y-q.h<e.y)hurtPlayer(q)}if(e.st<=0){e.state='coil';e.st=rnd(1,1.5)}}
  if(e.x<camX-200)return true;break}
 case'totem':{if(p)e.dir=p.x<e.x?-1:1;e.st=(e.st??rnd(.5,1.5))-dt;e.phase=e.phase||'idle';
  if(e.st<=0){if(e.phase==='idle'&&!onScreen(e,-10))e.st=.5;else{const n={idle:['charge',.7],charge:['flame',1.3],flame:['smoke',.9],smoke:['idle',rnd(1.2,2)]}[e.phase];e.phase=n[0];e.st=n[1];if(e.phase==='flame')SFX.fire()}}
  if(e.phase==='flame'){const x0=e.dir>0?e.x+30:e.x-215,x1=e.dir>0?e.x+215:e.x-30;for(const q of players)if(q.state==='alive'&&q.x+q.w/2>x0&&q.x-q.w/2<x1&&q.y>e.y-100&&q.y-q.h<e.y-50)hurtPlayer(q);
   if(Math.random()<dt*40)fx.push({k:'p',x:e.x+e.dir*rnd(50,200),y:e.y-75+rnd(-14,14),vx:e.dir*rnd(40,120),vy:rnd(-80,-20),life:rnd(.2,.4),max:.4,c:pick(['#ffd25a','#ff8a2a','#ff5a20']),s:rnd(3,6)})}
  break}
 case'arrow':{if(p&&!e.aimT)e.dir=p.x<e.x?-1:1;e.cd=Math.max(0,e.cd-dt);e.fireT=Math.max(0,(e.fireT||0)-dt);
  telegraphShot(e,p,dt,.55,()=>{e.alt=!e.alt;ebul.push({k:'arrow',x:e.x+e.dir*50,y:e.alt?e.y-62:e.y-22,vx:e.dir*430,vy:0,life:3,r:5});e.cd=1.5;SFX.eshot()});
  break}
 case'spike':{e.st=(e.st??rnd(0,1.4))-dt;if(e.st<=0){const n={down:['rise',.25],rise:['up',1.1],up:['lower',.3],lower:['down',1.4]}[e.phase||'down'];e.phase=n[0];e.st=n[1]}
  if(e.phase==='up'||(e.phase==='rise'&&e.st<.12)){for(const q of players)if(q.state==='alive'&&Math.abs(q.x-e.x)<44&&q.y>e.y-40&&q.y<=e.y+2)hurtPlayer(q)}
  if(e.x<camX-200)return true;break}
 case'boulder':{e.vx=-300;physics(e,dt,40);e.rot=(e.rot||0)+dt*9;if(Math.random()<dt*8)spark(e.x+30,e.y-4,'#c9a874',2,60,3);if(e.hitWall){e.hp=0;e.dead=true;e.deadT=0;boom(e.x,e.y-40,1)}if(e.y>H+80||e.x<camX-200)return true;break}
 case'pod':{e.st=(e.st??1)-dt;e.phase=e.phase||'idle';
  if(e.st<=0){if(e.phase==='idle'){if(onScreen(e,-40)&&(e.made||0)<3){e.phase='charge';e.st=3}else e.st=.5}
   else if(e.phase==='charge'){e.phase='burst';e.st=.8;SFX.cannon();shake=4}
   else if(e.phase==='burst'){e.phase='empty';e.st=4;e.made=(e.made||0)+1;spawn('leopard',e.x-30,e.y,{state:'run',dir:-1});spark(e.x,e.y-60,'#d8ff6a',16,200)}
   else{e.phase='idle';e.st=.3}}
  break}
 case'cauldron':{const f=Math.floor(e.anim*8)%8;if(f===4&&e.lastF!==4&&onScreen(e,-20)){for(let i=0;i<3;i++){const bias=p?Math.sign(p.x-e.x)*rnd(60,220):rnd(-150,150);ebul.push({k:'flask',glob:true,x:e.x+rnd(-20,20),y:e.y-110,vx:bias+rnd(-70,70),vy:rnd(-560,-420),g:true,life:3,r:8})}SFX.fire()}e.lastF=f;break}
 case'tank':break;
 case'stasis':{e.st=(e.st??1)-dt;e.phase=e.phase||'idle';
  if(e.st<=0){const ph=e.phase;
   if(ph==='idle'){if(onScreen(e,-60)&&(e.made||0)<2){e.phase='act';e.st=1.4}else e.st=.5}
   else if(ph==='act'){e.phase='open';e.st=.9;SFX.cannon()}
   else if(ph==='open'){e.phase='wait';e.st=2.5;e.made=(e.made||0)+1;spawn('leopard',e.x-10,e.y,{state:'run',dir:-1});shake=5;SFX.roar()}
   else if(ph==='wait'){e.phase='reset';e.st=1.2}
   else{e.phase='idle';e.st=2}}
  break}
 case'sci':{physics(e,dt);if(!p)break;e.dir=p.x<e.x?-1:1;e.st=(e.st??1.5)-dt;e.phase=e.phase||'idle';e.relT=Math.max(0,(e.relT||0)-dt);
  if(e.st<=0){
   if(e.phase==='idle'){if(Math.random()<.55){e.phase='throw';e.st=.5}else{e.phase='beamW';e.st=.6}}
   else if(e.phase==='throw'){const T=1.05,tx=p.x+rnd(-40,40),ty=groundAt(p.x)??430,sx=e.x+e.dir*30,sy=e.y-90;ebul.push({k:'flask',x:sx,y:sy,vx:(tx-sx)/T,vy:(ty-sy-.5*700*T*T)/T,g:true,life:3,r:8});e.phase='idle';e.relT=.3;e.st=rnd(.9,1.5);SFX.eshot()}
   else if(e.phase==='beamW'){e.phase='beam';e.st=.5;const base=Math.atan2(p.y-40-(e.y-60),p.x-e.x);for(let i=-1;i<=1;i++){const a=base+i*.18;ebul.push({k:'venom',x:e.x+e.dir*50,y:e.y-60,vx:Math.cos(a)*330,vy:Math.sin(a)*330,life:3,r:7})}SFX.laser()}
   else{e.phase='idle';e.st=rnd(1,1.6)}}
  break}
 case'brute':case'minibrute':{physics(e,dt,10);const MB=e.type==='minibrute';if(!p)break;e.st=(e.st??1)-dt*(e.enraged?1.17:1);const dx=p.x-e.x;
  if(e.state==='roar'){e.vx=0;if(e.st<=0){e.state='walk';e.st=rnd(1.2,2)}}
  else if(e.state==='walk'){e.dir=dx<0?-1:1;e.vx=e.dir*(MB?110:85);if(e.st<=0){e.vx=0;if(Math.abs(dx)<(MB?170:260)){e.state='poundW';e.st=.55}else{e.state='chargeW';e.st=.4}}}
  else if(e.state==='chargeW'){e.vx=0;if(e.st<=0){e.state='charge';e.st=1.2;e.vx=e.dir*(MB?380:430);SFX.roar()}}
  else if(e.state==='charge'){if(e.st<=0||e.hitWall){if(e.hitWall){shake=8;boom(e.x+e.dir*40,e.y-60,.6)}e.vx=0;e.state='walk';e.st=rnd(1,1.6)}}
  else if(e.state==='poundW'){e.vx=0;if(e.st<=0){e.state='pound';e.st=.6;shake=12;SFX.boom();for(const d of[-1,1])ebul.push({k:'shock',x:e.x+d*(MB?30:50),y:e.y-16,vx:d*(MB?260:330),vy:0,life:MB?1.1:2.2,r:MB?11:16,dir:d});spark(e.x,e.y-10,'#c8ff6a',20,260)}}
  else if(e.state==='pound'&&e.st<=0){e.state='walk';e.st=rnd(1,1.8)}
  break}
 case'capsule':{e.x+=(camX-e.lc)+160*dt;e.lc=camX;e.y=e.by+Math.sin(e.t*2.6)*46;if(e.x>camX+W+80)return true;break}
 case'bcore':break;
 }
 return false}
function enemyBox(e){if(e.type==='eagle'||e.type==='capsule'||e.type==='bat')return{x0:e.x-e.w/2,x1:e.x+e.w/2,y0:e.y-e.h/2,y1:e.y+e.h/2};
 if(e.type==='cannon'||e.type==='bcannon')return{x0:e.x-e.w/2,x1:e.x+e.w/2,y0:e.y-e.h,y1:e.y};
 if(e.type==='bcore')return{x0:e.x-e.w/2,x1:e.x+e.w/2,y0:e.y-e.h,y1:e.y};
 return{x0:e.x-e.w/2,x1:e.x+e.w/2,y0:e.y-e.h,y1:e.y}}
const contactTypes=new Set(['runner','panther','eagle','jaguar','pike','bat','serpent','leopard','boulder','brute','minibrute']);

// ----------------------------------------------------------- BOSS: THE IRON GATE
function flyWave(t){const n=t==='bat'?pick([1,2,3,3]):pick([1,1,2]),y0=t==='bat'?rnd(60,140):rnd(80,130);for(let k=0;k<n;k++)spawn(t,0,0,{off:k*(t==='bat'?55:90),fy:y0+(k%2)*(t==='bat'?42:30)})}
function startBoss(){if(boss)return;boss={kind:1,t:0,coreShield:1,gar:[],garT:.3,spawnT:9,wallT:1,dead:false,deadT:0};musicTrack='boss';seqStep=0;
 showBanner('BOSS','THE FIVE-SOLDIER GARRISON',3);SFX.roar();
 boss.c1=spawn('bcannon',GATE_X+6,214,{ang:Math.PI,cd:2});boss.c2=spawn('bcannon',GATE_X+6,300,{ang:Math.PI,cd:3});
 boss.core=spawn('bcore',GATE_X+42,430,{});
 boss.w1=spawn('wallman',GATE_X+90,118,{cd:2});boss.w2=spawn('wallman',GATE_X+250,118,{cd:3})}

function startChapterBoss(){if(boss)return;   // never twice: the intro cutscene and the arena trigger could both start it

 if(stageNum===6){startBoss2();return}
 const name=stageNum===2?'THE IRON CAPTAIN':STG.bossName;
 const typ=stageNum===4?'jaguar':stageNum===3?'brute':stageNum===5?'brute':'pike';
 boss={kind:3,t:0,dead:false,deadT:0,name,adds:3,addT:COMBAT_BALANCE[stageNum].adds};musicTrack='boss';seqStep=0;
 const bx=ARENA_X+W-220,e=spawn(typ,bx,groundAt(bx)??430,{dir:-1,st:1.3,state:typ==='brute'?'roar':'idle',hp:COMBAT_BALANCE[stageNum].hp,max:COMBAT_BALANCE[stageNum].hp,bossSprite:'boss'+stageNum});
 boss.actor=e;showBanner('BOSS ENCOUNTER',name,3);shake=8;SFX.roar();
}
// V4.2 — Unique, telegraphed signature attacks for bosses in chapters 2–6.
const BOSS_SPECIALS={
 2:{name:'IRON CROSSCUT',color:'#ffd06c',wind:.95,cool:9.4},
 3:{name:'CENOTE SURGE',color:'#72f0ff',wind:1.20,cool:9.8},
 4:{name:'FEATHER BARRAGE',color:'#80f7db',wind:1.00,cool:9.3},
 5:{name:'SIEGEBREAKER',color:'#ffc07b',wind:1.35,cool:10.8},
 6:{name:'TOXIC NOVA',color:'#b4ff70',wind:1.10,cool:10.5}
};
function updateBossSignature(dt){
 if(!boss||boss.dead||stageNum<2)return;
 const actor=boss.kind===3?boss.actor:boss.kind===2?boss.sci:null;
 if(!actor||actor.dead||actor.hp<=0){boss.signature=null;return;}
 const data=BOSS_SPECIALS[stageNum];if(!data)return;
 if(boss.signature){
   let sig=boss.signature;
   sig.t=Math.max(0,sig.t-dt);
   actor.specialPhase=sig.t>0?'wind':'release';
   if(sig.t>0)return;
   const x=actor.x, y=actor.y, dir=sig.dir;
   shake=Math.max(shake,stageNum===5?7:3);
   if(stageNum===2){ // Captain: one committed, ground-level blade arc
      ebul.push({k:'wave',x:x+dir*54,y:y-66,vx:dir*355,vy:0,dir,life:1.45,r:14});
      spark(x+dir*70,y-65,'#ffce82',15,130,2);SFX.eshot();
   }else if(stageNum===3){ // Abomination: waterlogged shockwaves running across the cave floor
      for(const d of[-1,1])ebul.push({k:'shock',color:'#6be1f9',x:x+d*56,y:y-23,vx:d*248,vy:0,dir:d,life:1.3,r:16});
      spark(x,y-38,'#7be7ff',19,195,3);SFX.boom();
   }else if(stageNum===4){ // Guardian: fan of feather darts aimed at where the player WAS
      const sx=x+dir*55,sy=y-115,base=Math.atan2(sig.aimY-sy,sig.aimX-sx);
      for(let j=-2;j<=2;j++){const a=base+j*.14;ebul.push({k:'feather',x:sx,y:sy,vx:Math.cos(a)*310,vy:Math.sin(a)*310,r:6,life:2.5});}
      spark(sx,sy,'#83f9d7',16,135,2);SFX.eshot();
   }else if(stageNum===5){ // Warlord: falling masonry, landing where the warning was displayed
      const dropX=clamp(sig.aimX,ARENA_X+45,GATE_X-60);
      ebul.push({k:'siegestone',x:dropX,y:Math.max(-20,(groundAt(dropX)??430)-230),vx:0,vy:285,life:2.1,r:16});
      spark(x,y-85,'#ffbb72',12,140,3);SFX.boom();
   }else if(stageNum===6){ // Mad Alchemist: staggered green toxin fan
      const sx=x+dir*46,sy=y-80,base=Math.atan2(sig.aimY-sy,sig.aimX-sx);
      for(let j=-2;j<=2;j++){const a=base+j*.15;ebul.push({k:'venom',x:sx,y:sy,vx:Math.cos(a)*255,vy:Math.sin(a)*255,r:7,life:2.6});}
      spark(sx,sy,'#c3ff80',16,145,3);SFX.laser();
   }
   actor.specialPhase='release';actor.specialT=.26;
   boss.signature=null;
   boss.specialCD=data.cool*(actor.enraged?.76:1);
   return;
 }
 actor.specialT=Math.max(0,(actor.specialT||0)-dt);
 boss.specialCD=(boss.specialCD??4.6)-dt;
 if(boss.specialCD>0)return;
 const player=nearestPlayer(actor.x,actor.y-60);
 if(!player||!onScreen(actor,100)){boss.specialCD=1;return;}
 const aimX=player.x,aimY=player.y-player.h*.54;
 const dir=aimX<actor.x?-1:1;
 actor.dir=dir;actor.specialPhase='wind';actor.specialT=data.wind;
 boss.signature={t:data.wind,max:data.wind,aimX,aimY,dir,name:data.name,color:data.color};
 popText(actor.x,actor.y-220,data.name,data.color);
}
function drawBossSignature(){
 if(!boss||!boss.signature||boss.dead)return;
 const sig=boss.signature,actor=boss.kind===3?boss.actor:boss.sci;
 if(!actor||actor.dead)return;
 const progress=1-sig.t/sig.max,bright=.40+.28*Math.sin(time*16)**2;
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=bright;
 ctx.strokeStyle=sig.color;ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(actor.x,actor.y-150,24,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);ctx.stroke();
 if(stageNum===5){
   const g=groundAt(sig.aimX)??430;ctx.setLineDash([8,7]);ctx.lineWidth=4;
   ctx.beginPath();ctx.ellipse(sig.aimX,g-7,29+progress*11,10+progress*4,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
   ctx.beginPath();ctx.moveTo(sig.aimX,g-210);ctx.lineTo(sig.aimX,g-38);ctx.stroke();
 }else if(stageNum===3){
   for(const d of[-1,1]){ctx.beginPath();ctx.moveTo(actor.x+d*44,actor.y-15);ctx.lineTo(actor.x+d*(110+progress*125),actor.y-15);ctx.stroke();}
 }else{
   ctx.setLineDash([9,8]);ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(actor.x+sig.dir*40,actor.y-85);ctx.lineTo(sig.aimX,sig.aimY);ctx.stroke();ctx.setLineDash([]);
   ctx.beginPath();ctx.arc(sig.aimX,sig.aimY,10+progress*7,0,Math.PI*2);ctx.stroke();
 }
 ctx.restore();
}
function updateChapterBoss(dt){
 if(!boss.dead)updateBossSignature(dt);
 if(boss.dead){boss.deadT+=dt;if(Math.random()<dt*5)boom(ARENA_X+W-rnd(120,350),rnd(160,400),.8);if(boss.deadT>3.2&&mode==='play')victory();return}
 boss.addT-=dt;
 if(boss.addT<=0){boss.addT=COMBAT_BALANCE[stageNum].adds;const ty=stageNum===3?'bat':stageNum===4?'eagle':stageNum===2?'cross':stageNum===5?'leopard':'runner';const x=ARENA_X+W-80;spawn(ty,x,ty==='bat'||ty==='eagle'?0:groundAt(x)||430,{dir:-1});}
 if(boss.actor?.dead)bossDefeated();
}

function updateBoss(dt){if(!boss)return;boss.t+=dt;if(boss.kind===2)return updateBoss2(dt);if(boss.kind===3)return updateChapterBoss(dt);
 if(boss.dead){boss.deadT+=dt;if(Math.random()<dt*10)boom(GATE_X+rnd(0,340),rnd(130,430),rnd(.6,1.6));if(boss.deadT>3.6&&mode==='play')victory();return}
 const GT=['rifle','pike','cross','pike','rifle'];if(boss.gar.length<5){boss.garT-=dt;if(boss.garT<=0){const k=boss.gar.length,t=GT[k],hp={rifle:7,pike:10,cross:7}[t];boss.gar.push(spawn(t,GATE_X-30,430,{garrison:true,hp,max:hp,dir:-1,cd:1.2+k*.3}));boss.garT=.9;SFX.cannon()}}
 const gd=boss.gar.filter(e=>e.dead).length;boss.garDead=gd;if(boss.coreShield&&gd>=5){boss.coreShield=0;showBanner('THE GARRISON HAS FALLEN','STRIKE THE SUN-STONE!',2.2);shake=8;flash=.2;SFX.roar();boss.spawnT=2}
 if(!boss.coreShield){boss.spawnT-=dt;if(boss.spawnT<=0){spawn('runner',GATE_X-14,430);boss.spawnT=rnd(2.2,3.6)}}
 boss.flyT=(boss.flyT??6)-dt;if(boss.flyT<=0){boss.flyT=rnd(6,9);flyWave(Math.random()<.5?'eagle':'bat')}
 for(const k of['w1','w2']){const w=boss[k];if(w&&w.dead&&w.deadT>1.3){boss[k]=null;boss[k+'t']=5}if(!boss[k]){boss[k+'t']-=dt;if(boss[k+'t']<=0)boss[k]=spawn('wallman',GATE_X+(k==='w1'?90:250),118,{cd:1.5})}}}
function bossDefeated(){if(!boss||boss.dead)return;boss.signature=null;boss.dead=true;for(const e of enemies)if(!e.dead&&e!==boss.core){e.hp=0;e.dead=true;e.deadT=0}ebul=[];shake=14;flash=.5;SFX.roar();const bx0=GATE_X-(boss.kind===2?300:0),stg=stageNum;for(let i=0;i<6;i++)setTimeout(()=>{if(stageNum===stg&&mode==='play')boom(bx0+rnd(0,300),rnd(150,420),1.8)},i*160)}
function startBoss2(){boss={kind:2,t:0,dead:false,deadT:0,released:false,batT:6};musicTrack='boss';seqStep=0;
 showBanner('WARNING','THE MAD ALCHEMIST & HIS MUTANT BRUTE',3);SFX.roar();boss.sci=spawn('sci',ARENA_X+W-180,200,{dir:-1,st:2.5,bossSprite:'boss6'})}
function updateBoss2(dt){
 if(!boss.dead)updateBossSignature(dt);
 if(boss.dead){boss.deadT+=dt;if(Math.random()<dt*8)boom(ARENA_X+rnd(0,300),rnd(150,430),rnd(.6,1.4));if(boss.deadT>3.6&&mode==='play')victory();return}
 if(!boss.released&&(boss.t>4.2||boss.sci.dead)){boss.released=true;boss.brute=spawn('brute',ARENA_X+W-220,430,{state:'roar',st:1.3,dir:-1});shake=14;flash=.25;SFX.roar();boom(ARENA_X+W-220,330,1.6);showBanner('THE POD BREAKS','MUTANT BRUTE UNLEASHED',1.8)}
 boss.batT-=dt;if(boss.batT<=0){boss.batT=rnd(9,12);flyWave(Math.random()<.65?'bat':'eagle')}
 if(boss.sci.dead&&boss.brute&&boss.brute.dead)bossDefeated()}

// ----------------------------------------------------------- MAIN UPDATE
function update(dt){
 time+=dt;stageT+=dt;if(banner){banner.t-=dt;if(banner.t<=0)banner=null}
 shake=Math.max(0,shake-dt*20);flash=Math.max(0,flash-dt);
 pollPads();
 for(const p of players)updatePlayer(p,dt);
 // camera: Contra-style forward-only scroll
 const alive=players.filter(p=>p.state==='alive');
 if(alive.length&&!boss){let lead=Math.max(...alive.map(p=>p.x)),trail=Math.min(...alive.map(p=>p.x));let target=Math.min(lead-400,trail-30);camX=clamp(Math.max(camX,camX+(Math.max(camX,target)-camX)*(1-Math.exp(-8.5*dt))),0,ARENA_X)}
 if(!boss&&mode==='play'&&camX>=ARENA_X-1){if(stageNum===1){if(!garrisonSeen&&!window.__noCut){garrisonSeen=true;ebul=[];playCuts(GARRISON_CUT,()=>{mode='play';startBoss()},'boss');return}startBoss()}else{if(!alchSeen&&!window.__noCut){alchSeen=true;ebul=[];playCuts([{f:({2:'Level_02_The_Iron_Captain',3:'Level_03_The_Cenote_Abomination',4:'Level_04_The_Feathered_Guardian',5:'Level_05_The_Siege_Warlord',6:'Level_06_The_Mad_Alchemist'})[stageNum]}],()=>{mode='play';startChapterBoss()},'boss');return}startChapterBoss()}}
 for(let i=0;i<BOULDERS.length;i++){if(!boulderDone.has(i)&&camX>=BOULDERS[i]){boulderDone.add(i);const bx=camX+W+60;spawn('boulder',bx,groundAt(bx)??430,{});popText(camX+W-120,140,'BOULDER!','#ffb36a');shake=5;SFX.cannon()}}
 // bridge
 for(const b of BRIDGE){if(b.state===0&&players.some(p=>p.state==='alive'&&p.x>b.x-70)){b.state=1;b.t=0;boom(b.x+45,b.y-10,.9)}if(b.state===1){b.t+=dt;if(b.t>.5)b.state=2}}
 // spawning
 for(let i=0;i<PLACED.length;i++){if(placedDone.has(i))continue;const[t,x,y]=PLACED[i];if(x<camX+W+70){placedDone.add(i);if(x>camX-40){if(t==='eagle'||t==='bat')spawn(t,x,0);else spawn(t,x,y,{dir:-1})}}}
 for(let i=0;i<CAPSULES.length;i++){if(capDone.has(i))continue;if(camX>=CAPSULES[i][0]){capDone.add(i);spawn('capsule',camX-40,0,{by:rnd(110,170),l:CAPSULES[i][1],lc:camX})}}
 if(!boss){runnerT-=dt;const z=RUNNER_ZONES.find(z=>camX+W>z[0]&&camX+W<z[1]);if(z&&runnerT<=0&&enemies.filter(e=>e.type==='runner'&&!e.dead).length<4){runnerT=z[2]*rnd(.6,1.3);const fromLeft=Math.random()<.18&&camX>300;const x=fromLeft?camX-30:camX+W+30;const g=groundAt(x);if(g!==null){const n=Math.random()<.35?2:1;for(let j=0;j<n;j++)spawn(stageNum===3?'serpent':stageNum===4?'pike':stageNum===5?'rifle':stageNum===6?'cross':'runner',x+(fromLeft?-j*50:j*50),g,{fromLeft})}}}
 if(!boss){flyT-=dt;const fz=(STG.flyers||[]).find(z=>camX+W>z[0]&&camX+W<z[1]);if(fz&&flyT<=0){flyT=fz[2]*rnd(.7,1.3);if(enemies.filter(e=>(e.type==='bat'||e.type==='eagle')&&!e.dead).length<5)flyWave(Math.random()<fz[3]?'bat':'eagle')}}
 for(let i=enemies.length-1;i>=0;i--){if(updateEnemy(enemies[i],dt))enemies.splice(i,1)}
 updateBoss(dt);
 // player bullets
 for(let i=pbul.length-1;i>=0;i--){const b=pbul[i];b.life-=dt;
  if(b.k==='f'){b.t+=dt;b.bx+=b.vx*dt;b.by+=b.vy*dt;const o=Math.sin(b.t*15)*20;b.x=b.bx-b.uy*o;b.y=b.by+b.ux*o}else{b.x+=b.vx*dt;b.y+=b.vy*dt}
  if(b.k==='l')b.len=Math.min(150,b.len+dt*1400);
  let gone=b.life<=0||b.x<camX-40||b.x>camX+W+40||b.y<-40||b.y>H+40;
  if(!gone)for(const e of enemies){if(e.dead||e.type==='spike')continue;const bx=enemyBox(e);
   let hit=false;if(b.k==='l'){if(b.hits.has(e))continue;for(let s=0;s<=1;s+=.25){const px=b.x-b.ux*b.len*s,py=b.y-b.uy*b.len*s;if(px>bx.x0&&px<bx.x1&&py>bx.y0&&py<bx.y1){hit=true;break}}}
   else hit=b.x+b.r>bx.x0&&b.x-b.r<bx.x1&&b.y+b.r>bx.y0&&b.y-b.r<bx.y1;
   if(hit){damageEnemy(e,b.dmg,b);if(b.k==='l')b.hits.add(e);else{gone=true;break}}}
  if(gone)pbul.splice(i,1)}
 // Reflect only physical shots and arrows while the Slash blade is active.
 function trySlashDeflection(b){
  if(!['ball','bolt','arrow','shell'].includes(b.k))return false;
  for(const p of players){
   if(p.state!=='alive'||p.attackKind!=='slash'||p.attackT<=0||p.dive||p.climbing)continue;
   const phase=1-p.attackT/.29;
   if(phase<.16||phase>.82)continue;
   const dir=p.attackDir||p.dir,dx=(b.x-p.x)*dir,dy=b.y-(p.y-65);
   if(dx<0||dx>125+(b.r||4)||Math.abs(dy)>96+(b.r||4))continue;
   if(Math.hypot(dx-41,dy)>111+(b.r||4))continue;
   const speed=Math.max(555,Math.min(890,Math.hypot(b.vx,b.vy)*1.28));
   const target=enemies.filter(e=>!e.dead&&e.hp>0&&dir*(e.x-b.x)>0&&dir*(e.x-b.x)<740)
     .sort((a,c)=>Math.abs(a.x-b.x)-Math.abs(c.x-b.x))[0];
   const aim=target?Math.atan2((target.y-target.h*.50)-b.y,Math.max(65,Math.abs(target.x-b.x))):0;
   const angle=clamp(aim,-.35,.35);
   pbul.push({k:'parry',x:b.x+dir*9,y:b.y,vx:dir*Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
     r:6,life:1.6,dmg:b.k==='shell'?4:3,own:p.i,c:HERO[p.hero].col,force:true});
   spark(b.x,b.y,HERO[p.hero].col,8,180,2);
   popText(p.x+dir*52,p.y-115,'DEFLECT!','#fff1b8');
   p.score+=20;shake=Math.max(shake,1.8);SFX.clink();
   return true;
  }
  return false;
 }
 // enemy bullets
 for(let i=ebul.length-1;i>=0;i--){const b=ebul[i];b.life-=dt;if(b.g)b.vy+=700*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.life>0&&trySlashDeflection(b)){ebul.splice(i,1);continue}
  if(b.k==='siegestone'){const g=groundAt(b.x)??430;if(b.y>=g-b.r){b.life=0;shake=Math.max(shake,6);spark(b.x,g-12,'#ffd0a0',15,140,3);for(const dir of[-1,1])ebul.push({k:'shock',color:'#ffc07b',x:b.x+dir*20,y:g-14,vx:dir*220,vy:0,dir,life:.52,r:10});}}
  if(b.k==='flask'){const g=groundAt(b.x)??600;if(b.y>=g&&b.vy>0){ebul.push({k:'acid',x:b.x,y:g-6,vx:0,vy:0,life:1.8,r:24});fxStrip('fx_boom',b.x,g+4,80,.55);SFX.hit();b.life=0}}
  else if(b.g&&b.y>430&&b.vy>0){if(!b.bounced){b.bounced=true;b.vy*=-.45;b.y=430;boom(b.x,b.y,.5)}else b.life=0}
  let gone=b.life<=0||b.x<camX-60||b.x>camX+W+60||b.y>H+40||b.y<-80;
  for(const p of players){if(gone)break;if(p.state!=='alive')continue;const pb={x0:p.x-p.w/2+3,x1:p.x+p.w/2-3,y0:p.y-p.h+4,y1:p.y};if(b.x+b.r*.6>pb.x0&&b.x-b.r*.6<pb.x1&&b.y+b.r*.6>pb.y0&&b.y-b.r*.6<pb.y1){if(p.barrier>0){gone=true;spark(b.x,b.y,'#ffe27a',6)}else if(!p.dive&&p.inv<=0){hurtPlayer(p);if(b.k!=='acid')gone=true}}}
  if(gone)ebul.splice(i,1)}
 // contact
 for(const p of players){if(p.state!=='alive')continue;const pb={x0:p.x-p.w/2+4,x1:p.x+p.w/2-4,y0:p.y-p.h+6,y1:p.y};
  for(const e of enemies){
   if(e.dead||!contactTypes.has(e.type)||(e.stun||0)>0)continue;
   if(e.type==='pike'&&!['thrust','dash'].includes(e.state))continue;
   if((e.type==='panther'||e.type==='leopard')&&!['run','leap'].includes(e.state))continue;
   if(e.type==='eagle'&&e.state==='idle')continue;
   if(e.type==='bat'&&e.state==='idle')continue;
   if(e.type==='serpent'&&e.state!=='lunge')continue;
   if(e.type==='jaguar'&&!['slash','dash'].includes(e.state))continue;
   if((e.type==='brute'||e.type==='minibrute')&&!['charge','pound'].includes(e.state))continue;
   // A small inset on the visible sprite shape avoids unfair invisible-edge contacts.
   const eb=enemyBox(e),inset=Math.min(7,(eb.x1-eb.x0)*.12);
   if(boxHit(pb,{x0:eb.x0+inset,x1:eb.x1-inset,y0:eb.y0+2,y1:eb.y1})){if(p.barrier>0){damageEnemy(e,['jaguar','brute'].includes(e.type)?1:99,{own:p.i,x:e.x,y:e.y-40,vx:p.dir,force:true})}else hurtPlayer(p)}}}
 // medals
 for(const m of medals){m.t+=dt;if(!m.onGround){m.w=26;m.h=24;physics(m,dt);m.vx*=.99}else m.vx=0}
 for(let i=medals.length-1;i>=0;i--)if(medals[i].taken||medals[i].x<camX-60||medals[i].y>H+60)medals.splice(i,1);
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];if(f.k==='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=380*dt;f.life-=dt;if(f.life<=0)fx.splice(i,1)}else if(f.k==='boom'||f.k==='strip'||f.k==='jumpBurst'){f.t+=dt;if(f.t>f.max)fx.splice(i,1)}else{f.life-=dt;f.y-=40*dt;if(f.life<=0)fx.splice(i,1)}}
 if(fx.length>500)fx.splice(0,fx.length-500);
}

// ----------------------------------------------------------- RENDER
const tileCache={};
function tile(kind){if(tileCache[kind])return tileCache[kind];const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d');
 const pal={earth:['#5b3a22','#734a2b','#3d2716','#8a6a3e'],stone:['#6d675c','#8a8273','#4a463f','#a89c80'],temple:['#7a6345','#9b8058','#4f3f2a','#c9a86a'],bed:['#2a3d3a','#355049','#1d2b29','#4d6b5f'],gate:['#4b4a4d','#636166','#2e2d31','#8b8478'],moss:['#2c2a1c','#3a3824','#1b1a10','#566040'],lab:['#2a2f2c','#3a423d','#191d1b','#5a6a60']}[kind];
 g.fillStyle=pal[0];g.fillRect(0,0,64,64);g.fillStyle=pal[2];g.fillRect(0,31,64,2);g.fillRect(31,0,2,32);g.fillRect(15,33,2,31);g.fillRect(47,33,2,31);
 g.fillStyle=pal[1];g.fillRect(2,2,28,4);g.fillRect(34,2,28,4);g.fillRect(2,35,12,3);g.fillRect(18,35,28,3);g.fillRect(50,35,12,3);
 if(kind!=='bed'){g.fillStyle=pal[3];g.globalAlpha=.55;g.fillRect(8,12,14,3);g.fillRect(8,12,3,12);g.fillRect(8,21,10,3);g.fillRect(40,10,14,14);g.fillStyle=pal[0];g.fillRect(44,14,6,6);g.fillStyle=pal[3];g.fillRect(22,44,16,3);g.fillRect(28,44,3,12);g.globalAlpha=1}
 g.fillStyle='#00000030';for(let i=0;i<40;i++)g.fillRect((i*37)%64,(i*23)%64,2,2);
 return tileCache[kind]=ctx.createPattern(c,'repeat')}
// V4.7 scenic renderer: painted panoramic background is a distinct far plane.
const scenicView={im:null,ox:0,sw:1,bh:1,bw:1};
const SCENIC_FALLS={
  1:[[345,281,38,102],[1359,196,112,176]],
  2:[[1460,321,92,66],[1958,122,90,247]],
  3:[[1293,227,142,160]],
  4:[[398,348,75,33],[1343,346,85,35]],
  5:[],6:[]
};
const SCENIC_STREAMS={
  1:[[305,381,260,35],[1190,373,338,34]],
  2:[[620,360,180,34],[1424,381,235,33],[1900,383,180,33]],
  3:[[0,392,2172,30]],
  4:[[365,370,210,32],[1340,364,175,28]],
  5:[],6:[]
};
const SCENIC_VINES={
  1:[[44,14,95],[289,15,115],[682,12,105],[920,16,80],[1134,20,118],[1580,16,92],[1778,20,116]],
  2:[[62,14,140],[250,9,104],[498,12,152],[720,10,110],[1010,10,154],[1320,10,117],[1758,12,115],[1990,8,134]],
  3:[[148,12,73],[438,12,101],[838,10,75],[1130,12,102],[1575,12,68]],
  4:[[86,8,112],[337,12,118],[580,10,86],[912,8,110],[1180,13,92],[1510,12,104]],
  5:[[185,8,46],[875,9,35]],
  6:[[170,8,54],[531,9,54],[1050,8,50],[1530,9,48]]
};
// Source-pixel coordinates are projected through the SAME parallax transform as
// the painting. Waterfall animation remains registered with the painted falls.
function scenicPos(sx,sy){const v=scenicView;return [(sx-v.ox)/v.sw*W,sy/v.bh*H]}
function drawBackground(){
 const stageBg=IMG['bg'+stageNum],base=IMG.bg;
 scenicView.im=stageBg?.naturalWidth?stageBg:null;
 if(scenicView.im){
   const im=scenicView.im,bw=im.naturalWidth,bh=im.naturalHeight;
   // Widen source window: the distant painting looks smaller, but player art
   // and collision world retain their original proportions and sharpness.
   const sw=Math.min(bw,bh*W/H*1.33);
   const ox=clamp(camX/Math.max(1,ARENA_X),0,1)*(bw-sw);
   Object.assign(scenicView,{ox,sw,bh,bw});
   ctx.save();ctx.filter='blur(1.15px) saturate(.82) brightness(.84) contrast(.96)';
   ctx.drawImage(im,ox,0,sw,bh,0,0,W,H);ctx.restore();
 }else if(base?.naturalWidth){
   ctx.save();ctx.filter='blur(1.05px) saturate(.86) brightness(.88)';
   ctx.drawImage(base,0,0,base.naturalWidth,base.naturalHeight,0,0,W,H);ctx.restore();
 }else{
   const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#285f76');g.addColorStop(1,'#203d29');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 }
 // A quiet atmospheric depth plane between the painted vista and playable
 // world. No flat triangles/rectangle pillars are layered over scenery.
 const haze=ctx.createLinearGradient(0,48,0,H);
 haze.addColorStop(0,stageNum===3?'rgba(15,36,49,.08)':stageNum===5?'rgba(56,22,20,.04)':'rgba(39,65,69,.09)');
 haze.addColorStop(.53,stageNum===6?'rgba(16,39,34,.12)':'rgba(48,66,59,.18)');
 haze.addColorStop(.83,'rgba(8,18,13,.06)');haze.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=haze;ctx.fillRect(0,0,W,H);
 drawScenicWater();drawScenicVines();
}
function drawScenicWater(){
 const v=scenicView;if(!v.im)return;
 const falls=SCENIC_FALLS[stageNum]||[];
 ctx.save();
 for(let j=0;j<falls.length;j++){
   const [sx,sy,sw,sh]=falls[j];if(sx+sw<v.ox||sx>v.ox+v.sw)continue;
   let [x,y]=scenicPos(sx,sy),w=sw/v.sw*W,h=sh/v.bh*H;
   if(w<3||h<3)continue;
   ctx.save();ctx.beginPath();ctx.rect(x,y,Math.max(3,w),h+2);ctx.clip();
   // Translucent scrolling rivulets allow the detailed original waterfall
   // painting to remain visible underneath, unlike a generic blue rectangle.
   const flow=ctx.createLinearGradient(x,y,x+w,y);
   flow.addColorStop(0,'rgba(15,110,152,0)');flow.addColorStop(.22,'rgba(88,203,242,.19)');flow.addColorStop(.68,'rgba(215,248,255,.12)');flow.addColorStop(1,'rgba(22,128,179,0)');
   ctx.fillStyle=flow;ctx.fillRect(x,y,w,h);
   for(let k=0;k<Math.min(18,Math.max(6,w/6));k++){
     const xx=x+((k*.6180339+j*.18)%1)*w;
     const t=(time*(67+k%3*19)+k*37+j*13)%(h+30);
     const len=8+(k*7)%26;
     ctx.strokeStyle=k%3===0?'rgba(231,252,255,.48)':k%3===1?'rgba(105,215,250,.40)':'rgba(210,247,255,.22)';
     ctx.lineWidth=k%4===0?1.65:.85;
     ctx.beginPath();ctx.moveTo(xx,y+t-24);ctx.lineTo(xx+Math.sin(time*1.7+k)*1.2,y+t-24+len);ctx.stroke();
   }
   // Falling foam spray against the rocks; droplets genuinely change position.
   for(let k=0;k<12;k++){
     const xx=x+w*((k*.37+j*.11)%1),tt=(time*20+k*17)%31;
     const yy=y+h-7-tt*.43;
     ctx.globalAlpha=(1-tt/38)*.53;
     ctx.fillStyle=k%2?'#b9f4ff':'#efffff';ctx.fillRect(xx+Math.sin(time*4+k)*3,yy,k%3===0?2:1,2);
   }
   ctx.globalAlpha=1;ctx.restore();
 }
 // Painted river sections: scrolling glints and layered wavelets.
 const rivers=SCENIC_STREAMS[stageNum]||[];
 for(let j=0;j<rivers.length;j++){
   const [sx,sy,sw,sh]=rivers[j];if(sx+sw<v.ox||sx>v.ox+v.sw)continue;
   const [x,y]=scenicPos(sx,sy),w=sw/v.sw*W,h=sh/v.bh*H;
   ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
   for(let k=0;k<Math.min(32,Math.ceil(w/15));k++){
     const xx=x+((k*71+time*(13+k%3*6))%Math.max(w,1));
     const yy=y+3+(k*13)%Math.max(8,h-5)+Math.sin(time*3+k)*1.2;
     ctx.globalAlpha=.12+.16*Math.max(0,Math.sin(time*2+k));ctx.fillStyle=k%3===0?'#edffff':'#87e6fd';
     ctx.fillRect(xx,yy,7+(k%4)*3,k%4===0?2:1);
   }
   ctx.restore();
 }
 ctx.restore();
}
function drawScenicVines(){
 const v=scenicView;if(!v.im)return;
 const vines=SCENIC_VINES[stageNum]||[];
 ctx.save();
 for(let i=0;i<vines.length;i++){
   const [sx,sy,len]=vines[i];if(sx<v.ox-80||sx>v.ox+v.sw+80)continue;
   const [x,y]=scenicPos(sx,sy),h=len/v.bh*H;
   const phase=time*(stageNum===6?.55:1.3)+i*1.62;
   const sway=Math.sin(phase)*Math.min(8,h*.07);
   const cable=stageNum===6, ember=stageNum===5;
   ctx.globalAlpha=cable?.60:ember?.30:.58;
   ctx.strokeStyle=cable?'#506964':ember?'#5a392b':'#173a1d';ctx.lineWidth=cable?3:3.3;
   ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+3,y+h*.32,x+sway*1.4,y+h*.75,x+sway,y+h);ctx.stroke();
   ctx.strokeStyle=cable?'#8fa69a':ember?'#8f5c3d':'#66984d';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(x+1,y);ctx.bezierCurveTo(x+4,y+h*.32,x+sway*1.4+1,y+h*.75,x+sway+1,y+h);ctx.stroke();
   if(!cable&&!ember){for(let k=1;k<=7;k++){
     const u=k/8,xx=x+sway*u*u+Math.sin(u*Math.PI)*2,yy=y+u*h;
     const side=k%2?-1:1,len=6+(i+k)%4*2,rot=Math.sin(phase+u*5)*2;
     ctx.fillStyle=k%3===0?'#91b864':k%2?'#2f7434':'#416f2d';
     ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+side*(len*.8+rot),yy-5,xx+side*(len+rot),yy-10);ctx.quadraticCurveTo(xx+side*len*.55,yy+3,xx,yy);ctx.fill();
     ctx.fillStyle='#a2c57577';ctx.fillRect(xx+side*3,yy-5,2,2);
   }}else if(cable){for(let k=1;k<=3;k++){const xx=x+sway*(k/4)**2,yy=y+h*k/4;ctx.fillStyle='#bbd39f';ctx.fillRect(xx-2,yy-2,4,4)}}
 }
 ctx.restore();
}
function drawCinematicAtmosphere(){
 ctx.save();
 // Screen-space illumination adds depth without stretching or blurring pixel sprites.
 const rays=stageNum===3?3:stageNum===6?2:4;
 for(let i=0;i<rays;i++){
   const bx=(i*271+90+Math.sin(time*.32+i)*22)%W;
   const col=stageNum===3?'90,185,235':stageNum===6?'122,220,93':stageNum===5?'255,133,72':'248,215,150';
   const strength=(stageNum===3?.045:stageNum===6?.037:.040)*(0.8+0.2*Math.sin(time*.7+i));
   const g=ctx.createLinearGradient(bx-62,40,bx+102,H);
   g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(.45,`rgba(${col},${strength.toFixed(3)})`);g.addColorStop(1,`rgba(${col},0)`);
   ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(bx,0);ctx.lineTo(bx+90,H);ctx.lineTo(bx+146,H);ctx.lineTo(bx+35,0);ctx.closePath();ctx.fill();
 }
 // Bottom mist sits behind gameplay and fades before reaching character upper bodies.
 const c=stageNum===3?'53,125,154':stageNum===6?'82,117,82':stageNum===5?'106,52,44':'56,92,58';
 const m=ctx.createLinearGradient(0,H*.62,0,H);
 m.addColorStop(0,`rgba(${c},0)`);m.addColorStop(1,`rgba(${c},.075)`);
 ctx.fillStyle=m;ctx.fillRect(0,H*.62,W,H*.38);
 ctx.restore();
}
function drawSolids(){for(const s of SOLIDS){if(s.x>camX+W||s.x+s.w<camX)continue;if(s.kind==='gate'||s.kind==='lab')continue;
 ctx.fillStyle=tile(s.kind);ctx.fillRect(s.x,s.y,s.w,Math.min(s.h,H-s.y+2));
 if(s.kind==='earth'||s.kind==='moss'){const M=s.kind==='moss';R(s.x,s.y,s.w,8,M?'#24481c':'#3f7a2a');R(s.x,s.y,s.w,3,M?'#5c9a34':'#8fc04a');for(let x=s.x+6;x<s.x+s.w-4;x+=14)R(x,s.y+7,4,4+((x*7)%(M?16:9)),M?'#183812':'#2e5d20');R(s.x,s.y,4,Math.min(s.h,H-s.y),'#00000055');R(s.x+s.w-4,s.y,4,Math.min(s.h,H-s.y),'#00000055')}
 else if(s.kind==='stone'){R(s.x,s.y,s.w,4,'#d8caad');R(s.x,s.y+4,s.w,3,'#5b8b38');for(let x=s.x+8;x<s.x+s.w-16;x+=36){R(x,s.y+8,20,12,'#8a7c69');R(x+2,s.y+10,16,2,'#b8a88c');R(x+8,s.y+13,4,3,'#675b4a')}for(let x=s.x+14;x<s.x+s.w;x+=28)R(x,s.y+5,2,10,'#44732b')}
 else if(s.kind==='temple'){R(s.x,s.y,s.w,4,'#e6cc8d');R(s.x,s.y+4,s.w,4,'#9a8664');for(let x=s.x+10;x<s.x+s.w-20;x+=34){R(x,s.y+9,22,10,'#746657');R(x+4,s.y+11,14,2,'#b9ab92');R(x+9,s.y+14,4,4,'#53483e')}R(s.x,s.y+s.h-3,s.w,3,'#00000060')}
 else if(s.kind==='bed'){R(s.x,s.y,s.w,4,'#4d6b5f')}}}
function drawLadders(){for(const l of LADDERS){if(l.x<camX-60||l.x>camX+W+60)continue;
 const metal=stageNum===6, temple=stageNum>=4&&stageNum<=5;
 if(metal){R(l.x-16,l.top,6,l.bottom-l.top,'#36403c');R(l.x+10,l.top,6,l.bottom-l.top,'#36403c');R(l.x-14,l.top,2,l.bottom-l.top,'#9fb0a9');R(l.x+12,l.top,2,l.bottom-l.top,'#9fb0a9');for(let y=l.top+9;y<l.bottom-6;y+=18){R(l.x-14,y,30,6,'#6b7870');R(l.x-10,y+2,22,2,'#c6d6cd');circ(l.x-10,y+3,1.2,'#21302b');circ(l.x+12,y+3,1.2,'#21302b')}}
 else if(temple){R(l.x-18,l.top,6,l.bottom-l.top,'#5a4630');R(l.x+12,l.top,6,l.bottom-l.top,'#5a4630');for(let y=l.top+10;y<l.bottom-5;y+=18){R(l.x-16,y,32,6,'#b78a56');R(l.x-12,y+1,24,2,'#e7bf84')}for(let y=l.top+4;y<l.bottom;y+=34){R(l.x-25,y,7,26,'#3e6b2d');R(l.x+18,y+6,7,24,'#3a5e28')}}
 else{R(l.x-17,l.top,4,l.bottom-l.top,'#6a4a28');R(l.x+13,l.top,4,l.bottom-l.top,'#6a4a28');R(l.x-15,l.top,2,l.bottom-l.top,'#a97a44');R(l.x+15,l.top,2,l.bottom-l.top,'#a97a44');for(let y=l.top+9;y<l.bottom-5;y+=18){R(l.x-15,y,32,6,'#cc9558');R(l.x-13,y+1,28,2,'#f1bd79')}for(let y=l.top+3;y<l.bottom;y+=28){const sway=Math.sin(time*2+y*.05+l.x*.01)*2;poly([[l.x-17,l.top+y-l.top],[l.x-27+sway,y+8],[l.x-20+sway,y+22]],'#36602e');poly([[l.x+17,l.top+y-l.top],[l.x+27-sway,y+10],[l.x+19-sway,y+24]],'#2f5627')}}}}
function drawPlatforms(){for(const p of PLATFORMS){if(p.x>camX+W||p.x+p.w<camX)continue;
 if(p.kind==='wood'){
  for(let x=p.x+14;x<p.x+p.w;x+=Math.max(64,p.w-22)){R(x-5,p.y+8,10,Math.max(0,(groundAt(x)||H)-p.y-8),'#4b311c');R(x-2,p.y+8,4,Math.max(0,(groundAt(x)||H)-p.y-8),'#8b6338');}
  for(let x=p.x;x<p.x+p.w;x+=20){R(x,p.y,18,12,'#6e4724');R(x,p.y+1,18,3,'#d6a15d');R(x+2,p.y+5,14,2,'#8b6338');circ(x+4,p.y+9,1.3,'#25180f');circ(x+14,p.y+9,1.3,'#25180f')}
  R(p.x,p.y+12,p.w,3,'#00000055');R(p.x+4,p.y-3,p.w-8,2,'#e8c182');
 }
 else if(p.kind==='metal'){
  R(p.x,p.y,p.w,15,'#39423f');R(p.x,p.y,p.w,3,'#9caea5');for(let x=p.x+10;x<p.x+p.w;x+=26){R(x,p.y+5,14,6,'#596662');circ(x+2,p.y+8,1.3,'#d4e4da');circ(x+12,p.y+8,1.3,'#d4e4da')}R(p.x,p.y+15,p.w,3,'#00000077');for(let x=p.x+14;x<p.x+p.w;x+=72){R(x,p.y+15,7,Math.max(0,(groundAt(x)||H)-p.y-15),'#27302c');R(x+2,p.y+15,2,Math.max(0,(groundAt(x)||H)-p.y-15),'#6d7d75')}if(((p.x/10)|0)%2===0){const glow=.55+.45*Math.sin(time*4+p.x*.01);R(p.x+p.w-14,p.y+2,8,8,'#34422e');R(p.x+p.w-12,p.y+4,4,4,`rgba(180,255,90,${.45+glow*.35})`)}}
 else{
  R(p.x,p.y,p.w,18,'#756a5b');R(p.x,p.y,p.w,4,'#d9c8a6');R(p.x,p.y+4,p.w,4,'#587f35');for(let x=p.x+8;x<p.x+p.w-24;x+=30){R(x,p.y+8,22,9,'#8a7b67');R(x+3,p.y+10,16,2,'#b7a994');R(x+8,p.y+13,6,2,'#5a5044')}
  for(let x=p.x+12;x<p.x+p.w;x+=38){R(x,p.y+18,3,12+((x*7)%18),'#416c2f');R(x+2,p.y+26,8,2,'#6ea65a')}
  R(p.x,p.y+18,p.w,3,'#00000060');
 }} }
function drawBridge(){for(const b of BRIDGE){if(b.state===2)continue;ctx.save();if(b.state===1){ctx.globalAlpha=1-b.t*2;ctx.translate(0,b.t*80)}
 R(b.x,b.y,b.w-2,10,'#6b4422');R(b.x,b.y,b.w-2,3,'#e2ad5f');for(let x=b.x+4;x<b.x+b.w;x+=15)R(x,b.y+3,2,7,'#2a170b');R(b.x+4,b.y-26,4,26,'#5a3a1e');R(b.x,b.y-24,b.w,2,'#c9a06a');R(b.x+b.w-6,b.y+10,4,40,'#4a2f1a');ctx.restore()}}
function drawWaterBack(){
 if(WATER.x1<camX||WATER.x0>camX+W)return;
 const x0=Math.max(WATER.x0,camX-12),x1=Math.min(WATER.x1,camX+W+12),h=H-WATER.surf;
 ctx.save();const g=ctx.createLinearGradient(0,WATER.surf,0,H);
 g.addColorStop(0,'#31859e');g.addColorStop(.21,'#257a91');g.addColorStop(.7,'#154b62');g.addColorStop(1,'#102e45');ctx.fillStyle=g;ctx.fillRect(x0,WATER.surf,x1-x0,h);
 // A painted, seamlessly scrolling 16-bit water texture replaces the old flat block.
 if(IMG.water_tile&&IMG.water_tile.naturalWidth){
   ctx.save();ctx.beginPath();ctx.rect(x0,WATER.surf,x1-x0,h);ctx.clip();
   const phase=(time*19)%256;
   for(let xx=Math.floor((x0+phase)/256)*256-phase;xx<x1;xx+=256)ctx.drawImage(IMG.water_tile,xx,WATER.surf,256,h);
   ctx.restore();
 }
 for(let i=Math.floor(x0/36);i<=Math.ceil(x1/36);i++){
   const xx=i*36+((time*12+i%3*6)%36),wave=Math.sin(time*3+i*.7)*1.8;
   ctx.globalAlpha=.14+.07*Math.sin(time*2+i);ctx.fillStyle=i%3?'#83dfe8':'#d7faff';
   ctx.fillRect(xx,WATER.surf+14+wave,23,2);ctx.fillRect(xx-17,WATER.surf+42-wave,12,1);
 }
 ctx.restore();
}
function drawWaterFront(){
 if(WATER.x1<camX||WATER.x0>camX+W)return;
 const x0=Math.max(WATER.x0,camX-12),x1=Math.min(WATER.x1,camX+W+12);
 ctx.save();ctx.fillStyle='rgba(56,161,187,.16)';ctx.fillRect(x0,WATER.surf+3,x1-x0,H-WATER.surf);
 for(let i=Math.floor(x0/27);i<=Math.ceil(x1/27);i++){
   const xx=i*27+((time*(17+i%3*7))%27),yy=WATER.surf+Math.sin(time*3.2+i*.8)*2;
   ctx.globalAlpha=.52;ctx.fillStyle=i%3===0?'#ebffff':'#97e7f3';ctx.fillRect(xx,yy,12,2);ctx.fillRect(xx+5,yy+1,9,1);
   ctx.globalAlpha=.22;ctx.fillStyle='#b7efff';ctx.fillRect(xx-6,yy+19,18,1);
 }
 // Bright sparkles and little spray at edges and around waterfalls.
 for(let k=0;k<13;k++){
   const x=x0+(k*101+time*(18+k%3*5))%Math.max(1,x1-x0),y=WATER.surf+5+(k*23)%27;
   ctx.globalAlpha=.20+.2*Math.max(0,Math.sin(time*5+k));ctx.fillStyle=k%2?'#f0ffff':'#8de2fc';ctx.fillRect(x,y,2,2);
 }
 ctx.restore();
}
function drawHut(x,base,s,burn){ctx.save();ctx.translate(x,base);ctx.scale(s,s);R(-70,-95,141,95,'#6d4f30');R(-60,-91,121,84,'#9a774a');for(let k=-60;k<60;k+=20)R(k,-86,7,78,'#86653f');R(-15,-65,32,65,'#241a12');
 poly([[-84,-100],[-40,-160],[47,-160],[88,-100]],burn?'#5a3d22':'#b49456');for(let k=-72;k<70;k+=13)poly([[k,-104],[k+28,-150],[k+39,-150],[k+11,-104]],k%2===0?(burn?'#3a2a1a':'#dbc078'):(burn?'#4a3520':'#a37c46'));
 if(burn){for(let k=0;k<5;k++){const fx2=-48+k*24;poly([[fx2-10,-120],[fx2,-160-14*Math.sin(time*7+k)-((k*13)%20)],[fx2+12,-120]],k%2?'#ffb545':'#ff5a28')}ctx.globalAlpha=.35;circ(10,-190-(time*30%60),36,'#3a302e');ctx.globalAlpha=1}
 ctx.restore()}
function drawCeiba(x,g){ctx.save();ctx.globalAlpha=.9;R(x-10,g-148,20,148,'#5f4528');R(x-4,g-148,4,148,'#866340');R(x+5,g-148,3,148,'#3e2d1a');poly([[x-10,g],[x-32,g+4],[x-18,g-18],[x-4,g-6]],'#5b4026');poly([[x+10,g],[x+32,g+4],[x+18,g-18],[x+4,g-6]],'#5b4026');for(let k=0;k<4;k++){const vx=x-12+k*8;R(vx,g-132-k*4,2,48+k*2,'#305b2e')}const cl=[[-34,-154,18],[-12,-176,22],[14,-180,20],[36,-160,18],[-40,-134,16],[-10,-142,18],[18,-144,18],[42,-136,14]];for(const[cx,cy,r]of cl){circ(x+cx,g+cy,r,'#234f2d');circ(x+cx-4,g+cy-3,r*.65,'#2f6d39');circ(x+cx+4,g+cy+3,r*.35,'#6ca85d')}ctx.restore()}
function drawRuinColumn(x,g){ctx.save();ctx.globalAlpha=.92;R(x-24,g-138,48,138,'#726656');R(x-18,g-138,8,138,'#8d806e');R(x+10,g-138,8,138,'#564c40');R(x-30,g-146,60,10,'#b9ab92');R(x-28,g-8,56,10,'#94866f');R(x-10,g-112,20,6,'#5e5144');R(x-16,g-74,28,5,'#5e5144');R(x-6,g-138,2,40,'#4e4439');R(x+4,g-86,2,34,'#4e4439');for(let k=0;k<3;k++){const vy=g-128+k*34;R(x+16,vy,3,18,'#44693b');R(x+18,vy+8,7,3,'#6ea85a')}ctx.restore()}
function drawDecor(){for(const[t,x,yy]of DECOR){if(x<camX-200||x>camX+W+200)continue;const g=yy||groundAt(x)||430;
 if(t==='gsmoke'){strip('fx_smoke',(time*9+x)%9,x,g,96,false,.75);continue}
 if(t==='boil'){strip('fx_boil',(time*9)%8,x,g,64);continue}
 if(t==='hut'||t==='burnhut'){drawHut(x,g,.85,t==='burnhut');continue}
 if(t==='torch'){
   if(stageNum===6){R(x-5,g-82,10,82,'#2b312f');R(x-14,g-88,28,8,'#4c5853');const p=.55+.45*Math.sin(time*10+x*.03);R(x-8,g-114,16,22,'#425247');R(x-5,g-111,10,16,`rgba(185,255,110,${.35+p*.35})`);ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(x,g-100,4,x,g-100,52);gr.addColorStop(0,'rgba(180,255,90,.35)');gr.addColorStop(1,'rgba(120,255,70,0)');ctx.fillStyle=gr;ctx.fillRect(x-52,g-152,104,104);ctx.restore()}
   else{R(x-4,g-76,8,76,'#4a2f1a');R(x-10,g-82,20,9,'#8a6236');R(x-13,g-70,26,6,'#5f3f22');const f=Math.sin(time*12+x)*3;poly([[x-10,g-82],[x+f,g-112-Math.abs(f)*2],[x+10,g-82]],'#ff8a2a');poly([[x-5,g-82],[x+f*.6,g-98],[x+5,g-82]],'#ffe27a');ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(x,g-92,2,x,g-92,62);gr.addColorStop(0,'rgba(255,170,60,.36)');gr.addColorStop(1,'rgba(255,120,40,0)');ctx.fillStyle=gr;ctx.fillRect(x-62,g-154,124,124);ctx.restore()}}
 else if(t==='banner'){
   R(x-2,g-156,5,156,'#3a2414');R(x-8,g-156,18,4,'#9b7a48');const wv=Math.sin(time*3+x)*5;poly([[x+4,g-150],[x+52+wv,g-144],[x+45+wv,g-88],[x+4,g-96]],stageNum>=5?'#812015':'#b3271f');poly([[x+44+wv,g-116],[x+61+wv,g-110],[x+44+wv,g-100]],stageNum>=5?'#6a1610':'#8b2318');R(x+8,g-134,32,3,'rgba(255,220,170,.22)');circ(x+24+wv/2,g-121,10,'#f2c14e');circ(x+24+wv/2,g-121,4,'#8b2318')}
 else if(t==='totem'){
   // Use an existing full-detail 16-bit sprite instead of a gray geometric placeholder.
   if(IMG.totem&&IMG.totem.naturalWidth){spr('totem',Math.floor(time*3+x*.01)%4,x,g,126,false,.94)}
   else{/* no generic gray block fallback */}
 }
 else if(t==='pillar'){/* The authentic carved columns are already painted into the stage background. */}
 else if(t==='lamp'){
   R(x-4,g-156,8,156,'#2a302c');R(x-4,g-156,34,4,'#3a423d');R(x+18,g-150,14,22,'#59675d');const pulse=.5+.5*Math.sin(time*4+x*.01);R(x+20,g-146,10,14,`rgba(200,255,110,${.4+pulse*.35})`);for(let k=0;k<3;k++)R(x-8+k*8,g-130+k*7,6,2,'#4f5d55');ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(x+25,g-137,2,x+25,g-137,58);gr.addColorStop(0,'rgba(160,255,80,.5)');gr.addColorStop(1,'rgba(100,255,60,0)');ctx.fillStyle=gr;ctx.fillRect(x-42,g-196,134,128);ctx.restore()}
 else if(t==='palm'){/* Dedicated high-detail background foliage replaces the generic vector palm. */}
}}
function spr(key,frame,x,foot,dh,flip,alpha=1){const im=IMG[key];if(!im||!im.naturalWidth){circ(x,foot-dh*.4,dh*.25,'#844');return}const[cw,ch]=CELL[key];const an=(ANCH[key]||[])[frame];const ax=an?an[0]:.5,fb=an?clamp(an[1],.6,1):clamp((FEET[key]||[])[frame]||.96,.6,.975);const dw=dh*cw/ch;
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,foot);if(flip)ctx.scale(-1,1);const cols=(key==='itza_anim'||key==='balam_anim')?6:4;const sx=(frame%cols)*cw,sy=Math.floor(frame/cols)*ch;ctx.drawImage(im,sx,sy,cw,ch,-dw*ax,-dh*fb,dw,dh);if(sprFlash){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6*alpha;ctx.drawImage(im,sx,sy,cw,ch,-dw*ax,-dh*fb,dw,dh)}ctx.restore()}
function strip(key,frame,x,foot,dh,flip,alpha=1){const im=IMG[key],m=STRIPS[key];if(!im||!im.naturalWidth||!m)return;const[cw,ch,n]=m;frame=clamp(Math.floor(frame),0,n-1);const dw=dh*cw/ch;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,foot);if(flip)ctx.scale(-1,1);ctx.drawImage(im,frame*cw,0,cw,ch,-dw/2,-dh,dw,dh);ctx.restore()}
function fxStrip(key,x,y,dh,max){fx.push({k:'strip',key,x,y,dh,t:0,max})}

// All new hero animation frames occupy equal 256px cells, centered within each cell.
const HERO24_RUN=[2,3,4,5,6,7,8,9];
const HERO24_IDLE=[0,1];
const HERO24_SLASH=[16,17,18];
const HERO24_MELEE=[19,20,21];
function hero24Frame(p){
  if(p.hurtAnimT>0)return 22;
  if(p.attackT>0){
    const slash=p.attackKind==='slash', duration=slash?.29:.20;
    const phase=Math.min(2,Math.max(0,Math.floor((1-p.attackT/duration)*3)));
    return (slash?HERO24_SLASH:HERO24_MELEE)[phase];
  }
  if(p.climbing)return HERO24_RUN[Math.floor(p.anim*.75)%8];
  if(!p.onGround){
    if(p.vy< -180)return 11; // takeoff / rising
    if(p.vy< 90)return 12; // airborne
    return 13; // falling
  }
  if(p.landT>0)return 14;
  if(p.dive||p.crouch)return 10;
  if(Math.abs(p.vx)>12)return HERO24_RUN[Math.floor(p.anim)%8];
  if(p.firing>0)return 15;   // both new sheets have a real shooting pose
  return HERO24_IDLE[Math.floor(time*2.1)%2];
}
function drawPlayer24(p){
  const h=HERO[p.hero],sheet=p.hero+'_anim';
  if(p.state==='dead'){
    if(Math.floor(time*20)%2)return;
    ctx.save();ctx.translate(p.x,p.y-50);ctx.rotate(p.spin*.35*-p.dir);
    spr(sheet,23,0,50,h.dh,p.dir<0);ctx.restore();return;
  }
  ctx.save();
  if(p.inv>0)ctx.globalAlpha=.55+.35*Math.sin(time*15);
  if(p.barrier>0){
    ctx.save();ctx.globalCompositeOperation='lighter';
    const r=62+Math.sin(time*14)*5,g=ctx.createRadialGradient(p.x,p.y-48,10,p.x,p.y-48,r);
    g.addColorStop(0,'rgba(255,220,90,0)');g.addColorStop(.75,'rgba(255,200,70,.18)');g.addColorStop(1,'rgba(255,240,150,.55)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y-48,r,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  if(p.onGround&&!p.dive){
    ctx.save();ctx.globalAlpha=.25;ctx.beginPath();ctx.ellipse(p.x,p.y+1,28,5,0,0,Math.PI*2);
    ctx.fillStyle='#000';ctx.fill();ctx.restore();
  }
  const frame=hero24Frame(p);
  const flip=p.dir<0;
  // Dark crisp outline separates the foreground warrior from deep scenery.
  ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=7;ctx.shadowOffsetY=2;
  if(p.dive){
    ctx.save();ctx.beginPath();ctx.rect(p.x-85,0,170,WATER.surf+6);ctx.clip();
    spr(sheet,frame,p.x,p.y+60,h.dh,flip);ctx.restore();
  }else{
    // Align animated feet to the world collision plane for every animation phase.
    spr(sheet,frame,p.x,p.y,h.dh,flip);
  }
  if(p.firing>0){const [mx,my]=muzzle(p);
    ctx.save();ctx.globalCompositeOperation='lighter';
    circ(mx,my,7+Math.random()*3,h.col+'88');circ(mx,my,3,'#fff');ctx.restore();
  }
  if(numPlayers===2)text('P'+(p.i+1),p.x,p.y-p.h-46,12,h.col,'center');
  ctx.restore();
}

function drawPlayer(p){if(p.state==='out')return;const h=HERO[p.hero];if(IMG[p.hero+'_anim']&&IMG[p.hero+'_anim'].naturalWidth){drawPlayer24(p);return}
 if(p.state==='dead'){if(Math.floor(time*20)%2)return;ctx.save();ctx.translate(p.x,p.y-50);ctx.rotate(p.spin*.5*-p.dir);spr(p.hero,h.idle[0],0,50,h.dh,p.dir<0);ctx.restore();return}
 ctx.save();if(p.inv>0)ctx.globalAlpha=.45+.35*Math.sin(time*16);
 if(p.barrier>0){ctx.save();ctx.globalCompositeOperation='lighter';const r=62+Math.sin(time*14)*5;const g=ctx.createRadialGradient(p.x,p.y-48,10,p.x,p.y-48,r);g.addColorStop(0,'rgba(255,220,90,0)');g.addColorStop(.75,'rgba(255,200,70,.18)');g.addColorStop(1,'rgba(255,240,150,.55)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y-48,r,0,6.28);ctx.fill();ctx.restore()}
 const flip=p.dir<0;
 if(p.onGround&&!p.dive){ctx.globalAlpha=.4;ctx.beginPath();ctx.ellipse(p.x,p.y+1,26,6,0,0,6.28);ctx.fillStyle='#000';ctx.fill();ctx.globalAlpha=1}
 if(!p.onGround&&p.jumping&&p.attackT<=0){
  // Stable leap silhouettes replace the rapid 360-degree somersault.
  // A small eased tilt communicates ascent/descent without distorted poses.
  const tilt=Math.max(-.11,Math.min(.11,-p.vy/3200));
  ctx.save();ctx.translate(p.x,p.y-48);ctx.rotate(tilt*p.dir);
  spr(p.hero,p.vy<0?h.run[0]:h.run[1],0,48,h.dh*.94,flip);
  ctx.restore();ctx.restore();return}
 let f=p.climbing?h.run[Math.floor(p.anim)%2]:h.idle[Math.floor(time*2)%2];
 const moving=Math.abs(p.vx)>1;
 if(p.attackT>0&&!p.climbing){
  const isSlash=p.attackKind==='slash';const duration=isSlash?.29:.20;
  const progress=1-p.attackT/duration;
  const seq=isSlash?(p.hero==='itza'?[5,6,7]:[2,6,7]):(p.hero==='itza'?[1,2,3]:[8,9,10]);
  f=seq[Math.min(2,Math.floor(Math.max(0,progress)*3))];
 }else if(p.crouch)f=h.crouch;else if(p.ay<0&&p.ax===0)f=h.up;else if(p.ay<0)f=h.diag;else if(p.ay>0)f=h.down;else if(moving)f=h.run[Math.floor(p.anim)%2];else if(p.firing>0)f=h.fire;
 const bob=moving&&!p.crouch?-Math.abs(Math.sin(p.anim*Math.PI))*1.7:0;
 if(p.dive){ctx.save();ctx.beginPath();ctx.rect(p.x-80,0,160,WATER.surf+6);ctx.clip();spr(p.hero,f,p.x,p.y+62,h.dh,flip);ctx.restore();ctx.restore();return}
 if(p.crouch){ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,h.sq);spr(p.hero,f,0,0,h.dh,flip);ctx.restore()}
 else spr(p.hero,f,p.x,p.y+bob,h.dh,flip);
 if(p.firing>0){const[mx,my]=muzzle(p);ctx.save();ctx.globalCompositeOperation='lighter';circ(mx,my,9+Math.random()*4,h.col+'cc');circ(mx,my,4,'#fff');ctx.restore()}
 if(numPlayers===2)text('P'+(p.i+1),p.x,p.y-p.h-46,12,h.col,'center');ctx.restore()}
const EF={runner:{run:[2,3,4,5],dh:112},rifle:{dh:112},sniper:{dh:112},cross:{dh:112},wallman:{dh:112}};
function drawEnemyTell(e){
 if(e.dead||!onScreen(e,80))return;
 const s=(e.phase&&e.phase!=='idle')?e.phase:(e.state||'');
 const heavyWind=['wind','windDash','chargeW','poundW','spitW','beamW'].includes(s);
 const ranged=typeof e.aimT==='number'&&e.aimT>0;
 if(!heavyWind&&!ranged)return;
 const phase=heavyWind?1-Math.min(1,(e.st||.45)/.55):1-e.aimT/(e.aimMax||.5);
 const alpha=Math.min(.82,.25+.35*Math.sin(time*11)**2+.15*phase);
 ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=alpha;
 const cy=e.y-(e.h||80)-18;
 circ(e.x,cy,heavyWind?8:5,heavyWind?'#ffb347':'#ffe19a');
 ctx.strokeStyle=heavyWind?'#ff8a45':'#ffe1a0';ctx.lineWidth=2;
 ctx.beginPath();ctx.arc(e.x,cy,heavyWind?14:9,-Math.PI*.5,-Math.PI*.5+Math.PI*2*Math.max(.08,phase));ctx.stroke();
 if(ranged&&e.aimX!=null){
   ctx.globalAlpha=Math.min(.35,alpha*.42);ctx.setLineDash([6,9]);ctx.lineWidth=1.8;
   ctx.beginPath();ctx.moveTo(e.x+e.dir*36,e.y-57);ctx.lineTo(e.aimX,e.aimY);ctx.stroke();ctx.setLineDash([]);
   ctx.globalAlpha=alpha*.8;circ(e.aimX,e.aimY,3,'#ffe9a2');
 }
 ctx.restore();
}
// Which of each boss sheet's 16 cells is which pose (0-3 row 1 ... 12-15 row 4).
const BOSS_FRAMES={boss2:{idle:[0,1],walk:[2,3,4,5],wind:6,atk:[7,8],hurt:10,die:[12,13,14,15]},
 boss3:{idle:[0,1],walk:[2,3,9,10],wind:8,atk:[5,6],pound:7,hurt:11,die:[12,13,14,15]},
 boss4:{idle:[0,1],walk:[2,3],wind:4,atk:[5,6],special:7,hurt:12,die:[13,14,15]},
 boss5:{idle:[0,1,2,3],walk:[4,5,6,7],wind:9,atk:[10],pound:11,hurt:12,die:[13,14,15]},
 boss6:{idle:[0,1,2,3],walk:[4,5,6,7],wind:8,atk:[9,10],special:11,hurt:12,die:[13,14,15]}};
function drawEnemy(e){ctx.save();if(!e.dead&&!e.bossSprite&&e.onGround&&Math.abs(e.vx||0)>22&&e.type!=='boulder'&&e.type!=='capsule')ctx.translate(0,Math.sin(e.gait*Math.PI*.5)*1.25);if(e.hurt>0&&!e.dead)ctx.translate((e.hitSide||1)*Math.sin((.22-e.hurt)*38)*3,0);if(e.garrison&&!e.dead){R(e.x-26,e.y-128,52,5,'#2a120c');R(e.x-26,e.y-128,52*e.hp/e.max,5,'#ff6a4a')}const fl=e.hurt>0;const a=e.dead?clamp((e.bossSprite?3.2:1.4)-e.deadT,0,1):1;if(a<=0){ctx.restore();return}sprFlash=fl&&!e.dead;if(e.bossSprite){const M=BOSS_FRAMES[e.bossSprite],cyc=(l,r)=>l[Math.floor(r)%l.length],atk=['pound','slash','thrust','beam','charge','dash'].includes(e.state);const f=e.dead?M.die[Math.min(M.die.length-1,Math.floor(e.deadT*6))]:e.hurt>0?M.hurt:e.specialPhase==='wind'?M.wind:e.specialT>0?(M.special??cyc(M.atk,e.anim*8)):e.state==='pound'&&M.pound!=null?M.pound:atk?cyc(M.atk,e.anim*8):['poundW','wind','windDash','chargeW','beamW'].includes(e.state)||e.phase==='beamW'?M.wind:Math.abs(e.vx)>5?cyc(M.walk,e.gait):cyc(M.idle,e.anim*2);spr(e.bossSprite,f,e.x+(fl?-e.dir*Math.min(4,e.hurt*22):0),e.y,stageNum===3?205:stageNum===5?194:175,e.dir<0,a);if(fl&&!e.dead){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.45;circ(e.x,e.y-95,45,'#ffcf7a');ctx.restore()}if(!e.dead){R(e.x-65,e.y-205,130,8,'#2a120c');R(e.x-64,e.y-204,128*Math.max(0,e.hp)/e.max,6,'#ff6a4a')}drawEnemyTell(e);sprFlash=false;ctx.restore();return}
 switch(e.type){
 case'runner':{const f=e.dead?(e.deadT<.4?14:15):e.hurt>0?10:!e.onGround?13:[2,3,4,5][Math.floor(e.gait)%4];spr('soldier',f,e.x,e.y,112,e.dir<0,a);break}
 case'rifle':case'wallman':{let f=e.dead?(e.deadT<.4?14:15):e.hurt>0?10:e.fireT>0?7:e.aimT>0?6:e.walking?[2,3,4,5][Math.floor(e.gait)%4]:(e.cd<.6?6:Math.floor(e.anim*2)%2);spr('soldier',f,e.x,e.y,112,e.dir<0,a);break}
 case'sniper':{let f=e.dead?(e.deadT<.4?14:15):12;spr('soldier',f,e.x,e.y,112,e.dir<0,a);if(e.fireT>0){circ(e.x+e.dir*46,e.y-46,8,'#ffd77a')}break}
 case'cross':{let f=e.dead?(e.deadT<.4?14:15):e.hurt>0?14:e.fireT>0?10:e.aimT>0?8:Math.floor(e.anim*2)%2;spr('crossbow',f,e.x,e.y,112,e.dir<0,a);break}
 case'panther':{let f=e.dead?(e.deadT<.3?13:15):e.hurt>0?12:e.state==='leap'?7:e.state==='run'?[4,5,6,5][Math.floor(e.gait)%4]:Math.floor(e.anim*3)%4;spr('panther',f,e.x,e.y,108,e.dir<0,a);break}
 case'eagle':{let f=e.dead?13:e.state==='dive'?7:[4,5,9,10][Math.floor(e.anim*9)%4];spr('eagle',f,e.x,e.y+50,104,true,a);break}
 case'jaguar':{let f=0;const s=e.state;if(e.dead)f=e.deadT<.25?13:e.deadT<.55?14:15;else if(s==='roar')f=12;else if(s==='slash')f=e.st<.3?9:8;else if(s==='wave')f=e.st<.3?10:8;else if(s==='dash')f=11;else if(Math.abs(e.vx)>1)f=[4,5,6,7][Math.floor(e.gait)%4];else f=Math.floor(e.anim*2)%2;
  spr('jaguar',f,e.x,e.y,136,e.dir<0,a);if(!e.dead){R(e.x-40,e.y-150,80,7,'#2a120c');R(e.x-39,e.y-149,78*e.hp/e.max,5,'#ffb347')}break}
 case'cannon':case'bcannon':drawCannon(e);break;
 case'pike':{let f;const s=e.state;if(e.dead)f=e.deadT<.3?12:15;else if(e.blockT>0)f=11;else if(s==='wind'||s==='windDash')f=8;else if(s==='thrust')f=e.st>.2?9:10;else if(s==='dash')f=14;else if(Math.abs(e.vx)>1)f=[4,5,6,7][Math.floor(e.gait)%4];else f=Math.floor(e.anim*2)%4;spr('pike',f,e.x,e.y,118,e.dir<0,a);break}
 case'bat':{let f=e.dead?(e.deadT<.5?13:15):e.hurt>0?12:e.state==='swoop'?8:[4,5,6,7][Math.floor(e.anim*10)%4];spr('bat',f,e.x,e.y+40,96,e.vx<=0,a);break}
 case'serpent':{const s=e.state;if(e.dead){spr('serpent_die',e.deadT<.4?0:1,e.x,e.y,128,e.dir<0,a);break}let f=e.hurt>0?12:s==='spitW'?6:s==='spit'?7:s==='lunge'?(e.st>.35?9:10):[4,5][Math.floor(e.anim*2)%2];spr('serpent',f,e.x,e.y,128,e.dir<0,a);break}
 case'totem':{const ph=e.phase;let f=e.dead?12+Math.min(3,Math.floor(e.deadT*4)):ph==='charge'?(e.st>.35?4:5):ph==='flame'?6+Math.floor(e.anim*10)%2:ph==='smoke'?8+Math.min(3,Math.floor((.9-e.st)*4.5)):Math.floor(e.anim*3)%4;
  spr('totem',f,e.x,e.y,150,e.dir<0,1);
  if(!e.dead&&ph==='flame'){ctx.save();ctx.globalCompositeOperation='lighter';const x0=e.x+e.dir*40,x1=e.x+e.dir*215,y=e.y-75,fl=Math.sin(time*30)*5;const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'rgba(255,240,150,.95)');g.addColorStop(.5,'rgba(255,140,40,.8)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;poly([[x0,y-10],[x1,y-26-fl],[x1,y+26+fl],[x0,y+10]],g);ctx.restore()}
  break}
 case'arrow':{let f=e.dead?12+Math.min(3,Math.floor(e.deadT*4)):e.fireT>0?(e.fireT>.15?4:5):e.cd<.45?1+Math.min(2,Math.floor((.45-e.cd)*6)):0;spr('arrow',f,e.x,e.y,140,e.dir<0,1);break}
 case'spike':{const ph=e.phase||'down';let f=ph==='down'?0:ph==='rise'?(e.st>.12?1:2):ph==='up'?3+Math.floor(e.anim*4)%2:(e.st>.15?9:10);spr('spike',f,e.x,e.y+6,104,false,1);break}
 case'boulder':{let f=e.dead?13+Math.min(2,Math.floor(e.deadT*3)):[4,5,6][Math.floor(e.rot)%3];spr('boulder',f,e.x,e.y,124,true,a);break}
 case'pod':{const ph=e.phase||'idle';let f=e.dead?(e.deadT<.6?14:15):ph==='charge'?3+Math.min(5,Math.floor((3-e.st)*2)):ph==='burst'?9+Math.min(2,Math.floor((.8-e.st)*4)):ph==='empty'?12+Math.floor(e.anim*2)%2:Math.floor(e.anim*3)%3;spr('pod',f,e.x,e.y,170,false,1);
  if(!e.dead){R(e.x-30,e.y-172,60,5,'#1a2a10');R(e.x-30,e.y-172,60*e.hp/e.max,5,'#c8ff6a')}break}
 case'stasis':{const ph=e.phase||'idle';let k='fx_idle',f=(time*8)%8;if(ph==='act'){k='fx_act';f=(1.4-e.st)/1.4*7}else if(ph==='open'){k='fx_open';f=(.9-e.st)/.9*7}else if(ph==='wait'){k='fx_open';f=6}else if(ph==='reset'){k='fx_reset';f=(1.2-e.st)/1.2*7}
  strip(k,f,e.x,e.y,180,false,a);if(!e.dead){R(e.x-30,e.y-188,60,5,'#1a2a10');R(e.x-30,e.y-188,60*e.hp/e.max,5,'#c8ff6a')}break}
 case'minibrute':{const s2=e.state;let f=e.dead?(e.deadT<.5?14:15):s2==='roar'?12:s2==='chargeW'?8:s2==='charge'?8+Math.floor(e.anim*10)%2:s2==='poundW'?10:s2==='pound'?11:Math.abs(e.vx)>1?[4,5,6,7][Math.floor(e.gait)%4]:Math.floor(e.anim*2)%4;spr('brute',f,e.x,e.y,128,e.dir<0,a);break}
 case'cauldron':spr('cauldron',Math.floor(e.anim*8)%8,e.x,e.y,130,false,a);break;
 case'tank':spr('tank',Math.floor(e.anim*7)%8,e.x,e.y,170,false,a);if(e.dead&&e.deadT<.8){ctx.save();ctx.globalCompositeOperation='lighter';circ(e.x,e.y-80,40+e.deadT*80,`rgba(140,255,60,${.5-e.deadT*.6})`);ctx.restore()}break;
 case'sci':{let f=e.dead?(e.deadT<.4?14:15):e.hurt>0?12:e.phase==='throw'?4:e.relT>0?5:e.phase==='beamW'?9:e.phase==='beam'?10+Math.floor(e.anim*10)%2:Math.floor(e.anim*2)%2;spr('sci',f,e.x,e.y,124,e.dir<0,a);break}
 case'brute':{const s=e.state;let f=e.dead?(e.deadT<.5?14:15):s==='roar'?12:s==='chargeW'?8:s==='charge'?8+Math.floor(e.anim*10)%2:s==='poundW'?10:s==='pound'?11:Math.abs(e.vx)>1?[4,5,6,7][Math.floor(e.gait)%4]:Math.floor(e.anim*2)%4;spr('brute',f,e.x,e.y,200,e.dir<0,a);break}
 case'capsule':drawCapsule(e);break;
 case'bcore':break;}
 drawEnemyTell(e);sprFlash=false;ctx.restore()}
function drawCannon(e){ctx.save();ctx.translate(e.x,e.y);
 if(e.type==='cannon'){R(-30,-22,60,22,e.dead?'#3a3530':'#6a5f50');R(-30,-22,60,4,'#b5a688');R(-22,-36,44,16,e.dead?'#2a2622':'#504638')}
 if(!e.dead){ctx.translate(0,-18);ctx.rotate(e.ang||Math.PI);R(0,-7,46,14,'#3b3128');R(0,-7,46,4,'#b88a4a');R(40,-9,10,18,'#2a221b');ctx.rotate(-(e.ang||Math.PI));circ(0,0,14,'#2d2620');circ(0,0,8,e.fireT>0?'#ffcf6a':'#a8742f');if(e.hurt>0){circ(0,0,16,'#ff8a5a88')}}
 else{for(let i=0;i<5;i++)R(-24+i*10,-12-(i%2)*6,10,8,'#2b2622')}
 ctx.restore()}
function drawCapsule(e){ctx.save();ctx.translate(e.x,e.y);const fl=Math.sin(e.t*16)*14;
 poly([[-10,0],[-46,-12-fl],[-30,6]],'#d14b2a');poly([[10,0],[46,-12-fl],[30,6]],'#d14b2a');poly([[-10,0],[-40,-8-fl],[-26,4]],'#ffb640');poly([[10,0],[40,-8-fl],[26,4]],'#ffb640');
 circ(0,0,17,'#8a5a1e');circ(0,0,14,'#f2c14e');circ(0,0,8,'#b3271f');for(let i=0;i<8;i++){const a=i*.785+e.t*2;R(Math.cos(a)*17-2,Math.sin(a)*17-2,4,4,'#ffe7a0')}ctx.restore()}
function drawMedal(m){ctx.save();ctx.translate(m.x,m.y-13+(m.onGround?Math.sin(m.t*5)*2:0));const w=Math.sin(m.t*8)*6;
 poly([[-8,0],[-30,-10-w],[-18,6]],'#ffb640');poly([[8,0],[30,-10-w],[18,6]],'#ffb640');circ(0,0,15,'#7a4a12');circ(0,0,13,m.l==='B'?'#ffe27a':'#e9b340');text(m.l,0,1,16,m.l==='B'?'#7a2a00':'#5a1500','center');ctx.restore()}
function drawGate(){if(camX+W<GATE_X-40)return;const x=GATE_X,y=118,dead=boss&&boss.dead;ctx.save();
 ctx.fillStyle=tile('gate');ctx.fillRect(x,y,LEVEL_W-x+40,H-y);
 // battlements
 for(let i=0;i<8;i++)R(x+i*46,y-26,30,26,'#5a5860');R(x,y,LEVEL_W-x,6,'#9a958a');
 R(x-4,y+10,8,H-y,'#2a292e');R(x+12,150,20,240,'#38363b');
 // banners
 for(const bx of[x+140,x+260]){const wv=Math.sin(time*2+bx)*3;poly([[bx,y+10],[bx+44,y+10],[bx+44+wv,y+150],[bx+22,y+130],[bx+wv,y+150]],dead?'#3a1a14':'#b3271f');R(bx+14,y+40,16,4,'#f2c14e');R(bx+20,y+30,4,40,'#f2c14e')}
 // core: a sun-stone forced into the door
 const c=boss&&boss.core;const cx=x+42,cy=370;
 R(x-8,300,104,130,'#2a2622');R(x-4,304,96,126,'#4b3f30');
 if(c&&!c.dead&&boss.coreShield){R(x-4,316,96,112,'#3a3a40');for(let k=0;k<4;k++)R(x-4,324+k*26,96,5,'#6a6a72');circ(cx,cy,14,'#8a8a92');text(`${boss.garDead||0}/5`,cx,cy,13,'#ffe0a0','center')}
 else if(c&&!c.dead){const pulse=.6+.4*Math.sin(time*6),hurt=c.hurt>0;ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(cx,cy,4,cx,cy,70);g.addColorStop(0,`rgba(255,${hurt?255:200},80,${.7*pulse})`);g.addColorStop(1,'rgba(255,90,30,0)');ctx.fillStyle=g;ctx.fillRect(cx-80,cy-80,160,160);ctx.restore();
  circ(cx,cy,40,'#7a4a12');circ(cx,cy,34,hurt?'#fff1b0':'#f2b23a');circ(cx,cy,22,'#b3271f');circ(cx,cy,12,'#ffd86a');for(let i=0;i<12;i++){const a=i*.5236+time*.8;R(cx+Math.cos(a)*30-3,cy+Math.sin(a)*30-3,6,6,'#5a2a08')}
  R(x-6,428-120,6,120,'#191716');}
 else if(c&&c.dead){circ(cx,cy,36,'#1a1412');circ(cx,cy,24,'#2a1d14')}
 ctx.restore()}
function drawLab(){if(stageNum!==6||camX+W<GATE_X-300)return;const x=GATE_X;
 ctx.fillStyle=tile('lab');ctx.fillRect(x,40,300,H);R(x,40,9,H,'#475258');R(x+1,40,2,H,'#9aa8a9');for(let ry=60;ry<H;ry+=48)circ(x+5,ry,2,'#c6c0a5');
 for(let y=70;y<430;y+=60){R(x+20,y,200,6,'#4a524d');for(let k=0;k<5;k++)circ(x+30+k*40,y+3,2,'#a8b8a8')}
 for(let k=0;k<3;k++){const tx=x+30+k*22,glow=.5+.5*Math.sin(time*3+k);R(tx,120,14,200,'#1a221d');R(tx+3,130+30*(1-glow),8,180-30*(1-glow),`rgba(150,255,70,${.5+glow*.4})`)}
 R(x-300,80,300,10,'#3a423d');R(x-300,80,300,3,'#8a9a8a');R(x-200,90,8,110,'#2a302c');R(x-120,90,8,110,'#2a302c');
 // the great containment pod, cracks when the boss phase begins
 if(boss&&boss.kind===2){const t=boss.t;if(boss.released)strip('fx_open',6,GATE_X-120,430,250);else if(t<3)strip('fx_act',t/3*7,GATE_X-120,430,250);else strip('fx_open',(t-3)/1.2*6,GATE_X-120,430,250)}
 else strip('fx_idle',(time*8)%8,GATE_X-120,430,250)}
function drawBullets(){
 for(const b of pbul){ctx.save();ctx.globalCompositeOperation='lighter';
  if(b.k==='l'){ctx.strokeStyle=b.c;ctx.lineWidth=7;ctx.shadowColor=b.c;ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.ux*b.len,b.y-b.uy*b.len);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke()}
  else if(b.k==='f'){circ(b.x,b.y,b.r+4,'#ff5a2088');circ(b.x,b.y,b.r,'#ffa040');circ(b.x,b.y,b.r*.5,'#fff2a0')}
  else if(b.k==='parry'){ctx.strokeStyle=b.c;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(b.x-b.vx*.036,b.y-b.vy*.036);ctx.lineTo(b.x,b.y);ctx.stroke();circ(b.x,b.y,b.r+3,b.c+'77');circ(b.x,b.y,b.r,'#fff8da');circ(b.x,b.y,2,b.c)}
  else{circ(b.x,b.y,b.r+3,b.c+'66');circ(b.x,b.y,b.r,b.c);circ(b.x,b.y,b.r*.45,'#fff')}
  ctx.restore()}
 for(const b of ebul){if(b.k==='bolt'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));R(-12,-1.5,22,3,'#d9c08a');poly([[10,-4],[16,0],[10,4]],'#eee');ctx.restore()}
  else if(b.k==='wave'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffcf4a';ctx.lineWidth=6;ctx.beginPath();ctx.arc(b.x-(b.dir||-1)*10,b.y,18,(b.dir>0?-1.2:1.94),(b.dir>0?1.2:4.34));ctx.stroke();ctx.restore()}
  else if(b.k==='shell'){circ(b.x,b.y,b.r,'#1e1a16');circ(b.x-2,b.y-2,b.r*.4,'#7a6a5a')}
  else if(b.k==='venom'){ctx.save();ctx.globalCompositeOperation='lighter';circ(b.x,b.y,b.r+5,'#9dff4a44');ctx.restore();strip('fx_bubbles',2+Math.floor(time*10)%2,b.x,b.y+b.r*1.5,b.r*3)}
  else if(b.k==='arrow'){ctx.save();ctx.translate(b.x,b.y);if(b.vx<0)ctx.scale(-1,1);R(-16,-1.5,28,3,'#8a5a2a');poly([[12,-5],[20,0],[12,5]],'#ddd');R(-18,-4,6,3,'#c33');R(-18,1,6,3,'#c33');ctx.restore()}
  else if(b.k==='flask'&&b.glob){ctx.save();ctx.globalCompositeOperation='lighter';circ(b.x,b.y,b.r+4,'#8aff3a55');circ(b.x,b.y,b.r,'#9dff4a');circ(b.x-2,b.y-2,3,'#eaffb0');ctx.restore()}
  else if(b.k==='flask'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(time*10);strip('fx_pour',0,0,17,34,false);ctx.restore()}
  else if(b.k==='acid'){const a=clamp(b.life/1.8*1.5,0,1);ctx.save();ctx.globalAlpha=a;ctx.globalCompositeOperation='lighter';ctx.fillStyle='#8aff3a88';ctx.beginPath();ctx.ellipse(b.x,b.y+4,30,8,0,0,6.28);ctx.fill();for(let k=0;k<4;k++)circ(b.x-18+k*12,b.y-((time*40+k*9)%22),3,'#c8ff6a');ctx.restore()}
  else if(b.k==='feather'){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.globalCompositeOperation='lighter';poly([[-19,0],[-4,-6],[16,0],[-4,6]],'#62eac8');R(-18,-1,31,2,'#dcfff0');ctx.restore()}
  else if(b.k==='siegestone'){circ(b.x+2,b.y+4,b.r+5,'#0006');circ(b.x,b.y,b.r,'#76665b');circ(b.x-5,b.y-4,6,'#b6a38f')}
  else if(b.k==='shock'){ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=b.color||'#c8ff6a';ctx.lineWidth=5;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(b.x-b.dir*k*10,b.y+16,18+k*6,Math.PI*1.1,Math.PI*1.9);ctx.stroke()}ctx.restore()}
  else{circ(b.x,b.y,b.r+2,'#ff4a2a88');circ(b.x,b.y,b.r,'#ff8a3a');circ(b.x,b.y,2,'#fff')}}}
function drawFx(){for(const f of fx){if(f.k==='p'){ctx.globalAlpha=clamp(f.life/f.max,0,1);R(f.x,f.y,f.s,f.s,f.c)}
 else if(f.k==='strip'){const n=(STRIPS[f.key]||[0,0,1])[2];strip(f.key,f.t/f.max*n,f.x,f.y,f.dh,false,1)}
 else if(f.k==='jumpBurst'){const k=Math.min(1,f.t/f.max);ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-k)*.85;ctx.strokeStyle=f.c;ctx.lineWidth=4*(1-k)+1;ctx.beginPath();ctx.ellipse(f.x,f.y+5,20+42*k,7+17*k,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(f.x,f.y+4,12+33*k,4+12*k,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
 else if(f.k==='boom'){const k=f.t/f.max,r=(16+50*k)*f.s;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-k;circ(f.x,f.y,r,'#ff7a2a');circ(f.x,f.y,r*.65,'#ffd25a');circ(f.x,f.y,r*.3,'#fff6d0');ctx.restore();ctx.globalAlpha=(1-k)*.5;circ(f.x+6,f.y-r*.6,r*.6,'#2a2420')}
 else{ctx.globalAlpha=clamp(f.life/f.max*1.5,0,1);text(f.t,f.x,f.y,14,f.c,'center')}}ctx.globalAlpha=1}
function drawForeground(){
 // A quiet ground-edge vignette replaces the former black geometric leaf wedges.
 ctx.save();const f=ctx.createLinearGradient(0,H-24,0,H);
 f.addColorStop(0,'rgba(0,0,0,0)');f.addColorStop(1,stageNum===6?'rgba(2,8,6,.14)':'rgba(3,9,6,.12)');
 ctx.fillStyle=f;ctx.fillRect(0,H-24,W,24);ctx.restore();
}
function medalIcon(x,y,c){poly([[x-5,y],[x-11,y-4],[x-7,y+3]],'#ffb640');poly([[x+5,y],[x+11,y-4],[x+7,y+3]],'#ffb640');circ(x,y,5,c)}
function hud(){
 // V4.9: on wide screens the stage is cropped to fill the window; draw the HUD inside the visible band.
 const VIEW=window.__view||{top:0,h:H};ctx.save();ctx.translate(0,VIEW.top);
 R(0,0,W,94,'#00000045');for(const p of players){const right=p.i===1,x=right?W-18:18,al=right?'right':'left',h=HERO[p.hero];
  text(`${numPlayers===2?'P'+(p.i+1)+' ':''}${h.name}`,x,20,14,h.col,al);
  const lv=Math.min(p.lives,10);for(let i=0;i<lv;i++)medalIcon(right?x-8-i*20:x+8+i*20,40,h.col);if(p.lives>10)text('×'+p.lives,right?x-215:x+215,40,12,'#fff',al);
  if(difficulty==='warrior'&&p.state==='alive')for(let i=0;i<3;i++){const hx=right?x-8-i*16:x+8+i*16;circ(hx,60,6,i<p.hp?'#e8474f':'#3a1a1a')}
  text(`${WEAP[p.weapon].name}`,right?x:x,78,11,'#ffe17a',al);
  text(String(p.score).padStart(7,'0'),right?x-150:x+150,20,14,'#fff',al);
  if(p.barrier>0)text('SPIRIT '+p.barrier.toFixed(0),right?x-150:x+150,60,11,'#ffe27a',al);
  if(p.state==='out')text('GAME OVER',right?x:x,100,12,'#f88',al)}
 text('STAGE '+stageNum,W/2,18,13,'#ffd785','center');
 const prog=clamp(camX/ARENA_X,0,1);R(W/2-110,32,220,6,'#00000088');R(W/2-110,32,220*prog,6,'#e0b264');R(W/2+108,29,3,12,'#ff6a4a');
 if(boss&&boss.kind===3&&!boss.dead&&boss.actor){const e=boss.actor;text(boss.name,W/2,54,12,'#ffbc80','center');R(W/2-170,64,340,9,'#291614');R(W/2-169,65,338*Math.max(0,e.hp)/e.max,7,'#e8794d')}
  if(boss&&boss.kind===2&&!boss.dead){const bars=[['MAD ALCHEMIST',boss.sci,'#c8ff6a'],['MUTANT BRUTE',boss.brute,'#ff8a4a']];bars.forEach(([n,e],i)=>{const bx=W/2-150+i*160;text(n,bx+70,54,11,e?'#ffe9b0':'#888','center');R(bx,64,140,8,'#2a120c');if(e)R(bx+1,65,138*Math.max(0,e.hp)/e.max,6,e.dead?'#444':bars[i][2])})}
 if(boss&&boss.kind===1&&!boss.dead&&boss.core&&boss.coreShield){text(`GARRISON  ${boss.garDead||0} / 5`,W/2,54,12,'#ff9a7a','center');R(W/2-150,64,300,8,'#2a120c');R(W/2-149,65,298*(1-(boss.garDead||0)/5),6,'#e0b264')}
 else if(boss&&boss.kind===1&&!boss.dead&&boss.core){const c=boss.core;text('THE IRON GATE',W/2,54,12,'#ff9a7a','center');R(W/2-150,64,300,8,'#2a120c');R(W/2-149,65,298*c.hp/c.max,6,'#ff6a4a')}
 if(banner){const k=banner.t/banner.max,a=clamp(Math.min(k*4,(1-k)*6),0,1),bw=420,bx=(W-bw)/2,by=6;ctx.globalAlpha=a;R(bx,by,bw,42,'#000000b8');R(bx,by,bw,2,'#e0b264');R(bx,by+40,bw,2,'#e0b264');text(banner.a,W/2,22,18,'#ffd785','center');text(banner.b,W/2,39,11,'#dcefd0','center');ctx.globalAlpha=1}
 ctx.restore();
 if(mode==='pause'){R(0,0,W,H,'#000a');const cy=VIEW.top+VIEW.h/2;text('PAUSED',W/2,cy-10,40,'#ffd785','center');text('Press P / Enter / START to resume',W/2,cy+30,14,'#cde','center')}
}
function draw(){ctx.save();if(shake>0)ctx.translate(rnd(-shake,shake),rnd(-shake,shake));
 drawBackground();drawCinematicAtmosphere();ctx.save();ctx.translate(-camX,0);
 drawDecor();drawWaterBack();drawSolids();drawLab();drawLadders();drawPlatforms();drawBridge();if(stageNum===1)drawGate();drawBossSignature();
 for(const e of enemies)if(e.type==='cannon'||e.type==='bcannon')drawEnemy(e);
 for(const m of medals)drawMedal(m);
 for(const e of enemies)if(e.type!=='cannon'&&e.type!=='bcannon')drawEnemy(e);
 for(const p of players){drawPlayer(p);drawStrike(p);}
 drawBullets();drawFx();drawWaterFront();ctx.restore();drawForeground();
 if(flash>0){ctx.fillStyle=`rgba(255,240,200,${flash})`;ctx.fillRect(0,0,W,H)}
 ctx.restore();if((mode==='play'||mode==='pause'||mode==='over'||mode==='win')&&!matchMedia('(orientation: portrait)').matches)hud()}
function drawTitleScene(){camX=(time*40)%6000;drawBackground();ctx.save();ctx.translate(-camX,0);drawDecor();drawWaterBack();drawSolids();drawLadders();drawPlatforms();drawBridge();drawWaterFront();ctx.restore();drawForeground();ctx.fillStyle='#0008';ctx.fillRect(0,0,W,H)}

// ----------------------------------------------------------- CUTSCENES
const INTRO=[{f:'01_Oath',t:'THE OATH',x:'Beneath the last sun, the brothers Itzá and Balam swore to guard their village.'},
 {f:'02_Beasts_Attack',t:'BEASTS ATTACK',x:'Then the jungle turned against them. Beasts, driven mad, poured from the trees.'},
 {f:'03_Invasion',t:'THE INVASION',x:'Behind the beasts came iron men from across the sea, burning all in their path.'},
 {f:'04_Brothers_Charge',t:'BROTHERS CHARGE',x:'Sun and Shadow. Club and spear. The brothers charge.'}];
const GARRISON_CUT=[{f:'Level_1_Five_Soldier_Garrison',t:'THE IRON GARRISON',x:'Five soldiers hold the village gate. Break their line, then strike the Sun-Stone.'}],ALCHEMIST_CUT=[{f:'Level_06_The_Mad_Alchemist',t:'THE MAD ALCHEMIST',x:'In his laboratory he has brewed a monster from the poisons of the jungle.'}];
let CUTS=INTRO,garrisonSeen=false,alchSeen=false,cutIdx=-1,cutDone=null,seenIntro=false,cutT=0;
const cutUrl=c=>'cuts/'+c.f+'.mp4';
function playCuts(list,done,track='story'){CUTS=list;mode='cut';cutDone=done;cutIdx=-1;cover.classList.add('hidden');$('cutWrap').classList.add('on');musicTrack=track;seqStep=0;nextCut()}
function playIntro(done){playCuts(INTRO,()=>{seenIntro=true;done()})}
function nextCut(){cutIdx++;cutT=0;const v=$('cutVid');if(cutIdx>=CUTS.length){endIntro();return}const c=CUTS[cutIdx];
 v.onerror=()=>{if(mode==='cut')nextCut()};v.src=cutUrl(c);v.currentTime=0;const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{if(mode==='cut')nextCut()});
 $('cutTitle').textContent=c.t||'';$('cutText').textContent=c.x||'';$('cutCap').classList.remove('show');void $('cutCap').offsetWidth;if(c.t)$('cutCap').classList.add('show');
 $('cutDots').innerHTML=CUTS.length>1?CUTS.map((_,i)=>`<i class="${i<=cutIdx?'on':''}"></i>`).join(''):'';if(cutIdx)SFX.jump()}
function endIntro(){const v=$('cutVid');v.onerror=null;v.pause();v.removeAttribute('src');v.load();$('cutWrap').classList.remove('on');const d=cutDone;cutDone=null;if(d)d()}
function cutSkip(all){if(mode!=='cut'||cutT<.35)return;if(all)endIntro();else nextCut()}
$('cutVid').addEventListener('ended',()=>{if(mode==='cut')nextCut()});
$('cutWrap').addEventListener('pointerdown',e=>{e.preventDefault();audio();cutSkip(false)});
$('cutSkipAll').addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();cutT=1;cutSkip(true)});
// ----------------------------------------------------------- FLOW / UI
const cover=$('cover');
function overlay(html){cover.innerHTML=`<div class="panel">${html}</div>`;cover.classList.remove('hidden')}
function startGame(n,hero,stage,skipIntro){numPlayers=n;if(hero)soloHero=hero;stageNum=stage||startStage;audio();
 if(stageNum===1&&!seenIntro&&!skipIntro){playIntro(()=>startGame(n,hero,1,true));return}
 garrisonSeen=false;alchSeen=false;
 resetStage();mode='play';musicTrack='stage';seqStep=0;cover.classList.add('hidden');updateTouch()}
function titleScreen(){mode='title';const d=STAGES[startStage]||STAGES[1];overlay(`<div class="eyebrow">BROTHERS OF THE JAGUAR · LIVING JUNGLE · SIX LEVELS</div><h1>THE LAST SUN</h1><div class="eyebrow">CHAT V 4.8 · WIDER JUNGLE VIEW</div><h2>STAGE ${startStage}: ${d.name}</h2><p>${CHAPTERS[startStage]}</p><p>Six side-scrolling missions. Climb ruins, survive ambushes, defeat the stage boss and continue the brothers' journey.</p><div class="row"><button class="cta" data-go="1" data-hero="itza">▶ ITZÁ <small>Solar warrior</small></button><button class="cta alt" data-go="1" data-hero="balam">▶ BALAM <small>Shadow warrior</small></button></div><div class="row"><button class="cta ghost" data-go="2">👥 2-PLAYER CO-OP</button><button class="cta ghost" id="stageBtn">STAGE ${startStage} / 6 ↻</button><button class="cta ghost" id="diffBtn">${difficulty==='warrior'?'WARRIOR · 3 HP':'CLASSIC · 1 HIT'}</button><button class="cta ghost" id="padBtn">🎮 CONTROLLER</button></div><p class="hint">Move: A/D or ←/→ · Climb: W / touch up · Double Jump: tap ↑ / K / Space twice · Fire: J or X · Slash deflects shots & arrows · Drop: Down + Jump · P pauses. Mobile: touchscreen. Gamepad supported.<br><span class="pr" id="loadStatus">${loaded>=total?'Ready to start':'Loading artwork…'}</span></p>`);
cover.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>startGame(+b.dataset.go,b.dataset.hero));
$('diffBtn').onclick=()=>{difficulty=difficulty==='warrior'?'classic':'warrior';titleScreen()};$('padBtn').onclick=setupController;
$('stageBtn').onclick=()=>{startStage=startStage%6+1;stageNum=startStage;loadStage(startStage);titleScreen()}}
function gameOver(){mode='over';const sc=players.reduce((a,p)=>a+p.score,0);overlay(`<div class="eyebrow">THE SUN FLICKERS</div><h2>GAME OVER</h2><p>Score ${sc}</p><div class="row"><button class="cta" id="cont">↻ CONTINUE</button><button class="cta ghost" id="toTitle">TITLE</button></div>`);
 $('cont').onclick=()=>{for(const p of players){p.lives=konami?30:3;p.score=0;p.state='dead';p.deadT=.01}mode='play';cover.classList.add('hidden')};$('toTitle').onclick=titleScreen}
function victory(){mode='win';SFX.life();const sc=players.reduce((a,p)=>a+p.score,0),tm=`Time ${Math.floor(stageT/60)}:${String(Math.floor(stageT%60)).padStart(2,'0')} · Score ${sc}`;
const last=stageNum>=6,next=STAGES[stageNum+1];unlockStage(Math.min(6,stageNum+1));overlay(`<div class="eyebrow">STAGE ${stageNum} CLEARED</div><h1>${last?'THE LAST SUN RISES':'VICTORY!'}</h1><h2>${STG.name}</h2><p>${last?'The laboratory collapses, the invasion is broken, and the brothers return as the sun rises over their homeland.':'The boss has fallen. The brothers push onward.'}</p><p>${tm}</p><div class="row"><button class="cta" id="next">${last?'↻ RESTART CAMPAIGN':'▶ STAGE '+(stageNum+1)+' · '+next.name}</button><button class="cta ghost" id="toTitle">STAGE SELECT</button></div>`);
$('next').onclick=()=>{if(last){startGame(numPlayers,null,1,true)}else{stageNum++;alchSeen=false;garrisonSeen=false;resetStage(true);mode='play';musicTrack='stage';seqStep=0;cover.classList.add('hidden')}};
$('toTitle').onclick=titleScreen}
function togglePause(){if(mode==='play'){mode='pause'}else if(mode==='pause'){mode='play'}}

// ----------------------------------------------------------- INPUT
const KEY1={KeyA:'l',KeyD:'r',KeyW:'u',KeyS:'d',KeyJ:'fire',KeyK:'jump',Space:'jump',KeyZ:'jump',KeyX:'fire',KeyH:'slash',KeyL:'melee'};
const KEY2={ArrowLeft:'l',ArrowRight:'r',ArrowUp:'jump',ArrowDown:'d',Period:'fire',Slash:'slash',Comma:'melee',Numpad1:'fire',Numpad2:'jump',ShiftRight:'jump',Enter:'_'};
const keyState=[{},{}];
const KON=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];let konPos=0;
function mapKey(code){if(KEY1[code])return[0,KEY1[code]];if(KEY2[code]&&KEY2[code]!=='_')return[numPlayers===2?1:0,KEY2[code]];return null}
addEventListener('keydown',e=>{
 if(mode==='cut'){e.preventDefault();cutSkip(e.code==='Escape'||e.code==='Enter');return}
 if(mode==='title'){if(e.code===KON[konPos]){konPos++;if(konPos===KON.length){konami=true;konPos=0;audio();SFX.life();titleScreen()}}else konPos=e.code===KON[0]?1:0}
 if(e.code==='KeyP'||e.code==='Escape'||(e.code==='Enter'&&(mode==='play'||mode==='pause'))){togglePause();e.preventDefault();return}
 const m=mapKey(e.code);if(!m||mode==='title')return;e.preventDefault();const[i,a]=m;if(a==='jump'&&!keyState[i]['jump_'+e.code])inp[i].jumpP=true;if((a==='slash'||a==='melee')&&!keyState[i][e.code])inp[i][a+'P']=true;keyState[i]['jump_'+e.code]=a==='jump';keyState[i][e.code]=a;})
addEventListener('keyup',e=>{const m=mapKey(e.code);if(!m)return;const[i]=m;delete keyState[i][e.code];delete keyState[i]['jump_'+e.code]})
addEventListener('blur',()=>{keyState[0]={};keyState[1]={};if(mode==='play')togglePause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')togglePause()});
const touch={l:0,r:0,u:0,d:0,fire:0,jump:0,slash:0,melee:0};
let padPrev=[{},{}];
let padBlocked=false;function getPads(){if(padBlocked||!navigator.getGamepads)return[];try{return navigator.getGamepads()||[]}catch(e){padBlocked=true;return[]}}
let padMap=null;try{padMap=JSON.parse(localStorage.getItem('lastSunPad')||'null')}catch(e){}
function readPad(gp){const b=n=>!!(gp.buttons[n]&&gp.buttons[n].pressed),ax=gp.axes[0]||0,ay=gp.axes[1]||0;
 let l=ax<-.45,r=ax>.45,u=ay<-.45,d=ay>.45;
 for(const hi of[9,6,7])if(gp.axes.length>hi){const h=gp.axes[hi];if(h>=-1.05&&h<=1.05&&!(hi!==9&&Math.abs(h)<.2)){if(hi===9){const k=Math.round((h+1)/(2/7));if(k>=0&&k<=7){u||=k===0||k===1||k===7;r||=k>=1&&k<=3;d||=k>=3&&k<=5;l||=k>=5&&k<=7}}else{if(hi===6){l||=h<-.5;r||=h>.5}else{u||=h<-.5;d||=h>.5}}}}
 l||=b(14);r||=b(15);u||=b(12);d||=b(13);
 // A/B jump, X/Y fire in BOTH standard and generic-USB layouts; L/R also fire. Custom map overrides.
 let jump=b(0)&&gp.mapping==='standard'||b(1)||b(2)&&gp.mapping!=='standard',fire=b(2)&&gp.mapping==='standard'||b(3)||b(0)&&gp.mapping!=='standard'||b(6)||b(7);
 if(padMap){jump=padMap.jump.some(b);fire=padMap.fire.some(b)}
 return{l,r,u,d,fire,jump,slash:b(4),melee:b(5),start:b(9),select:b(8)}}
let menuFocus=0;
function menuNav(st,prev){const btns=[...cover.querySelectorAll('button')];if(!btns.length||cover.classList.contains('hidden'))return;
 const mv=(st.r&&!prev.r)||(st.d&&!prev.d)?1:(st.l&&!prev.l)||(st.u&&!prev.u)?-1:0;
 if(mv){menuFocus=(menuFocus+mv+btns.length)%btns.length;btns[menuFocus].focus()}
 if((st.jump&&!prev.jump)||(st.start&&!prev.start)||(st.fire&&!prev.fire)){(btns[menuFocus]||btns[0]).click();menuFocus=0}}
function pollPads(){
 for(let i=0;i<2;i++){const o={};for(const c in keyState[i]){const a=keyState[i][c];if(a&&a!==true)o[a]=true}const hadJump=inp[i].jumpP,hadSlash=inp[i].slashP,hadMelee=inp[i].meleeP;Object.assign(inp[i],{l:!!o.l,r:!!o.r,u:!!o.u,d:!!o.d,fire:!!o.fire,jump:!!o.jump,jumpP:hadJump,slashP:hadSlash,meleeP:hadMelee})}
 inp[0].l||=!!touch.l;inp[0].r||=!!touch.r;inp[0].u||=!!touch.u;inp[0].d||=!!touch.d;inp[0].fire||=!!touch.fire;inp[0].jump||=!!touch.jump;
 const pads=getPads();let pi=0;
 for(const gp of pads){if(!gp||!gp.connected||pi>1)continue;const i=numPlayers===2?pi:0;const st=readPad(gp),pv=padPrev[pi]||{};
  if(mode==='play'){inp[i].l||=st.l;inp[i].r||=st.r;inp[i].u||=st.u;inp[i].d||=st.d;inp[i].fire||=st.fire;inp[i].jump||=st.jump;if(st.jump&&!pv.jump)inp[i].jumpP=true;if(st.slash&&!pv.slash)inp[i].slashP=true;if(st.melee&&!pv.melee)inp[i].meleeP=true}
  if((st.start&&!pv.start)||(st.select&&!pv.select)){if(mode==='play'||mode==='pause'){togglePause();padPrev[pi]=st;pi++;continue}}
  if(mode==='cut'){if(st.start&&!pv.start)cutSkip(true);else if((st.jump&&!pv.jump)||(st.fire&&!pv.fire))cutSkip(false)}
  else if(mode==='pause'&&st.jump&&!pv.jump)togglePause();
  else if(mode!=='play'&&mode!=='pause'&&!padSetup)menuNav(st,pv);
  padPrev[pi]=st;pi++}}
// controller setup: press the button you want for JUMP, then FIRE
let padSetup=null;
function setupController(){padSetup={step:'jump',held:true};overlay(`<div class="eyebrow">CONTROLLER SETUP</div><h2 id="psMsg">Press the button you want for <b>JUMP</b></h2><p class="hint" id="psInfo">${padBlocked?'This page viewer blocks controllers. They work when the game is hosted on GitHub Pages or opened as a file.':[...(getPads())].filter(Boolean).map(g=>g.id).join('<br>')||'No controller detected yet. Press any button on it.'}</p><div class="row"><button class="cta ghost" id="psReset">RESET TO DEFAULT</button><button class="cta ghost" id="psBack">BACK</button></div>`);
 $('psReset').onclick=()=>{padMap=null;try{localStorage.removeItem('lastSunPad')}catch(e){}padSetup=null;titleScreen()};$('psBack').onclick=()=>{padSetup=null;titleScreen()}}
function setupTick(){if(!padSetup)return;const pads=[...(getPads())].filter(Boolean);let pressed=-1;
 for(const gp of pads)gp.buttons.forEach((b,n)=>{if(b.pressed&&pressed<0)pressed=n});
 if(pressed<0){padSetup.held=false;return}if(padSetup.held)return;padSetup.held=true;SFX.power();
 if(padSetup.step==='jump'){padSetup.jump=pressed;padSetup.step='fire';$('psMsg').innerHTML='Now press the button you want for <b>FIRE</b>'}
 else if(pressed!==padSetup.jump){padMap={jump:[padSetup.jump],fire:[pressed]};try{localStorage.setItem('lastSunPad',JSON.stringify(padMap))}catch(e){}padSetup=null;titleScreen();setTimeout(()=>{const ls=$('loadStatus');if(ls)ls.textContent='Controller saved: button '+padMap.jump[0]+' = JUMP, button '+padMap.fire[0]+' = FIRE'},10)}}
addEventListener('gamepadconnected',e=>{const ls=$('loadStatus');if(ls)ls.textContent='🎮 Controller connected: '+e.gamepad.id.slice(0,40);audio()});
// touch: virtual stick + buttons
const stick=$('stick'),knob=$('knob');let stickId=null;
function stickMove(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const m=Math.hypot(dx,dy),max=r.width*.38;if(m>max){dx=dx/m*max;dy=dy/m*max}knob.style.transform=`translate(${dx}px,${dy}px)`;
 const dead=r.width*.13;touch.l=dx<-dead;touch.r=dx>dead;touch.u=dy<-dead*1.4;touch.d=dy>dead*1.4}
stick.addEventListener('pointerdown',e=>{e.preventDefault();stickId=e.pointerId;stick.setPointerCapture(e.pointerId);audio();stickMove(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)stickMove(e)});
for(const ev of['pointerup','pointercancel'])stick.addEventListener(ev,e=>{if(e.pointerId!==stickId)return;stickId=null;knob.style.transform='';touch.l=touch.r=touch.u=touch.d=false});
for(const b of document.querySelectorAll('[data-t]')){const k=b.dataset.t;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.classList.add('on');audio();if(k==='jump'&&!touch.jump)inp[0].jumpP=true;if((k==='slash'||k==='melee')&&!touch[k])inp[0][k+'P']=true;if(k==='autofire'){touch.fire=touch.fire==='lock'?0:'lock';b.classList.toggle('lock',!!touch.fire);return}touch[k]=1});
 for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>{b.classList.remove('on');if(k!=='autofire'&&!(k==='fire'&&touch.fire==='lock'))touch[k]=0})}
const isTouch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;let touchOverride=null;
function updateTouch(){document.body.classList.toggle('touch',touchOverride===null?isTouch:touchOverride);$('touchBtn').style.opacity=document.body.classList.contains('touch')?'1':'.55'}updateTouch();
$('touchBtn').onclick=()=>{touchOverride=!document.body.classList.contains('touch');updateTouch()};
$('portraitAnyway').onclick=()=>document.body.classList.add('portrait-ok');
addEventListener('orientationchange',()=>{document.body.classList.remove('portrait-ok');touch.l=touch.r=touch.u=touch.d=touch.jump=0});
$('pauseBtn').onclick=()=>{if(mode==='play'||mode==='pause')togglePause()};
$('soundBtn').onclick=e=>{soundOn=!soundOn;e.currentTarget.textContent=soundOn?'🔊':'🔇';if(soundOn)audio()};
$('fsBtn').onclick=()=>{const f=$('shell');const active=document.fullscreenElement||document.webkitFullscreenElement;if(active){const out=document.exitFullscreen||document.webkitExitFullscreen;if(out)try{out.call(document)}catch(e){};return}const enter=f.requestFullscreen||f.webkitRequestFullscreen;if(enter){try{const p=enter.call(f);if(p&&p.then)p.then(()=>{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}).catch(()=>{})}catch(e){}}};

// ----------------------------------------------------------- LOOP
let last=0;
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;if(mode==='cut')cutT+=dt;if(mode!=='play'){pollPads();setupTick()}ctx.setTransform(SC,0,0,SC,0,0);
 try{if(mode==='play'&&!window.__freeze){let r=dt;while(r>1e-4){const st=Math.min(r,1/120);update(st);r-=st}}else{time+=dt;if(mode==='title')drawTitleScene()}if(mode!=='title'&&mode!=='cut')draw()}catch(err){console.error(err)}
 requestAnimationFrame(frame)}
loadStage(1);titleScreen();requestAnimationFrame(frame);
// test hooks
window.__lastSun={debugCombat:()=>({projectiles:ebul.map(b=>({k:b.k,x:b.x,y:b.y,vx:b.vx})),reflections:pbul.filter(b=>b.k==='parry').map(b=>({x:b.x,y:b.y,vx:b.vx,vy:b.vy})),players:players.map(p=>({x:p.x,y:p.y,vx:p.vx,vy:p.vy,onGround:p.onGround,jumpsUsed:p.jumpsUsed,attackT:p.attackT,attackKind:p.attackKind,score:p.score}))}),testShot:(kind='arrow',dx=65,dy=-64)=>{const p=players[0];if(!p)return;ebul.push({k:kind,x:p.x+dx,y:p.y+dy,vx:-280,vy:0,life:2,r:5})},testTarget:(dx=210)=>{const p=players[0];if(!p)return null;const e=spawn('rifle',p.x+dx,p.y,{hp:5,max:5});return e.x},triggerSlash:()=>{if(players[0])startStrike(players[0],'slash')},enemyStates:()=>enemies.slice(0,25).map(e=>({type:e.type,x:+e.x.toFixed(1),state:e.state,hp:e.hp,stun:e.stun||0,aimT:Math.max(0,e.aimT||0),enraged:!!e.enraged})),state:()=>({stage:stageNum,mode,camX,boss:!!boss,bossDead:!!(boss&&boss.dead),enemies:enemies.length,players:players.map(p=>({x:p.x,y:p.y,state:p.state,lives:p.lives,weapon:p.weapon,score:p.score,jumpsUsed:p.jumpsUsed}))}),
 freeze:v=>{window.__freeze=v},stage:n=>{stageNum=n;resetStage(false);mode='play';cover.classList.add('hidden')},ladderCount:()=>LADDERS.length,complete:()=>victory(),renderMusic:async(track,secs)=>{const oac=new OfflineAudioContext(2,44100*secs,44100),sv=[ac,master,musBus,fxSend,mode,musicTrack,seqStep,nextNote,soundOn];
 ac=oac;master=oac.createGain();master.gain.value=.55;master.connect(oac.destination);musBus=null;mode='play';musicTrack=track;seqStep=0;nextNote=0;soundOn=true;musInit();
 const S=SONGS[track],sp=60/S.bpm/4;while(nextNote<secs){const base=nextNote;Object.defineProperty(oac,'currentTime',{value:base-.1,configurable:true});musicTick()}
 [ac,master,musBus,fxSend,mode,musicTrack,seqStep,nextNote,soundOn]=sv;const buf=await oac.startRendering();const ch=buf.getChannelData(0),n=ch.length,dv=new DataView(new ArrayBuffer(44+n*2));
 const w=(o,str)=>{for(let k=0;k<str.length;k++)dv.setUint8(o+k,str.charCodeAt(k))};w(0,'RIFF');dv.setUint32(4,36+n*2,true);w(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,44100,true);dv.setUint32(28,88200,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,n*2,true);
 let pk=0;for(let k=0;k<n;k++){const v=Math.max(-1,Math.min(1,ch[k]));pk=Math.max(pk,Math.abs(v));dv.setInt16(44+k*2,v*32767,true)}
 const bytes=new Uint8Array(dv.buffer);let bin='';for(let k=0;k<bytes.length;k+=32768)bin+=String.fromCharCode.apply(null,bytes.subarray(k,k+32768));return{peak:pk,wav:btoa(bin)}},start:(n=1,h='itza',st=1)=>startGame(n,h,st,true),step:(s,hold={})=>{for(let i=0;i<Math.ceil(s/.02);i++){Object.assign(touch,hold);update(.02)}for(const k in hold)touch[k]=0},
 god:()=>{for(const p of players){p.inv=9999}},warp:x=>{for(const p of players){p.x=x;p.y=100;p.state='alive'}camX=clamp(x-300,0,ARENA_X)},killGarrison:()=>{if(boss&&boss.gar)for(const e of boss.gar)if(!e.dead)damageEnemy(e,99,{own:0,x:e.x,y:e.y-50,force:true})},noCut:v=>{window.__noCut=v},hitCore:n=>{if(!boss)return;for(const e of[boss.core,boss.sci,boss.brute])if(e&&!e.dead)damageEnemy(e,n,{own:0,x:e.x,y:e.y-60,force:true})}};
})();
