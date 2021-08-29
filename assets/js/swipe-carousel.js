import Carousel from './carousel.js';
class SwipeCarousel extends Carousel {
  
  _swipeStart(e) {
    this.swipeStartX = e.changedTouches[0].pageX;
  }
  _swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    (this.swipeStartX - this.swipeEndX > 100) && this.next();
    (this.swipeStartX - this.swipeEndX < -100) && this.prev();
  }
  _initListener() {
    super._initListener();
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
  }
};
export default SwipeCarousel;