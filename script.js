// #####################################
//
//  ABANDON HOPE, ALL YE WHO ENTER HERE
//
//   this is definitely the worst code
//   you will ever lay your eyes upon.
//    looking back at it a month later
//    i wonder what sort of psychotic
//    breakdown i mustve been having
//            writing this.
//
// #####################################

var $openpage;
function openpage(event) {
	closepage();
	const $link = $(event.target).closest('a');
// 	console.log($link.text());
	let $page = $link
		.parent()
		.find(".page");
// 	console.log($link.prop("tagName"));
	$page.show("slide");
	$openpage = $page;
}
function closepage() {
    if($('.fscreenitem')[0]){
        $('.fscreenitem').removeClass('fscreenitem');
    } else if($openpage){
		$openpage.find('iframe').attr( 'src', function ( i, val ) { return val; });
		$openpage.hide("slide");
	}
}
$.fn.toPx = function(settings){
    settings = jQuery.extend({
        scope: 'body'
    }, settings);
    var that = parseFloat(this[0]),
        scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
        scopeVal = scopeTest.height();
    scopeTest.remove();
    return Math.round(that * scopeVal);
};

$(document).on("keydown", function(event) {
	if(event.key == "Escape") {
		closepage();
	}
});
$(document).ready(function(){
	$.getJSON("poem.json", function(poem){
		$("#title").text(poem.title)
		for(const i in poem.stanzas){
			stz = poem.stanzas[i];
			let $stz = $('<div class="stzcontainer"/>')
				.append($('<p class="stanz"/>').text(stz))
				.append('<div class="desc"/>');
			$(".text").append($stz);
			$.getJSON("ls.php?path=content/"+(parseInt(i)+1), function(ls){
				files = [];
				for(const e of ls){
					file = e.split("/");
					if(file.length == 3) {
						let $desccontent = $('<div class="desccontent" id="'+file.join("-").replace(new RegExp(' ', 'g'),'_')+'"/>')
							.append('<a class="openpage"><img class="thumb"/></a>')
							.append(
								$('<div class="page"><div class="pagecontent"><div class="pageitem"/></div></div>')
									.prepend($('<img class="closebutton" src="close.svg">').click(closepage) )
									);
						$stz.find(".desc").append($desccontent)
					} else {
						files.push(file);
					}
				}
				for(const file of files){
//                     console.log(file.slice(0,-1).join("-").replace(new RegExp(' ', 'g'),'_'));
					let $desc = $stz.find("#"+file.slice(0,-1).join("-").replace(new RegExp(' ', 'g'),'_'));
					const path = file.join("/");
                    let ext, name;
                    if(file.slice(-1)[0].split(".").length > 1){
                        ext = file.slice(-1)[0].split(".").slice(-1)[0].toLowerCase();
                        name = file.slice(-1)[0].split(".")[0].toLowerCase()
                        console.log(name,ext);
                    } else {
                        ext = "";
                    }
					if(name && name.toLowerCase() == "description"){
						$.get(path, function(desc){
							$desc.find('.openpage').append(desc).click(openpage);
							$desc.find('.pagecontent').prepend($('<h1/>').text(desc));
						});
					} else if(name && name.toLowerCase() == "icon"){
                        $desc.find('.thumb').attr('src',path);
                    } else{
						let $pageitem = $desc.find('.pageitem');
						let $thumb = $desc.find(".thumb");
                        
						// if someone finds an unsupported file type I will kashoot myself
						if(["jpg","jpeg","jfif","pjpeg","pjp","png","svg","tif","tiff","webp","gif"]
							.includes(ext)){
							if(!$thumb.attr("src")) $thumb.attr('src',path);
                            $pageitem.append($('<img/>').attr('src',path))
						} else if(["txt", ""].includes(ext)) {
							$.get(path, function(text){
// 								console.log(text)
								if(text.startsWith('http://') || text.startsWith('https://')){
// 									console.log('link')
									let src = text.replace(/\s/g, "");
									let $frame = $('<iframe allow="fullscreen"/>');
									if(src.includes("youtube")){
// 										console.log('youtube')
										let id = src.split("?v=").slice(-1)[0]
										if(!$thumb.attr("src"))$thumb.attr("src","https://img.youtube.com/vi/"+id+"/default.jpg");
										$frame.attr("src","https://www.youtube.com/embed/"+id);
									} else if (src.includes("vimeo")){
// 										console.log('vimeo')
										let id = src.split("/").slice(-1)[0]
										$frame.attr("src","https://player.vimeo.com/video/"+id);
										if(!$thumb.attr("src")) $thumb.attr("src","playdefault.svg");
									} else {
										$frame.attr("src",src);
                                        if(!$thumb.attr("src")) $thumb.attr("src","linkdefault.svg");
									}
									let $fwrapper = $('<div/>').append($frame)
                                    $pageitem.append($fwrapper);
								} else {
									if(!$thumb.attr("src")) $thumb.attr("src","textdefault.svg");
									$plainitem = $('<p/>').text(text).addClass('plainitem');
                                    $desc.find('.pagecontent').append($plainitem);
								}
							});
						} else if(ext.toLowerCase() == 'pdf'){
                            let $frame = $('<iframe allow="fullscreen" allowfullscreen/>');
                            $frame.attr('src',path)
                            let $fwrapper = $('<div/>').append($frame)
                            $pageitem.append($fwrapper);
                            $pageitem.append($('<img src="fullscreen.svg" class="fscreen">').click(function(){
                                $frame.toggleClass('fscreenitem');
                            }));
                            if(!$thumb.attr("src")) $thumb.attr("src","pdfdefault.svg");
                        }
					}
				}
			});
		}
		$(".text").append(
			$('<p class="poemfooter"/>').text(poem.footer)
		);
		var $open;
		$(".stanz").click(function() {
// 			console.log('click');
			$("html, body").animate({
								scrollTop: $(this).offset().top-7
							}, 300);
			let $desc = $(this)
				.parent()
				.find(".desc");
			if ($open && $open[0] != $desc[0]) {
				$open.hide("slide", {
					
				});
			}
			$desc.toggle("slide", {
				direction: "left",
				complete: function() {
// 				console.log("toggled");
			}
		});
		if($open && $open[0] == $desc[0]){
			$open = undefined;
		} else {
			$open = $desc;
		}
		if($open){
			$(".main").addClass("side", 100);
		} else {
			$(".main").removeClass("side", 200);
		}
		});
		
	})
})
