define([], function() {
    return {
        init: function() {
            const $tel = $('.tel');
            const $password = $('.password');
            const $login = $('.login'); //登录按钮

            $login.on('click', function() {
                $.ajax({
                    type: 'post',
                    url: 'http://10.31.161.36/Gree%20Mall/php/login.php',
                    data: {
                        tel: $tel.val(),
                        pass: $password.val()
                    }
                }).done(function(data) {
                    if (!data) { //登录失败
                        alert('用户名或者密码有误!');
                        $password.val(''); //密码清空
                    } else { //登录成功
                        location.href = 'index1.html'; //前端和前端进行页面的通信，相对路径即可，如果是前后端的通信一定是觉对路径。
                        //存储用户名，方便首页获取。
                        localStorage.setItem('loginname', $tel.val());
                    }
                })
            });
        }
    }
})