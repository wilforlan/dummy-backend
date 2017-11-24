var PaginationUtil = {};
/**
 * This function accepts a callback to make the page fetch async
 *
 */
PaginationUtil.createPages = function(count, limit, fn) {
    limit = limit || 10;
    if (count <= limit) {
        fn([1]);
    } else {
        var page_index = (count / limit);
        var pages = [];
        for (var i = 0; i <= page_index; i++) {
            pages.push(i + 1);
        }
        fn(pages);
    }
}
module.exports = PaginationUtil;