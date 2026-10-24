// Pylon Collective — Main Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Works Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 2. Video Modal Player
  const modalOverlay = document.getElementById('videoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalVideoFrame = document.getElementById('modalVideoFrame');
  const modalTitle = document.getElementById('modalTitle');
  const modalCredits = document.getElementById('modalCredits');

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.work-title').innerText;
      const credits = card.querySelector('.work-credits').innerHTML;
      const videoSrc = card.getAttribute('data-video');

      modalTitle.innerText = title;
      modalCredits.innerHTML = credits;

      if (videoSrc) {
        if (videoSrc.includes('vimeo') || videoSrc.includes('youtube')) {
          modalVideoFrame.innerHTML = `<iframe src="${videoSrc}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
        } else {
          modalVideoFrame.innerHTML = `<video src="${videoSrc}" controls autoplay playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
        }
      } else {
        // Fallback reel demo
        modalVideoFrame.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-family:'Space Grotesk';">
            <div style="text-align:center;">
              <div style="font-size:2rem;margin-bottom:8px;">🎬</div>
              <p>Private Screen Link / Full Cut Available Upon Request</p>
            </div>
          </div>`;
      }

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    modalVideoFrame.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // 3. Client Inquiry Form Handling
  const inquiryForm = document.getElementById('inquiryForm');
  const formSuccessMsg = document.getElementById('formSuccessMsg');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(inquiryForm);
      const data = Object.fromEntries(formData.entries());

      console.log('Pylon Project Inquiry Received:', data);

      inquiryForm.style.display = 'none';
      if (formSuccessMsg) {
        formSuccessMsg.style.display = 'block';
      }
    });
  }

  // 4. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.style.display === 'flex';
      mainNav.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        mainNav.style.flexDirection = 'column';
        mainNav.style.position = 'absolute';
        mainNav.style.top = '80px';
        mainNav.style.left = '0';
        mainNav.style.right = '0';
        mainNav.style.background = '#0d0e13';
        mainNav.style.padding = '24px';
        mainNav.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
      }
    });
  }
});
