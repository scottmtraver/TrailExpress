$(document).foundation();

$(document).ready(function () {

  //bug fix
  $('.owl-carousel').owlCarousel({
    items: 1,
    itemsDesktop: false,
    itemsDesktopSmall: false,
    itemsTablet: false,
    itemsTabletSmall: false,
    itemsMobile: false,
    autoHeight: true,
    autoPlay: true
  });

  $('.date-slash').each(function (i, ele) {
    var formatted = moment(ele.innerHTML).utc().format('M/D/YYYY');
    ele.innerHTML = formatted;
  });
}); 
$('.date').each(function (i, ele) {
  var formatted = moment(ele.innerHTML).utc().format('dddd MMMM Do');
  ele.innerHTML = formatted;
});
$('.readmore-opener').click(function () {
  $('.readmore-mobile').addClass('open');
  $(this).hide();
});

// This code loads the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This code is called by the YouTube API to create the player object
function onYouTubeIframeAPIReady(event) {
  player = new YT.Player('youTubePlayer', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // do nothing, no tracking needed
}
function onPlayerStateChange(event) {
  // track when user clicks to Play
  if (event.data == YT.PlayerState.PLAYING) {
    _gaq.push(['_trackEvent', 'Videos', 'Play', 'Homepage Video']);
  }
}

//gallery code
if(Vue && document.getElementById('gallery')) {
  var page = 0;
  var pagesize = 1;
  var loading = true;
  var loadGallery = function () {
    $.get(
      //"http://localhost:3001/api/photos",
      "http://localhost:3001/api/photos?page[offset]=" + (page * pagesize) + "&page[limit]=" + pagesize,
      //{ page : page },
      function(images) {
        if(!images.data.length) {
          v.$broadcast('$InfiniteLoading:noMore');
          loading = false;
          return;
        }
        page++;
        images.data.forEach(function (image) {
          console.log(image.attributes.image_url)
          v.list.push({ url: image.attributes.image_url });
        });
        v.$broadcast('$InfiniteLoading:loaded');
      }
    );

  };
  var v = new Vue({
    el: '#gallery',
    data: {
      list: []
    },
    ready: function () {
    },
    methods: {
      onInfinite: function () {
        if(loading) {
          setTimeout(function () {
            loadGallery();
          }.bind(this), 500);
        }
      }
    }
  });
  loadGallery();
}

$(".is-future:first").addClass("first");