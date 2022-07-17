Web3 = require('web3');
fs= require('fs');
App={

 logArrIn:[],
  logArrOut:[],
  logCustoms:[],
  web3Provider: null,
  accounts:null,
  instance:{},
  fml_instance:{},
  contract_Addr:'0xaD4d8cAbb9D2C6B495Fb5EeFeEf871dE356c0ee7',
  contract_usdtd:'0xB8AfDC29EC2A48e253023384F2ee22874875448A',
  originalBlock:20964943,
  chainIdd:"0x61",
  ininWebs:async function (){

 if (typeof window.ethereum !== 'undefined'){
     if (window.ethereum){
       App.web3Provider = window.ethereum;
        App.accounts=  await ethereum.request({ method: 'eth_requestAccounts' });
        let chainIds=  await ethereum.request({ method: 'eth_chainId'});
     $("#chain").text(chainIds);
     $("#mon_main").text(App.accounts[0]+"USDT");

       ethereum.on('chainChanged',(chainID)=>{
       App.chainIdd=chainID;
      $("#chain").text(chainID);

   if (chainID!='0x61'){
     
     try {
          ethereum.request({
     method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x61' }],

     });
     window.location.reload();
     } catch(switchError) {
         if (switchError.code==4902) {

           ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
          {
            chainId: '0x61',
            chainName: 'BSC-TEST',
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] ,
          },
        ]
           });

         }
         console.log(e);
     }

    }
    window.location.reload();
    });

   web3=new Web3();
   web3.setProvider(App.web3Provider); 
     

      $.getJSON('./artifacts/test.json', function(data){
       App.instance = new web3.eth.Contract(data.abi,App.contract_Addr,{from:App.accounts[0]});
      });
         $.getJSON('./artifacts/fml.json',  function(data){
       App.fml_instance =  new web3.eth.Contract(data.abi,App.contract_usdtd,{from:App.accounts[0]});
      });
  }
    
    return App.initBingEvent(); 
   
  }

  },

//chain_select 
 initBingEvent: function (){

      $("ceshi09").on('click',  function () {
         
         alert("dianji");
          // App.chainIdd=chainID;
          $("#mon_main").text(App.accounts[0]+"USDT");
         // let mn= $('#sel4 option:selected').val()+"000000000000000000";
         // alert(mn);
         //  App.fml_instance.methods.approve(App.contract_Addr,mn).send({from:App.accounts[0]})
         //  .on('receipt',function(receipt){
         //   console.log(receipt); 
         //  })
      
      });
       $(".dropdown-item").on('click', function () {
       // let mn=$(this).find("img").attr("src");
       //   $("#img01").attr("src",mn);
       //   $("#dropdownMenuButton1").text($(this).text());
         alert("dianji");
    });

 }



}

