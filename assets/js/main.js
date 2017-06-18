//本来想用Vue的但是之前没有接触过加上这次写主题时间紧 所以还是用回了jQ
//Vue，我们下一个项目见！

//各种变量定义区

//这段我是直接抄的，别吐槽我
var month=new Array(12)
month[0]="January"
month[1]="February"
month[2]="March"
month[3]="April"
month[4]="May"
month[5]="June"
month[6]="July"
month[7]="August"
month[8]="September"
month[9]="October"
month[10]="November"
month[11]="December"
var Template_Right='<div class="page-content shadow-in"><div class="post"><div class="container"><a class="_post_link"><div class="_cover"><div class="_img"></div></div></a><div class="_head"><div class="_post_info"><div class="_line"></div><a class="_post_link"><div class="_title"></div></a><div class="_description"><img class="user-avatar-small" align="center">&nbsp;&nbsp;&nbsp;<span id="post_author"></span></div></div><div class="_post_actions"><a class="_post_action_btn_father"><div class="_post_action_btn _like_btn"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;<span class="likeNum"></span><br>资瓷</div></a><br id="_post_action_br"><a class="_post_action_btn_father"><div class="_post_action_btn _comment_btn"><i class="fa fa-comment-o" aria-hidden="true"></i>&nbsp;<span class="commentNum"></span><br>批判一番</div></a></div></div><div class="_content"><div class="_text"></div></div><div class="_continue"><i class="fa fa-comment-o" aria-hidden="true"></i></div><div class="_date"><span class="_day"></span><br><div class="_month"></div></div></div></div></div>';
var Template_Left='<div class="page-content shadow-in"><div class="post"><div class="container"><a class="_post_link"><div class="_cover _cover-right"><div class="_img"></div></div></a><div class="_head" style="float:right"><div class="_post_info"><a class="_post_link"><div class="_title"></div></a><div class="_description"><img class="user-avatar-small" align="center">&nbsp;&nbsp;&nbsp;<span id="post_author"></span></div><div class="_line" style="margin-right:10px"></div></div><div class="_post_actions"><a class="_post_action_btn_father"><div class="_post_action_btn _like_btn"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>&nbsp;<span class="likeNum"></span><br>资瓷</div></a><br id="_post_action_br"><a class="_post_action_btn_father"><div class="_post_action_btn _comment_btn"><i class="fa fa-comment-o" aria-hidden="true"></i>&nbsp;<span class="commentNum"></span><br>批判一番</div></a></div></div><div class="_content" style="margin:0 135px 0 0;"><div class="_text"></div></div><div class="_continue"><i class="fa fa-comment-o" aria-hidden="true"></i></div><div class="_date _date-right"><span class="_day"></span><br><div class="_month"></div></div></div></div>';
var Template_Continue='<div class="_continue"><i class="fa fa-angle-down" aria-hidden="true"></i></div>';
var authors=Array();
var coverCount=0;


//自动运行区

    setTimeout(function(){
        cleanLoader();
    },3000); //最多显示3s加载动画，让人以为最多花了3s


//

function addPost(data,template,lazyload=false){
    var PostElement=$(template);
    PostElement.find('._title').text(data.title);
    if(data.image!=null){
        //如果没有则保留原有默认cover
        PostElement.find('._img').attr("style","background-image: url(" + data.image + ")");
    }
    if(typeof authors[data.author] == "undefined"){
        var postid=data.id;
        $.ajax({
            url:ghost.url.api('users/' + data.author),type:'GET',async:false,timeout:5000,dataType:'json',
            success:function(data,textStatus,jqXHR){
                authors[data.users[0].id]=data;
                PostElement.find('#post_author').text(data.users[0].name);
                PostElement.find('.user-avatar-small').attr('src',data.users[0].image);
            },
            error:function(xhr,textStatus){
                alert('加载失败');
            }
        });
    }else{
        PostElement.find('#post_author').text(authors[data.author].users[0].name);
        PostElement.find('.user-avatar-small').attr('src',authors[data.author].users[0].image);
    }
    PostElement.find(".likeNum").text(data.like);
    PostElement.find("._post_link").attr('href',data.url);
    //Post LazyLoad Support
    var PostHTML=$(data.html);
    if(lazyload){
        PostHTML.find('img').each(function(){
        $(this).attr('data-original',$(this).attr('src'));
        $(this).attr('src','');
        $(this).addClass('post_lazyload_img');
        });
    }
    PostElement.find("._text").append(PostHTML);
    PostElement.find(".post").attr("id","post-" + data.id);
    PostElement.find("._like_btn").attr("onclick","likeUp(" + data.cid + ")");
    PostElement.find("._comment_btn").attr("onclick","loadDuoshuo(" + data.id + ")");
    PostElement.find("._continue").attr("onclick","loadDuoshuo(" + data.id + ")");
    //格式化日期时间
    var d=new Date(data.published_at);
    PostElement.find("._day").html(d.getDate());
    PostElement.find("._month").html(month[d.getMonth()]);
    //加载TAGS
    for(tagid in data.tags){
        PostElement.find("._tags").append($('<span class="tags_text"></span>').text(" #" + data.tags[tagid].name));
    }
    $("#post_list").append(PostElement.clone());
}

function likeUp(cid){
    $.ajax({
        url:apiurl + "?api=like&cid=" + cid,
        type:'GET',
        async:true,    //或false,是否异步
        data:{
            //并不需要请求数据
        },
        timeout:5000,    //超时时间
        dataType:'text',    //返回的数据格式：json/xml/html/script/jsonp/text
        success:function(data,textStatus,jqXHR){
            //+1s
            $('#post-' + cid).find('.likeNum').text(data);
            $('#post-' + cid).find('._like_btn').attr("onclick","alert('你已经点过赞了哦')");
        },
        error:function(xhr,textStatus){
            alert('请求失败');
        }
    })
}

function loadDuoshuo(cid){
}

function loadMorePage(page){
    $("._continue").hide();
    setLoader();
    $.ajax({
        url:ghost.url.api('posts',{limit: 5,page:page}),
        type:'GET',
        async:true,    //或false,是否异步
        data:{
            //并不需要请求数据
        },
        timeout:5000,    //超时时间
        dataType:'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success:function(data,textStatus,jqXHR){
            //Ghost版本的博客信息直接渲染
            //循环添加文章列表
            for(var pid in data.posts){
                var post=data.posts[pid];
                (pid%2==0) ? addPost(post,Template_Right) : addPost(post,Template_Left);
            }
			//分析分页信息看看还有没有多的
            if(data.meta.pagination.page < data.meta.pagination.pages){
                //显示加载更多
                var ContinueElement=$(Template_Continue);
                ContinueElement.attr('onclick','loadMorePage(' + (parseInt(data.meta.pagination.page) + 1) + ')');
                $("#post_list").find('.post:last').append(ContinueElement);
            }
            cleanLoader();
        },
        error:function(xhr,textStatus){
            alert('加载失败');
            cleanLoader();
        }
    })
}

function cleanLoader(){
    $('.loader').attr('style','opacity:0;')
    setTimeout(function(){
        $('.loader').hide();
    },500); 
}
function setLoader(){
    $('.loader').show;
    $('.loader').attr('style','opacity:1;')
}
$(window).load(function(){
    cleanLoader();
});