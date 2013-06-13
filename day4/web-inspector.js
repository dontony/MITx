/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function ($) {
  exports = {};

  // The root element of the inspector.
  var root = null;

  var template = ""
    + "<div class='tray'>"
    + "  <textarea class='text-editor'></textarea>"
    + "  <div class='property-editor'>"
    + "    <div class='node-lookup'>"
    + "      <input class='selector' /><input class='nth' />"
    + "    <button>search</button></div>"
    + "    <div class='property-list'>"
    + "    </div>" 
    + "  </div>" 
    + "</div>" 
    + "<div class='handle'></div>";

  /*
   * Construct the UI
   */
    var closed=true;
  exports.initialize = function() {
    root = $("<div class='inspector'></div>").appendTo($('body'));
      root.append(template);
      root.find('.handle').bind("mousemove", function(e){});
      root.find('.handle').on("click", function(e){
        toggle();
        
        //hide()
      });
      root.find('.node-lookup button').on("click", function(){searchBySelectors()});
      
  };
    var searchBySelectors=function(){
        var selectorBox = root.find('.selector');
        var selectStr= selectorBox.val();
        var selection=$(selectStr).html();
        var textEditor=root.find('.text-editor');
            textEditor.val(selection);
        console.log(selectorBox);
        
    };
    var toggle=function(){
//        if(closed){
//            root.animate({'top':'-300px', 'left':'-500px'}, 2000);
//        }else{
//            root.animate({'top':'0px', 'left':'0px'}, 2000);
//        }
//        closed=!closed;
        if(root.css('top')=='0px'){
            root.animate({'top':'-300px', 'left':'50px'}, 500);
            root.find(('.handle')).animate({'background-color': 'red'}, 500);
        }else{
            root.animate({'top':'0px', 'left':'0px'}, 500);
            root.find(('.handle')).animate({'background-color': 'blue'}, 500);
        }
        
    };
    exports.toggle=toggle;
    
  return exports;
};

/*****************************************************************************
 * Boot up the web inspector!
 *
 * This will enable you to COPY AND PASTE this entire file into any web page
 * to inspect it.
 *
 * XXX TODO!
 *  Change the CSS link below to point to the full URL of your CSS file!
 *
 *  You shouldn't need to touch anything else below.
 *
 *****************************************************************************/
(function() {
    var createInspector = function() {
      window.inspector = Inspector(jQuery);
      window.inspector.initialize();
    }

    // Add the CSS file to the HEAD
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'web-inspector.css'); // XXX TODO CHANGEME!!
    document.head.appendChild(css);

    if ('jQuery' in window) {
      createInspector(window.jQuery);
    } else {
      // Add jQuery to the HEAD and then start polling to see when it is there
      var scr = document.createElement('script');
      scr.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
      document.head.appendChild(scr);
      var t = setInterval(function() {
        if ('jQuery' in window) {
          clearInterval(t); // Stop polling 
          createInspector();
        }
      }, 50);
    }
})();
