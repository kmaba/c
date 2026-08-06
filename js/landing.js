(function($){"use strict";
gsap.registerPlugin(DrawSVGPlugin,ScrollTrigger,CSSRulePlugin,ScrollToPlugin,MorphSVGPlugin,CustomEase,InertiaPlugin,SplitText);

/* ===== Cursor ===== */
var mouseCursor=$('#mouseCursor'),cursorCircle=$('#cursor'),cursorDot=$('#dot');
let cursorLoading;
cursorLoading=gsap.timeline({overwrite:true,paused:true});
cursorLoading.to("#mouseCursor",.3,{width:50,height:50,},0);
cursorLoading.to('#cursor',.3,{backgroundColor:'transparent',borderWidth:2,},0);
cursorLoading.to('#dot',.3,{opacity:1,x:'0%',y:'0%',top:'0%',left:'0%'},0);
cursorLoading.to('#dot',.3,{opacity:1,x:0,y:0,top:0,left:0},0);
cursorLoading.to('#mouseCursor',.3,{borderRadius:"50%"},0);
cursorLoading.to('#cursor',.3,{borderRadius:"50%"},0);

function initCursor(){
  if(!mouseCursor.length){return;}
  gsap.set(mouseCursor,{xPercent:-50,yPercent:-50});
  var pos={x:window.innerWidth/2,y:window.innerHeight/2};
  var mouse={x:pos.x,y:pos.y};
  var speed=0.18;
  var xSet=gsap.quickSetter(mouseCursor,'x','px');
  var ySet=gsap.quickSetter(mouseCursor,'y','px');
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;});
  gsap.ticker.add(function(){
    var dt=1.0-Math.pow(1.0-speed,gsap.ticker.deltaRatio());
    pos.x+=(mouse.x-pos.x)*dt;
    pos.y+=(mouse.y-pos.y)*dt;
    xSet(pos.x);ySet(pos.y);
  });
}

function cursorHovers(){
  if(!mouseCursor.length){return;}
  var darkCircle=mouseCursor.data('dark-circle'),darkDot=mouseCursor.data('dark-dot'),
      lightCircle=mouseCursor.data('light-circle'),lightDot=mouseCursor.data('light-dot');
  function applyColors(isDark){
    if(isDark){
      gsap.set(cursorCircle,{borderColor:lightCircle});
      gsap.set(cursorDot,{background:lightDot});
    }else{
      gsap.set(cursorCircle,{borderColor:darkCircle});
      gsap.set(cursorDot,{background:darkDot});
    }
  }
  if($('body').hasClass('dark')||$('#page').hasClass('dark-demo')){applyColors(true);}
  else{applyColors(false);}
  var hoverEls=$('a, button, .gallery-item, .testimonial-card, .facility-card, .package-card, .hero-cta-btn, .header-cta-but a, .social-links a');
  hoverEls.on('mouseenter',function(){gsap.to(mouseCursor,{width:100,height:100});});
  hoverEls.on('mouseleave',function(){gsap.to(mouseCursor,{width:50,height:50});});
}

barba.hooks.before((data)=>{cursorLoading=gsap.timeline({overwrite:true});cursorLoading.to(mouseCursor,.3,{width:50,height:50,},0);
cursorLoading.to('#cursor',.3,{backgroundColor:'transparent',borderWidth:2,},0);
cursorLoading.to('#dot',.3,{opacity:1,x:'0%',y:'0%',top:'0%',left:'0%'},0);
cursorLoading.to('#dot',.3,{opacity:1,x:0,y:0,top:0,left:0},0);
cursorLoading.to('#mouseCursor',.3,{borderRadius:"50%"},0);
cursorLoading.to('#cursor',.3,{borderRadius:"50%"},0);
cursorLoading.to(mouseCursor,1,{rotate:360,repeat:-1,ease:'power2.inOut'},0);});

/* ===== Locomotive Scroll ===== */
var locoScroll;
function initLocomotiveScroll(){
  if(typeof LocomotiveScroll !== 'undefined'){
    if(locoScroll) locoScroll.destroy();
    locoScroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      lerp: 0.08,
      multiplier: 1,
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });
  }
}

