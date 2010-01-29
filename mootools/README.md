Fx.TextContinu
===============

Fx.TextContinu is a class that divide an element with text in multiples elements.

![Screenshot](http://github.com/nicodmf/TextContinu/raw/master/mootools/icon.png)

Requirements
------------

* [MooTools Core 1.2.4](http://mootools.net/core)

### Extends:

- [Options][]

How to use
----------

### Syntax
	#JS
	var textContinu = new Fx.TextContinu(el, followers{, options});

### Arguments

1. element - (*element*) the element itself.
2. followers - (*elements*) an array of elements in which the text must place (in this order : the first to the last).
3. options - (*options*) a key/value set of options.

### Options

### Returns:

* (*object*) A new TextContinuElement instance.

### Example:

Morphing using an div:

	#JS
	var poem = new Fx.TextContinu($('poem'),$$('[class*=follow-poem]')});
