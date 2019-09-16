$(() => {
  // hidden thread id for localStorage
  let id = [];

  // hides hidden thread on load
  if (localStorage.hidden) {
    id = localStorage.hidden.split(",");
    id.map(href => {
      $("tbody a").each(function() {
        if ($(this).attr("href") == href) {
          $(this)
            .parents("tr")
            .hide();
        }
      });
    });

    $(".threads-hidden")
      .removeClass("fade")
      .children()
      .text(`Show ${id.length} hidden rows`);
  }

  // ui hover
  $(document).on(
    "mouseenter mouseleave",
    "#table-threads tbody button",
    function() {
      $(this)
        .children()
        .toggleClass("fa-eye-slash");
    }
  );

  // hide threads
  $(document).on("click", "#table-threads button .fa-eye", function() {
    $(this)
      .parents("tr")
      .hide();
    let hidden = parseInt($(".threads-hidden a").attr("data-count"));
    hidden++;
    $(".threads-hidden a").attr("data-count", hidden);

    id.push(
      $(this)
        .parents("tr")
        .find("a")
        .attr("href")
    );

    $(".threads-hidden")
      .removeClass("fade")
      .children()
      .text(`Show ${id.length} hidden rows`);

    localStorage.setItem("hidden", id);
  });

  // show threads
  $(document).on("click", ".threads-hidden a", function() {
    $(this)
      .parent()
      .addClass("fade");
    $(".threads-hidden a").attr("data-count", "0");
    $("tbody tr:not(.thread-info").show();
    id = [];
    localStorage.clear();
  });

  // table search
  $(document).on("keyup", "#table-threads-search", function(e) {
    $(this)
      .parent("tr")
      .hide();
    let query = $(this).val();

    $("tbody tr td").each(function() {
      let contents = $(this)
        .text()
        .toLocaleLowerCase();

      if (query.length < 3) {
        $("tbody tr td > *").css("background-color", "transparent");
        $("tbody tr:not(.thread-info)").show();
        return false;
      }

      let filter = $(this)
        .text()
        .toLocaleLowerCase();

      if (filter.indexOf(query) !== -1 ) {
        $(this)
          .parent("tr:not(.thread-info)")
          .show();
        $(this)
          .children()
          .css("background-color", "yellow");
        return false;
      } else {
        $(this)
          .parent("tr")
          .hide();
      }
    });
  });

  // expand new div for thread details
  $(document).on("click", ".thread-title", function(e) {
    e.preventDefault();
    $('.thread-info').not(this).hide()
    $(this).parents('tr').next('.thread-info').slideToggle();
  });

  $(document).on("click", ".thread-info #thread-info-close", function() {
    $(this).parent().hide();
  });
});
