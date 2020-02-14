---
title: LoggedIn
metadata:
    description: LoggedIn.
    author: Brian Onang'o
---

#### LoggedIn

<script src="{{config.base_url}}/themes/default/lib/jquery/dist/jquery.min.js"></script>


$(document).ready(function () {
    let redirectTo = 
    if (!localStorage.getItem("token")) $("#headerLinks").prepend(
    '<li><a class="loginbtn" href="/login">Log in</a></li>')
    $(document).on("click", "a.loginbtn", function (e) {
    e.preventDefault()
    localStorage.setItem("returnafterlogin", window.location.href);
    alert('log in...'+window.location.href)
    window.location =  $(this).attr('href');
    });
})