describe('Coral.QuickActions', function() {
  var BUTTON_SELECTOR = '._coral-QuickActions-item:not([handle="moreButton"])';

  var itemObject = {
    icon: 'copy',
    content: {
      textContent: 'Copy'
    }
  };
  var itemObject1 = {
    icon: 'paste',
    content: {
      textContent: 'Paste'
    }
  };

  describe('Namespace', function() {
    it('should have QuickActions defined', function() {
      expect(Coral).to.have.property('QuickActions');
    });

    it('should expose the interaction in an enum', function() {
      expect(Coral.QuickActions).to.have.property('interaction');
      expect(Coral.QuickActions.interaction.ON).to.equal('on');
      expect(Coral.QuickActions.interaction.OFF).to.equal('off');
      expect(Object.keys(Coral.QuickActions.interaction).length).to.equal(2);
    });

    it('should expose the placement in an enum', function() {
      expect(Coral.QuickActions).to.have.property('placement');
      expect(Coral.QuickActions.placement.TOP).to.equal('top');
      expect(Coral.QuickActions.placement.CENTER).to.equal('center');
      expect(Coral.QuickActions.placement.BOTTOM).to.equal('bottom');
      expect(Object.keys(Coral.QuickActions.placement).length).to.equal(3);
    });
  });
  
  describe('Instantiation', function() {
    it('should be possible to clone using markup', function() {
      helpers.cloneComponent(window.__html__['Coral.QuickActions.empty.html']);
    });
  
    it('should be possible to clone using js', function() {
      helpers.cloneComponent(new Coral.QuickActions());
    });
  });

  describe('API', function() {
    var el;
    var targetElement;

    beforeEach(function() {
      // Create the QuickActions
      el = helpers.build(new Coral.QuickActions());

      // Create the target element
      targetElement = helpers.overlay.createStaticTarget();

      // Set the tabIndex so that we can focus the target
      targetElement.tabIndex = 0;

      // Set the targets
      el.target = targetElement;
    });

    afterEach(function() {
      el = targetElement = null;
    });

    describe('#threshold', function() {
      it('should default to 4', function() {
        expect(el.threshold).to.equal(4);
      });
    });

    describe('#interaction', function() {
      it('should default to on', function() {
        expect(el.interaction).to.equal(Coral.QuickActions.interaction.ON);
      });
    });

    describe('#offset', function() {
      it('should default to 10', function() {
        expect(el.offset).to.equal(10);
      });
    });

    describe('#alignMy', function() {
      it('should default to "center top"', function() {
        expect(el.alignMy).to.equal('center top');
      });
    });

    describe('#alignAt', function() {
      it('should default to "center top"', function() {
        expect(el.alignAt).to.equal('center top');
      });
    });

    describe('#items', function() {
      it('should be possible to add/remove items via Collection API', function() {
        var items = el.items.getAll();
        expect(items.length).to.equal(0, 'quickActions initially have no items');

        var item = el.items.add(itemObject);
        items = el.items.getAll();
        expect(items.length).to.equal(1, 'quickActions have a single item after add');

        el.items.remove(item);
        items = el.items.getAll();
        expect(items.length).to.equal(0, 'quickActions have no items after remove');
      });
    });

    describe('#target', function() {});
    describe('#placement', function() {});
  });

  describe('Markup', function() {
    var targetElement;

    beforeEach(function() {
      // Create the target element
      targetElement = helpers.overlay.createStaticTarget();

      // Set the tabIndex so that we can focus the target
      targetElement.tabIndex = 0;
    });

    afterEach(function() {
      targetElement = null;
    });

    describe('#items', function() {
      it('should sync buttons and buttonList when items are added/removed via Collection API', function(done) {
        const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
        el.target = targetElement;
        var buttonListItems = el._elements.buttonList.items.getAll();
        var buttons = el.querySelectorAll(BUTTON_SELECTOR);

        expect(buttonListItems.length).to.equal(4, 'buttonList initially has four items');
        expect(buttons.length).to.equal(4, 'four buttons initially');

        // Add a couple more items
        el.items.add(itemObject);
        el.items.add(itemObject1);

        // Wait for MO
        helpers.next(function() {
          buttonListItems = el._elements.buttonList.items.getAll();
          buttons = Array.prototype.slice.call(el.querySelectorAll(BUTTON_SELECTOR));
          expect(buttons.length).to.equal(6, 'buttonList has six items after we have added some more');
          expect(buttonListItems.length).to.equal(6, 'six buttons after we have added some more');
          buttons.forEach(function(item) {
            expect(item instanceof Coral.Button).to.be.true;
          });
          buttonListItems.forEach(function(item) {
            expect(item instanceof Coral.ButtonList.Item).to.be.true;
          });
          done();
        });
      });

      it('should support anchorButtons and anchorButtonList items', function(done) {
        const el = helpers.build(window.__html__['Coral.QuickActions.type.html']);
        el.target = targetElement;
        // we need to open it to force the creation of the internal elements
        el.open = true;

        // Wait until opened
        helpers.next(function() {
          var anchorButtonListItems = el._elements.buttonList.items.getAll();
          var anchorButtons = Array.prototype.slice.call(el.querySelectorAll(BUTTON_SELECTOR));
          
          expect(anchorButtons.length).to.equal(4, 'anchorButtonList has six items after we have added some more');
          expect(anchorButtonListItems.length).to.equal(4, 'six anchorButtons after we have added some more');
          anchorButtons.forEach(function(item) {
            expect(item instanceof Coral.AnchorButton).to.be.true;
            expect(item.getAttribute('href')).to.equal('#');
          });
          anchorButtonListItems.forEach(function(item) {
            expect(item instanceof Coral.AnchorList.Item).to.be.true;
            expect(item.getAttribute('href')).to.equal('#');
          });
          done();
        });
      });
    });
    
    describe('#focus', function() {
      it('should move the focus inside the component', function(done) {
        const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
        el.on('coral-overlay:open', function() {
          expect(document.activeElement).not.to.equal(el);
        
          var buttons = el.querySelectorAll(BUTTON_SELECTOR);
          // we focus the component
          el.focus();
        
          // expect(el.contains(document.activeElement)).to.equal()
          expect(document.activeElement).to.equal(buttons[0], 'The first button should be focused');
          done();
        });
      
        el.show();
      });
  
      it('should not shift focus if already inside the component', function(done) {
        const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
        el.on('coral-overlay:open', function() {
          expect(el.contains(document.activeElement)).to.equal(true, 'Focus should be inside the component');
        
          var buttons = el.querySelectorAll(BUTTON_SELECTOR);
          // we move focus to the 3rd item
          buttons[3].focus();
        
          // we focus the component
          el.focus();
          expect(document.activeElement).to.equal(buttons[3], 'Focus should not be moved');
        
          done();
        });
      
        el.show();
      });
  
      it('should not focus the component if not shown', function() {
        const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
        expect(document.activeElement).not.to.equal(el);
      
        // we focus the component
        el.focus();
      
        expect(el.contains(document.activeElement)).to.equal(false, 'Should not change the focus');
      });
    });
  });

  describe('Events', function() {
    var targetElement;

    beforeEach(function() {
      // Create the target element
      targetElement = helpers.overlay.createStaticTarget();

      // Set the tabIndex so that we can focus the target
      targetElement.tabIndex = 0;
    });

    afterEach(function() {
      targetElement = null;
    });

    it('should trigger click event when an item is selected by clicking a button', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
      el.target = targetElement;
      var spy = sinon.spy();

      el.on('click', function(event) {
        expect(event.target.textContent).to.equal('Copy');
        spy.call(spy, this.arguments);
      });

      // Click the button
      var button = el.querySelector(BUTTON_SELECTOR);
      button.click();
      
      expect(spy.callCount).to.equal(1, 'spy called once after clicking item');
    });

    it('should trigger click event when an item is selected by clicking a ButtonList item', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
      el.target = targetElement;
      var spy = sinon.spy();

      el.on('click', function(event) {
        expect(event.target.textContent).to.equal('Copy');
        spy.call(spy, this.arguments);
      });

      // Click the ButtonList item
      var buttonListItem = el._elements.buttonList.items.first();
      buttonListItem.click();
    
      expect(spy.callCount).to.equal(1, 'spy called once after clicking item');
    });

    it('should not allow internal Coral.Overlay events to propagate beyond QuickActions', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      var spy = sinon.spy();
      
      el.on('coral-overlay:open', () => {
        el.on('coral-overlay:beforeopen', spy);
        el.on('coral-overlay:beforeclose', spy);
        el.on('coral-overlay:open', spy);
        el.on('coral-overlay:close', spy);
        el.on('coral-overlay:positioned', spy);
  
        // Open and close the overlay to trigger Coral.Overlay events
        el._elements.overlay.open = true;
  
        helpers.next(function() {
          el._elements.overlay.open = false;
    
          helpers.next(function() {
            expect(spy.callCount).to.equal(0, 'no events propagated for internal Coral.Overlay');
            done();
          });
        });
      });
      
      // Open the quickActions
      el.open = true;
    });
  });

  describe('User Interaction', function() {
    var targetElement;

    beforeEach(function() {
      // Create the target element
      targetElement = helpers.overlay.createStaticTarget();

      // Set the tabIndex so that we can focus the target
      targetElement.tabIndex = 0;
    });

    afterEach(function() {
      targetElement = null;
    });

    it('should open when mouse enters the target', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      expect(el.open).to.equal(false, 'QuickActions initially closed');

      el.target = targetElement;

      helpers.mouseEvent('mouseenter', targetElement);

      expect(el.open).to.equal(true, 'QuickActions opened after the mouse enters the target');
    });

    it('should close when mouse leaves the target', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;

      el.show();

      expect(el.open).to.equal(true, 'QuickActions successfully shown');
      
      helpers.mouseEvent('mouseleave', targetElement);
      
      expect(el.open).to.equal(false, 'QuickActions closed after mouse leaves target');
    });

    it('should open when shift + F10 keys pressed', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      expect(el.open).to.equal(false, 'QuickActions initially closed');

      // Hit shift + F10 keys
      var event = document.createEvent('Event');
      event.initEvent('keyup', true, true);
      event.keyCode = 121;
      event.which = 121;
      event.shiftKey = true;
      targetElement.dispatchEvent(event);
      
      expect(el.open).to.equal(true, 'QuickActions opened after shift + F10 key pressed');
    });

    it('should open when ctrl + space keys pressed', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      expect(el.open).to.equal(false, 'QuickActions initially closed');

      // Hit ctrl + space keys
      var event = document.createEvent('Event');
      event.initEvent('keyup', true, true);
      event.keyCode = 32;
      event.which = 32;
      event.ctrlKey = true;
      targetElement.dispatchEvent(event);
      
      expect(el.open).to.equal(true, 'QuickActions opened after ctrl + space key pressed');
    });

    it('should close on escape keypress', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;

      el.show();

      expect(el.open).to.equal(true, 'QuickActions successfully shown');

      // Hit escape key
      helpers.keypress('escape', el);
      
      expect(el.open).to.equal(false, 'QuickActions closed after escape keypress');
    });

    it('should navigate to next button for "right", "down" and "pagedown" keypresses', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      el.show();
  
      // Wait until opened
      el.on('coral-overlay:open', () => {
        var buttons = el.querySelectorAll(BUTTON_SELECTOR);
      
        expect(document.activeElement).to.equal(buttons[0], 'First QuickAction item focused');

        helpers.keypress('right', buttons[0]);
        expect(document.activeElement).to.equal(buttons[1], 'Second QuickAction item focused');

        helpers.keypress('down', buttons[1]);
        expect(document.activeElement).to.equal(buttons[2], 'Third QuickAction item focused');

        helpers.keypress('pagedown', buttons[2]);
        expect(document.activeElement).to.equal(buttons[3], 'Fourth QuickAction item focused');

        done();
      });
    });

    it('should navigate to previous button for "left", "up" and "pageup" keypresses', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      el.show();
  
      // Wait until opened
      el.on('coral-overlay:open', () => {
        var buttons = el.querySelectorAll(BUTTON_SELECTOR);
      
        buttons[3].focus();
        expect(document.activeElement).to.equal(buttons[3], 'Fourth QuickAction item focused');

        helpers.keypress('left', buttons[3]);
        expect(document.activeElement).to.equal(buttons[2], 'Third QuickAction item focused');

        helpers.keypress('up', buttons[2]);
        expect(document.activeElement).to.equal(buttons[1], 'Second QuickAction item focused');

        helpers.keypress('pageup', buttons[1]);
        expect(document.activeElement).to.equal(buttons[0], 'First QuickAction item focused');

        done();
      });
    });

    it('should navigate to last button for "end" keypress and first for "home" keypress', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      
      el.target = targetElement;
      el.show();
  
      // Wait until opened
      el.on('coral-overlay:open', () => {
        var buttons = el.querySelectorAll(BUTTON_SELECTOR);
      
        expect(document.activeElement).to.equal(buttons[0], 'First QuickAction item focused initially');

        helpers.keypress('end', buttons[0]);
        expect(document.activeElement).to.equal(buttons[3], 'Last QuickAction item focused for end keypress');

        helpers.keypress('home', buttons[3]);
        expect(document.activeElement).to.equal(buttons[0], 'First QuickAction item focused for home keypress');

        done();
      });
    });

    it('should open the overlay when clicking the more button', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      expect(el._elements.overlay.open).to.equal(false, 'Overlay is initially closed');

      // Simulate a click of the more button
      el._elements.moreButton.click();

      expect(el._elements.overlay.open).to.equal(true, 'Overlay is open following a click of the more button');
    });

    it('should close the overlay on escape keypress when open', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.open = true;
      expect(el._elements.overlay.open).to.equal(false, 'Overlay initially closed');
      el._elements.overlay.open = true;

      // Hit escape key
      helpers.keypress('escape', el);
      
      expect(el._elements.overlay.open).to.equal(false, 'Overlay closed after escape keypress');
      expect(el.open).to.equal(true, 'QuickActions are still open, only the overlay has closed');
    });

    // @flaky
    it.skip('should return focus to the target when launched via keyboard', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el._overlayAnimationTime = 0;
      
      el.target = targetElement;
      el.target.focus();

      // Hit shift + F10 keys to open
      var event = document.createEvent('Event');
      event.initEvent('keyup', true, true);
      event.keyCode = 121;
      event.which = 121;
      event.shiftKey = true;
      targetElement.dispatchEvent(event);
      
      el.on('coral-overlay:open', function() {
        expect(document.activeElement === el.target).to.equal(false, 'Focus is internal to the QuickActions');
        el.open = false;
      });
      
      el.on('coral-overlay:close', function() {
        expect(document.activeElement === el.target).to.equal(true, 'Focus is returned to the target on close');
        done();
      });
    });

    it('should trap focus when launched via keyboard', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;
      el.target.focus();

      // Hit shift + F10 keys to open
      var event = document.createEvent('Event');
      event.initEvent('keyup', true, true);
      event.keyCode = 121;
      event.which = 121;
      event.shiftKey = true;
      targetElement.dispatchEvent(event);
  
      // Wait until opened
      el.on('coral-overlay:open', () => {
        var buttons = el.querySelectorAll(BUTTON_SELECTOR);

        helpers.next(function() {
          expect(document.activeElement).to.equal(buttons[0], 'First QuickAction item focused');

          // Hit tab key
          helpers.keypress('tab', el);

          expect(document.activeElement).to.equal(buttons[0], 'Focus trapped within the QuickActions');
          done();
        });
      });
    });
  });

  describe('Implementation Details', function() {
    var targetElement;

    beforeEach(function() {
      // Create the target element
      targetElement = helpers.overlay.createStaticTarget();

      // Set the tabIndex so that we can focus the target
      targetElement.tabIndex = 0;
    });

    afterEach(function() {
      targetElement = null;
    });

    it('should allow HTML content in the items', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.htmlcontent.html']);
      el.target = targetElement;

      // opening the quickactions initiliazes the buttons
      el.open = true;
      
      var items = el.items.getAll();
      var buttonListItems = el._elements.buttonList.items.getAll();
      var buttons = Array.prototype.slice.call(el.querySelectorAll(BUTTON_SELECTOR));

      buttons.forEach(function(button, index) {
        expect(button.getAttribute('aria-label')).to.equal(items[index].content.textContent, 'the aria-label should be strip the HTML out');
        expect(button.getAttribute('title')).to.equal(items[index].content.textContent, 'the title should strip the HTML out');
        expect(buttonListItems[index].content.innerHTML).to.equal(items[index].content.innerHTML, 'the list item should keep the HTML');
        expect(items[index].content.textContent).not.to.equal(items[index].content.innerHTML);
      });
    });

    it('should trim the content', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.base.html']);
      el.target = targetElement;

      // opening the quickactions initiliazes the buttons
      el.open = true;
    
      var items = el.items.getAll();
      var buttons = Array.prototype.slice.call(el.querySelectorAll(BUTTON_SELECTOR));

      buttons.forEach(function(button, index) {
        expect(button.getAttribute('title')).to.equal(items[index].content.textContent.trim(), 'The title should be trimmed');
        expect(button.getAttribute('aria-label')).to.equal(items[index].content.textContent.trim(), 'The aria-label should be strip the trimmed');
      });
    });

    it('should reflect an item icon change in buttons and buttonList items', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
      el.target = targetElement;
      var items = el.items.getAll();
      var buttonListItem = el._elements.buttonList.items.first();
      var buttonListItemIcon = buttonListItem.querySelector('coral-icon');
      var button = el.querySelector(BUTTON_SELECTOR);

      expect(buttonListItemIcon.icon).to.equal('copy', 'the buttonList item icon is initially "copy"');
      expect(button.icon).to.equal('copy', 'the button icon is initially "copy"');

      // Change the icon for the first item
      items[0].icon = 'share';
      
      // We have to re-sample the buttonList item
      var buttonListItem = el._elements.buttonList.items.first();
      var buttonListItemIcon = buttonListItem.querySelector('coral-icon');

      expect(buttonListItemIcon.icon).to.equal('share', 'the ButtonList item icon is now "share"');
      expect(button.icon).to.equal('share', 'the button icon is now "share"');
    });

    it('should reflect an Item content change in button titles and buttonList items', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
      el.target = targetElement;
      var items = el.items.getAll();
      var buttonListItem = el._elements.buttonList.items.first();
      var button = el.querySelector(BUTTON_SELECTOR);

      expect(buttonListItem.content.textContent).to.equal('Copy', 'the ButtonList item content is initially "Copy"');
      expect(button.getAttribute('title')).to.equal('Copy', 'the button content is initially "Copy"');

      // Change the content for the first item
      items[0].content.textContent = '  Share  ';

      // Wait for MO
      helpers.next(function() {
        button = el.querySelector(BUTTON_SELECTOR);
        
        // We have to re-sample the buttonList item
        var buttonListItem = el._elements.buttonList.items.first();

        expect(buttonListItem.content.textContent).to.equal('  Share  ', 'the ButtonList item content is now "Share"');
        // expect(button.getAttribute('title')).to.equal('Share', 'Title content should be trimmed');
        expect(button.getAttribute('aria-label')).to.equal('Share', 'Aria-label content should be trimmed');
        done();
      });
    });

    it('should reflect an item type change in buttons and buttonList items', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.open.html']);
      el.target = targetElement;
      var items = el.items.getAll();
      var buttonListItem = el._elements.buttonList.items.first();
      var button = el.querySelector(BUTTON_SELECTOR);

      expect(items[0].type).to.equal(Coral.QuickActions.Item.type.BUTTON);
      expect(button.tagName).to.equal('BUTTON');
      expect(buttonListItem.tagName).to.equal('BUTTON');

      // Change the icon for the first item
      items[0].type = Coral.QuickActions.Item.type.ANCHOR;
      
      // We have to re-sample the buttonList item
      buttonListItem = el._elements.buttonList.items.first();
      button = el.querySelector(BUTTON_SELECTOR);

      expect(buttonListItem.tagName).to.equal('A', 'item should be converted to anchor');
      expect(button.tagName).to.equal('A');
      expect(button.href).to.exist;
    });

    it('should match the Coral.QuickActions width to that of their target on layout', function(done) {
      const el = helpers.build(window.__html__['Coral.QuickActions.empty.html']);
      el.target = targetElement;
      el.open = true;
      var target = el._getTarget(el.target);

      // Wait for quickactions to be open to read layout
      helpers.next(function() {
        expect(el.getBoundingClientRect().width === target.getBoundingClientRect().width).to.equal(true, 'Coral.QuickActions width matches that of their target');
        done();
      });
    });

    it('should override the inline max-width applied by extended Coral.Overlay to prevent collapse', function() {
      const el = helpers.build(window.__html__['Coral.QuickActions.empty.html']);
      expect(el.style.maxWidth === 'none').to.equal(true, 'max-width is correctly overridden');
    });
  });
});
