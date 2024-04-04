(function ($) {
	"use strict";

  //========== PRELOADER ==========>
	$(window).on('load', function (event) {
		$('.preloader').delay(500).fadeOut(500);
	});
  //========== PRELOADER// ==========>
  

  //========== APPLY LERGESTES HEIGHT// ==========>
  window.addEventListener('load',()=>{
		applyLergestheight(document.querySelectorAll('.product-item'))
		applyLergestheight(document.querySelectorAll('.benefit-item'))
		featureApplyLergestheight(document.querySelectorAll('.feature-item'))
})
window.addEventListener('resize',()=>{
	applyLergestheight(document.querySelectorAll('.product-item'))
	applyLergestheight(document.querySelectorAll('.benefit-item'))
	featureApplyLergestheight(document.querySelectorAll('.feature-item'))
})
function applyLergestheight(items) {
	let itemheight = []
	items.forEach(item => {
		item.style.height = 'auto'
		itemheight.push(item.getBoundingClientRect().height)
	});
	items.forEach(item => {
		item.style.height = Math.max.apply(null, itemheight) + 'px'
	});
}

function featureApplyLergestheight(items) {
	if (!window.matchMedia("(max-width: 768px)").matches) {
		items.forEach((item, index) => {
			if (index % 2 == 0) {
				let itemheight = []
				item.style.height = 'auto'
				items[index + 1].style.height = 'auto'
				itemheight.push(item.getBoundingClientRect().height)
				itemheight.push(items[index + 1].getBoundingClientRect().height)
				item.style.height = Math.max.apply(null, itemheight) + 'px'
				items[index + 1].style.height = Math.max.apply(null, itemheight) + 'px'
			}
		});
	 } 
}
//========== APPLY LERGESTES HEIGHT// ==========>

//========== FAQ ==========>
	const faqWrap = document.querySelectorAll('.faq-box-wrap')
	faqWrap.forEach(wrap => {
		let faqBox = wrap.querySelectorAll('.faq-box')
		faqBox.forEach(bx => {
			let title = bx.querySelector('.faq-box-title')
			let body = bx.querySelector('.faq-box-body')
			if (bx.classList.contains('active')) {
				body.style.maxHeight = body.scrollHeight + 'px'
			}
			title.addEventListener('click', ()=>{
				if (bx.classList.contains('active')) {
					bx.classList.remove('active')
					body.style.maxHeight = null;
				}else{
					for (let i = 0; i < faqBox.length; i++) {
						faqBox[i].classList.remove('active')
						faqBox[i].querySelector('.faq-box-body').style.maxHeight = null;
					}
					bx.classList.add('active')
					body.style.maxHeight = body.scrollHeight + 'px';
				}
			})
		});
	});


	const dashboard = document.querySelectorAll('.dashboard-content')
	dashboard.forEach(wrap => {
		let faqBox = wrap.querySelectorAll('.dropdown-box')
		faqBox.forEach(bx => {
			let title = bx.querySelector('.dropdown-title')
			let body = bx.querySelector('.dropdown-content')
			if (bx.classList.contains('active')) {
				body.style.maxHeight = body.scrollHeight + 'px'
			}
			title.addEventListener('click', ()=>{
				if (bx.classList.contains('active')) {
					bx.classList.remove('active')
					body.style.maxHeight = null;
				}else{
					for (let i = 0; i < faqBox.length; i++) {
						faqBox[i].classList.remove('active')
						faqBox[i].querySelector('.dropdown-content').style.maxHeight = null;
					}
					bx.classList.add('active')
					body.style.maxHeight = body.scrollHeight + 'px';
				}
			})
		});
	});
//========== FAQ// ==========>

//========== MAINMENU ==========>
    /* SLIDE UP */
    let slideUp = (target, duration = 300) => {

		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.boxSizing = 'border-box';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout( () => {
				target.style.display = 'none';
				target.style.removeProperty('height');
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				//alert("!");
		}, duration);
  }

  /* SLIDE DOWN */
  let slideDown = (target, duration = 300) => {

		target.style.removeProperty('display');
		let display = window.getComputedStyle(target).display;
		if (display === 'none') display = 'block';
		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout( () => {
		  target.style.removeProperty('height');
		  target.style.removeProperty('overflow');
		  target.style.removeProperty('transition-duration');
		  target.style.removeProperty('transition-property');
		}, duration);
  }

  /* TOOGLE */
  var slideToggle = (target, duration = 300) => {
		if (window.getComputedStyle(target).display === 'none') {
		  return slideDown(target, duration);
		} else {
		  return slideUp(target, duration);
		}
  }

// manu active
const mainMenu = document.querySelectorAll('.mainmenu > ul > li')
mainMenu.forEach(menu => {		
	let submenu = menu.querySelector('.submenu')
	
	if (menu.contains(submenu)) {
		menu.classList.add('has-child');
		let btn = document.createElement('BUTTON');
		btn.classList.add('menu-icon', 'fa-regular', 'fa-angle-down')
		menu.appendChild(btn);
		let mainMenuIcon = menu.querySelector('.menu-icon')

		mainMenuIcon.addEventListener('click', ()=>{
			slideToggle(submenu)
		})
	}
});

let megaTrigger = document.querySelectorAll('.mega-trigger li')
let megaLinkTab = document.querySelectorAll('.mega-link-tab')

if (window.matchMedia("(max-width: 767px)").matches) {
	megaTrigger.forEach((trigger, index) => {
		trigger.appendChild(megaLinkTab[index])
	});
}

let humberger = document.querySelectorAll('.humberger-bar')
humberger.forEach(trigger => {
	let mainMenuWrap = document.querySelector('.mainmenu')
	trigger.addEventListener('click', ()=>{
		mainMenuWrap.classList.toggle('active')
		trigger.classList.toggle('active')
	})
});


//========== MAINMENU// ==========>


//========== CUSTOM TAB// ==========>
tabFunc(document.querySelectorAll('.membership-list li'), document.querySelectorAll('.membership-tab'))

function tabFunc(tabLinks, tabs) {
  tabLinks.forEach((link, index) => {
    link.addEventListener('click', ()=>{
      for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active')
        tabs[i].classList.remove('active')
      }
      link.classList.add('active')
      tabs[index].classList.add('active')
    })
  });
}
//========== CUSTOM TAB ==========>

  //========== STICKY HEADER, BACK TO TOP ==========>	
	const headerArea = document.querySelectorAll('.header-area')
	headerArea.forEach(area => { 
		let height;
		let scrollUp = document.querySelector('.scroll-up')
		window.addEventListener('resize', ()=>{addHeaderHeight()})
		window.addEventListener('load', ()=>{addHeaderHeight()})
		function addHeaderHeight() {
			height = area.clientHeight
			document.documentElement.style.setProperty('--header-h', height + 'px')
		}
		window.addEventListener('scroll', ()=>{
			if (window.scrollY > height) {
					area.classList.add('sticky')
					scrollUp.classList.add('sticky')
			}else{
					area.classList.remove('sticky')
					scrollUp.classList.remove('sticky')
			}
		})
		scrollUp.addEventListener('click', ()=>{        
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
		})
	});
  //========== STICKY HEADER, BACK TO TOP// ==========>

  //========== MAGNIFIC POPUP ==========>
	$('.video-btn').magnificPopup({
		type: 'iframe'
	});
	$('.pop-img-btn').magnificPopup({
		type: 'image'
	});
	$('.gallery-item a').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true,
		}
	});
  //========== MAGNIFIC POPUP// ==========>
  
  //========== AOS POPUP ==========>  
  AOS.init({
	once: true,
	duration: 700
  });
  //========== AOS POPUP ==========>

