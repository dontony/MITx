/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function($) {
  exports = {};
	
  // The root element of the inspector.
  	var root = null;
  var template = ""
    + "<div class='tray'>"
    + "  <textarea class='text-editor'></textarea>"
    + "  <div class='property-editor'>"
    + "    <div class='node-lookup'>"
    + "      <input class='selector' /><input class='nth' />"
    + "      <button id='search'>search</button>"
    + "      <button id='visual'>visual selector</button>"
    + "    </div>"
    + "    <div class='property-list'>"
    + "    </div>" 
    + "  </div>" 
    + "</div>" 
    + "<div class='handle'></div>";
    
  var toggle=function(){
    if(root.css("top")=="0px"){
        root.animate( { "top": "-300px"}, 500); //500 is number of milliseconds it'll take
    } else {
        root.animate( { "top": "0px"}, 500);
    }
  }
  
  var searchBySelector=function(){
      var selectorBox=root.find(".selector");
      var selectorStr=selectorBox.val();
        var n = parseInt(root.find(".nth").val());
        if (isNaN(n)){
            n=0;
        }
      var selection=$(selectorStr).eq(n);
      prev_target=selection;
      var html = selection.html();
      var textEditor=root.find(".text-editor");
      textEditor.val(html);
      getCSS(selection);
      
  }
  
  function getCSS(selection){
  //TODO: clear table, make table id, clear that tablecolor
  
      var csscolor = selection.css('color');
      var cssbgcolor = selection.css('background-color');
      
      var cspan=$("<div>color: " +csscolor+"</div>");
      cspan.css("color","#000000");
      var cbox = $("<span>color</span>");
      cbox.css('background-color', csscolor);
      cbox.css('color', csscolor);
      cbox.css('min-width', '50px');
      cbox.css('border', 'solid 1px black');
      cspan.append(cbox);
      var cbgspan=$("<div>background-color: "+cssbgcolor+"</div>");
      cbgspan.css("color","#000000");
      var cbgbox = $("<span>color</span>");
      cbgbox.css('color', cssbgcolor);
      cbgbox.css('background-color', cssbgcolor);
      cbgbox.css('min-width', '50px');
      cbgbox.css('border', 'solid 1px black');
      cbgspan.append(cbgbox);
      var cssfont = selection.css('font');
      var csstop = selection.css('top');
      var cssleft = selection.css('left');
      var cssmargin = selection.css('margin');
      var cssborder = selection.css('border');
      var csspadding = selection.css('padding');
      var cssheight = selection.css('height');
      var csswidth = selection.css('width');
      console.log(cbgspan);
      console.log(cspan);
      
      var cssTable = $('<table></table>');
      //TODO: clear table, get table font color=black
      cssTable.css('color','#000000');
      
      var row1=$('<tr></tr>');
      row1.html('<td>color</td>');
      var col1 = $('<td/>');
      col1.append(cspan);
      row1.append(col1);
      var row2=$('<tr></tr>');
      row2.html('<td>background-color</td>');
      var col2 = $('<td/>');
      col2.append(cbgspan);
      row2.append(col2);
      
      cssTable.append("<tr><td>font</td><td>"+cssfont+"</td></tr>");
      cssTable.append("<tr><td>width</td><td>"+csswidth+"</td></tr>");
      cssTable.append("<tr><td>height</td><td>"+cssheight+"</td></tr>");
      cssTable.append("<tr><td>top</td><td>"+csstop+"</td></tr>");
      cssTable.append("<tr><td>left</td><td>"+cssleft+"</td></tr>");
      cssTable.append("<tr><td>border</td><td>"+cssborder+"</td></tr>");
      cssTable.append("<tr><td>margin</td><td>"+cssmargin+"</td></tr>");
      cssTable.append("<tr><td>padding</td><td>"+csspadding+"</td></tr>");
      cssTable.append(row1);
      cssTable.append(row2);
      
      
      
      
      var cssText=root.find(".property-list");
      var cssProperties='width: ' + csswidth+'</br>height: ' 
        + cssheight+'</br>margin: ' + cssmargin+'</br>border: ' 
        + cssborder+'</br>padding: ' + csspadding+'</br>top: ' 
        + csstop+'</br>left: ' + cssleft+''  
        +'</br>font: ' + cssfont;
      
      //cssText.html(cssProperties);
      //cssText.append(cbgspan);
      //cssText.append(cspan);
      cssText.append(cssTable);
  }
  
  var changeHTMLLive=function(event){
    console.log(event);
   
    var textEditor=root.find(".text-editor");
    var html = textEditor.val(); //gets whatever's in text box
    //find the header that was in the selection box
    //go to whatever n was in the nth input box
    /*var selector=root.find(".selector").val();
    var n = parseInt(root.find(".nth").val());
    if (isNaN(n)){
        n=0;
    }
    console.log(selector);
    console.log(n);
    var selection = $(selector).eq(n);*/
    var selection=prev_target;
    selection.html(html);
  }
  
  var prev_border=null;
  var prev_target=null;//for tracking the previous higlighted object, so we have the ability to take the border off
  var visualSel=false;
  var visualSelection=function(event){
      if(visualSel){
      		target = $(event.target);
              if(prev_target){
                  console.log('targeting');
                  if(target[0]===prev_target[0]){
                      console.log('tracking target');
                    }else{
                        console.log('target changed');
                        prev_target.css('border',prev_border);
                        prev_border=target.css('border');
                        
                        prev_target.off('click');
                        target.on('click', saveInEditor);
                        console.log(target);
	      		}
	      		target.css('border', 'solid 5px red');
	      		prev_target=target;
	      		
				      		
	      		
      		}
      		else{
      			console.log('first target');
      			target = $(event.target);
      			console.log(target);
                prev_border=target.css('border');
      			target.css('border', 'solid 5px red');
	      		prev_target=target;
      		}
            event.stopPropagation();
	      var html = target.parent().html();
	      var textEditor=root.find(".text-editor");
	      textEditor.val(html);
	      getCSS(target);
      }
  }
  
  function saveInEditor(e){
  	e.stopPropagation();
  	visualSel=false;
  	if(prev_target!=null){
  		prev_target.off('click');
        prev_target.css('border',prev_border);
  		//var selectorBox=root.find(".selector");
  		//selectorBox.val(prev_target.attr('class'));
  		
  		//console.log(selectorBox.val());
       
  	}
  	 
  }
  
  
  /*
   * Construct the UI
   */
  exports.initialize = function() {
    root = $("<div class='inspector'></div>").appendTo($('body'));
      
    root.append(template);
    root.find(".handle").on("click",toggle); //searches for this selector but only in 'root'
    root.find("#search").on("click",searchBySelector);  
    root.find("#visual").on("click",function(e){
        if (visualSel){ 
            visualSel=false;
            prev_target.css('border', 'none');}
        else{ visualSel=true;}
        
    });  
    root.find(".text-editor").on("keypress",changeHTMLLive);
    
    $('#wrapper').on('mousemove', visualSelection);
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
