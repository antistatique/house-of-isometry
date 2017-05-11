/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _houseOfIsometric = __webpack_require__(2);
	
	var _houseOfIsometric2 = _interopRequireDefault(_houseOfIsometric);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _jquery2.default)(document).on('ready', function () {
	  (0, _houseOfIsometric2.default)();
	});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = jQuery;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global jQuery */
	
	// To do
	// - Document & comments
	
	exports.default = isoLayout = function isoLayout() {
	  var pointerEventToXY = function pointerEventToXY(e) {
	    var out = { x: 0, y: 0 };
	    if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
	      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
	      out.x = touch.pageX;
	      out.y = touch.pageY;
	    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
	      out.x = e.pageX;
	      out.y = e.pageY;
	    }
	    return out;
	  };
	
	  var Block = function () {
	    function Block(grid, element) {
	      _classCallCheck(this, Block);
	
	      this.grid = grid;
	      this.element = element;
	      this.currentcoordinates = JSON.parse(element.attr('data-coordinates'));
	    }
	
	    //Return the position of the element from his current coordinates
	
	
	    _createClass(Block, [{
	      key: 'getPosition',
	      value: function getPosition() {
	        var x = (this.currentcoordinates[0] - this.currentcoordinates[1]) * this.grid.tile_width / 2 + this.grid.center[0] - this.grid.tile_width / 2;
	        var y = (this.currentcoordinates[0] + this.currentcoordinates[1]) * this.grid.tile_height / 2 + this.grid.center[1] - this.grid.tile_height / 2;
	        return [x, y];
	      }
	    }]);
	
	    return Block;
	  }();
	
	  var Grid = function () {
	    function Grid(container, element, tile_width, tile_height) {
	      _classCallCheck(this, Grid);
	
	      this.blocks = [];
	      this.container = container;
	      this.element = element;
	      this.center = [parseInt(element.width() / 2), 290];
	      this.expanded = false;
	      this.tile_width = tile_width;
	      this.tile_height = tile_height;
	      this.dragging = false;
	      this.disableClick = false;
	      this.mouse_start_x = 0;
	      this.mouse_start_y = 0;
	      this.mouse_last_x = 0;
	      this.mouse_last_y = 0;
	      this.clickedElement;
	    }
	
	    _createClass(Grid, [{
	      key: 'addBlock',
	      value: function addBlock(block) {
	        this.blocks.push(block);
	      }
	    }, {
	      key: 'disable',
	      value: function disable() {
	        this.expanded = !this.expanded;
	        if (this.expanded) {
	          this.element.parent('.isometric-layout').addClass('expanded');
	        } else {
	          this.element.parent('.isometric-layout').removeClass('expanded');
	        }
	        this.update();
	      }
	    }, {
	      key: 'update',
	      value: function update() {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = this.blocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var block = _step.value;
	
	            var floor_offset = 0;
	            if (this.expanded) {
	              if (block.element.attr('data-coordinates-expanded') == '[]') {
	                block.element.addClass('hidden');
	              } else {
	                block.currentcoordinates = JSON.parse(block.element.attr('data-coordinates-expanded'));
	              }
	            } else {
	              block.element.removeClass('hidden');
	              block.currentcoordinates = JSON.parse(block.element.attr('data-coordinates'));
	              floor_offset = parseInt(block.element.attr('data-floor'), 10) * 30;
	            }
	            block.element.css({ left: block.getPosition()[0], top: block.getPosition()[1] + floor_offset });
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'startDrag',
	      value: function startDrag(e) {
	        if (this.expanded && this.dragging === false && this.container.hasClass('expanded-view')) {
	          e.preventDefault();
	          this.mouse_start_x = this.mouse_last_x = pointerEventToXY(e).x;
	          this.mouse_start_y = this.mouse_last_y = pointerEventToXY(e).y;
	          this.mouse_start_x = this.mouse_last_x = pointerEventToXY(e).x;
	          this.mouse_start_y = this.mouse_last_y = pointerEventToXY(e).y;
	          this.dragging = true;
	        }
	      }
	    }, {
	      key: 'drag',
	      value: function drag(e) {
	        if (this.expanded && this.dragging === true) {
	          var new_x = pointerEventToXY(e).x - this.mouse_last_x + parseInt(this.element.css('left'));
	          var new_y = pointerEventToXY(e).y - this.mouse_last_y + parseInt(this.element.css('top'));
	
	          // if (new_x > 0) new_x = 0;
	          // if (new_y > 0) new_y = 0;
	          // if (new_x < -this.element.width()+this.element.parent().width()) new_x = -this.element.width()+this.element.parent().width();
	          // if (new_y < -this.element.height()+this.element.parent().height()) new_y = -this.element.height()+this.element.parent().height();
	
	          this.element.css({
	            left: new_x,
	            top: new_y
	          });
	
	          this.mouse_last_x = pointerEventToXY(e).x;
	          this.mouse_last_y = pointerEventToXY(e).y;
	        }
	      }
	    }, {
	      key: 'endDrag',
	      value: function endDrag() {
	        if (this.expanded && this.dragging) {
	          if (this.mouse_start_x === this.mouse_last_x && this.mouse_start_y === this.mouse_last_y) {
	            if (this.clickedElement) {
	              if (this.clickedElement.find('.content-detail')[0]) {
	                this.clickedElement.addClass('active');
	                this.container.addClass('detail-view');
	                this.container.removeClass('expanded-view');
	                this.container.removeClass('home-view');
	                (0, _jquery2.default)('.content-detail-container').html('');
	                (0, _jquery2.default)('.content-detail-container').html(this.clickedElement.find('.content-detail').html());
	                this.element.css({
	                  left: this.center[0] - (this.clickedElement.position().left + this.clickedElement.width() + 90),
	                  top: this.center[1] / 2 - (this.clickedElement.position().top + this.clickedElement.height()) + 300
	                });
	              }
	            }
	          }
	          this.mouse_start_x = this.mouse_last_x = 0;
	          this.mouse_start_y = this.mouse_last_y = 0;
	          this.dragging = false;
	          this.clickedElement = false;
	        }
	      }
	    }, {
	      key: 'showExpandedView',
	      value: function showExpandedView() {
	        this.expanded = true;
	        this.update();
	        this.element.find('.isometric-block').removeClass('active');
	        this.container.addClass('expanded-view');
	        this.container.removeClass('detail-view');
	        this.container.removeClass('home-view');
	      }
	    }, {
	      key: 'showHomeView',
	      value: function showHomeView() {
	        this.expanded = false;
	        this.update();
	        this.container.removeClass('expanded-view');
	        this.container.removeClass('detail-view');
	        this.container.addClass('home-view');
	
	        this.element.css({
	          left: 0,
	          top: 0
	        });
	      }
	    }, {
	      key: 'resize',
	      value: function resize() {
	        this.center[0] = parseInt(this.element.width() / 2);
	        this.update();
	      }
	    }]);
	
	    return Grid;
	  }();
	
	  if ((0, _jquery2.default)('.isometric-layout')[0]) {
	    console.log('here');
	    var grid = new Grid((0, _jquery2.default)('.isometric-layout'), (0, _jquery2.default)('.isometric-grid'), 200, 116);
	
	    (0, _jquery2.default)('.isometric-grid .isometric-block').each(function () {
	      grid.addBlock(new Block(grid, (0, _jquery2.default)(this)));
	    });
	
	    if (grid.container.hasClass('expanded-view')) {
	      grid.expanded = true;
	    }
	    grid.update();
	    grid.container.addClass('ready');
	
	    (0, _jquery2.default)('.isometric-grid').on('mousedown touchstart', function (e) {
	      grid.startDrag(e);
	    });
	    (0, _jquery2.default)(document).on('mousemove touchmove', function (e) {
	      grid.drag(e);
	    });
	    (0, _jquery2.default)(document).on('mouseup touchend', function (e) {
	      grid.endDrag();
	    });
	
	    (0, _jquery2.default)('.isometric-block').on('click touch', function (e) {
	      if (!grid.expanded) {
	        grid.showExpandedView();
	      }
	    });
	
	    (0, _jquery2.default)('.showExpandedView').on('click touch', function (e) {
	      e.preventDefault();
	      grid.showExpandedView();
	    });
	
	    (0, _jquery2.default)('.showHomeView').on('click touch', function (e) {
	      e.preventDefault();
	      grid.showHomeView();
	    });
	
	    (0, _jquery2.default)('.isometric-block').on('click touch', function (e) {
	      e.preventDefault();
	    }).on('mousedown touchstart', function (e) {
	      e.preventDefault();
	      grid.clickedElement = (0, _jquery2.default)(this);
	    });
	
	    (0, _jquery2.default)('.information-container-detail, .focus-background').on('click touch', function (e) {
	      grid.showExpandedView();
	    });
	
	    (0, _jquery2.default)('.content-detail-container').click(function (event) {
	      event.stopPropagation();
	    });
	
	    (0, _jquery2.default)(window).resize(function () {
	      grid.resize();
	    });
	  }
	};

/***/ })
/******/ ]);