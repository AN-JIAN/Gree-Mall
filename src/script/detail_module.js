define(['jcookie'], () => {
    return {
        init: function() {
            //1.通过地址栏获取列表页面传入的sid。
            let $sid = location.search.substring(1).split('=')[1];
            if (!$sid) {
                $sid = 1;
            }

            //2.将sid传给后端，后端根据对应的sid返回不同的数据。
            $.ajax({
                url: 'http://10.31.161.36/Gree%20Mall/php/detail.php',
                data: {
                    sid: $sid
                },
                dataType: 'json'
            }).done(function(data) {
                $('.spic').attr('src', data.url);
                $('.loadtitle').html(data.title);
                $('.loadpcp').html(data.price);
                $('.bpic').attr('src', data.url);

                let $list = $('.list');
                let $picurl = data.urls.split(','); //将数据转换成数组。
                // console.log($picurl);
                let $strhtml = '<ul>';
                // let $strhtml = '';
                $.each($picurl, function(index, value) {
                    $strhtml += `<li><img src="${value}"/></li>`;
                });
                $strhtml += '<ul>';
                $list.html($strhtml);
            });

            //3.放大镜效果
            const $spic = $('.small'); //小图
            const $bpic = $('.bpic'); //大图
            const $sf = $('.zoom'); //小放
            const $bf = $('.bf'); //大放
            const $left = $('#arrow_l'); //左箭头
            const $right = $('#arrow_r'); //右箭头
            const $list = $('.list'); //小图列表


            // 小放/大放=小图/大图
            $sf.width($spic.width() * $bf.width() / $bpic.width());
            $sf.height($spic.height() * $bf.height() / $bpic.height());
            let $bili = $bpic.width() / $spic.width(); //比例大于1 放大效果
            $spic.hover(function() {
                $sf.css('visibility', 'visible');
                $bf.css('visibility', 'visible');
                $(this).on('mousemove', (ev) => {

                    let $leftvalue = ev.pageX - $(this).offset().left - $sf.width() / 2;
                    let $topvalue = ev.pageY - $('.middle').offset().top - $sf.height() / 2;
                    if ($leftvalue < 0) {
                        $leftvalue = 0;
                    } else if ($leftvalue >= $spic.width() - $sf.width()) {
                        $leftvalue = $spic.width() - $sf.width()
                    }

                    if ($topvalue < 0) {
                        $topvalue = 0;
                    } else if ($topvalue >= $spic.height() - $sf.height()) {
                        $topvalue = $spic.height() - $sf.height()
                    }

                    $sf.css({
                        left: $leftvalue,
                        top: $topvalue
                    });

                    $bpic.css({
                        left: -$leftvalue * $bili,
                        top: -$topvalue * $bili
                    });

                });
            }, function() {
                $sf.css('visibility', 'hidden');
                $bf.css('visibility', 'hidden');
            });


            //小图切换
            $('.list').on('click', 'li', function() {
                let $src = $(this).find('img').attr('src');
                $('.spic').attr('src', $src);
                $('.bpic').attr('src', $src);
            });


            //左右箭头事件
            let $num = 10; //列表显示的图片个数
            $right.on('click', 'li', function() {
                let $lists = $('.list ul li');
                console.log($lists);
                if ($lists.size() > $num) { //限制点击的条件
                    $num++;
                    $left.css('color', '#333');
                    if ($lists.size() == $num) {
                        $right.css('color', '#fff');
                    }
                    $('.list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });
            $left.on('click', function() {
                let $lists = $('.list ul  li');
                if ($num > 6) { //限制点击的条件
                    $num--;
                    $right.css('color', '#333');
                    if ($num <= 6) {
                        $left.css('color', '#fff');
                    }
                    $('.list ul').animate({
                        left: -($num - 6) * $lists.eq(0).outerWidth(true)
                    });
                }
            });


            //4.购物车：(商品sid、商品数量)
            //4.1设置存储cookie的变量,因为是多个商品，采用数组存储。
            let arrsid = []; //存储商品的sid
            let arrnum = []; //存储商品的数量

            //4.2核心是判断用户是第一次存储，多次存储。
            //如果是第一次存储，创建商品的列表显示在购物车列表页面。
            //如果是多次存储，购物车列表页面里面的商品数量累加。

            //如何判断是第一次还是第二次
            //通过获取cookie进行判断，每存储一个商品对应的商品编号存入cookie里面，cookie就会发生变化。如果cookie里面存在当前商品的编号，该商品不是第一次存储，直接数量累加。

            //提前预判cookie设置时的key值(cookiesid/cookienum)进行获取cookie
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    arrsid = $.cookie('cookiesid').split(',');
                    arrnum = $.cookie('cookienum').split(',');
                } else {
                    arrsid = [];
                    arrnum = [];
                }
            }
            //上面的函数获取cookie值，并且转换成数组，方便判断是否是第一次。
            //第一次存储添加sid进入arrsid，存储数量
            //第二次以上，直接修改数量。

            $('.p-btn a').on('click', function() {
                getcookietoarray(); //获取cookie，变成数组，判断是否存在。
                if ($.inArray($sid, arrsid) === -1) { //第一次添加商品
                    arrsid.push($sid); //添加sid
                    $.cookie('cookiesid', arrsid, { expires: 10, path: '/' });
                    arrnum.push($('#count').val()); //添加数量
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                } else { //多次添加，数量累加
                    //通过$sid获取商品的数量所在的位置。
                    let $index = $.inArray($sid, arrsid);
                    //原来的数量+新加的数量进行重新赋值，添加cookie
                    arrnum[$index] = parseInt(arrnum[$index]) + parseInt($('#count').val()); //重新赋值
                    $.cookie('cookienum', arrnum, { expires: 10, path: '/' });
                }
                alert('已加入购物车');
            });
        }
    }
});