
/* V3.8 portrait camera: show an aspect-correct crop of the running stage,
   centered near the active hero; the game logic stays at its original resolution. */
(()=>{
 const source=document.getElementById('game'),visible=document.getElementById('portraitView');
 if(!source||!visible)return;
 const ctx=visible.getContext('2d',{alpha:false});
 const media=window.matchMedia('(orientation: portrait)');
 let lastW=0,lastH=0,cam=0,lastHud=0;
 const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
 function tick(t){
   if(media.matches){
     const rect=visible.getBoundingClientRect();
     const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
     if(w>40&&h>40){
       let dpr=Math.min(1.5,window.devicePixelRatio||1);
       const vw=Math.round(w*dpr),vh=Math.round(h*dpr);
       if(vw!==lastW||vh!==lastH){visible.width=vw;visible.height=vh;lastW=vw;lastH=vh;}
       const logicalW=960,logicalH=540,sourceW=source.width,sourceH=source.height;
       const cropWidth=Math.min(logicalW,logicalH*w/h*1.40);
       const status=window.__lastSun&&window.__lastSun.state();
       let target=0;
       if(status&&status.players&&status.players.length){
         const alive=status.players.filter(p=>p.state==='alive');
         const group=alive.length?alive:status.players;
         const avg=group.reduce((sum,p)=>sum+p.x,0)/group.length;
         target=avg-status.camX-cropWidth*.44;
       }
       target=clamp(target,0,logicalW-cropWidth);
       const smoothDt=Math.min(.05,Math.max(0,(t-(tick.last||t))/1000));tick.last=t;
       cam+=(target-cam)*(1-Math.exp(-12*smoothDt));
       ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
       ctx.drawImage(source,cam/logicalW*sourceW,0,cropWidth/logicalW*sourceW,sourceH,0,0,vw,vh);
       if(status&&t-lastHud>100){
         document.getElementById('pStage').textContent='STAGE '+(status.stage||1)+' / 6';
         const p=status.players[0];
         document.getElementById('pHero').textContent=p?(p.score.toString().padStart(5,'0')+' · '+(p.weapon||'NORMAL')):'THE LAST SUN';
         document.getElementById('pLives').textContent=p?'♥ '+p.lives:'♥ ♥ ♥';
         lastHud=t;
       }
     }
   }
   requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
})();
