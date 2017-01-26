// Menu

function launchMenu() {
    var x = document.getElementById("navMenu");
    if (x.className === "topNav") {
		x.className += " responsive";
    } else {
		x.className = "topNav";
    }
}

function closeMenu() {
	var x = document.getElementById("navMenu");
	x.className = "topNav";
}

// initial scroll value

var lastScrollTop = window.scrollY || document.documentElement.scrollTop;

window.onscroll = function() {

	// Add scrolled class when scrolling in/out of a chart div

	var divs = document.getElementsByClassName("chart");

	for(var i = 0; i < divs.length; i++) {
		if ((window.scrollY || document.documentElement.scrollTop) > (document.getElementById(divs[i].id).getBoundingClientRect().top + window.pageYOffset - (window.innerHeight/3)) && (window.scrollY || document.documentElement.scrollTop) <= (document.getElementById(divs[i].id).getBoundingClientRect().bottom + window.pageYOffset/* + (window.innerHeight/2)*/)) {
			document.getElementById(divs[i].id).classList.add("scroll-active");
		}

		else { document.getElementById(divs[i].id).classList.remove("scroll-active"); };
	};

	// hide nav when scrolling downwards if nav is collapsed

	if (document.documentElement.clientWidth <= 800) {
		var st = window.pageYOffset || document.documentElement.scrollTop;

		if (st > lastScrollTop) {
			closeMenu();
			document.getElementById("navMenu").style.top = "-100%";
		}
		else {
			document.getElementById("navMenu").style.top = "";
		}
		lastScrollTop = st;
	};

};

// Smooth scrolling

$(document).ready(function(){
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

(jQuery);
