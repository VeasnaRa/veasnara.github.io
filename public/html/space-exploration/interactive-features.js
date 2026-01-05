// Interactive features for Mars Journey post

console.log('🚀 Mars Journey interactive features loaded!');

// Add click counter to stats
document.addEventListener('DOMContentLoaded', () => {
  const statCards = document.querySelectorAll('.stat-card');

  statCards.forEach((card, index) => {
    let clickCount = 0;

    card.addEventListener('click', () => {
      clickCount++;
      card.style.transform = 'scale(1.05)';

      setTimeout(() => {
        card.style.transform = 'scale(1)';
      }, 200);

      // Add a little easter egg
      if (clickCount === 5) {
        const message = document.createElement('div');
        message.textContent = '🌟 You discovered a secret! Mars facts are amazing!';
        message.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 1000;
          animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
          message.style.animation = 'slideOutRight 0.5s ease';
          setTimeout(() => message.remove(), 500);
        }, 3000);

        clickCount = 0;
      }
    });

    // Add hover effect
    card.addEventListener('mouseenter', () => {
      card.style.cursor = 'pointer';
    });
  });

  // Add parallax effect on scroll
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const timeline = document.querySelector('.timeline-container');

        if (timeline) {
          timeline.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

        ticking = false;
      });

      ticking = true;
    }
  });

  // Interactive timeline hover
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.paddingLeft = '2.5rem';
      item.style.transition = 'padding-left 0.3s ease';
    });

    item.addEventListener('mouseleave', () => {
      item.style.paddingLeft = '2rem';
    });
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
