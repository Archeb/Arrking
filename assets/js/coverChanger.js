//CoverChanger.JS By Archeb 2017.03
//自动切换封面/背景图片并显示进度条

//Require:JQuery Jquery.Preload(已内置)

//JQ Preload (https://github.com/htmlhero/jQuery.preload)
!function(a){a.preload=function(){var b=[],c=function(a){for(var c=0;c<b.length;c++)if(b[c].src===a.src)return b[c];return b.push(a),a},d=function(a,b,c){"function"==typeof b&&b.call(a,c)};return function(b,e,f){if("undefined"!=typeof b){"string"==typeof b&&(b=[b]),2===arguments.length&&"function"==typeof e&&(f=e,e=0);var g,h=b.length;if(e>0&&h>e&&(g=b.slice(e,h),b=b.slice(0,e),h=b.length),!h)return d(b,f,!0),void 0;for(var i,j=arguments.callee,k=0,l=function(){k++,k===h&&(d(b,f,!g),j(g,e,f))},m=0;m<b.length;m++)i=new Image,i.src=b[m],i=c(i),i.complete?l():a(i).on("load error",l)}}}();var b=function(b,c){var d,e,f,g,h,i=[],j=new RegExp("url\\(['\"]?([^\"')]*)['\"]?\\)","i");return c.recursive&&(b=b.find("*").add(b)),b.each(function(){for(d=a(this),e=d.css("background-image")+","+d.css("border-image-source"),e=e.split(","),h=0;h<e.length;h++)f=e[h],-1===f.indexOf("about:blank")&&-1===f.indexOf("data:image")&&(g=j.exec(f),g&&i.push(g[1]));"IMG"===this.nodeName&&i.push(this.src)}),i};a.fn.preload=function(){var c,d;1===arguments.length?"object"==typeof arguments[0]?c=arguments[0]:d=arguments[0]:arguments.length>1&&(c=arguments[0],d=arguments[1]),c=a.extend({recursive:!0,part:0},c);var e=this,f=b(e,c);return a.preload(f,c.part,function(a){a&&"function"==typeof d&&d.call(e.get())}),this}}(jQuery);

var LoopTime=7000; //轮换时间(ms)
var Covers=Array(
    '/content/images/2017/03/Konachan.com---237061-animal-bandage-brown_hair-cape-cat-chomusuke-dress-gloves-haribote_-tarao--hat-megumin-short_hair-thighhighs-witch_hat.jpg',
    'https://o2hr9ra03.qnssl.com/2.jpg',
    '/content/images/2017/03/megumin_2.jpg',
    'https://qwq.moe/content/images/2017/03/miku_2--1-.jpg',
    '/content/images/2017/02/cover_r.jpg'); //封面图片列表(URL)
    
var Progress=0;
var nowTime=0;
var ImgID=0;

//初始随机显示封面
var ImgID=Math.floor(Math.random()*(Covers.length-0)+0);
$('#CoverImg').css('background-image','url(' + Covers[ImgID] + ')');

//Preload
setTimeout(function() {
    $.each(Covers, function(i,value){ 
        $.preload(value); 
    }); 
}, 3000);

//加载计时器

setInterval(function(){
    nowTime+=100;
    Progress=nowTime / LoopTime * 100;
    $('#ProgressBar').css('width',Progress + "vw");
    if(Progress >= 100){
        (ImgID >= (Covers.length -1 )) ? ImgID=0 : ImgID++;
        //午时已到
        $('#CoverImg').css('background-image','url(' + Covers[ImgID] + ')');
        nowTime=0;
        Progress=0;
    }
},100);