//   niceSelect
  $('select').niceSelect();
 

// FOLLOW MOUSE POITER CIRCLE ==========>
// document.addEventListener('DOMContentLoaded', () => {
// 	let mousePosX = 0,
// 		 mousePosY = 0,
// 		 mouseCircle = document.getElementById('mouse-circle');

// 	document.onmousemove = (e) => {
// 		 mousePosX = e.clientX;
// 		 mousePosY = e.clientY;
// 	}
// 	window.onmouseover = (e) => {
// 	  mouseCircle.classList.add('entered')
// 	  if (e.target.closest('a, button, input, .nice-select')) {
// 		 mouseCircle.classList.add('entered-sm')
// 	  }
// 	}
// 	window.onmouseout = (e) => {
// 	  mouseCircle.classList.remove('entered')
// 	  if (!e.target.closest('a, button, input, .nice-select')) {
// 		 mouseCircle.classList.remove('entered-sm')
// 	  }
// 	}

// 	let delay = 1,
// 		 revisedMousePosX = 0,
// 		 revisedMousePosY = 0;


// 	function delayMouseFollow() {
// 		 requestAnimationFrame(delayMouseFollow);

// 		 revisedMousePosX += (mousePosX - revisedMousePosX) / delay;
// 		 revisedMousePosY += (mousePosY - revisedMousePosY) / delay; 

// 		 mouseCircle.style.left = revisedMousePosX + 'px';
// 		 mouseCircle.style.top = revisedMousePosY + 'px';
// 	}
// 	delayMouseFollow();
// });







})(jQuery);