/* ===== Initial states for entrance animations ===== */
function setInitialStates(){
  gsap.set('.lph-image',{y:'100%'});
  gsap.set('.landing-menu',{visibility:'hidden'});
  gsap.set('.layout-switch',{visibility:'hidden'});
  gsap.set('.lph-layout-switch',{scale:0});
  gsap.set('.header-cta-but',{x:-30,opacity:0});
  gsap.set('.lst_line',{y:'100%'});
  gsap.set('.lsa_char',{y:'100%'});
  gsap.set('.lph-image-3',{y:'100%'});
  gsap.set('.lph-image-2, .lph-image-4',{y:'100%'});
  gsap.set('.lph-image-1, .lph-image-5',{y:'100%'});
  var overlayBg = $('#page').hasClass('dark-demo') ? '#191b1d' : '#ebebeb';
  gsap.set('.lph-overlay',{height:'0%',background:overlayBg});
}

/* ===== Splash loader ===== */
var loadAn;
function buildSplash(loader){
  var textEl = loader.find('.apl-text');
  if(textEl.length && !textEl.find('.apl-loading').length){
    var lines = [textEl.data('line-1') || 'Wanna book a ballroom?', textEl.data('line-2') || 'You are at the right place.'];
    textEl.empty();
    $.each(lines,function(i,line){
      var lineEl = $('<div class="apl-loading"></div>');
      if(i === 1){ lineEl.addClass('apl-sub'); }
      var words = line.split(' ');
      $.each(words,function(wi,word){
        lineEl.append('<span class="apl-load-word-wrapper"><span class="apl-load-word">'+word+'</span></span>');
        if(wi < words.length - 1){ lineEl.append(' '); }
      });
      textEl.append(lineEl);
    });
  }
  // Build rolling digit columns exactly like original template
  if(!loader.find('.apl-num').length){
    var count = loader.find('.apl-count');
    if(!count.length){
      count = $('<div class="apl-count"></div>');
      loader.append(count);
    }
    count.wrap('<div class="apl-wrapper"></div>');
    // Original arrays: nums1=[0..9,1] (11), nums2=[0..9,0..9,0] (21)
    var nums1=[0,1,2,3,4,5,6,7,8,9,1];
    var nums2=[0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0];
    var num1Text='', num2Text='';
    for(var i=0;i<nums1.length;i++){ num1Text+='<span>'+nums1[i]+'</span>'; }
    for(var i=0;i<nums2.length;i++){ num2Text+='<span>'+nums2[i]+'</span>'; }
    count.append('<div class="apl-num apl-num-1"></div><div class="apl-num apl-num-2"></div><div class="apl-num apl-num-3"></div>');
    count.find('.apl-num-1').html(num1Text);
    count.find('.apl-num-2').html(num2Text);
    count.find('.apl-num-3').html('<span>%</span><span>0</span>');
    count.find('.apl-num').wrapInner('<div class="apl-num-wrapper"></div>');
  } else {
    $('.apl-count').wrap('<div class="apl-wrapper"></div>');
  }
}

function initSplash(loader){
  buildSplash(loader);
  var aplCount=loader.find('.apl-count');
  var num1wrap=aplCount.find('.apl-num-1 .apl-num-wrapper');
  var num2wrap=aplCount.find('.apl-num-2 .apl-num-wrapper');
  var num3wrap=aplCount.find('.apl-num-3 .apl-num-wrapper');
  var duration=loader.data('duration') || 5;
  var bg=loader.find('.apl-background');
  var textEl=loader.find('.apl-text');
  
  // Background stays behind loader content within the loader's stacking context
  var bgEl = bg[0] || bg;
  if(bgEl && bgEl.style) bgEl.style.zIndex = '-1';
  else { console.log('BG element issue:', bg); }
  
  // Set initial states
  gsap.set(num1wrap,{y:'10%'});
  gsap.set(num2wrap,{y:'5%'});
  gsap.set(num3wrap,{y:'100%'});
  gsap.set(textEl,{visibility:'hidden',x:500});
  gsap.set('#page',{visibility:'hidden'});
  gsap.set('.logo-text',{y:'100%'});
  gsap.set('.header-cta-but',{x:-30,opacity:0});
  
  // Main loader timeline - original keyframes & timings, quicker via data-duration
  loadAn=gsap.timeline({
    yoyo:true,
    id:'pageLoader',
    once:true,
    onStart:function(){
      $('body').addClass('loading');
    },
    onComplete:function(){
      $('body').removeClass('loading');
      gsap.set('#page',{visibility:'visible'});
      gsap.to(textEl,.3,{opacity:0,ease:'power2.out'});
      gsap.to(bg,.7,{height:'0%',ease:'power2.inOut',onComplete:function(){loader.hide();}});
      if($('#page').hasClass('landing-main')){ landingPageOpen(); }
      else { demoPageOpen(); }
      initLocomotiveScroll();
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    }
  });
  
  // Original keyframes: countdown columns, then splash text slides in from right
  loadAn.to(num1wrap,duration,{y:'-91%',ease:'power2.inOut'},.25);
  loadAn.to(num2wrap,duration,{y:'-95.3%',ease:'power2.inOut'},.25);
  loadAn.to(num3wrap,1.5,{y:'0%',ease:'power2.out'},.5);
  loadAn.set(textEl,{visibility:'visible'},.5);
  loadAn.to(textEl,1.2,{x:0,ease:'power3.out'},.5);
  loadAn.to('.apl-loading:not(.apl-sub) .apl-load-word',1.1,{y:'0%',stagger:0.06,ease:'power3.out'},.95);
  loadAn.to('.apl-loading.apl-sub .apl-load-word',.9,{y:'0%',stagger:0.07,ease:'power3.out'},2.4);
  loadAn.to('.logo-text',.8,{y:'0%',ease:'power2.out'},2);
  loadAn.to('.header-cta-but',.9,{x:0,opacity:1,ease:'power2.out'},2.8);
  loadAn.to(num3wrap,1,{y:'-50%',ease:'power2.out'},duration-.6);
  loadAn.to('.apl-num-wrapper',.6,{y:'-100%',ease:'power2.in',stagger:.1},duration+.6);
}

