class Field{
    constructor(){
        this.field=[]
        
    }
    add(id,idBoton,fieldName,column){
        this.field.push({id:id,idBoton:idBoton,fieldName:fieldName,columnName:column})
    }
    getById(id){
        let obj;
        this.field.forEach(f=>{
            if(f.id==id){
                console.log("getById",id,f)
                obj=f;
            }
        })
        console.log("getById 2",id,obj)
        return obj;
    }
    getByName(name){
        let obj;
        this.field.forEach(f=>{
            if(f.fieldName==name){
                obj = f;
            }
        })
        return obj;
    }
}
class SortList{
    constructor(fields){
        this.sortArr=[]
        this.fieldObj=new Field();
        this.fieldObj=fields
    }
    addToList(id){
        let obj={}
        let tipo=""
        obj=this.fieldObj.getById(id);
        console.log("addToList",this.fieldObj,id);
        let btn=obj.idBoton;
        let pref="";
        if(document.getElementById(btn).innerHTML=="-") tipo="^";
        if(document.getElementById(btn).innerHTML=="^") {tipo="v";pref="-"}
        
        let field=obj.fieldName;
        let pos=-1;
        let pos1=-1;

        pos=this.sortArr.indexOf(field);
        pos1=this.sortArr.indexOf("-"+field);
        if(pos>=0 || pos1>=0){          // existe
            if(pos>=0) this.sortArr[pos]=pref+field;
            if(pos1>=0) this.sortArr[pos1]=pref+field;
        }else
            this.sortArr.push(pref+field);
        document.getElementById(btn).innerHTML=tipo;

    }
    clear(){
        this.sortArr.forEach( el=>{
            let id="";
            let nb;
            let obj;
            nb=el;
            if(el[0]=="-"){
                nb=el.substring(1);
            }
            obj=this.fieldObj.getByName(nb);
            id=obj.idBoton;


            document.getElementById(id).innerHTML="-";
        })
        this.sortArr=[];

    }
    restaurar(){
        let tipo="^"
        let obj;
        let obj1;
        let id;
        console.log("restaurar",this.sortArr);
        this.sortArr.forEach( el=>{
            let id="";

            let nb=el;
            let pref="";
            if(el[0]=="-"){
                nb=el.substring(1);
            }
            console.log("restaurar",this.fieldObj,el);
            obj=this.fieldObj.getByName(nb);


            if(el==obj.fieldName) id=obj.idBoton;
            if(el=="-"+obj.fieldName) {id=obj.idBoton;tipo="v";}

            document.getElementById(id).innerHTML=tipo;
        })
    }
}
class SorterTable{
    constructor(sortLst,tabla,funMostrar){
        this.sortList=sortLst;
        this.dataArr;
        this.fmostrar=funMostrar;
        this.tableName=tabla;
    }
    setData(data){
        this.dataArr=data
    }
    fieldSorter(fields) {
        return function (a, b) {
            return fields
                .map(function (o) {
                    var dir = 1;
                    if (o[0] === '-') {
                    dir = -1;
                    o=o.substring(1);
                    }
                    if (a[o] > b[o]) return dir;
                    if (a[o] < b[o]) return -(dir);
                    return 0;
                })
                .reduce(function firstNonZeroValue (p,n) {
                    return p ? p : n;
                }, 0);
        };
    }

    exec(){
        console.log("exec",this.dataArr)
        this.dataArr.sort(this.fieldSorter(this.sortList.sortArr));
        document.getElementById(this.tableName).innerHTML=this.fmostrar();
        this.sortList.restaurar()
    }

}