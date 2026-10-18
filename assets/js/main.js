/* Progressive enhancements. Portfolio content remains readable without JS. */
(() => {
  'use strict';
  const header = document.getElementById('site-header');
  const menu = document.getElementById('mobile-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const imageDialog = document.getElementById('image-dialog');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 25);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
  menuToggle.addEventListener('click', () => {
    menu.showModal();
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => {
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
  for (const dialog of [menu, imageDialog]) {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  }
  function openAnchor(hash, scroll = false) {
    if (!hash || hash === '#') return null;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return null; }
    const target = document.getElementById(id);
    if (!target) return null;
    let ancestor = target;
    while (ancestor) {
      if (ancestor.tagName === 'DETAILS') ancestor.open = true;
      ancestor = ancestor.parentElement;
    }
    if (scroll) requestAnimationFrame(() => target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' }));
    return target;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute('href');
    const target = openAnchor(hash);
    if (!target) return;
    event.preventDefault();
    if (menu.open) menu.close();
    if (window.location.hash !== hash) history.pushState(null, '', hash);
    openAnchor(hash, true);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', () => openAnchor(location.hash, true));
  window.addEventListener('popstate', () => openAnchor(location.hash || '#home', true));
  openAnchor(location.hash, Boolean(location.hash));
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  const tabList = document.querySelector('[role="tablist"]');
  const mobileWidth = window.matchMedia('(max-width: 700px)');
  const orientTabs = () => tabList.setAttribute('aria-orientation', mobileWidth.matches ? 'horizontal' : 'vertical');
  mobileWidth.addEventListener('change', () => {
    orientTabs();
    if (!mobileWidth.matches && menu.open) menu.close();
  });
  orientTabs();
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-lightbox], a.film__box');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const thumbnail = link.querySelector('img');
    const image = imageDialog.querySelector('img');
    image.src = link.href;
    image.alt = thumbnail?.alt || 'Full-size research figure';
    imageDialog.querySelector('p').textContent = image.alt;
    imageDialog.showModal();
    document.body.classList.add('image-open');
  });
  imageDialog.addEventListener('close', () => document.body.classList.remove('image-open'));
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    for (const id of ['home', 'about', 'experience', 'research', 'projects', 'background', 'contact']) observer.observe(document.getElementById(id));
  }
  for (const video of document.querySelectorAll('video')) {
    video.addEventListener('play', () => {
      for (const other of document.querySelectorAll('video')) if (other !== video) other.pause();
    });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
