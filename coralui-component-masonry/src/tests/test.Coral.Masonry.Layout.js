describe('Coral.Masonry.Layout', function() {
  describe('Namespace', function() {
    it('should be defined', function() {
      expect(Coral.Masonry).to.have.property('Layout');
    });
  });
  
  describe('API', function() {
    let el;
    let layout;
  
    beforeEach(function(done) {
      el = helpers.build(window.__html__['Coral.Masonry.variable.3-columns-9-items.html']);
      
      // Wait for layouting
      helpers.next(function() {
        layout = el._layoutInstance;
        done();
      });
    });
    
    afterEach(function() {
      el = null;
      layout = null;
    });
  
    describe('#layout', function() {});
    
    describe('#destroy', function() {
      it('should remove the item data', function() {
        expect(el.items.getAll()[0]._layoutData).to.be.an('object');
        layout.destroy();
        expect(el.items.getAll()[0]._layoutData).to.be.undefined;
      });
    });
  
    describe('#detach', function() {
      it('should allow to position an item differently', function() {
        var firstItem = el.items.getAll()[0];
        var left = firstItem.getBoundingClientRect().left;
        layout.detach(firstItem);
        firstItem.style.transform = 'translate(1000px,1000px)';
      
        layout.layout();
        
        expect(firstItem.getBoundingClientRect().left).to.not.equal(left);
        expect(el.items.getAll()[1].getBoundingClientRect().left).to.equal(left);
      });
    });
  
    describe('#reattach', function() {});
    
    describe('#itemAt', function() {
      it('should return null if the position is outside the masonry', function() {
        expect(layout.itemAt(-100, -100)).to.be.null;
        expect(layout.itemAt(1000, 1000)).to.be.null;
      });
  
      it('should return the item for a given relative position', function() {
        var boundingClientRect = el.getBoundingClientRect();
        var width =  boundingClientRect.width;
        var height = boundingClientRect.height;
        var center = width / 2;
    
        expect(layout.itemAt(5, 5)).to.equal(el.items.getAll()[0]);
        expect(layout.itemAt(center, 5)).to.equal(el.items.getAll()[1]);
        expect(layout.itemAt(width - 5, 5)).to.equal(el.items.getAll()[2]);
    
        expect(layout.itemAt(center, height / 2)).to.equal(el.items.getAll()[4]);
        expect(layout.itemAt(center, height - 5)).to.equal(el.items.getAll()[7]);
      });
    });
  });
  
  describe('Implementation Details', function() {
  
    ['fixed-centered', 'fixed-spread', 'variable', 'dashboard'].forEach((layoutName) => {
      it('should be centered', function(done) {
        const el = helpers.build(window.__html__['Coral.Masonry.no-layout.centered.html']);
        
        el.layout = layoutName;
    
        helpers.next(function() {
          const masonryRect = el.getBoundingClientRect();
          const leftRect = el.items.getAll()[0].getBoundingClientRect();
          const rightRect = el.items.getAll()[2].getBoundingClientRect();
      
          expect(leftRect.left - masonryRect.left).to.equal(masonryRect.right - rightRect.right);
          done();
        });
      });
    });
  
    it('should support columnwidth', function(done) {
      const el = helpers.build(new Coral.Masonry());
      const item = el.items.add();
      const columnWidth = 100;
    
      el.setAttribute('columnwidth', columnWidth);
    
      // Wait for MO
      helpers.next(function() {
        const itemRect = item.getBoundingClientRect();
      
        expect(itemRect.width).to.equal(columnWidth);
        done();
      });
    });
  
    it('should support spacing', function(done) {
      const el = helpers.build(new Coral.Masonry());
      const item1 = el.items.add();
      const item2 = el.items.add();
      const spacing = 20;
    
      el.style.width = '300px';
      el.setAttribute('spacing', spacing);
      el.setAttribute('columnwidth', 100);
    
      // Wait for MO
      helpers.next(function() {
        const item1Rect = item1.getBoundingClientRect();
        const item2Rect = item2.getBoundingClientRect();
      
        expect(item2Rect.left - item1Rect.right).to.equal(spacing);
        done();
      });
    });
  
    it('should support multi-columns', function(done) {
      const el = helpers.build(window.__html__['Coral.Masonry.multi-column.html']);
      const multiColumnItem = el.items.getAll()[2];
    
      // Wait for layouting
      helpers.next(function() {
        // should render the item on the next line if there is not enough space
        var itemsAbove = el.items.getAll().slice(0, 2);
        var multiColumnItemTop = multiColumnItem.getBoundingClientRect().top;
        for (var i = 0; i < itemsAbove.length; i++) {
          var itemAboveBottom = itemsAbove[i].getBoundingClientRect().bottom;
          expect(itemAboveBottom).to.be.below(multiColumnItemTop);
        }
      
        done();
      });
    });
  
    it('should support dashboard layout', function(done) {
      const el = helpers.build(window.__html__['Coral.Masonry.dashboard.different-heights.html']);
    
      // Wait for layouting
      helpers.next(function() {
        // should expand the height of items to fill the remaining space
        var masonryHeight = el.getBoundingClientRect().height;
        var items = el.items.getAll();
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          expect(item.getBoundingClientRect().height).to.equal(masonryHeight);
        }
      
        done();
      });
    });
  
    it('should support fixed-spread layout', function() {
      const el = helpers.build(window.__html__['Coral.Masonry.fixed-spread.left-aligned.html']);
      // should align the items on the left if the first row is not filled
      expect(el.items.first().getBoundingClientRect().left).to.equal(el.getBoundingClientRect().left);
    });
  
    it('should support fixed-centered layout', function(done) {
      const el = helpers.build(window.__html__['Coral.Masonry.fixed-centered.2-items.html']);
    
      // Wait for layouting
      helpers.next(function() {
        // should center the items even if the first row is not filled
        var items = el.items.getAll();
        var mr = el.getBoundingClientRect();
        var paddingLeft = items[0].getBoundingClientRect().left - mr.left;
        var paddingRight = mr.right - items[1].getBoundingClientRect().right;
        expect(paddingLeft).to.equal(paddingRight);
      
        done();
      });
    });
  });
});
