define(['jcookie'], () => {
    return {
        init: function() {
            // 1.获取cookie - 主要是来自于详情页。
            function getcookietoarray() {
                if ($.cookie('cookiesid') && $.cookie('cookienum')) {
                    let $arrsid = $.cookie('cookiesid').split(','); //[1,2] 
                    let $arrnum = $.cookie('cookienum').split(','); //[10,20] 
                    $.each($arrsid, function(index, value) {
                        rendergoods($arrsid[index], $arrnum[index]); //index:数组的索引
                    });
                }
            }
            getcookietoarray();

            // 2.渲染购物车列表(隐藏一块布局，对隐藏的进行克隆，传值)
            function rendergoods(sid, num) { //sid:商品的编号    num:商品的数量
                $.ajax({
                    url: 'http://10.31.161.36/Gree%20Mall/php/alldata.php',
                    dataType: 'json'
                }).done(function(data) {
                    console.log(data);
                    $.each(data, function(index, value) {
                        if (sid === value.sid) { //确定当前的数据。克隆隐藏的盒子，进行赋值
                            let $clonebox = $('.goods-item:hidden').clone(true, true); //克隆
                            $clonebox.find('.goods-pic img').attr('src', value.url);
                            $clonebox.find('.goods-d-info a').html(value.title);
                            $clonebox.find('.b-price strong').html(value.price);
                            $clonebox.find('.quantity-form input').val(num);
                            $clonebox.find('.b-sum strong').html((value.price * num).toFixed(2)); //计算小计
                            $clonebox.css('display', 'block');
                            $('.item-list').append($clonebox);
                            calcprice(); //计算总价
                        }
                    });
                });
            }

            // 3.计算总价和总的商品件数 - 单独计算，不同的地方进行调用。
            // 核心：可视的visible  选中的
            // each():jquery遍历元素对象   $.each():遍历数组和对象的
            function calcprice() {
                let $sum = 0; //商品的件数
                let $count = 0; //商品的总价
                $('.goods-item:visible').each(function(index, ele) {
                    if ($(ele).find('.cart-checkbox input').prop('checked')) { //复选框是否勾选
                        $sum += parseInt($(ele).find('.quantity-form input').val());
                        $count += parseFloat($(ele).find('.b-sum strong').html());
                    }
                });
                //赋值
                $('.amount-sum').find('em').html($sum);
                $('.totalprice').html($count.toFixed(2));
            }

            // 4.全选 - 事件委托。

            $('.allsel').on('click', function() {
                $('.goods-item:visible').find(':checkbox').prop('checked', $(this).prop('checked')); //将全选的值给下面的几个input
                $('.allsel').prop('checked', $(this).prop('checked')); //将自己的值赋值给自己。2个allsel复选框
                calcprice(); //计算总价
            });

            //获取克隆的商品列表里面的checkbox,添加事件
            //克隆的商品列表里面：选中的复选框的长度等于存在的复选框的长度
            let $inputs = $('.goods-item:visible').find(':checkbox'); //查找复选框
            $('.item-list').on('click', $inputs, function() {
                //$(this):被委托的元素，checkbox
                if ($('.goods-item:visible').find(':checkbox').length === $('.goods-item:visible').find('input:checked').size()) {
                    $('.allsel').prop('checked', true);
                } else {
                    $('.allsel').prop('checked', false);
                }
                calcprice(); //计算总价
            });
        }
    }
});