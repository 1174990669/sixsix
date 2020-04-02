class BaseClass{
    constructor(select,options){
        this.name = '';
        this.select = select;
        this.options = Object.assign({},options);
    }
    init(){

    }
    initEvent(){

    }
}
class A extends BaseClass{
    constructor(...arg){
        super(...arg);
    }
}
export default BaseClass;