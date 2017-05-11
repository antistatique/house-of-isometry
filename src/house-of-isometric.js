(function () {
  var isometricLayout = function {
    var pointerEventToXY = function (e) {
      var out = { x: 0, y: 0 };
      if (
        e.type == 'touchstart' || e.type == 'touchmove'
        || e.type == 'touchend' || e.type == 'touchcancel'
      ) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
      }
      return out;
    };

    class Block {
      constructor(grid, element) {
        this.grid = grid;
        this.element = element;
        this.currentcoordinates = JSON.parse(element.attr('data-coordinates'));
      }

      //Return the position of the element from his current coordinates
      getPosition() {
        var x = (this.currentcoordinates[0] - this.currentcoordinates[1]) * this.grid.tile_width / 2 + this.grid.center[0] - this.grid.tile_width / 2;
        var y = (this.currentcoordinates[0] + this.currentcoordinates[1]) * this.grid.tile_height / 2 + this.grid.center[1] - this.grid.tile_height / 2;
        return [x, y];
      }
    }

    class Grid {

      constructor(container, element, tile_width, tile_height) {
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

      addBlock(block) {
        this.blocks.push(block);
      }

      disable() {
        this.expanded = !this.expanded;
        if (this.expanded)  {
          this.element.parent('.isometric-layout').addClass('expanded');
        } else {
          this.element.parent('.isometric-layout').removeClass('expanded');
        }
        this.update();
      }

      update() {
        for (const block of this.blocks) {
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
      }

      startDrag(e) {
        if (this.expanded && this.dragging === false && this.container.hasClass('expanded-view')) {
          e.preventDefault();
          this.mouse_start_x = this.mouse_last_x = pointerEventToXY(e).x;
          this.mouse_start_y = this.mouse_last_y = pointerEventToXY(e).y;
          this.mouse_start_x = this.mouse_last_x = pointerEventToXY(e).x;
          this.mouse_start_y = this.mouse_last_y = pointerEventToXY(e).y;
          this.dragging = true;
        }
      }

      drag(e) {
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

      endDrag() {
        if (this.expanded && this.dragging) {
          if (this.mouse_start_x === this.mouse_last_x && this.mouse_start_y === this.mouse_last_y) {
            if (this.clickedElement) {
              if (this.clickedElement.find('.content-detail')[0]) {
                this.clickedElement.addClass('active');
                this.container.addClass('detail-view');
                this.container.removeClass('expanded-view');
                this.container.removeClass('home-view');
                $('.content-detail-container').html('');
                $('.content-detail-container').html(this.clickedElement.find('.content-detail').html());
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

      showExpandedView() {
        this.expanded = true;
        this.update();
        this.element.find('.isometric-block').removeClass('active');
        this.container.addClass('expanded-view');
        this.container.removeClass('detail-view');
        this.container.removeClass('home-view');
      }

      showHomeView() {
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

      resize() {
        this.center[0] = parseInt(this.element.width() / 2);
        this.update();
      }
    }

    if ($('.isometric-layout')[0])  {
      console.log('here');
      var grid = new Grid($('.isometric-layout'), $('.isometric-grid'), 200, 116);

      $('.isometric-grid .isometric-block').each(function ()  {
        grid.addBlock(new Block(grid, $(this)));
      });

      if (grid.container.hasClass('expanded-view')) {
        grid.expanded = true;
      }
      grid.update();
      grid.container.addClass('ready');

      $('.isometric-grid').on('mousedown touchstart', function (e) {
        grid.startDrag(e);
      });
      $(document).on('mousemove touchmove', function (e) {
        grid.drag(e);
      });
      $(document).on('mouseup touchend', function (e) {
        grid.endDrag();
      });

      $('.isometric-block').on('click touch', function (e) {
        if (!grid.expanded) {
          grid.showExpandedView();
        }
      });

      $('.showExpandedView').on('click touch', function (e) {
        e.preventDefault();
        grid.showExpandedView();
      });

      $('.showHomeView').on('click touch', function (e) {
        e.preventDefault();
        grid.showHomeView();
      });

      $('.isometric-block').on('click touch', function (e) {
        e.preventDefault();
      }).on('mousedown touchstart', function (e) {
        e.preventDefault();
        grid.clickedElement = $(this);
      });

      $('.information-container-detail, .focus-background').on('click touch', function (e) {
        grid.showExpandedView();
      });

      $('.content-detail-container').click(function (event) {
        event.stopPropagation();
      });

      $(window).resize(function () {
        grid.resize();
      });
    }
  }
}());