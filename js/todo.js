/* global $ */
$( "a.hovertrigger" ).hover(
  function() {
    console.log(this);
    $( this ).append( $( "<span><i class='fa fa-times' ></i></span>" ) );
  }, function() {
    $( this ).find( "span:last" ).remove();
  }
);