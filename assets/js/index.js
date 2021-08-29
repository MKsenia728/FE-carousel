/* eslint-disable no-undef */
// import Carousel from './carousel.js';
import Carousel from './swipe-carousel.js';
let carousel = new Carousel({
  // containerId: '#carousel',
  // slideID: '.slide',
  interval: 5000,
  isPlaying: true,
  isBlind: true
});
carousel.init();