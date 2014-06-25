var $commentCount = null;
var disqusEndpoint = "https://disqus.com/api/3.0/threads/details.jsonp?api_key=tIbSzEhGBE9NIptbnQWn4wy1gZ546CsQ2IHHtxJiYAceyyPoAkDkVnQfCifmCaQW&thread%3Aident="
var commentCount = null;
var disqus_config;
var disqus_shortname;
var disqus_identifier;
var startTime;
var endTime;

var getAuthCookie = function() {
    /*
    * Grabs the auth cookie.
    * Returns the results trimmed and URL-decoded.
    */

    // Get all cookies this domain can see.
    var allCookies = document.cookie.split(';');

    // Get our cookie, 'at,' and return it trimmed and deurlified.
    for (var i = 0; i < allCookies.length; i++) {

        // Our cookie is called 'at'. For some reason.
        if ($.trim(allCookies[i].split('=')[0]) == 'at') {

            // Send it out!
            return decodeURIComponent($.trim(allCookies[i].split('=')[1]));
        }
    }

    return null;
}

var parseAuthCookie = function() {
    /*
    * Parses the cookie out to an object.
    * Returns an object with the necessary auth components to renew a cookie.
    */
    var cookie = getAuthCookie();

    // If there's no cookie, return an empty object.
    if (!cookie) {
        return {};
    }

    // Our cookie data is a urlencoded string. So split on &'s.
    var data = cookie.split('&');
    var parsed = {};

    // Loop over the key/value pairs.
    for (pair in data) {

        // Split to keys and values.
        var bits = data[pair].split('=');
        var key = bits[0];
        var val = bits[1];

        // This is a great story. You should ask @onyxfish about it.
        if (key != 'email') {
            val = val.replace(/\+/g, " ");
        }

        // Decode the value, just in case.
        parsed[key] = decodeURIComponent(val);
    }

    return parsed;
}

var loadDisqusFrame = function() {
    /*
    * Writes the Disqus frame and sets some configuration.
    */

    // Get the auth bits from the cookie.
    var auth = parseAuthCookie();

    // If we've got our auth bits, set up a callback function.
    if (typeof auth['dt'] !== 'undefined') {

        // Hide the login bits.
        $('#login-overlay-link').hide();
        $('#logout-overlay-link').show();

        // Set up a callback function to use later. Apparently.
        disqus_config = function () {
            this.page.remote_auth_s3 = auth['dm'] + ' ' + auth['dh'] + ' ' + auth['dt'];
            this.page.api_key = 'K5ANvxVxS7meX7au7vJpUpqIgFqQcDBEH8q39Z8N750SFmBhaOLTsShueMWid956';

            this.callbacks.onNewComment = [
                function() { 
                    _gaq.push(['_trackEvent', APP_CONFIG.PROJECT_SLUG, 'new-comment']);
                    trackComment(); 
                }
            ];
        }
    }

    /*
    * The next lines of code are supplied by DISQUS for rendering their iframe (widget).
    * They suggest that we do not modify the code below here.
    * Seriously. Hands (and feet) off.
    */
    var dsq=document.createElement('script');dsq.type='text/javascript';dsq.async=true;
    dsq.src='//'+disqus_shortname+'.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(dsq);
}

var loadComments = function() {
    /*
    * Click handler for the show comments button.
    */
    // Doesn't load the Disqus frame (or check auth) until this is clicked.
    loadDisqusFrame();

    return false;
}

var renderCommentCount = function(data) {
    /*
    * Renders the comment count.
    */
    var thread = data.response;
    commentCount = thread.posts;

    $commentCount.text(commentCount);

    if (commentCount > 0) {
        $commentCount.addClass('has-comments');
    }

    if ( commentCount > 1) {
        $commentCount.next('.comment-label').text('Comments');
    }
}

var loadCommentCount = function() {
    /*
    * Loads the comment count from Disqus.
    * Calls renderCommentCount as a callback on success.
    */
    $.ajax({
        url: disqusEndpoint + APP_CONFIG.PROJECT_SLUG + "-" + APP_CONFIG.DISQUS_UUID + "&forum=" + disqus_shortname,
        dataType: "jsonp",
        success: renderCommentCount
    });
}

$(function() {
    // Set some global state.
    disqus_shortname = APP_CONFIG.DISQUS_SHORTNAME;
    disqus_identifier = APP_CONFIG.PROJECT_SLUG + '-' + APP_CONFIG.DISQUS_UUID;
});

