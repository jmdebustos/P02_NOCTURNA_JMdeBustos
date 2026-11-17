

(function($){'use strict';$(function(){
const $menu=$('#nav'),$toggle=$('.menu-toggle');function closeMenu(){$menu.removeClass('is-open');$toggle.attr('aria-expanded','false');$('body').removeClass('no-scroll');}
$toggle.on('click',function(){const open=!$menu.hasClass('is-open');$menu.toggleClass('is-open',open);$toggle.attr('aria-expanded',String(open));$('body').toggleClass('no-scroll',open);});$menu.find('a').on('click',closeMenu);$(window).on('resize',function(){if(innerWidth>700)closeMenu()});
const $header=$('.header');
function syncHeaderState(){ $header.toggleClass('is-scrolled', window.scrollY > 16); }
syncHeaderState();
$(window).on('scroll', syncHeaderState);

function findPhotoData(key) {
    const card = document.querySelector('[data-work="' + key + '"]');
    const photo = card ? card.querySelector('img') : null;
    return photo ? photo.src : '';
}

const work={'ornamental-mano':['ORNAMENTAL FINELINE','ORNAMENTAL','Fotografía de tatuaje de la colección de NOCTURNA.'],'blackwork-mano':['BLACKWORK EN MANO','BLACKWORK','Fotografía de tatuaje de la colección de NOCTURNA.'],'leopardo':['LEOPARDO','BLACKWORK','Fotografía de tatuaje de la colección de NOCTURNA.'],'kiss-me':['KISS ME','LETTERING','Fotografía de tatuaje de la colección de NOCTURNA.'],'manga-roja':['MANGA DE AUTOR','BLACK & RED','Fotografía de tatuaje de la colección de NOCTURNA.'],'rostro':['ROSTRO Y BOTÁNICA','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.'],'espalda':['ESPALDA ORNAMENTAL','ORNAMENTAL','Fotografía de tatuaje de la colección de NOCTURNA.'],'lettering-pecho':['LETTERING EN PECHO','LETTERING','Fotografía de tatuaje de la colección de NOCTURNA.'],'hombro':['HOMBRO BLACKWORK','BLACKWORK','Fotografía de tatuaje de la colección de NOCTURNA.'],'espaldas-editorial':['ESPALDAS ORNAMENTALES','ORNAMENTAL','Fotografía de tatuaje de la colección de NOCTURNA.'],'espalda-angel':['ÁNGEL Y CARTOGRAFÍA','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.'],'espalda-barroca':['ESPALDA BARROCA','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.'],'rostro-clasico':['ROSTRO CLÁSICO','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.'],'angel-hombro':['ÁNGEL EN HOMBRO','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.'],'alas-espalda':['ALAS Y BARROCO','REALISMO','Fotografía de tatuaje de la colección de NOCTURNA.']};const $modal=$('#art-modal');let before;
function closeModal(){if(!$modal.hasClass('is-open'))return;$modal.removeClass('is-open').attr('aria-hidden','true');$('body').removeClass('no-scroll');if(before)$(before).trigger('focus')}
$('[data-close], .modal-text a[href="#cita"]').on('click',closeModal);$(document).on('keydown',function(e){if(e.key==='Escape'){closeModal();closeMenu()}});
$('.faq-question').on('click',function(){const $b=$(this),$a=$('#'+$b.attr('aria-controls'));const open=$b.attr('aria-expanded')==='true';$('.faq-question').attr('aria-expanded','false').find('span').text('+');$('.faq-answer').slideUp(200);if(!open){$a.prop('hidden',false).hide().slideDown(200);$b.attr('aria-expanded','true').find('span').text('−')}});

const $cards=$('.work-card');const original=$cards.toArray();const $grid=$cards.parent();
let selectedFilter='all', searchText='', sortMode='original';
const favoriteKey='nocturna-favoritos-v1';let favorites=[];
try{const saved=JSON.parse(localStorage.getItem(favoriteKey)||'[]');if(Array.isArray(saved))favorites=saved.filter(k=>Object.prototype.hasOwnProperty.call(work,k));}catch(err){favorites=[];}
function saveFavorites(){try{localStorage.setItem(favoriteKey,JSON.stringify(favorites));}catch(err){}}
function syncFavoriteButtons(){ $('[data-favorite]').each(function(){const yes=favorites.includes($(this).data('favorite'));$(this).attr('aria-pressed',String(yes)).text(yes?'♥ GUARDADO':'♡ GUARDAR');});const active=work[modalKey]&&favorites.includes(modalKey);$('#modal-favorite').text(active?'♥ GUARDADO':'♡ GUARDAR');}
function renderGallery(){if(!$cards.length)return;const ordered=original.slice();if(sortMode!=='original')ordered.sort((a,b)=>{const an=$(a).find('h3').text(),bn=$(b).find('h3').text();return (sortMode==='az'?1:-1)*an.localeCompare(bn,'es')});ordered.forEach(el=>$grid.append(el));let visible=0;
$cards.each(function(){const $c=$(this),key=$c.find('[data-work]').data('work'),w=work[key],haystack=(w.join(' ')+' '+$c.data('category')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const category=selectedFilter==='all'||(selectedFilter==='favorites'?favorites.includes(key):$c.data('category')===selectedFilter);const show=category&&haystack.includes(searchText);this.hidden=!show;if(show)visible++;});
$('.empty').prop('hidden',visible!==0);if(window.AOS)AOS.refresh();}
$('.filter-btn').on('click',function(){selectedFilter=$(this).data('filter');$('.filter-btn').removeClass('is-active').attr('aria-pressed','false');$(this).addClass('is-active').attr('aria-pressed','true');renderGallery();});
$('#work-search').on('input',function(){searchText=this.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();renderGallery()});
$('#work-sort').on('change',function(){sortMode=this.value;renderGallery()});
$('#clear-gallery').on('click',function(){selectedFilter='all';searchText='';sortMode='original';$('#work-search').val('');$('#work-sort').val('original');$('.filter-btn').removeClass('is-active').attr('aria-pressed','false').filter('[data-filter="all"]').addClass('is-active').attr('aria-pressed','true');renderGallery()});
let modalKey=null;
function visibleKeys(){return $cards.filter(function(){return !this.hidden}).map(function(){return $(this).find('[data-work]').data('work')}).get();}
function showWork(key){const w=work[key];if(!w)return;modalKey=key;$('#modal-img').attr({src:findPhotoData(key),alt:'Fotografía completa de '+w[0]});$('#modal-name').text(w[0]);$('#modal-style').text(w[1]);$('#modal-description').text(w[2]);const keys=visibleKeys().length?visibleKeys():Object.keys(work);$('#modal-position').text((keys.indexOf(key)+1)+' / '+keys.length+' trabajos');syncFavoriteButtons();}

$('.quick-view').on('click',function(){before=this;showWork($(this).data('work'));$modal.addClass('is-open').attr('aria-hidden','false');$('body').addClass('no-scroll');$('.modal-close').trigger('focus');});
function nextWork(delta){const keys=visibleKeys().length?visibleKeys():Object.keys(work),idx=keys.indexOf(modalKey);if(!keys.length)return;showWork(keys[(idx+delta+keys.length)%keys.length]);}
$('#modal-prev').on('click',()=>nextWork(-1));$('#modal-next').on('click',()=>nextWork(1));
function toggleFavorite(key){if(!work[key])return;favorites=favorites.includes(key)?favorites.filter(x=>x!==key):[...favorites,key];saveFavorites();syncFavoriteButtons();renderGallery();}
$(document).on('click','[data-favorite]',function(){toggleFavorite($(this).data('favorite'));});$('#modal-favorite').on('click',function(){toggleFavorite(modalKey);});
$(document).on('keydown',function(e){if(!$modal.hasClass('is-open'))return;if(e.key==='ArrowLeft'){e.preventDefault();nextWork(-1)}if(e.key==='ArrowRight'){e.preventDefault();nextWork(1)}if(e.key==='Tab'){const $focus=$modal.find('button,a[href]').filter(':visible');const first=$focus[0],last=$focus[$focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
syncFavoriteButtons();renderGallery();

if(window.AOS)AOS.init({once:true,duration:650,offset:70,disable:window.matchMedia('(prefers-reduced-motion: reduce)').matches});if(window.Typed&&document.querySelector('#typed-word')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)new Typed('#typed-word',{strings:['Tu piel. Tu historia.','Cada línea importa.','Arte que permanece.'],typeSpeed:43,backSpeed:24,backDelay:1400,loop:true,showCursor:false});
});})(jQuery);


(function($){'use strict';$(function(){
  const $carousel = $('#studio-carousel');
  if (!$carousel.length) return;
  const $slides = $carousel.find('.studio-slide');
  const $thumbs = $carousel.find('.studio-thumb');
  const $prev = $carousel.find('.studio-carousel-btn.prev');
  const $next = $carousel.find('.studio-carousel-btn.next');
  const $current = $carousel.find('[data-current]');
  const $total = $carousel.find('[data-total]');
  const $progress = $carousel.find('[data-progress]');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;
  const delay = 5200;
  $total.text(String($slides.length).padStart(2,'0'));

  function render(newIndex){
    const target = (newIndex + $slides.length) % $slides.length;
    const $incoming = $slides.eq(target);
    const $outgoing = $slides.eq(index);
    if (target !== index) {
      $outgoing.stop(true,true).fadeOut(reduceMotion ? 0 : 190, function(){
        $outgoing.removeClass('is-active').attr('aria-hidden','true').prop('hidden',true);
      });
      $incoming.stop(true,true).prop('hidden',false).hide().addClass('is-active').attr('aria-hidden','false').fadeIn(reduceMotion ? 0 : 390);
    } else {
      $incoming.stop(true,true).prop('hidden',false).show().addClass('is-active').attr('aria-hidden','false');
    }
    index = target;
    $thumbs.removeClass('is-active').attr('aria-pressed','false').eq(index).addClass('is-active').attr('aria-pressed','true');
    $current.text(String(index + 1).padStart(2,'0'));
    $progress.css('width', (((index + 1) / $slides.length) * 100) + '%');
  }

  function next(){ render(index + 1); }
  function prev(){ render(index - 1); }
  function stopAuto(){ if (timer) { clearInterval(timer); timer = null; } }
  function startAuto(){
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(next, delay);
  }

  $prev.on('click', function(){ prev(); startAuto(); });
  $next.on('click', function(){ next(); startAuto(); });
  $thumbs.on('click', function(){ render(Number($(this).data('slide')) || 0); startAuto(); });
  $carousel.on('mouseenter focusin', stopAuto).on('mouseleave focusout', startAuto);
  $(document).on('keydown', function(event){
    if (!$carousel.is(':visible') || !($carousel[0].contains(document.activeElement))) return;
    if (event.key === 'ArrowLeft') { prev(); startAuto(); }
    if (event.key === 'ArrowRight') { next(); startAuto(); }
  });
  render(0);
  startAuto();
});})(jQuery);
