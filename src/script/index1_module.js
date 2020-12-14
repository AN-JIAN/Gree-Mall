define(['jlazyload'], () => {
    return {
        init: function() {
            //渲染+懒加载
            const $list = $('.render ul');
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
                                <span>￥${value.price}</span>
                                <em>已售：${value.salenum}</em>
                            </a>
                        </li>
                    `;
                });
                $list.html($strhtml);
                //渲染的下面进行懒加载操作
                $(function() { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //显示方法：谈入
                    });
                });
            });
        }
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

}(jQuery)