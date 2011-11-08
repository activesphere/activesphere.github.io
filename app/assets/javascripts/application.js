// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
$(function() {
	$(".hover1").css("opacity","1.0"); // Default set opacity to 1.0

	// On Mouse over
	$(".hover1").hover( 
						function () {

									// SET OPACITY TO 15%
									$("span.hover2").stop().animate({opacity: 0.15}, 1200);
									},

									// ON MOUSE OUT
						function () {
							 
									// SET OPACITY BACK TO 100%
									$("span.hover2").stop().animate({opacity: 1.0}, 1200);
									}
					 );
			}
 );

