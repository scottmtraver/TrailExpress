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

try {
  // This code loads the IFrame Player API code asynchronously
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
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
      ga('send', 'event', 'Videos', 'Play', 'Homepage Video');
    }
  }

} catch (e) {

}

//gallery code
if (Vue && document.getElementById('gallery')) {
  var page = 0;
  var pagesize = 10;
  var loading = true;
  var loadGallery = function () {
    $.get(
      "https://api.runontrails.com/api/photos?sort=-date&filter[is_active]=true&page[offset]=" + (page * pagesize) + "&page[limit]=" + pagesize,
      //"http://localhost:3001/api/photos?sort=-date&page[offset]=" + (page * pagesize) + "&page[limit]=" + pagesize,
      function (images) {
        if (!images.data.length) {
          v.$broadcast('$InfiniteLoading:noMore');
          loading = false;
          return;
        }
        page++;
        images.data.forEach(function (image) {
          var baseUrl = image.attributes.image_url; 
          var formatUrl = baseUrl.split('upload/').join('upload/c_scale,w_' + 500 + '/');
          var hqUrl = baseUrl.split('upload/').join('upload/c_scale,w_' + 1200 + '/');
          v.list.push({ url: formatUrl, hqurl: hqUrl });
        });
        v.$broadcast('$InfiniteLoading:loaded');
      }
    );

  };
  var v = new Vue({
    el: '#gallery',
    data: {
      list: [],
      share: function (item) {
        ga('send', 'event', 'Pictures', 'Share', 'Share Photo');
        //FB SHARE
        FB.ui({
          method: 'share_open_graph',
          action_type: 'og.shares',
          action_properties: JSON.stringify({
            object: {
              'og:title': 'Wasatch Trail Series',
              'og:image': item.hqurl
            }
          })
        });
      }
    },
    ready: function () {
    },
    methods: {
      onInfinite: function () {
        if (loading) {
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