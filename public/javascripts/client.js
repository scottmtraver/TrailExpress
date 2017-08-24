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
  // https://developers.google.com/youtube/iframe_api_reference
  // This code loads the IFrame Player API code asynchronously
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Homepage video tracking
  function onPlayerStateChange(event) {
    // track when user clicks to Play
    if (event.data == YT.PlayerState.PLAYING) {
      // ga('send', 'event', 'Videos', 'Play', 'Homepage Video');
    }
  }

  // campaign video tracking
  var tracked = false;
  function campaignStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      // add tracking here
      // ga('send', 'event', 'Videos', 'Play', 'Campaign Video');
    }

    if (event.data == YT.PlayerState.ENDED) {
      // reveal bib entry modal
      $('#campaign-video-modal').hide();
      $('#campaign-entry-modal').show();
    }
  }

  // This code is called by the YouTube API to create the player object
  //    after the API code downloads.
  var player, campaign;
  function onYouTubeIframeAPIReady() {
    // check if there is an element with homepage player id
    var pageVid = $('#page-video').val();
    if (pageVid) {
      player = new YT.Player('homepage-iframe', {
        height: '390',
        width: '640',
        // TODO SMT somehow inject video id and store video id in database
        videoId: pageVid,
        events: {
          'onReady': function () { },//noop
          'onStateChange': onPlayerStateChange
        }
      });
    }

    var vid = $('#campaign-video').val();
    if (vid) {
      campaign = new YT.Player('homepage-campaign', {
        height: '390',
        width: '640',
        videoId: $('#campaign-video').val(),
        playerVars: {
          controls: 0,
          disablekb: 1,
          autoPlay: 0
        },
        events: {
          'onReady': function () { },//noop
          'onStateChange': campaignStateChange
        }
      });
      //campaign
      $('.close').click(function () {
        $('#campaign-video-modal').hide();
        $('#campaign-entry-modal').hide();
        $('#campaign-success-modal').hide();
      });


      //initial show
      // cookie logic!
      $('#campaign-video-modal').show();

      $('#submit-campaign').click(function () {
        var inputs = $('.campaign-input').toArray().map(function (ele, i) { return $(ele).val(); });
        if (inputs[0] && inputs[1]) {
          $('.campaign-error').hide()
          $('#campaign-entry-modal').hide();
          $('#campaign-success-modal').show();
          //post here

          var now = new moment();
          $.ajax({
            type: "POST",
            url: "http://localhost:3001/api/centry",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify({
              data: {
                attributes: {
                  bib: $('#bib-input').val(),
                  name: $('#lname-input').val(),
                  added: now.format('YYYY MM DD')
                },
                type: "centry",
                relationships: {
                  campaign: {
                    data: {
                      type: "campaigns",
                      id: "1"
                    }
                  }
                }
              }
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              //google analytics here
              // ga('send', 'event', 'Campaign', 'Play', 'Campaign Video');

            },
            failure: function (errMsg) {
              console.log('failure to post centry')
            }
          });

          setTimeout(function () {
            $('#campaign-success-modal').hide();
          }, 3000)
          // post inputs to api
        } else {
          $('.campaign-error').show()
        }
      });
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
          var formatUrl = image.attributes.image_url;
          formatUrl = formatUrl.split('upload/').join('upload/c_scale,w_' + 350 + '/');
          v.list.push({ url: formatUrl });
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
              'og:image': item.url
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