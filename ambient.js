/* V4.9 ambient fill: on wide screens the stage keeps its 16:9 shape, and the space
   beside it shows a soft, blurred glow of the live scene so the jungle reaches the window edges. */
(()=>{
 const src=document.getElementById('game'),amb=document.getElementById('ambient');
 if(!src||!amb)return;
 const ctx=amb.getContext('2d',{alpha:false});
 const land=window.matchMedia('(orientation: landscape)');
 let last=0;
 function tick(t){
   if(land.matches&&!document.hidden&&t-last>66){
     last=t;
     try{ctx.drawImage(src,0,0,amb.width,amb.height)}catch(e){}
   }
   requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
})();
