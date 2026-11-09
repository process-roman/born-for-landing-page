import { header, footer, likePanel, mountLikes } from "./common.js";
import { icon, portrait, sky, escape } from "./icons.js";
import data from "./generated/app-data.json";
const leo = data.signs.leo;
const attributes = Object.entries(leo.stats)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 6);
document.querySelector("#app").innerHTML = `${header()}
<main id="main">
<section class="hero wrap">
 <div class="hero-copy"><p class="eyebrow"><span class="tiny-star">✦</span> SOON ON THE APP STORE &amp; GOOGLE PLAY</p><h1>Explore a career.<br><em>Live the choices.</em></h1><p class="hero-description">Step into different career lives. Make decisions, experience the trade-offs, and discover which paths you want to pursue in real life.</p><a class="button button-primary" href="/discover/">Try a career life ${icon("arrow")}</a><p class="microcopy">A starting character. A career to try. Choices to make.</p></div>
 <div class="hero-visual">
  <span class="orbit orbit-one" aria-hidden="true"></span><span class="orbit orbit-two" aria-hidden="true"></span><span class="hero-spark" aria-hidden="true">✦</span>
  <div class="phone-frame" role="group" aria-label="Career simulator character preview">
   <div class="phone-screen">
    <div class="phone-status" aria-hidden="true"><span>9:41</span><span class="phone-island"></span><svg viewBox="0 0 59 14" fill="currentColor"><rect x="1" y="9" width="3" height="4" rx="1"/><rect x="6" y="6" width="3" height="7" rx="1"/><rect x="11" y="3" width="3" height="10" rx="1"/><path d="M20 5a10 10 0 0 1 14 0l-1.5 1.5a8 8 0 0 0-11 0ZM23 8a6 6 0 0 1 8 0l-1.5 1.5a4 4 0 0 0-5 0ZM26 11a2 2 0 0 1 2 0l-1 1.5Z"/><rect x="39" y="3" width="16" height="9" rx="2" fill="none" stroke="currentColor"/><rect x="41" y="5" width="12" height="5" rx="1"/><rect x="56" y="6" width="2" height="3" rx="1"/></svg></div>
    <div class="phone-app-header"><span class="phone-brand"><img class="phone-logo" src="/brand-logo.png" width="24" height="24" alt="" /> Born For</span><span class="phone-header-star" aria-hidden="true">✦</span></div>
    <div class="phone-art">${sky("phone-sky")}<div class="phone-character">${portrait("leo")}</div></div>
    <div class="phone-character-info"><span class="phone-sign">EXAMPLE CHARACTER · LEO</span><h2>${escape(leo.archetype)}</h2><p>A fictional character ready for a career story.</p></div>
    <div class="phone-powers"><div class="phone-powers-heading"><h3>Starting character stats</h3><span>OUT OF 100</span></div><ul class="phone-attributes">${attributes.map(([id, value]) => `<li><div><span>${escape(data.labels[id])}</span><strong>${value}<span class="sr-only"> out of 100</span></strong></div><span class="phone-attribute-track" aria-hidden="true"><i style="--value:${value}%"></i></span></li>`).join("")}</ul></div>
    <div class="phone-home" aria-hidden="true"><span></span></div>
   </div>
  </div>
 </div>
</section>
<div class="horizon-strip"><span>12 starting archetypes</span><i>✧</i><span>16 character attributes</span><i>✧</i><span>${data.careers.length} career paths</span><i>✧</i><span>Choices that <em>shape</em> the story</span></div>
<div class="early-support wrap">${likePanel()}</div>
<section class="section wrap" id="how-it-works"><div class="section-heading"><h2>Explore a career<br><em>before choosing your path.</em></h2><p>Play through career stories, experience different decisions, and reflect on the paths you want to explore beyond the game.</p></div><div class="steps-grid">
 <article class="story-step"><span class="step-art lavender">${icon("spark")}</span><span class="step-number">01 / YOUR CHARACTER</span><h3>Meet your starting character.</h3><p>Your birthday selects a zodiac-inspired archetype and fictional starting stats. They set up your character’s story; they don’t measure your real-life abilities.</p></article>
 <article class="story-step"><span class="step-art peach">${icon("compass")}</span><span class="step-number">02 / YOUR CAREER</span><h3>Choose a career to explore.</h3><p>Pick a career you’re curious about—from design and teaching to software and more. Try a different path with the same starting character.</p></article>
 <article class="story-step"><span class="step-art gold">${icon("book")}</span><span class="step-number">03 / YOUR CHOICES</span><h3>Make choices. Explore the path.</h3><p>In the app, play through career stories, see how decisions shape your character’s life, and try small real-world quests to explore your interests.</p></article>
</div></section>
<section class="possibility-section"><div class="wrap possibility-grid"><div class="mini-scene">${sky("small-sky")}<span class="scene-caption">YOUR CHOICES SHAPE THE STORY.</span></div><div class="possibility-copy"><p class="eyebrow">EXPERIENCE A CAREER BEFORE YOU CHOOSE IT</p><h2>Step into a career.<br><em>See if it’s your path.</em></h2><p>Experience a fictional career life as a designer, teacher, founder, or another career you’re curious about. Make decisions and explore the challenges and trade-offs along the way.</p><p>Use the stories to reflect on what interests you about a career and which paths you want to investigate in real life.</p><a class="text-arrow" href="/discover/">Try a career life ${icon("arrow")}</a></div></div></section>
<section class="community-section wrap"><span class="community-star">✦</span><h2>Coming very soon<br>to the <em>App Store &amp; Google Play.</em></h2><p>Which career life would you try first?<br class="desktop-only"> Tap below if you want Born For on your phone.</p>${likePanel()}<a class="text-link" href="/discover/">Or try the career preview →</a></section>
</main>${footer()}`;
mountLikes();
