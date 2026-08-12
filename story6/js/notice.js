(() => {
  const notice = document.querySelector('.screen-size-notice');
  const closeButton = notice?.querySelector('.screen-size-notice__close');

  closeButton?.addEventListener('click', () => {
    notice.hidden = true;
    document.dispatchEvent(new CustomEvent('story6:screen-size-notice-dismissed'));
  });
})();
