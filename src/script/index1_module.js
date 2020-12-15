define(['jlazyload'], () => {
    return {
        init: function() {
            //渲染
            const $list = $('.floor_pro_r ul');
            $.ajax({
                url: 'http://10.31.161.36/Gree%20Mall/php/index1.php',
                dataType: 'json'
            }).done(function(data) {
                let $strhtml = '';
                $.each(data, function(index, value) {
                    $strhtml += `
                        <li>
                            <a href="detail.html?sid=${value.sid}">
                                <img class="lazy" data-original="${value.url}" width="200" height="200"/>
                                <p>${value.title}</p>
                                <span>${value.state}</span>
                                <em>￥${value.price}</em>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml);


                // 懒加载
                $("img.lazy").lazyload({ effect: "fadeIn" });
            });
        },
        // init1: function() {
        //     function scroll() {
        //         var top = $(window).scrollTop();
        //         top >= 1000 ? $('#leftBar').show() : $('#leftBar').hide();
        //         $('.floor').each(function(index, element) {
        //             var loutop = $(this).offset().top;
        //             if (loutop >= top) {
        //                 $('#leftBar li').removeClass('active');
        //                 $('#leftBar li').eq($(this).index()).addClass('active');
        //                 return false;
        //             }
        //         });
        //     }
        //     scroll();
        //     $(window).on('scroll', function() {
        //         scroll();
        //     });
        //     $('#leftBar li').on('click', function() {
        //         $(this).addClass('active').siblings().removeClass('active');
        //         var loutop = $('.floor').eq($(this).index()).offset().top;
        //         $('html').animate({
        //             scrollTop: loutop
        //         });
        //     })
        // }
    }
});


// 轮播图

! function($) {
    const $bannerbox = $('.banner_box'); // 外层大盒子
    const $banner = $('.banner'); // 轮播盒子
    const $piclist = $('.banner li'); // 2张轮播图
    const $btnlist = $('.dot li'); // 两个小圆点

    let $num = 0;
    let $timer = null;
    const $liwidth = $piclist.eq(0).width(); // 一张图片的长度。

    $banner.width($liwidth * $piclist.size()) //轮播盒子的长度

    // 点击小圆点让轮播盒子移动。显示对应图片。
    $btnlist.on('click', function() {
        $num = $(this).index();
        $btnlist.eq($num).addClass('active').siblings('li').removeClass('active');

        $banner.animate({
            left: -$liwidth * $num
        });

    });

    $bannerbox.hover(function() {
        clearInterval($timer);
    }, function() {
        $timer = setInterval(function() {
            $btnlist.click();
        }, 1000);
    });
    $timer = setInterval(function() {
        $btnlist.click();
    }, 1000);

}(jQuery);


//  楼梯导航
! function() {

    const stairway = $('#stairway'); // 楼梯盒子
    const louti = $('#stairway li'); // 7个li元素,楼梯。
    const floor = $('.floor'); // 运动的楼层

    function scroll() {
        let scrolltop = $(window).scrollTop(); //滚动条的top值
        scrolltop >= 1000 ? stairway.show() : stairway.hide();


        floor.each(function(index, element) {
            let floortop = $(element).offset().top; // 每个楼层的top值
            if (floortop >= scrolltop) {
                louti.removeClass('active');
                louti.eq(index).addClass('active');
                return false;
            }
        });
    }
    scroll();

    $(window).on('scroll', function() {
        scroll();
    });

    //   点击楼梯，让楼层运动到相应的位置
    louti.on('click', function() {
        $(window).off('scroll'); //点击楼梯时会一直触发激活状态，取消滚轮事件。
        $(this).addClass('active').siblings('li').removeClass('active'); // 当前点击的Li元素添加类。其余的移除。
        let floortop = floor.eq($(this).index()).offset().top; //每个楼层的top值。

        $('html').animate({ // 将楼层的top值给滚动条。
            scrollTop: floortop
        }, function() {
            $(window).on('scroll', function() {
                scroll();
            })
        });
    });
}(jQuery)