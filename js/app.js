
  /**
   * app.js
   * 
   * @author Anthony Su
   */

  var ZERO = THRESHOLD_ON = 0, ONE = THRESHOLD_OFF = 1, TWO = 2, THREE = ALL = 3;
  var FRAME_SIZE = {
    SMALL: 75,
    MEDIUM: 150,
    LARGE: 300
  };

  var data_store = [data_one];
  var ALL_CLASS = "ALL";
  var CFG = {
     frame_width: FRAME_SIZE.MEDIUM,
     threshold_on: false, 
     DIRECTORIES: [["one", 15, true],["two", 29, true],["three", 56, true]],
     first_load: true,
     ANIMATION_TIME : 400,
     SHOW_ANIM_CLASS: 'show-anim',
     SHOW_CLASS: 'show',
     HIDE_ANIM_CLASS: 'hide-anim',
     HIDE_CLASS: 'hide',
     FRAME_SET: ALL,
     lq_class: ALL_CLASS,
     lo_class: ALL_CLASS,
     sd_class: ALL_CLASS,
     sf_class: ALL_CLASS,
     tr_class: ALL_CLASS

  };

    //corresponding classes to different filters
    var line_quality = ["lq_0","lq_1","lq_2", ALL_CLASS],
    line_orientation = ["lo0","lo_1","lo_2", ALL_CLASS],
    space_depth = ["sd_0","sd_1","sd_2", ALL_CLASS],
    space_familiarity = ["sf_0","sf_1","sf_2", ALL_CLASS],
    tonal_range = ["tr_0","tr_1","tr_2", ALL_CLASS],
    SELECTED_CLASS = "selected";

  


  function show($elem) {
    $elem.addClass(CFG.SHOW_CLASS);
    setTimeout(function(){
      $elem.removeClass(CFG.HIDE_CLASS).addClass(CFG.SHOW_ANIM_CLASS)
    }
    , CFG.ANIMATION_TIME);
  }

  function hide($elem) {
    $elem.removeClass(CFG.SHOW_ANIM_CLASS).
          removeClass(CFG.SHOW_CLASS).
          addClass(CFG.HIDE_ANIM_CLASS);
    setTimeout(function(){$elem.addClass(CFG.HIDE_CLASS)},CFG.ANIMATION_TIME);
  }



  var set_id = ["set_one","set_two","set_three"];
  var $container, $overlay, $img_container;

  function load_images() {

       
        $(CFG.DIRECTORIES).each(function(idx, arr) {
        
            var COUNT = arr[1],
                IDX_LIMIT = COUNT + 1,
                $set = (CFG.first_load)? $('<div/>').attr({id: set_id[idx], class:'set'}) : $('#' + set_id[idx]) ;
  

        if(CFG.first_load) {
          var $fragment = $(document.createDocumentFragment());


          for(var i = 1; i < IDX_LIMIT; i++) {
            var div = document.createElement('div') 
              , img = document.createElement('img')
              , span = document.createElement('span');

            //TODO
            //var data = data_store[idx];
            var data = data_one;

            //TODO: parse other data
            var k = i-1;
            if(k > 14) {
              k = 14;
            }
            var obj = data[k];



            div.className = [
              "img_container",
              line_quality[obj["line quality"]],
              line_orientation[obj["line orientation"]],
              space_depth[obj["space depth"]],
              space_familiarity[obj["space familiarity"]],
              tonal_range[obj["tonal range"]]
            ].join(" ");

            var num = i.toString().replace(/^(\d)$/,"00$1").replace(/^(\d\d)$/,"0$1");
            div.setAttribute("data-img", arr[0] + "/" + num + ".png");

            img.src = arr[0] + "/"+ CFG.frame_width+ "/" + num + (CFG.threshold_on ? "_threshold" : "")+ "_" + CFG.frame_width + ".png";
            
            span.appendChild(document.createTextNode(i));
            span.setAttribute("class","digit");
            div.appendChild(img);
            div.appendChild(span);
            $set.append(div);
          }

          $set.append(document.createElement('hr'));
          $fragment.append($set.addClass('hide'));
          $container.append($fragment);

        } else {

          // load new set of images
          hide($set);
          
          $('img',$set).each(function(j, img){
            j = j+1;
            img. src = arr[0] + "/"+ CFG.frame_width+ "/" + j.toString().replace(/^(\d)$/,"00$1").replace(/^(\d\d)$/,"0$1") + (CFG.threshold_on ? "_threshold" : "")+ "_" + CFG.frame_width + ".png";

          });

          if(CFG.FRAME_SET == ALL || idx === CFG.FRAME_SET) {
            show($set);
          } 
       

        }

      });

  }

  function make_selection() {
    var selected_classes =  [];

     if( CFG.lq_class != ALL_CLASS) {
       selected_classes.push("." + CFG.lq_class);
     }
     if( CFG.lo_class != ALL_CLASS) {
       selected_classes.push("." + CFG.lo_class);
     }
      if( CFG.sd_class != ALL_CLASS) {
       selected_classes.push("." + CFG.sd_class);
     }
      if( CFG.sf_class != ALL_CLASS) {
       selected_classes.push("." + CFG.sf_class);
     }
      if( CFG.tr_class != ALL_CLASS) {
       selected_classes.push("." + CFG.tr_class);
     }
     // create intersection of all classes
     selected_classes =  selected_classes.join("");

     if(selected_classes == "") {
          $("." + SELECTED_CLASS).removeClass(SELECTED_CLASS);
    } else {
           $(selected_classes).addClass(SELECTED_CLASS);
           $img_container.not(selected_classes).removeClass(SELECTED_CLASS);
    }

  }


    window.onload = function() {
  
    //var DIRECTORIES = [["one", 15, true],["two", 29, true],["three", 56, true]/*,["four/150", 224, true]/*,["five/150", 446, true]*/];
    $container = $('#container');
    $overlay = $('#overlay');

    load_images();
    $img_container = $('.img_container');
  
     var view = document.querySelector('#view'),
         toggle = document.querySelector('#toggle');
         show($('.set').addClass("hide"));

     $('#view').click(function() {
        $('#toggle').toggleClass("down");
        $('dl').toggleClass("hide_controls");
     });

    // event delegation for controls clicked
    $("#controls").on("click","input", function() {
  
      var class_name = $(this).attr("name");
      var i = parseInt($(this).attr("value"),10);

      switch(class_name) {
        case "frame_set":
          CFG.FRAME_SET = i;
          
          if(i == ALL) {
            show($('.set'));
          
          } else {
            hide($('.set').not(document.getElementById(set_id[i])));
            show($('#' + set_id[i]));
          }

          break;
        case "frame_size":
          if(i === CFG.frame_width) {
            break;
          } else if (i === FRAME_SIZE.SMALL) {
            CFG.frame_width = FRAME_SIZE.SMALL;
          } else if (i === FRAME_SIZE.MEDIUM) {
            CFG.frame_width = FRAME_SIZE.MEDIUM;
          } else {
            CFG.frame_width = FRAME_SIZE.LARGE;
          }
         
          load_images();
          break;
        case "threshold":

          if(i == THRESHOLD_OFF && CFG.threshold_on) {
            CFG.threshold_on = false;
          } else if(i == THRESHOLD_ON && !CFG.threshold_on) {
             CFG.threshold_on = true;
          } else {
             break;
          }
          load_images();
          break;

        case "l_quality":
          CFG.lq_class = line_quality[i];
          make_selection();
          break;
        case "l_orientation":
          CFG.lo_class = line_orientation[i];
          make_selection();
          break;
        case "space_depth":
          CFG.sd_class = space_depth[i];
          make_selection();
          break;
        case "s_familiarity":
           CFG.sf_class = space_familiarity[i];
           make_selection(); 
          break;
        case "t_range":
          CFG.tr_class = tonal_range[i];
          make_selection(); 
          break;
  
        default:
          break;
      }
    });

    $container.on("click",".img_container",function() {
      var src = $(this).attr("data-img");
      if (CFG.threshold_on) {
        src = src.replace(/.png/,"_threshold.png");
      }
      var $img = $('<img/>',{src: src}); 
    
      $overlay.text("").append($img).show();
    });

    $overlay.click(function(){
      $(this).fadeOut();
    })

      CFG.first_load = false;
    }

    