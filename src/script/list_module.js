define(['jlazyload', 'pagination'], () => {
    return {
        init: function() {

            const $list = $('.pro_list ul');
            let $array_default = []; //排序前的li放入此数组。
            let $array = []; //排序后的数组
            let $prev = []; //li里面的商品的前一个价格
            let $next = []; //li里面的商品的后一个价格

            $.ajax({
                url: 'http://10.31.161.36/Gree%20Mall/php/list.php',
                dataType: 'json'
            }).done(function(datalist) {
                // console.log(datalist);
                data = datalist.pagedata;
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


                //图片懒加载
                $("img.lazy").lazyload({ effect: "fadeIn" });


                //将li元素添加到排序前的数组中。
                $('.pro_list li').each(function(index, element) { //element:原生的元素对象
                    $array_default[index] = $(this); //排序前
                    $array[index] = $(this); //排序后
                });



                //2.分页设置
                $('.page').pagination({
                    pageCount: datalist.pageno, //总的页数
                    jump: true, //是否开启跳转到指定的页数，布尔值。
                    prevContent: '上一页', //将图标改成上一页下一页。
                    nextContent: '下一页',
                    callback: function(api) {
                        console.log(api.getCurrent()); //获取当前的点击的页码。
                        $.ajax({
                            url: 'http://10.31.161.36/Gree%20Mall/php/list.php',
                            data: {
                                page: api.getCurrent()
                            },
                            dataType: 'json'
                        }).done(function(datalist) {
                            data = datalist.pagedata; //获取接口里面数据
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

                            //懒加载
                            $("img.lazy").lazyload({ effect: "fadeIn" });

                            //将li元素添加到排序前的数组中。
                            $('.pro_list li').each(function(index, element) { //element:原生的元素对象
                                $array_default[index] = $(this); //排序前
                                $array[index] = $(this); //排序后
                            });
                            console.log($array_default);
                        });
                    }
                });

                //3.点击按钮进行排序

                // 默认排序
                $(' .sort button').eq(0).on('click', function() {
                    //遍历渲染。
                    $.each($array_default, function(index, value) { //value就是li元素
                        $list.append(value);
                    });
                });


                // 升序排序
                $(' .sort button').eq(1).on('click', function() {
                    for (let i = 0; i < $array.length - 1; i++) {
                        for (let j = 0; j < $array.length - i - 1; j++) {
                            $prev = parseFloat($array[j].find('span').html().substring(1)); //上一个价格
                            $next = parseFloat($array[j + 1].find('span').html().substring(1)); //下一个价格
                            if ($prev > $next) {
                                //通过价格的比较,交换的是里面的这个li元素
                                let temp = $array[j];
                                $array[j] = $array[j + 1];
                                $array[j + 1] = temp;
                            }
                        }
                    }

                    //遍历渲染。
                    $.each($array, function(index, value) { //value就是li元素
                        $list.append(value);
                    });
                });


                // 降序排序
                $(' .sort button').eq(2).on('click', function() {
                    for (let i = 0; i < $array.length - 1; i++) {
                        for (let j = 0; j < $array.length - i - 1; j++) {
                            $prev = parseFloat($array[j].find('span').html().substring(1));
                            $next = parseFloat($array[j + 1].find('span').html().substring(1));
                            if ($prev < $next) {

                                let temp = $array[j];
                                $array[j] = $array[j + 1];
                                $array[j + 1] = temp;
                            }
                        }
                    }
                    //遍历渲染。
                    $.each($array, function(index, value) {
                        $list.append(value);
                    });
                });


            });
        }
    }
});