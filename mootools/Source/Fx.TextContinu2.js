/*
---
name: Fx.TextContinu.js
description: Creates a text and follow in other div.
authors: Nicolas de Marqué
requires:
    core/1.2.4:
provides: [TextContinu]
license: CC-by-SA
version: 1.0.0
...
 */
Element.implement({
	isHidden: function(){
		var parents = this.getParents();
		var allmarge=0
		for (var i=0; i<parents.length; i++){
			var parent=parents[i]
			if(parent.nodeName.toLowerCase()=="body")break;
			var bbw=parent.getStyle('border-bottom-width').toInt()
			var btw=parent.getStyle('border-top-width').toInt()
			var pb=parent.getStyle('padding-bottom').toInt()
			var pt=parent.getStyle('padding-top').toInt()
			var mb=parent.getStyle('margin-bottom').toInt()
			var mt=parent.getStyle('margin-top').toInt()
			var parentSize = parent.getSize().y-(bbw+btw);
			allmarge+=+pt+pb
			var bottom =  this.getPosition(parent).y+this.getSize().y;
		
			if(bottom>parentSize)
				return true;
		}
		return false;
		
	},
	isVisible: function(){
		return !this.isHidden();
	}
});

Fx.TextContinu = new Class({
	
	Implements: [Options],

	options: {
		debug : 'cutTag',
		spanClass : 'spanClass'
	},
	initialize: function(element, followers, options){
		this.subject = this.subject || this;
		this.element = element;
		this.followers = followers;
		this.followersNumber = 0
		this.follower = followers[0];
		this.setOptions(options);
		
		this.parseText();
		this.placeText(element.firstChild, this.follower);
		this.mergeText(element)
		followers.each(function(ele){this.mergeText(ele)}, this);
	},
	parseText: function(){
		this.tmpDiv = new Element("div");
		this.cutTag(this.element, true);
		while(this.element.hasChildNodes()){
			this.element.removeChild(this.element.firstChild);
		}
		while(this.tmpDiv.hasChildNodes()){
			this.element.appendChild(this.tmpDiv.removeChild(this.tmpDiv.firstChild))
			if(this.tmpDiv.firstChild && this.element.lastChild.nodeName==this.tmpDiv.firstChild.nodeName)this.element.appendText(" ");
		}
	},
	cutTxt: function(element, tag){
		this.inc=0;
		element.textContent.split(" ").each(function(txt, inc){
			//if(this.inc<3) alert(tag+" "+txt)
			//if(inc!=this.inc)s=" "; else s="";
			if(tag){
				var el = tag.clone()
				var tel=el
				while(tel.hasChildNodes()) tel=tel.firstChild
				tel.set('text', txt);
			}
			else
				var el = new Element("span").addClass(this.options.spanClass).set('text', txt);
			this.tmpDiv.appendChild(el)
			this.inc++;
		}, this)
	},
	cutTag: function(element, simple){
		var sibling=element.firstChild;
		while(sibling){
			//for(var i=0; i<element.childNodes.length; i++){
			var child = sibling;
			//alert("Sibling:"+sibling+" \nSimple:"+simple+"\nChild"+child+" - "+child.nodeType);
			sibling=sibling.nextSibling;
			
			
			if(simple==true)
				var tag=null;
			else
				if(simple==null)
					var tag = element.clone().set("text", "");
				else{
					simple.appendChild(element.clone().set("text", ""));
					var tag = simple
				}

			if(child.nodeType==1)var newChilds=this.cutTag(child, tag);
			if(child.nodeType==3)var newChilds=this.cutTxt(child, tag);
		}
	},
	replaceOneByMore: function(one, more){
		var td = new Element("div").replaces(one)
		alert(more.childNodes.length);
		for(var i=0; i<more.childNodes.length; i++){
			//alert(more.childNodes.item(i))
			more.childNodes.item(i).inject(td, 'before');	
		}
		td.parentNode.removeChild(td)
	},
	placeText: function(element, follower){
		if(!follower) return false;
		var inc=0;
		do{
			if($(element).nodeType==1 && $(element).isHidden()){
				do{
					sibling=element.nextSibling
					//var rel=element.parentNode.removeChild(element)
					//if(rel.nodeType==1 && $(rel).hasClass(this.options.spanClass))rel=rel.firstChild;
					follower.appendChild(element.parentNode.removeChild(element))
					if(element.nodeType==1 && element.isHidden()){
						follower=this.nextFollower();
						follower.appendChild(element.parentNode.removeChild(element))
						element=sibling;
						break
					}
				}while(element=sibling);
				//this.placeText(follower.firstChild, this.follower);
				//break;
				if(!element)break
			}
		}while(element=element.nextSibling);
	},
	nextFollower: function(){
		this.followersNumber++
		this.follower = this.followers[this.followersNumber]
		return this.follower;
	},
	mergeText: function(element){
		
	}
})

window.addEvent('domready', function() {
		var t=new Date()
		var t1=t.getTime()
		var origins = new Hash();
		$$('[class*=follow-]').each(function(ele){
			ele.getProperty('class').split(' ').each(function(class){
				if(class.contains('follow-')){
					var elementCible=class.substring(class.indexOf('-')+1)
					if(!eval("origins."+elementCible)){
						eval("origins."+elementCible+" = new Hash()");
						eval("origins."+elementCible+".name = '"+elementCible+"'");
						eval("origins."+elementCible+".followers = new Array()");
					}
					eval("origins."+elementCible+".followers.push(ele)");
				}
			}, origins, ele)
		}, origins);
		/*origins.each(function(obj){
							  obj.followers.each(
												 function(obj){
													 alert(obj.getProperty('id'))
												})
		})//alert(origins.div.followers);
		*/
		origins.each(function(obj){new Fx.TextContinu($(obj.name), obj.followers)});
		var t=new Date()
		var t2=t.getTime()
		alert(t2-t1)
})