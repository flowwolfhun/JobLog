(function ($) {
    jQuery.fn.extend({
        postsync: function (url, data, success) {
            let _data = null;
            let _success = null;
            if (success) {
                _data = data;
                _success = success;
            }
            else {
                _success = data;
            }
            $.ajax({
                type: 'POST',
                url: url,
                data: _data,
                async: false,
                success: function (data) {
                    _success(data);
                }
            });
            return this;
        }
    });
    jQuery.extend(
        jQuery.expr[":"],
        {
            reallyvisible: function (a) {
                return jQuery(a).is(':visible') && $(a).parents().filter(function () {
                    return $(this).css('visibility') === 'hidden';
                }).length === 0;
            }
        }
    );
})(jQuery);