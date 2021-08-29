class Carousel {
  constructor(p) {
    let setting = {... {containerId: '#carousel', slideID: '.slide', interval: 5000, isPlaying: true, isBlind: true}, ...p}
    this.container = document.querySelector(setting.containerId);
    this.slides = this.container.querySelectorAll(setting.slideID);
    this.interval = setting.interval;
    this.isPlaying = setting.isPlaying;
    this.isBlind = setting.isBlind;
  }
  
  _initProps() {
    this.slideCount = this.slides.length;
    this.slidesContainer = this.container.querySelector('.slides');
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-chevron-left"></i>';
    this.FA_NEXT = '<i class="fas fa-chevron-right"></i>';
    this.CODE_RIGHT_ARROW = 'ArrowRight';
    this.CODE_LEFT_ARROW  = 'ArrowLeft';
    this.CODE_SPACE = 'Space';
    
    this.currentSlide = 0; 
    this.countBlinds = 10;
    this.blindInterval = 700;
  }
  
  _initControls() {
    const controls = document.createElement('div');
    controls.setAttribute('class', 'controls');
    this.container.appendChild(controls);
    
    const PAUSE = `<span id="pause-btn" class="control control-pause">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</span>`;
  
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;
    controls.innerHTML = PAUSE + PREV + NEXT;
    
    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');    
  }
  
  _initIndicators() {
    const indicators = document.createElement('ul');
    
    indicators.setAttribute('class', 'indicators');
    this.container.appendChild(indicators);
    for (let i = 0; i < this.slideCount; i++) {
      let indicatorsItem = document.createElement('li');
      indicators.appendChild(indicatorsItem);
      (i > 0) ? indicatorsItem.setAttribute('class', 'indicator') : indicatorsItem.setAttribute('class', 'indicator active');
      indicatorsItem.dataset.slideTo = `${i}`;
    };
    
    this.indicatorsContainer = this.container.querySelector('.indicators');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
  }
  
  _initSlideBlind(n) {
    let blindContainer = document.createElement('div');
    blindContainer.setAttribute('class', 'slide-blind');
    this.slidesContainer.appendChild(blindContainer);
    for (let i = 0; i < n; i++) {
      let blindLeft = document.createElement('div');
      blindLeft.setAttribute('class', 'slide-blind--left');
      blindLeft.style.transition = `width ${this.blindInterval / 1000}s`;
      blindContainer.appendChild(blindLeft);
    }
    for (let i = 0; i < n; i++) {
      let blindRight = document.createElement('div');
      blindRight.setAttribute('class', 'slide-blind--right');
      blindRight.style.transition = `width ${this.blindInterval / 1000}s`;
      blindContainer.appendChild(blindRight);
    }
    this.blindLeft = blindContainer.querySelectorAll('.slide-blind--left');
    this.blindRight = blindContainer.querySelectorAll('.slide-blind--right');
  }
  
   _slideBlind() {        
    for( let i = 0; i < this.countBlinds; i++) {
      this.blindLeft[i].classList.toggle('closed');
      this.blindRight[i].classList.toggle('closed');
    } 
  }

  _gotoNth(n) {  
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.slideCount) % this.slideCount;
    
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicators[this.currentSlide].classList.toggle('active');
  }
  
  _gotoNthWithBlind(n) {
    if (this.isBlind) {
      this._slideBlind();
      setTimeout(() => {
        this._gotoNth(n);
        this._slideBlind()
      }, this.blindInterval);
    } else this._gotoNth(n);
  } 
  
  _gotoPrev() {
    this._gotoNthWithBlind(this.currentSlide - 1);
  }
  
  _gotoNext() {
    this._gotoNthWithBlind(this.currentSlide + 1);
  }
  
  _pause() {
    if (this.isPlaying) 
    {
      clearInterval(this.timerId);
      this.isPlaying = false;
      this.pauseBtn.innerHTML = this.FA_PLAY;     
    }
  }
  
  _play() {
    if (!this.isPlaying) {      
      this.isPlaying = true;
      this.timerId = setInterval(() => this._gotoNext(), this.interval);
      this.pauseBtn.innerHTML = this.FA_PAUSE;
    }
  }
  
  _indicate (e) {
    const target = e.target;
    if (target && target.classList.contains('indicator')) {
      this._pause();
      this._gotoNthWithBlind(+target.dataset.slideTo);
    }
  }
  
  _pressKey(e) {
    if (e.code === this.CODE_RIGHT_ARROW) this.next();
    if (e.code === this.CODE_LEFT_ARROW) this.prev();
    if (e.code === this.CODE_SPACE) this.pausePlay();  
  }
  
  pausePlay() {
    this.isPlaying ? this._pause() : this._play();
  }

  pauseClick() {
    console.log(this.isPlaying)
    (this.isPlaying) ? this._pause() : this._play();
  }
  
  next() {
    this._pause();
    this._gotoNext();
  }
  
  prev() {
    this._pause();
    this._gotoPrev();
  }
  
  _initListener() {
    document.addEventListener('keydown', this._pressKey.bind(this));
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
    // this.container.addEventListener('mouseenter', this._pause.bind(this));
    // this.container.addEventListener('mouseleave', this._play.bind(this));
  }
  
  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    if (this.isBlind) this._initSlideBlind(this.countBlinds);
    this._initListener();
    if (this.isPlaying) this.timerId = setInterval(() => this._gotoNext(), this.interval); 
  }
};
export default Carousel;
