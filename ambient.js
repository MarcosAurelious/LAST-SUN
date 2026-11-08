/* V4.9 full window. On screens wider than 16:9 the stage fills the window: it is scaled to the
   full width and cropped top and bottom (mostly sky, at most 80 game pixels of stone floor), and
   the HUD is drawn inside the visible band (window.__view). On extreme ultrawides the crop stops
   at 370 visible rows so play near the top is never lost, and a blurred glow fills the rest.
   Screens narrower than 16:9 keep the whole stage with the glow above and below. */
(()=>{
 const src=document.getElementById('game'),amb=document.getElementById('ambient'),frame=document.getElementById('frame');
 if(!src||!amb||!frame)return;
 const ctx=amb.getContext('2d',{alpha:false});
 const land=window.matchMedia('(orientation: landscape)');
 const LW=960,LH=540,MIN_VIS=370,MAX_FLOOR=80;
 const set=(k,v)=>src.style.setProperty(k,v,'important');
 let key='';
 function fit(){
   const w=frame.clientWidth,h=frame.clientHeight,k=w+'x'+h+(land.matches?'L':'P');
   if(k===key)return;key=k;
   if(!land.matches||!w||!h){['width','height','object-fit','object-position','left','top','right','bottom','margin'].forEach(p=>src.style.removeProperty(p));window.__view={top:0,h:LH};return}
   if(w/h<=LW/LH){ // narrower than 16:9: keep the whole stage (CSS centres it)
     ['width','height','object-fit','object-position'].forEach(p=>src.style.removeProperty(p));window.__view={top:0,h:LH};return}
   const bw=Math.min(w,h*LW/MIN_VIS),scale=bw/LW,visH=Math.min(LH,h/scale),crop=LH-visH;
   const bottom=Math.min(crop,MAX_FLOOR),top=crop-bottom;
   set('width',bw+'px');set('height',h+'px');set('object-fit','cover');
   set('object-position','50% '+(crop>0?(top/crop*100):50)+'%');
   window.__view={top,h:visH};
 }
 let last=0;
 function tick(t){
   fit();
   if(land.matches&&!document.hidden&&t-last>66){last=t;try{ctx.drawImage(src,0,0,amb.width,amb.height)}catch(e){}}
   requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
})();