/* ===== Landing Page Functions ===== */
function landingPageOpen(){
  var lpOpen=gsap.timeline({onStart:function(){gsap.set('.lph-headline',{display:'block'});gsap.set('.lph-headline',{opacity:1});}});
  lpOpen.fromTo('.landing-menu a',1,{y:'100%'},{y:'0%',stagger:0.08,ease:'power2.out',onStart:function(){gsap.set('.landing-menu',{visibility:'visible'})}},.15);
  lpOpen.fromTo('.logo-text',1,{y:'100%'},{y:'0%',ease:'power2.out'},0);
  lpOpen.fromTo('.header-cta-but',1,{x:-30,opacity:0},{x:0,opacity:1,ease:'power2.out'},.3);
  lpOpen.fromTo('.lst_line',1.5,{y:'100%'},{y:'0%',stagger:.06,ease:'power2.out',onStart:function(){gsap.set('.layout-switch',{visibility:'visible'})}},.4);
  lpOpen.fromTo('.ls-glass',.9,{y:60,opacity:0},{y:0,opacity:1,ease:'power2.out'},.55);
  lpOpen.fromTo('.lph-headline .lsa_char',1.5,{y:'100%'},{y:'0%',stagger:.04,ease:'power2.out'},.5);
  lpOpen.fromTo('.lph-image-3',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.5);
  lpOpen.fromTo('.lph-image-2, .lph-image-4',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.8);
  lpOpen.fromTo('.lph-image-1, .lph-image-5',1.5,{y:'100%'},{y:'25%',ease:'power3.out'},1.1);
  lpOpen.fromTo('.hero-cta',1,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},1.2);
}

function demoPageOpen(){
  var dpOpen=gsap.timeline({onStart:function(){gsap.set('#page',{visibility:'visible'});gsap.set('.landing-menu',{visibility:'visible'});gsap.set('.logo-text',{y:'0%'});}});
  dpOpen.fromTo('.logo-text',1,{y:'100%'},{y:'0%',ease:'power2.out'},0);
  dpOpen.fromTo('.landing-menu a',1,{y:'100%'},{y:'0%',stagger:0.08,ease:'power2.out'},.2);
  dpOpen.fromTo('.lph-headline',1.5,{top:'45%',opacity:0},{top:'40%',opacity:1,ease:'power2.out'},.1);
  dpOpen.fromTo('.lph-headline .lsa_char',1.5,{y:'100%'},{y:'0%',stagger:0.02,ease:'power2.out'},.25);
  dpOpen.fromTo('.lph-description',1,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},.6);
  dpOpen.fromTo('.lph-image-3',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.5);
  dpOpen.fromTo('.lph-image-2, .lph-image-4',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.8);
  dpOpen.fromTo('.lph-image-1, .lph-image-5',1.5,{y:'100%'},{y:'25%',ease:'power3.out'},1.1);
  dpOpen.fromTo('.hero-cta',1,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},1.2);
  dpOpen.fromTo('.lph-layout-switch',1.5,{scale:0},{scale:1,ease:'power2.inOut'},.7);
}

