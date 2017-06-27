/* global $ */

class Block {
  /**
    * @desc Constructor of the block class
    * @param {JQuery} grid - Grid object containing the block
    * @param {JQuery} element - Element object of the DOM block
  */
  constructor(grid, element) {
    this.grid = grid;
    this.element = element;
    this.currentcoordinates = JSON.parse(element.attr('data-coordinates'));
    this.element
      .on('mousedown touchstart', (e) => {
        e.preventDefault();
        this.grid.clickedElement = $(e.currentTarget);
      })
      .on('click touch', () => {
        if (!grid.expanded) {
          this.grid.showExpandedView();
        }
      });
  }

  /**
    * @desc Return the position of the element from his current coordinates
    * @return {integer[]} - An array with the X/Y current coordinates.
  */
  getPosition() {
    const x = ((this.currentcoordinates[0] - this.currentcoordinates[1]) *
      (this.grid.tileWidth / 2)) + (this.grid.center[0] - (this.grid.tileWidth / 2));
    const y = ((this.currentcoordinates[0] + this.currentcoordinates[1]) *
      (this.grid.tile_height / 2)) + (this.grid.center[1] - (this.grid.tile_height / 2));
    return [x, y];
  }
}

/* eslint-disable no-unused-vars*/
/*
 * Disable the linter for the issue when a class is defined but never used
 * because IsometricGrid in used externally.
*/
class IsometricGrid {
/* eslint-enable */
  /**
    * @desc Constructor of the Isometric Grid object
    * @param {JQuery} container - The container containing the grid
    * @param {integer} tileWidth - The width of a isometric tile width (or horizontal diagonale)
    * @param {integer} tileWidth - The width of a isometric tile heigt (or vertical diagonale)
  */
  constructor(container, tileWidth, floorHeight, gridAngle = 30) {
    const angleRadiant = (gridAngle * Math.PI) / 180;

    this.blocks = [];
    this.container = container;
    this.element = this.container.find('.isometric-grid');
    this.center = [parseInt(this.element.width() / 2, 10), 290];
    this.expanded = false;
    this.tileWidth = tileWidth;
    this.tile_height = 2 * (Math.tan(angleRadiant) * (this.tileWidth / 2));
    this.floorHeight = floorHeight;
    this.dragging = false;
    this.disableClick = false;
    this.mouse_start_x = 0;
    this.mouse_start_y = 0;
    this.mouse_last_x = 0;
    this.mouse_last_y = 0;
    this.clickedElement = [];

    // Keep a reference of this object to be accessed inside jQuery call
    const self = this;

    // Find all the block children in the grid and create a Block object with it
    container.find('.isometric-block').each((index, element) => {
      self.addBlock(new Block(self, $(element)));
    });

    // If the grid container already has the expanded class. Set the variable so.
    if (self.container.hasClass('expanded-view')) {
      self.expanded = true;
    }

    // Update the layout
    self.update();

    // As the init position of the block is ready,
    // set the ready class so the CSS can display the grid
    self.container.addClass('ready');

    // Eventlistener for all touch event related to the drag/drop.
    container.on('mousedown touchstart', (e) => {
      self.startDrag(e);
    });
    $(window).on('mousemove touchmove', (e) => {
      self.drag(e);
    });
    $(window).on('mouseup touchend', () => {
      self.endDrag();
    });

    // On detail view: show the expanded view when clicked everywhere on page...
    container
      .find('.information-container-detail, .focus-background')
      .on('click touch', () => {
        self.showExpandedView();
      });

    // .. expect in the card container.
    container.find('.content-detail-container').click((event) => {
      event.stopPropagation();
    });
  }

  /**
    * @desc Convert a pointerEvent event to his X/Y coordinates
    * @param {event} e - The event containing the click & all his attributes
    * @return {array} out - An aray containing the X/Y cliick coord in pixel
  */
  pointerEventToXY(e) {
    this.out = { x: 0, y: 0 };
    if (
      e.type === 'touchstart' ||
      e.type === 'touchmove' ||
      e.type === 'touchend' ||
      e.type === 'touchcancel'
    ) {
      const touch =
        e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      this.out.x = touch.pageX;
      this.out.y = touch.pageY;
    } else if (
      e.type === 'mousedown' ||
      e.type === 'mouseup' ||
      e.type === 'mousemove' ||
      e.type === 'mouseover' ||
      e.type === 'mouseout' ||
      e.type === 'mouseenter' ||
      e.type === 'mouseleave'
    ) {
      this.out.x = e.pageX;
      this.out.y = e.pageY;
    }
    return this.out;
  }

