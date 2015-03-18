function initialize() {
	var mapCanvas = document.getElementById('map-canvas');
	var mapOptions = {
		center: new google.maps.LatLng(-33.8667, 151.2116),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(mapCanvas, mapOptions)
	var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-33.8667, 151.2116),
        map: map,
        title: 'Australia Luxury Yacht Club'
  });
}
google.maps.event.addDomListener(window, 'load', initialize);

$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviourg
            // get values from FORM
            var name = $("input#inputFullName").val();
            var email = $("input#inputEmail").val();
            var phone = $("input#inputPhoneNumber").val();
            var message = $("textarea#inputContent").val();
            //Compose message
            message = message + "\n\n\n" + "From: " + name + ".\n" + "Contact: " + phone + ".\n" + "Reply to: " + email;
            Parse.Cloud.run('sendEmail', {subject: "Shelf Enquiry Australia", message: message, receiver: "sk8tech@163.com"}, {
              success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("<strong>Thank you for your feedback! We will get back to you ASAP!</strong>");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function(error) {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $('#success > .alert-danger').append("<strong>Sorry " + firstName + "Oops, something went wrong. Sorry about this. Please try again later!(Error：" + error.message + ")");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});