function landingPageHead(){
  $('.lph-headline-wrap').each(function(){
    var $this=$(this);
    var $h1=$this.find('h1.big-title').first();
    var html=$h1.length ? $h1.html() : $this.html();
    html=html.replace(/<br\s*\/?>/gi,'\u2028');
    var lines=html.split('\u2028');
    var out='';
    $.each(lines,function(i,line){
      out+='<span class="lst_line">'+line.replace(/\S/g,'<span class="lsa_char">$&</span>')+'</span>';
    });
    if($h1.length){ $h1.html(out); }
    else{ $this.html(out); }
  });
}

function lphImages(){
  $('.lph-images').each(function(){
    var $this=$(this);
    $this.find('.lph-image').each(function(){
      var $image=$(this),img=$image.find('img'),imgSrc=img.attr('src');
      if(imgSrc){
        var imgClone=img.clone();
        $image.append(imgClone);
        img.remove();
      }
    });
  });
}

function aliothImageCarousel(){
  $('.alioth-image-carousel').each(function(){
    let $this=$(this),navigate=$this.data('navigate'),wrapper=$this.children('.ai-wrapper'),xVal=wrapper.outerWidth()-$(window).outerWidth();
    if(navigate==='scroll'){
      gsap.to(wrapper,{x:-xVal,scrollTrigger:{trigger:$this,scrub:1.2,start:'center center',end:'bottom+=2000 top',markers:false,pin:true}});
    } else if(navigate==='drag'){
      Draggable.create(wrapper,{type:"x",duration:1,bounds:$this,edgeResistance:0.75,throwProps:true,inertia:true,onDrag:function(){}});
    }
  });
}

function aliothPageNav(){
  $('.alioth-page-nav').each(function(){
    let $this=$(this),title=$this.find('.page-title'),text=title.text();
    title.append('&nbsp;'+text+'&nbsp;');
  });
}

function aliothScrollAnimations(){
  var hasAnim=$('.has-anim');
  hasAnim.each(function(){
    var $this=$(this),anim=$this.data('animation'),delay=$this.data('delay'),stagger=$this.data('stagger'),duration=$this.data('duration');
    if((anim==='linesUp')||(anim==='linesDown')||(anim==='linesFadeUp')||(anim==='linesFadeDown')||(anim==='linesFadeLeft')||(anim==='linesFadeRight')||(anim==='linesFade')||(anim==='linesUpLeft')||(anim==='linesUpRight')||(anim==='linesDownLeft')||(anim==='linesDownRight')){var splitType='lines';}
    else if((anim==='wordsFadeUp')||(anim==='wordsFadeDown')||(anim==='wordsFadeLeft')||(anim==='wordsFadeRight')||(anim==='wordsUp')||(anim==='wordsDown')||(anim==='wordsLeft')||(anim==='wordsRight')){var splitType='words';}
    else if((anim==='charsFadeUp')||(anim==='charsFadeDown')||(anim==='charsFadeRight')||(anim==='charsFadeLeft')||(anim==='charsUp')||(anim==='charsDown')||(anim==='charsLeft')||(anim==='charsRight')){var splitType='lines,chars';}
    else{var splitType='chars';}
    if(typeof SplitText === 'undefined'){ return; }
    var split=new SplitText($this[0],{type:splitType});
    var types=splitType.split(',');
    var targets=[];
    $.each(types,function(i,t){ if(split[t]) targets=targets.concat(split[t]); });
    gsap.fromTo(targets,{y:'100%',opacity:0},{y:'0%',opacity:1,duration:duration,delay:delay,stagger:stagger,ease:'power2.out',onComplete:function(){split.revert();}});
  });
}

function aliothHeading(){
  $('.alioth-heading').each(function(){
    let $this=$(this),parallax=$this.data('parallax'),image=$this.data('image'),bgText=$this.data('background-text'),img=$this.children('.ah-image'),title=$this.children('.ah-title');
    if(parallax==true){$this.addClass('will_anim');}
    if(image==true){
      if(img.length===0){img=$('<div class="ah-image"></div>');$this.prepend(img);}
      img.css({'background-image':'url('+bgText+')','background-size':'cover','background-position':'center'});
      $this.append(title);
    }else{
      if(title.length===0){title=$('<div class="ah-title"></div>');$this.append(title);}
      title.text(bgText);
      if(parallax==true){
        gsap.to(title,{y:-80,scrollTrigger:{trigger:$this,start:'top bottom',end:'bottom top',scrub:1.5}});
      }
    }
  });
}

