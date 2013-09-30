//
// Namespace - Module Pattern.
//
var MNSWPR = (function($, window, document, undefined) {
  // Expose innards of MNSWPR.
  var mines = [];
  return {
    go: function() {
      for (var i in MNSWPR.init) {
        MNSWPR.init[i]();
      }
    },
    //
    // Initialize the board.
    //
    init: {
      board: function() {
        while (mines.length < 10) {
          var rando = MNSWPR.util.getRandomIntRange(0, 63);
          var unique = false;
          for ( var i=0; i<mines.length; i++ ) {
            if (mines[i] === rando) {
              unique = true; 
              break;
            }
          }
          if (!unique) {
            mines[mines.length] = rando;
          }
        }

        var row = 0, col = 0;
        $("td").each(function(index) {
          for ( var i=0; i<10; i++ ) {
            if ( index === mines[i] ) {
              $(this).addClass("mine");
            }
          }

          $(this).data("idx", [row, col]);
          col += 1;
          if (col === 8) {
            row += 1;
            col = 0;
          }
        });
      },
      //
      // Setup the controls.
      //
      controls: function() {
        // Alias to document.
        var d = $(document);

        // Flag
        d.on('contextmenu', 'td', function() {
          $(this).html('<img src="glyphicons_266_flag.png" alt="Flagged" />').addClass("flagged");
          return false;
        });

        // Test
        d.on('click', 'td', function() {
          if ( $(this).hasClass("mine") ) {
            $("td").each(function(index) {
              if ( $(this).hasClass("mine") ) {
                $(this).html('<img src="glyphicons_289_bomb.png" alt="Mine" />');
              }
            });
            $('span').html("GAME OVER");
            d.off('click', 'td');
            d.off('click', 'button');
            d.off('contextmenu', 'td');
            $('table').css('opacity','0.5');
          }
          else {
            $(this).addClass("flagged");
            var coordY = $(this).data("idx")[1];
            var counter = 0;
            if ( $(this).prev().hasClass("mine") ) counter++;
            if ( $(this).next().hasClass("mine") ) counter++;
            if ( $(this).parent().prev().children('td').eq(Math.abs(coordY-1)).hasClass("mine") ) counter++;
            if ( $(this).parent().prev().children('td').eq(coordY).hasClass("mine") ) counter++;
            if ( $(this).parent().prev().children('td').eq(coordY+1).hasClass("mine") ) counter++;
            if ( $(this).parent().next().children('td').eq(Math.abs(coordY-1)).hasClass("mine") ) counter++;
            if ( $(this).parent().next().children('td').eq(coordY).hasClass("mine") ) counter++;
            if ( $(this).parent().next().children('td').eq(coordY+1).hasClass("mine") ) counter++;
            
            if ( counter > 0 ) {
              $(this).html(counter);
            }
            else {
              $(this).prev().addClass("flagged");
              $(this).next().addClass("flagged");
              $(this).parent().prev().children('td').eq(Math.abs(coordY-1)).addClass("flagged");
              $(this).parent().prev().children('td').eq(coordY).addClass("flagged");
              $(this).parent().prev().children('td').eq(coordY+1).addClass("flagged");
              $(this).parent().next().children('td').eq(Math.abs(coordY-1)).addClass("flagged");
              $(this).parent().next().children('td').eq(coordY).addClass("flagged");
              $(this).parent().next().children('td').eq(coordY+1).addClass("flagged");
            }
          }
        });

        d.on('click', 'button', function() {
          $('td').each(function(index) {
            if ( !$(this).hasClass("flagged") && !$(this).hasClass("mine") ) {
              $('span').html("GAME OVER");
            }
            else {
              $('span').html("YAAY!! YOU DID IT!!!");
            }
          });
          d.off('click', 'td');
          d.off('click', 'button');
          d.off('contextmenu', 'td');
          $('table').css('opacity','0.5');
          return false;
        });
      }
    },
    util: {
      getRandomIntRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
  };
})(jQuery, this, this.document);

//
// Kick things off.
//
jQuery(document).ready(function() {
  MNSWPR.go();
});
