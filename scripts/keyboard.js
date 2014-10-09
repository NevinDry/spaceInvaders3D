window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  L: 37,
  U: 38,
  R: 39,
  S: 83,
  D: 40,
  M: 77,
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

if ( window.addEventListener ) {
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  window.addEventListener("keydown", function(e){
  kkeys.push( e.keyCode );
  if ( kkeys.toString().indexOf( konami ) >= 0 ) {
	  if(!konamiCode){
	      $("#audio").html('<audio autoplay controls loop><source src="song/sax.mp3" type="audio/mpeg"></audio>');
	  }
	  konamiCode = true;
      
  }
}, true);
}

window.addEventListener( 'keypress', function( e ) { 
	if(begin){
		if (e.keyCode = "32")		
		{
			console.log("début");
			gamePlay();
			begin = false;
	    }
	}
} );


