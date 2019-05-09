$(document).ready(function(){
    
    $('#logout').hide();
    // $('#signupform').hide();
    $('#login').click(function(){
        
        var password = document.getElementById('password').value;
        var email = document.getElementById('email').value;
        $.ajax({
            type: 'GET',
            url : "http://localhost:5000/user/login/"+email,
            dataType: 'json',
            contentType: 'application/json',
            // data : JSON.stringify(values),
            beforeSend: function(xhr){
                console.log("waiting");
            },
            success: function(data){
                console.log(data);
                if(data['success']){
                    pass2 = data['password']
                    if(password==atob(pass2)){
                        sessionStorage.setItem("username", email);
                        sessionStorage.setItem("password", pass2);
                        console.log('login successful');
                        display();
                        $('error').html('');
                    }
                    else{
                        $('#error').html('Please Enter Correct Password');
                    }
                }
                else{
                    $('#error').html('Please Enter Correct Password');
                }
            },
            complete: function(xhr){
                // print(xhr);
            }
            
        });
    });
    $('#delete').click(function(){
        // var password = document.getElementById('password').value;
        // var email = document.getElementById('email').value;
        $.ajax({
            type: 'DELETE',
            url : "http://localhost:5000/user/delete/"+sessionStorage.getItem('username'),
            dataType: 'json',
            contentType: 'application/json',
            data : { 
                        "username" : sessionStorage.getItem('username'),
                        "password" : sessionStorage.getItem('password')
            },
            // data : JSON.stringify(values),

            beforeSend: function(xhr){
                // xhr.setRequestHeader("Authorization", "Basic "+btoa(
                //     sessionStorage.getItem('username') + ":" + sessionStorage.getItem('password')
                // ));
            },
            success: function(data){
                console.log(data);
                console.log("deleted");
                removeItems();
            },
            complete: function(xhr){
                // print(xhr);
            }
            
        });
    });
    $('#logout').click(function(){
        removeItems();
        location.reload();
    });
    $('#booking').click(function(){
        email = sessionStorage.getItem('username');
        packageId = document.getElementById('packageId').value;
        $.ajax({
            type: 'POST',
            url : "http://localhost:5000/user/add/",
            dataType: 'json',
            contentType: 'application/json',
            data : JSON.stringify({"email":email, "package_id":packageId}),
            beforeSend: function(xhr){
                console.log("waiting");
            },
            success: function(data){
                if(data['success']){
                    console.log('booking successful');
                }
            },
            complete: function(xhr){
                // print(xhr);
            }
        });
    });
    $.ajax({
            type: 'GET',
            url : "http://localhost:5000/package/display/",
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function(xhr){
                console.log("waiting");
            },
            success: function(data){
                console.log(data);
                console.log(data.length);
                for(var i=0; i<data.length-1 && i<4; i++){
                    var sports = data[i]['sports'].split(",");
                    console.log(data[i]['valid_upto']);
                var txt = '<div class="col-1-of-4">'+
                       '<div class="card">'+
                           '<div class="card__side card__side--front">'+
                                '<div class="card__picture card__picture--1">'+
                                    '&nbsp;'+
                                '</div>'+
                                '<h4 class="card__heading">'+
                                    '<span class="card__heading-span card__heading-span--1">'+data[i]['name']+'</span>'+
                                '</h4>'+
                                '<div class="card__details">'+
                                    '<ul>'+
                                        '<li>'+sports[0]+'</li>'+
                                        '<li>'+sports[1]+'</li>'+
                                        '<li>'+sports[2]+'</li>'+
                                        '<li>'+sports[3]+'</li>'+
                        
                                        '</ul>'+
                                '</div>'+
                           '</div>'+
                           '<div class="card__side card__side--back card__side--back-1">'+
                                '<div class="card__cta">'+
                                    '<div class="card__price-box">'+
                                        '<p class="card__price-only">Only</p>'+
                                        '<p class="card__price-only">Valid Upto '+ data[i]['valid_upto']+' Months</p>'+
                                        '<p class="card__price-value">'+data[i]['price']+'&#8377;</p>'+
                                    '</div>'+
                                    '<a id='+data[i]['id']+'href="#" class="btn btn--white">Book now!</a>'+
                                '</div>'+
                            '</div>'+
                       '</div>'+
                    '</div>';
                    $('#packages').append(txt);

                }




            },
            complete: function(xhr){
                // print(xhr);
            }

    });
    $('#dicoverall').click(function(){
        $('#dicoverall').hide();
        $.ajax({
            type: 'GET',
            url : "http://localhost:5000/package/display/",
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function(xhr){
                console.log("waiting");
            },
            success: function(data){
                console.log(data);
                console.log(data.length);
                for(var i=4; i<data.length-1; i++){
                    var sports = data[i]['sports'].split(",");
                    console.log(data[i]['valid_upto']);
                var txt = '<div class="col-1-of-4">'+
                       '<div class="card">'+
                           '<div class="card__side card__side--front">'+
                                '<div class="card__picture card__picture--1">'+
                                    '&nbsp;'+
                                '</div>'+
                                '<h4 class="card__heading">'+
                                    '<span class="card__heading-span card__heading-span--1">'+data[i]['name']+'</span>'+
                                '</h4>'+
                                '<div class="card__details">'+
                                    '<ul>'+
                                        '<li>'+sports[0]+'</li>'+
                                        '<li>'+sports[1]+'</li>'+
                                        '<li>'+sports[2]+'</li>'+
                                        '<li>'+sports[3]+'</li>'+
                        
                                        '</ul>'+
                                '</div>'+
                           '</div>'+
                           '<div class="card__side card__side--back card__side--back-1">'+
                                '<div class="card__cta">'+
                                    '<div class="card__price-box">'+
                                        '<p class="card__price-only">Only</p>'+
                                        '<p class="card__price-only">Valid Upto '+ data[i]['valid_upto']+' Months</p>'+
                                        '<p class="card__price-value">'+data[i]['price']+'&#8377;</p>'+
                                    '</div>'+
                                    '<a id='+data[i]['id']+'href="#" class="btn btn--white">Book now!</a>'+
                                '</div>'+
                            '</div>'+
                       '</div>'+
                    '</div>';
                    $('#packages').append(txt);

                }




            },
            complete: function(xhr){
                // print(xhr);
            }

    });
     
        
    });
    
    if(sessionStorage.getItem("username")!==undefined){
        $('#loginname').html('Welcome , '+sessionStorage.getItem('name').toUpperCase()).css({"color" : "white", "font-size" : "16px"});
        $('#login').hide();
        $('#logout').show();
        $('#signup').hide();

    }
    
});
$('#signup').click(function(){
    $('#signupform').show();
    $('#loginform').hide();
});
function display(){
    // $('#login').hide();
    // $('#signup').hide();
    email = sessionStorage.getItem('username');
    // password = sessionStorage.getItem('password');
    $.ajax({
        type: 'GET',
        url : "http://localhost:5000/user/display/"+email,
        dataType: 'json',
        contentType: 'application/json',
        // data : JSON.stringify({"email":email, "package_id":packageId}),
        beforeSend: function(xhr){
            console.log("waiting");
        },
        success: function(data){
            console.log(data);
            if(data['success']){
                name = data['name'];
                age = data['age'];
                address = data['address']
                pic = data['pic_url']
                mobile = data['mobile']
                sessionStorage.setItem('name', name);
                sessionStorage.setItem('age', age);
                sessionStorage.setItem('address', address);
                sessionStorage.setItem('pic_url', pic);
                sessionStorage.setItem('mobile', mobile);
            }
        },
        complete: function(xhr){
            // print(xhr);
            location.reload();
        }
    });
}
function removeItems(){
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('age');
    sessionStorage.removeItem('address');
    sessionStorage.removeItem('pic_url');
    sessionStorage.removeItem('mobile');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    $('#login').show();
    $('#signup').show();
    $('#logout').hide();
    // location.reload();
}
$('#registration').click(function(){
    var name = document.getElementById('rname').value;
    var age = document.getElementById('rage').value;
    var password = document.getElementById('rpassword').value;
    var cpassword = document.getElementById('rcpassword').value;
    console.log(name);
    if(password != cpassword){
        alert('password doesn\'t match');
        return;
    }
    var email = document.getElementById('remail').value;
    var secret = document.getElementById('rsecretkey').value;
    var pic = 'http://samplepic.com';
    var address = document.getElementById('raddress').value;
    var mobile = document.getElementById('rmobile').value;
    var values = {
            "name" : name,
            "age" : age,
            "password" : btoa(password),
            "email": email,
            "type" : "U",
            "address": address,
            "mobile": mobile,
            "security_question": secret,
            "pic": pic
        };
    $.ajax({
        type: 'POST',
        url : "http://localhost:5000/user/add/",
        dataType: 'json',
        contentType: 'application/json',
        data : JSON.stringify(values),
        beforeSend: function(xhr){
            // alert("waiting");
            console.log("waiting");
        },
        success: function(data){
            console.log(data);
            if(data['success']){
                sessionStorage.setItem("username", email);
                sessionStorage.setItem("password", btoa(password));
                console.log(data);
                display();
            }
        },
        complete: function(xhr){
            // print(xhr);
        }
        
    });
});