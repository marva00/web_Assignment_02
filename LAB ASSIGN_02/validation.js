$(document).ready(function() {
    // --- Element Selections ---
    const form = $('#checkout-form');
    const placeOrderBtn = $('#placeOrderBtn');
    const termsCheck = $('#termsCheck');
    const termsFeedback = $('#terms-feedback');
    const creditCardDetails = $('#credit-card-details');

    // --- Helper function to manage validation states ---
    function setValidationState(element, isValid) {
        if (isValid) {
            element.removeClass('is-invalid').addClass('is-valid');
        } else {
            element.removeClass('is-valid').addClass('is-invalid');
        }
    }

    // --- Validation Functions ---
    function validateFullName() {
        const input = $('#fullName');
        const isValid = input.val().trim().length >= 3;
        setValidationState(input, isValid);
        return isValid;
    }

    function validateEmail() {
        const input = $('#email');
        // A common and reasonably effective regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.val().trim());
        setValidationState(input, isValid);
        return isValid;
    }

    function validatePhone() {
        const input = $('#phone');
        // Matches digits only, at least 10
        const phoneRegex = /^\d{10,}$/;
        const isValid = phoneRegex.test(input.val().replace(/\D/g, '')); // Remove non-digits before testing
        setValidationState(input, isValid);
        return isValid;
    }
    
    function validateRequired(selector) {
        const input = $(selector);
        const isValid = input.val().trim() !== "";
        setValidationState(input, isValid);
        return isValid;
    }

    function validatePostalCode() {
        const input = $('#zip');
        // Matches numeric only, length between 4 and 6
        const postalRegex = /^\d{4,6}$/;
        const isValid = postalRegex.test(input.val().trim());
        setValidationState(input, isValid);
        return isValid;
    }
    
    function validateCountry() {
        const input = $('#country');
        const isValid = input.val() !== "";
        setValidationState(input, isValid);
        return isValid;
    }

    function validateCreditCardFields() {
        let allValid = true;
        // Only validate if the credit card radio is checked
        if ($('#credit').is(':checked')) {
            creditCardDetails.find('input[required]').each(function() {
                 if (!validateRequired(this)) {
                     allValid = false;
                 }
            });
        }
        return allValid;
    }

    // --- Real-time Validation Event Listeners ---
    $('#fullName').on('input', validateFullName);
    $('#email').on('input', validateEmail);
    $('#phone').on('input', validatePhone);
    $('#address').on('input', () => validateRequired('#address'));
    $('#city').on('input', () => validateRequired('#city'));
    $('#zip').on('input', validatePostalCode);
    $('#country').on('change', validateCountry);
    creditCardDetails.find('input[required]').on('input', function() {
        validateRequired(this);
    });

    // --- Payment Method Logic ---
    $('input[name="paymentMethod"]').on('change', function() {
        if ($('#credit').is(':checked')) {
            creditCardDetails.slideDown();
            creditCardDetails.find('input').prop('required', true);
        } else {
            creditCardDetails.slideUp();
            creditCardDetails.find('input').prop('required', false).removeClass('is-invalid is-valid');
        }
    });

    // --- Terms and Conditions Checkbox Logic ---
    termsCheck.on('change', function() {
        placeOrderBtn.prop('disabled', !this.checked);
        if(this.checked){
            termsFeedback.hide();
            termsCheck.removeClass('is-invalid');
        }
    });

    // --- Master Form Submission Handler ---
    placeOrderBtn.on('click', function(event) {
        event.preventDefault(); // Prevent default button action

        // Run all validations to get their current state
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isAddressValid = validateRequired('#address');
        const isCityValid = validateRequired('#city');
        const isCountryValid = validateCountry();
        const isZipValid = validatePostalCode();
        const areCardFieldsValid = validateCreditCardFields();
        const isTermsChecked = termsCheck.is(':checked');

        // Show terms error if not checked
        if (!isTermsChecked) {
            termsFeedback.show();
            termsCheck.addClass('is-invalid');
        }

        // Check if the entire form is valid
        if (isFullNameValid && isEmailValid && isPhoneValid && isAddressValid && 
            isCityValid && isCountryValid && isZipValid && areCardFieldsValid && isTermsChecked) {
            
            // On success, you would typically submit the form or make an AJAX call.
            // For this lab, we'll just show an alert.
            alert('Form is valid! Order Placed Successfully!');
            // To truly submit after validation, you would use: form.submit();
        } else {
            // If the form is invalid, find the first field with an error and scroll to it.
            const firstError = $('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    // Scroll to the top of the element, minus 100px for header clearance
                    scrollTop: firstError.offset().top - 100 
                }, 500);
            }
        }
    });
});