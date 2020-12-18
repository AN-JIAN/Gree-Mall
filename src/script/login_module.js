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
                    console.log(data);
                    if (!data) {
                        alert('用户名或者密码有误!');
                        $password.val('');
                    } else {
                        location.href = 'index.html';
                        localStorage.setItem('loginname', $tel.val());
                    }
                })
            });
        }
    }
})