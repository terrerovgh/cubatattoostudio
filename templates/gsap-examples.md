```js
// Example GSAP animation with ScrollTrigger
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from('.section', {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: '.section',
    start: 'top 80%',
  }
});
```
