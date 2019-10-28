let height = window.innerHeight;
let mainheight;
$(function () {
    // grid
    mainheight = $('#overlay_panel').innerHeight();
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
        verticalMargin: 5,
        height: mainheight/30,
    };
    console.log(mainheight/30)
    $('#left_panel').gridstack(options);
    var grid = $('#left_panel').data('gridstack');
    $('.griditem').each((i,g)=>{
        grid.addWidget(g, 0, 0, 3, g.getAttribute('offset-height')||2, true);
    })

    $('#right_panel').gridstack(_.defaults({
        float: true
    }, options));

    // color panel -- https://www.cssscript.com/color-picker-pro/
    var mirror_light_color = new ColorPicker.TabPalette('#lightControl', {
        color: '#009de7',
        placement: 'left',
        anchor: {
            cssProperty: 'background'
        },
        history: {
            hidden: false, //  shows or hides history block
            colors: [] // ['red', 'green', 'rgba(255, 1, 128, 1)']
        }
        });
    mirror_light_color.on('change', function(color) {
        mainContent.style.setProperty('--light-color',color.hex)
    });

    // $('.colorpicker-theme').on('change', function () {
    //     var val = $(this).val();
    //     var style = '<link id="colorpicker-style" rel="stylesheet" href="' + val + '">';
    //     $('head').append(style);
    // });
});