let height = window.innerHeight;
let mainheight;
$(function () {
    mainheight = $('#mainContent').innerHeight();
    d3.select('.menu-open').on('change',function(){
        d3.select('.menu').classed('active',$(this).prop('checked'));
    });
    var options = {
        width: 3,
        float: true,
        removable: '.trash',
        removeTimeout: 100,
        acceptWidgets: '.grid-stack-item',
        cellHeight: 30,
        height: mainheight/30,
    };
    $('#left_panel').gridstack(options);
    var grid = $('#left_panel').data('gridstack');
    grid.addWidget($('.griditem'), 0, 0, 3, 2, true);

    $('#right_panel').gridstack(_.defaults({
        float: true
    }, options));
});