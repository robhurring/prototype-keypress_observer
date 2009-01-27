/*
	=About
	Keypress observer monitors a document's keypresses and if they match the specified combo it calls the callback.
  Author:: Rob Hurring <rob@zerobased.com>
  Homepage:: http://github.com/robhurring
  Date:: 1/27/09
  
  =Options

	Keypress.Observer accepts:

		shift:: 	we want the SHIFT key down
		alt:: 		we want the ALT key down
		control:: we want the CTRL key down
		meta:: 		we want the META key down

  =Usage

		// monitor ctrl-shift-G
		new Keypress.Observer(Ansi.G, function(e)
		{
			alert('Do something');
		},{shift:true, control:true});
    
		// monitor ctrl-meta-shift-P
		new Keypress.observe(Ansi.P, function(e)
		{
			print_document();
		}, {control:true, meta:true, shift:true});

  =Dependencies

  written against Prototype 1.6.0.1

	=TODO
	
	"genericize" this class and include it in document + Element prototypes so we can do, say,
	document.ext_observe(...) rather than Keypress.Observer(...)
	
*/
if(!window.Keypress) var Keypress = {};
if(!window.Ansi) var Ansi = {};
/**
 *	Our ANSI map for the alphabet of keyboard keys.
 */
Object.extend(Ansi,
{
	SHIFT: 32,
	CTRL: 96,
	A: 97,		B: 98,		C: 99,		D: 100,		E: 101,
	F: 102,		G: 103,		H: 104,		I: 105,		J: 106,
	K: 107,		L: 108,		M: 109,		N: 110,		O: 111,
	P: 112,		Q: 113,		R: 114,		S: 115,		T: 116,
	U: 117,		V: 118,		W: 119,		X: 120,		Y: 121,
	Z: 122
});
/*
	Monitors the document's keypresses and issues callbacks if hit
*/
Keypress.Observer = Class.create();
Object.extend(Keypress.Observer.prototype,
{
  initialize: function(key_code, callback, options) {
		this.key_code = key_code;
		this.callback = callback || function(e){}
		this.options = $H(Object.extend({
			shift: false,
			meta: false,
			alt: false,
			control: false,
			listen:document
		}, options || {}));
		this.listen = this.options.unset('listen');
		this.options = this.options.toObject();
		
		// control changes the key_code so this will adjust for that
		if(this.options.control)
			this.key_code -= Ansi.CTRL;

		// if they want a "G" and pass in a "g" this will correct the key_code
		if(this.options.shift && !this.options.control && !this.options.meta && this.key_code >= 97 && this.key_code <= 122)
			this.key_code -= Ansi.SHIFT;

		// if they want a "G" and don't set shift == true we must set that so the keyboard options and our options match up
		if(this.key_code < 97)
			this.options.shift = true;
		
		this.observe(this.listen);
	},
	observe:function(element)
	{
		element.observe('keypress', function(e)
		{
			var char_code = (e.charCode ? e.charCode : e.keyCode);
			var keyboard_options = {
				shift: e.shiftKey,
				meta: e.metaKey,
				alt: e.altKey,
				control: e.ctrlKey
			};
			/* FIXME: comparing the 2 hashes via toQueryString, this seems horrible, but i'm not sure how else to
								compare 2 hashes/objects... and it works :)
			*/
			if(char_code == this.key_code && ($H(keyboard_options).toQueryString() == $H(this.options).toQueryString()))
				this.callback(e);
		}.bind(this));		
	}
});
