class StaticFun {
    //新窗口打开
    static newOpenWindow(url) {
        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('style', 'display:none');
        a.setAttribute('target', '_blank');
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
    }
}
export default StaticFun;