/**
 * 
 *  公共函数
 **/ 
 function UpdateOutLog(x){
 for (let i = 0; i < x.length; i++){
if (!inArry(App.logArrOut,x[i].returnValues._time)){

       App.logArrOut.push(x[i]);
      var row= document.createElement('tr');
        $('#tables_in').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         c1.innerText =timeStampToTime(x[i].returnValues._time) ;
 c3.innerText = web3.utils.fromWei(x[i].returnValues._value,'ether')+"USDT";
         if (x[i].returnValues._type==1) {
            c2.innerText ="+:基本仓";
         }
         else if (x[i].returnValues._type==2) {
           c2.innerText ="+:基本仓";
         }
           else if (x[i].returnValues._type==3) {
           c2.innerText ="+:利润仓(3)";//管理员划拨
         }
           else if (x[i].returnValues._type==4) {
            c2.innerText ="+:推荐仓(4)";//管理员划拨
         }
           else if (x[i].returnValues._type==5) {
            c2.innerText ="-:基本仓";
         }
          else if (x[i].returnValues._type==6) {
            c2.innerText ="-:利润仓";
         }
         else if (x[i].returnValues._type==7) {
           c2.innerText ="-:推荐仓";
         }
         else if (x[i].returnValues._type==8) {
           c2.innerText ="+:基本仓(8)"; //管理员划拨
         }
          else if (x[i].returnValues._type==13) {
           c2.innerText ="+:推荐仓(13)";// 推荐返
         }
         else if (x[i].returnValues._type==14) {
           c2.innerText ="+:推荐仓(14)"; // 推荐返
         }
         else if (x[i].returnValues._type==15) {
           c2.innerText ="+:推荐仓(15)"; //充值返

         }
        c4.innerText =web3.utils.fromWei(x[i].returnValues.total_account,'ether')+"USDT";
      

}
 }

   }
   function UpdateInLog(x) {
       for ( let i= 0; i < x.length; i++){
       if (!inArry(App.logArrIn,x[i].returnValues._time)){
      App.logArrIn.push(x[i]);
      var row= document.createElement('tr');
        $('#tables_out').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         c1.innerText = timeStampToTime(x[i].returnValues._time) ;
         c2.innerText ="-"+ web3.utils.fromWei(x[i].returnValues._value,'ether')+"USDT";
         c3.innerText =web3.utils.fromWei(x[i].returnValues.total_account,'ether')+"USDT";

         if (x[i].returnValues.total_account==0) {
           c4.innerText =0;
         }else {
            c4.innerText = timeStampToTime(x[i].returnValues._limit_time);
         }
        
}
 }
   }

    async  function UpdateCustomLog() {
         let mn=0;
         App.instance.methods.get_Length_acters().call(function  (err,res) {
          mn=res;
          console.log(res);
              for ( let i= 1; i <= mn; i++){
          App.instance.methods.getAddrFromIndex(i).call(function  (err,res) {
           
             App.instance.methods.getActorAdmin(res).call(function  (err,res) {
             // 的手写一个 JS 数组 遍历函数
        var row= document.createElement('tr');
        $('#customs_table').append(row);  // jq 没有appendChild
         var c1= document.createElement('td');
         var c2= document.createElement('td');
         var c3= document.createElement('td');
         var c4= document.createElement('td');
          var c5= document.createElement('td');
         var c6= document.createElement('td');
         var c7= document.createElement('td');
         var c8= document.createElement('td');
          var c9= document.createElement('td');
         var c10= document.createElement('td');
         var c11= document.createElement('td');
         var c12= document.createElement('td');
         row.appendChild(c1);
         row.appendChild(c2);
         row.appendChild(c3);
         row.appendChild(c4);
         row.appendChild(c5);
         row.appendChild(c6);
         row.appendChild(c7);
         row.appendChild(c8);
         row.appendChild(c9);
         row.appendChild(c10);
         row.appendChild(c11);
         row.appendChild(c12);
         c1.innerText=res.name;
          c2.innerText=addr_Trans(res.sigin_addr);
           c3.innerText=addr_Trans(res.addr);
            c4.innerText=addr_Trans(res._mrAr);
            c5.innerText=addr_Trans(res._orr);
             c6.innerText=web3.utils.fromWei(res._baAt,'ether');
              c7.innerText=web3.utils.fromWei(res._ptAt,'ether');
               c8.innerText=web3.utils.fromWei(res._mAt,'ether');
                c9.innerText=res._mrCs;
                 c10.innerText=res._orCs;
                  c11.innerText=res.deep_level;
                   c12.innerText=res.team_number;

        });
          

        });
         

  
        };
        });
         
     

         }

   
  function  inArry(arry,search) {
       for(let i in arry){
             if(arry[i].returnValues._time==search){

                return true;
             }
         

       }
    } 




function timeStampToTime (timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate() ) : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    return M + D + h + m;
  }




  function updateSelInfor() {
           App.instance.methods.getSelfInfor().call(function (err,res) {
            console.log(res);
            $('#base_addr').text(addr_Trans(res[0]));
            $('#out_addr').val(addr_Trans(res[3]));
            $('#mem_addr').val(addr_Trans(res[4]));
            $('#name').val(res[1]);
            $('#classs').text(res[11]);
            $('#base_mon').text(web3.utils.fromWei(res[6],'ether'));
            $('#porfit_mon').text(web3.utils.fromWei(res[7],'ether'));
            $('#mem_mon').text(web3.utils.fromWei(res[8],'ether'));
            
     });
    }


function getBalanceOfMainOnly () {
         App.instance.methods.balanceOfFromFML(App.accounts[0]).call(function (err,res) {
       $("#usdt_cu").text(web3.utils.fromWei(res,'ether'));
       // let n= net_Ids.is
       // $("#chain").text( App.net_Names.App.chainIdd);
     });
}

   function getNotic () {
            App.instance.methods._notic().call(function (err,res) {
             $("#_notic").val(res);
          });
         
    
       }
       //字符串 截取函数，取前4位和 后4位，中间用3个小点
       function addr_Trans( str_in) {
       return str_in.slice(0,4)+"...."+str_in.slice(37,42);
       }

  $(function() {
  $(window).load(function() {
    App.ininWebs();
     });
});