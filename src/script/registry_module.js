define([], function() {
    return {
        init: function() {
            // 表单验证
            // 获取元素
            let $form = $('#form1'); // 表单
            let $tel = $('.tel'); // 手机号
            let $password = $('.password'); // 密码
            let $sure = $('.sure'); // 确认密码
            let $message = $('#form1 p'); // 提示信息


            // 定义检测标记
            $telflag = true;
            $passflag = true;
            $sureflag = true;



            // 手机号码验证：
            $tel.on('focus', function() {
                $message.eq(0).html('请输入手机号码');
            });
            $tel.on('blur', function() {
                // console.log(1);
                let $value = $(this).val(); // 当前表单的值
                // console.log($value);
                if ($value !== '') {
                    let $reg = /^1[3|5|6|7|8]\d{9}$/;
                    if ($reg.test($value)) {
                        $message.eq(0).html('√').css('color', 'green');
                        $telflag = true;

                        $.ajax({
                            type: 'post',
                            url: 'http://10.31.161.36/Gree%20Mall/php/reg.php',
                            data: {
                                tel: $tel.val()
                            }
                        }).done(function(data) {
                            if (!data) {
                                $message.eq(0).html('√').css('color', 'green');
                                $telflag = true;
                            } else {
                                $message.eq(0).html('该用户已存在').css('color', 'red');
                                $telflag = false;
                            }
                        });
                    } else {
                        $message.eq(0).html('格式有误').css('color', 'red');
                        $telflag = false;
                    }

                } else {
                    $message.eq(0).html('手机号不能为空');
                    $telflag = false;
                }
            });


            // 密码验证

            $password.on('focus', function() {
                $message.eq(1).html('请输入密码，6-20位字符，由数字、字母、下划线组成');
            });

            $password.on('blur', function() {
                let $value = $(this).val();
                if ($value !== '') {
                    let $regpassword = /^[a-z0-9_-]{6,18}$/;
                    if ($regpassword.test($value)) {
                        $.ajax({
                            type: 'post',
                            url: 'http://10.31.161.36/Gree%20Mall/php/reg.php',
                            data: {
                                tel: $tel.val(),
                                password: $password.val()
                            }
                        }).done(function(data) {
                            if (!data) {
                                $message.eq(1).html('√').css('color', 'green');
                                $passflag = true;
                            } else {
                                $message.eq(1).html('密码格式有误').css('color', 'red');
                                $passflag = false;
                            }
                        })

                    } else {
                        $message.eq(1).html('密码格式有误，请从新输入').css('color', 'red');
                        $passflag = false;
                    }
                } else {
                    $message.eq(1).html('密码不能为空');
                    $passflag = false;
                }
            })


            // 确认密码

            $sure.on('focus', function() {
                $message.eq(2).html('请再次输入密码')
            });

            $sure.on('blur', function() {
                if ($sure.val() !== '') {
                    if ($sure.val() === $password.val()) {
                        $message.eq(2).html('√').css('color', 'green');
                        $sureflag = true;
                    } else {
                        $message.eq(2).html('你输入的密码不一致').css('color', 'red');
                        $sureflag = false;
                    }
                } else {
                    $message.eq(2).html('请确认密码再试');
                    $sureflag = false;
                }
            });






            //   阻止表单跳转
            $form.on('submit', function() {
                if ($tel.val() === '') {
                    // $message.eq(0).html('手机号不能为空').css('color', 'red');
                    $message.eq(0).html('手机号码不能为空');
                    $telflag = false;
                }

                if ($password.val() === '') {
                    // $message.eq(1).html('请输入密码').css('color', 'red');
                    $message.eq(1).html('密码不能为空');
                    $passflag = false;
                }

                if ($sure.val() === '') {
                    // $message.eq(2).html('您输入的密码不一致').css('color', 'red');
                    $message.eq(2).html('请验证密码');
                    $sureflag = false;
                }
                if (!$telflag || !$passflag || !$sureflag) {
                    return false;
                }

            })
        }
    }
})