function landingPageHolders(){
  $('.landing-page-hold').each(function(){
    let $this=$(this);
    $this.find('a').each(function(){
      let $a=$(this);
      if($a.attr('href')!==undefined && $a.attr('href')!=='#'){ $a.attr('data-hover',''); }
    });
  });
}

/* ===== Forms ===== */
function initForms(){
  $('.contact-form').on('submit',function(e){
    e.preventDefault();
    var $form=$(this);
    var $btn=$form.find('button[type="submit"]');
    var label=$btn.data('label') || $btn.text();
    $btn.data('label',label);
    $btn.prop('disabled',true).text('Thank you! We will respond within 24 hours.');
    setTimeout(function(){
      $form[0].reset();
      $btn.prop('disabled',false).text($btn.data('label'));
    },4000);
  });
}

/* ===== Scroll to hash (smooth, locomotive) ===== */
function scrollToHash(){
  if(window.location.hash){
    var target=$(window.location.hash);
    if(target.length){
      setTimeout(function(){
        if(locoScroll && typeof locoScroll.scrollTo === 'function'){ locoScroll.scrollTo(target[0],{offset:0,duration:900}); }
        else{ $('html,body').animate({scrollTop:target.offset().top},800); }
      },350);
    }
  }
}

/* ===== Barba Transitions ===== */
barba.init({debug:true,transitions:[
  {name:'main-dark',from:{namespace:['demo-main']},to:{namespace:['demo-dark']},
   leave(){return new Promise(function(resolve,reject){let mainOut=gsap.timeline({onComplete:function(){resolve();}});mainOut.fromTo('.lph-overlay',1,{height:'0%'},{height:'100%',ease:'power3.inOut'},0);
     mainOut.fromTo('.lph-image-3',1,{y:'0%'},{y:'100%',ease:'power3.in'},.2);});},
   enter(){return new Promise(function(resolve,reject){let demoIn=gsap.timeline({onStart:function(){resolve();gsap.set('#page',{visibility:'visible'});gsap.set('.landing-menu',{visibility:'visible'});}});
     demoIn.fromTo('.logo-text',1,{y:'100%'},{y:'0%',ease:'power2.out'},0);
     demoIn.fromTo('.landing-menu a',1,{y:'100%'},{y:'0%',stagger:0.08,ease:'power2.out'},.2);
     demoIn.fromTo('.lph-headline',1.5,{top:'45%',opacity:0},{top:'40%',opacity:1,ease:'power2.out'},.1);
     demoIn.fromTo('.lph-headline .lsa_char',1.5,{y:'100%'},{y:'0%',stagger:0.02,ease:'power2.out'},.25);
     demoIn.fromTo('.lph-description',1,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},.6);
     demoIn.fromTo('.lph-image-3',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.5);
     demoIn.fromTo('.lph-image-2, .lph-image-4',1.5,{y:'100%'},{y:'0%',ease:'power3.out'},.8);
     demoIn.fromTo('.lph-image-1, .lph-image-5',1.5,{y:'100%'},{y:'25%',ease:'power3.out'},1.1);
     demoIn.fromTo('.hero-cta',1,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},1.2);
     demoIn.fromTo('.lph-layout-switch',1.5,{scale:0},{scale:1,ease:'power2.inOut'},.7);});},
  },
  {name:'dark-main',from:{namespace:['demo-dark']},to:{namespace:['demo-main']},
   leave(){return new Promise(function(resolve,reject){let backOut=gsap.timeline({onStart:function(){gsap.set('.lph-overlay',{zIndex:5,background:'#ebebeb'});$('.landing-header').removeClass('dark');},onComplete:function(){resolve();}});
     backOut.to(window,.7,{scrollTo:0,ease:'power3.inOut'},0);
     backOut.fromTo('.lph-overlay',1,{height:'0%'},{height:'100%',ease:'power3.inOut'},0);});},
   enter(){return new Promise(function(resolve,reject){gsap.set('#page',{visibility:'visible'});landingPageOpen();resolve();});},
  },
  {name:'dark-dark',from:{namespace:['demo-dark']},to:{namespace:['demo-dark']},
   leave(){return new Promise(function(resolve,reject){let ddOut=gsap.timeline({onComplete:function(){resolve();}});ddOut.fromTo('.lph-overlay',.8,{height:'0%'},{height:'100%',ease:'power3.inOut'},0);});},
   enter(){return new Promise(function(resolve,reject){let ddIn=gsap.timeline({onStart:function(){resolve();gsap.set('#page',{visibility:'visible'});gsap.set('.landing-menu',{visibility:'visible'});}});
     ddIn.fromTo('.logo-text',1,{y:'100%'},{y:'0%',ease:'power2.out'},0);
     ddIn.fromTo('.landing-menu a',1,{y:'100%'},{y:'0%',stagger:0.08,ease:'power2.out'},.2);
     ddIn.fromTo('.lph-headline',1.3,{top:'45%',opacity:0},{top:'40%',opacity:1,ease:'power2.out'},.1);
     ddIn.fromTo('.lph-headline .lsa_char',1.3,{y:'100%'},{y:'0%',stagger:0.02,ease:'power2.out'},.25);
     ddIn.fromTo('.lph-description',.8,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},.5);
     ddIn.fromTo('.lph-image-3',1.3,{y:'100%'},{y:'0%',ease:'power3.out'},.4);
     ddIn.fromTo('.lph-image-2, .lph-image-4',1.3,{y:'100%'},{y:'0%',ease:'power3.out'},.7);
     ddIn.fromTo('.lph-image-1, .lph-image-5',1.3,{y:'100%'},{y:'25%',ease:'power3.out'},1);
     ddIn.fromTo('.hero-cta',.8,{y:30,opacity:0},{y:0,opacity:1,ease:'power2.out'},1.1);
     ddIn.fromTo('.lph-layout-switch',1.3,{scale:0},{scale:1,ease:'power2.inOut'},.5);});},
  },
]});

