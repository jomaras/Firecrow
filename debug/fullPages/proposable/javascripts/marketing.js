$(document).ready(function() {
  $('#new_account').submit(function() {
    if (($('#account_terms').is(':checked'))) {
      return true;
    } else {
      alert("You must agree to the Terms of Service");
      return false;
    }
  });

  $('#commit_yes').live('click', function() {
    var code = $('#plan_code').val();
    $('#subscription_plan_code').val(code);
    $('#edit_subscription_plan').submit();
    return false;
  });

  $('#commit_no').live('click', function() {
    $.facebox.close();
    return false;
  });

  $('a.changePlanFromTeam, a.changePlanFromProToBasic').facebox();

  $('.changePlanTrial, .changePlan').live('click', function() {
    var parent = $(this).parent();
    var className = parent.attr('class');
    parent.removeClass(className);
    parent.addClass(className + 'RO');
    $('#subscription_plan_code').val($(this).attr('rel'));
    $('#edit_subscription_plan').submit();
    return false;
  });
});

$(document).ready(function() {
  if ($.facebox) {
    $('.video').facebox();
  }
  $('#subscription_country').live('change', function() {
    $.get('/subcription/states', { country: $(this).val() }, function(r, s) {
      $('.subState').html(r);
    });
  });
});