  /**
    * @desc Add a block to the grid blocks array.
    * @param {Block} block - The block object to be passed as children
  */
  addBlock(block) {
    this.blocks.push(block);
  }

  /**
    * @desc Update the whole grid layout. Useful after a change of state / view
  */
  update() {
    for (const block of this.blocks) {
      let floorOffset = 0;
      // Adapt layout depending of the state expanded or not.
      if (this.expanded) {
        // Check if the expanded attribute is correct
        const attributedExpanded = block.element.attr('data-coordinates-expanded');
        if ((typeof attributedExpanded === typeof undefined
          || attributedExpanded === false)
          || attributedExpanded === '[]') {
          // If it hasn't any attribute, hide the block
          block.element.addClass('hidden');
        } else {
          // Else, convert the attributes to an object and pass them as current.
          block.currentcoordinates = JSON.parse(attributedExpanded);
        }
      } else {
        // This will show hidden block & reset the original layout.
        block.element.removeClass('hidden');
        block.currentcoordinates = JSON.parse(
          block.element.attr('data-coordinates')
        );
        // Adds the offset according to the floor.
        floorOffset = parseInt(block.element.attr('data-floor'), 10) * this.floorHeight;
      }

      // Get the current position and update the css position with it.
      const currentPosition = block.getPosition();

      block.element.css({
        left: currentPosition[0],
        top: currentPosition[1] - floorOffset,
      });
    }
  }

  /**
    * @desc When the user starts to drag the container
    * @param {event} e - Click event
  */
  startDrag(e) {
    if (
      this.expanded &&
      this.dragging === false &&
      this.container.hasClass('expanded-view')
    ) {
      e.preventDefault();
      this.mouse_start_x = this.mouse_last_x = this.pointerEventToXY(e).x;
      this.mouse_start_y = this.mouse_last_y = this.pointerEventToXY(e).y;
      this.dragging = true;
    }
  }

  /**
    * @desc When the user is dragging the container
    * @param {event} e - Click event
  */
  drag(e) {
    if (this.expanded && this.dragging === true) {
      const newX =
        (this.pointerEventToXY(e).x - this.mouse_last_x) +
        parseInt(this.element.css('left'), 10);
      const newY =
        (this.pointerEventToXY(e).y - this.mouse_last_y) +
        parseInt(this.element.css('top'), 10);

      this.element.css({
        left: newX,
        top: newY,
      });

      this.mouse_last_x = this.pointerEventToXY(e).x;
      this.mouse_last_y = this.pointerEventToXY(e).y;
    }
  }

  /**
    * @desc When the user stops dragging the container
  */
  endDrag() {
    if (this.expanded && this.dragging) {
      if (
        this.mouse_start_x === this.mouse_last_x &&
        this.mouse_start_y === this.mouse_last_y
      ) {
        // If an element is clicked & has some content to show
        if (this.clickedElement) {
          if (this.clickedElement.find('.content-detail')[0]) {
            // Show the detailed view.
            // Pass this element as clicked & copy the content to the modal box.
            this.clickedElement.addClass('active');
            this.container
              .addClass('detail-view')
              .removeClass('expanded-view')
              .removeClass('home-view');
            $('.content-detail-container').html(
              this.clickedElement.find('.content-detail').html()
            );

            // Recenter the viewport to have the block
            // positionned on the left side.
            this.element.css({
              left: this.center[0] -
                (this.clickedElement.position().left +
                  this.clickedElement.width() +
                  90),
              top: (this.center[1] / 2) -
                ((this.clickedElement.position().top + this.clickedElement.height()) - 300),
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

  /**
    * @desc Show the expanded view
  */
  showExpandedView() {
    this.expanded = true;
    this.update();
    this.element.find('.isometric-block').removeClass('active');
    this.container
      .addClass('expanded-view')
      .removeClass('detail-view')
      .removeClass('home-view');
  }

  /**
    * @desc Show the homeview
  */
  showHomeView() {
    this.expanded = false;
    this.update();
    this.container
      .removeClass('expanded-view')
      .removeClass('detail-view')
      .addClass('home-view');

    // Center the grid.
    this.element.css({
      left: 0,
      top: 0,
    });
  }
  /**
    * @desc Reset the center of grid.
  */
  reCenter() {
    this.center[0] = parseInt(this.element.width() / 2, 10);
    this.update();
  }
}