barba.hooks.after((data)=>{aliothScrollAnimations();ScrollTrigger.refresh();ScrollTrigger.update();initLocomotiveScroll();initForms();scrollToHash();cursorHovers();});


/* ===== Hero CTA Dropdown ===== */
$(document).on('click','.hero-dropdown-toggle',function(e){
  e.preventDefault();
  e.stopPropagation();
  var $dd=$(this).closest('.hero-dropdown');
  $dd.toggleClass('open');
  $(this).attr('aria-expanded',$dd.hasClass('open')?'true':'false');
});
$(document).on('click','.hero-dropdown-menu a',function(){
  var $dd=$(this).closest('.hero-dropdown');
  $dd.removeClass('open');
  $dd.find('.hero-dropdown-toggle').attr('aria-expanded','false');
});
$(document).on('click',function(e){
  if(!$(e.target).closest('.hero-dropdown').length){
    $('.hero-dropdown.open').removeClass('open').find('.hero-dropdown-toggle').attr('aria-expanded','false');
  }
});
$(document).on('keydown',function(e){
  if(e.key==='Escape'){
    $('.hero-dropdown.open').removeClass('open').find('.hero-dropdown-toggle').attr('aria-expanded','false');
  }
});

/* ===== Smooth in-page anchor scrolling (locomotive) ===== */
$(document).on('click','a[href^="#"]',function(e){
  var hash=this.hash;
  if(hash && hash.length>1 && $(hash).length){
    e.preventDefault();
    if(locoScroll && typeof locoScroll.scrollTo==='function'){ locoScroll.scrollTo($(hash)[0],{offset:0,duration:900}); }
    else{ $('html,body').animate({scrollTop:$(hash).offset().top},800); }
  }
});
/* ===== First page load ===== */
$(window).on('load',function(){
  lphImages();
  landingPageHead();
  aliothImageCarousel();
  aliothPageNav();
  aliothScrollAnimations();
  aliothHeading();
  landingPageHolders();
  initForms();
  setInitialStates();
  initCursor();
  cursorHovers();
  var loader=$('.alioth-page-loader');
  if(loader.length && loader.is(':visible')){
    initSplash(loader);
  }else{
    loader.hide();
    gsap.set('#page',{visibility:'visible'});
    if($('#page').hasClass('landing-main')){ landingPageOpen(); }
    else { demoPageOpen(); }
    initLocomotiveScroll();
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }
});}(jQuery));
