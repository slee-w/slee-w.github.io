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

// Add scrolled class when scrolling in/out of a chart div

window.onscroll = function() {
	
	var divs = document.getElementsByClassName("chart");
	//console.log(divs);
	
	for(var i = 0; i < divs.length; i++) {
		if (window.scrollY > (document.getElementById(divs[i].id).getBoundingClientRect().top + window.pageYOffset - (window.innerHeight/3)) && window.scrollY <= (document.getElementById(divs[i].id).getBoundingClientRect().bottom + window.pageYOffset/* + (window.innerHeight/2)*/)) { 
			document.getElementById(divs[i].id).classList.add("scroll-active");
		}
		
		else { document.getElementById(divs[i].id).classList.remove("scroll-active"); };
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