'use strict';

var Handlebars = require('handlebars');

(function (handlebars) {

  'use strict';

  var getBlocks = function getBlocks(context, name) {
    var blocks = context._blocks;
    return blocks[name] || (blocks[name] = []);
  };

  handlebars.registerHelper({
    extend: function extend(partial, options) {
      var context = Object.create(this);
      var template = handlebars.partials[partial];

      // Partial template required
      if (template == null) {
        throw new Error('Missing layout partial: \'' + partial + '\'');
      }

      // New block context
      context._blocks = {};

      // Parse blocks and discard output
      options.fn(context);

      // Render final layout partial with revised blocks
      if (typeof template !== 'function') {
        template = handlebars.compile(template);
      }

      // Compile, then render
      return template(context);
    },

    append: function append(name, options) {
      getBlocks(this, name).push({
        should: 'append',
        fn: options.fn
      });
    },

    prepend: function prepend(name, options) {
      getBlocks(this, name).push({
        should: 'prepend',
        fn: options.fn
      });
    },

    replace: function replace(name, options) {
      getBlocks(this, name).push({
        should: 'replace',
        fn: options.fn
      });
    },

    block: function block(name, options) {
      var block = null;
      var retval = options.fn(this);
      var blocks = getBlocks(this, name);
      var length = blocks.length;
      var i = 0;

      for (; i < length; i++) {
        block = blocks[i];

        switch (block && block.fn && block.should) {
          case 'append':
            retval = retval + block.fn(this);
            break;

          case 'prepend':
            retval = block.fn(this) + retval;
            break;

          case 'replace':
            retval = block.fn(this);
            break;
        }
      }

      return retval;
    },

    foreach: function foreach(context, options) {
      var ret = "";

      for (var i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i]);
      }

      return ret;
    }

  });
})(Handlebars);