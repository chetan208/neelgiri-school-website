const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap');

.hdr * {
  font-family: 'Outfit', sans-serif;
  box-sizing: border-box;
}

.hdr-serif {
  font-family: 'Cormorant Garamond', serif;
}

@keyframes barSlide {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes navFade {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes dropBloom {
  from {
    opacity: 0;
    transform: translateY(10px) scale(.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes drawerIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.hdr-topbar {
  animation: barSlide .45s cubic-bezier(.22,1,.36,1) both;
}

.hdr-nav {
  animation: navFade .5s .1s cubic-bezier(.22,1,.36,1) both;
}

.hdr-drop {
  animation: dropBloom .28s cubic-bezier(.22,1,.36,1) both;
}

.hdr-drawer {
  animation: drawerIn .38s cubic-bezier(.22,1,.36,1) both;
}

.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 16px;
  right: 16px;
  height: 2px;
  border-radius: 2px;
  background: #093C5D;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform .3s cubic-bezier(.22,1,.36,1);
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

.drop-item {
  transition: background .15s,
  transform .15s,
  box-shadow .15s;
}

.drop-item:hover {
  background: #f8fafc;
  transform: translateX(3px);
}

.hdr-nav {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}

.hdr-glass {
  background: rgba(255,255,255,0.82) !important;
  backdrop-filter: blur(24px) saturate(200%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(200%) !important;
  box-shadow:
    0 1px 0 rgba(0,0,0,0.08),
    0 6px 28px rgba(0,0,0,0.07) !important;
}

.mob-acc {
  overflow: hidden;
  transition:
    max-height .32s cubic-bezier(.22,1,.36,1),
    opacity .25s;
}

.no-scroll {
  overflow: hidden;
}
`;

export default CSS;