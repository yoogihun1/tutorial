function carSearch(){

    $("#carSearch").on("click",function(e){
        var carNumber = $("#searchNumber").val();
        console.log(carNumber);
        infoRequest(carNumber);
    })

    $("#searchNumber").on("keyup",function (e){
        if(e.keyCode == 13){
            var carNumber = $("#searchNumber").val();
            console.log(carNumber);
            infoRequest(carNumber);
        }
    })


}

function infoRequest(carNumber){
        $.ajax({
            url: "/info",
            type: "GET",
            data: {carNumber:carNumber},
            contentType : "application/json; charset=UTF-8;",
            dataType:"text",
            async:false,
            success: function(data){
                $("#searchList").hide();
                data = JSON.parse(data);
                console.log(data);

                var html = ''
                for(var i=0; i<data.length; i++){
                    var totalPrice = 0;
                    html += '<tr>'
                    html += '<td style="display: none" class="searchData">'+data[i]['id']+'</td>'
                    html += '<td class="searchData">'+data[i]['createAt']+'</td>'
                    html += '<td class="searchData">'+data[i]['carNumber']+'</td>'
                    html += '<td class="searchData">'+data[i]['carName']+'</td>'
                    html += '<td class="searchData">'+parseInt(data[i]['carMeter']).toLocaleString('ko-KR')+'</td>'

                    html += '<td style="width:25%;" class="searchData">'
                    for(var j=0; j<data[i]['workList'].length; j++){
                        console.log(data[i]['workList'][j]);
                        if(data[i]['workList'][j]!=null){
                            html += '<span name="workName">'+data[i]['workList'][j]['workName']+': '+'</span>';
                            console.log(data[i]['workList'][j]['workPrice']);
                            if(data[i]['workList'][j]['workPrice'] == ''){
                                html += '<span name="workPrice">'+0+'원'+'</span>'+'<br/>';
                                totalPrice += 0;
                            }else{
                                html += '<span name="workPrice">'+parseInt(data[i]['workList'][j]['workPrice']).toLocaleString('ko-KR')+'원'+'</span>'+'<br/>';
                                totalPrice += parseInt(data[i]['workList'][j]['workPrice']);
                            }
                        }
                    }
                    html += '<td class="searchData">'
                    html +=     totalPrice.toLocaleString('ko-KR')+'원';

                    html += '</td>'
                    html += '</td>'


                    html += '<td>'+data[i]['description']+'</td>'
                    html += '<td><input type="button" name="infoModify" value="수정"></td>'
                    html += '<td><input type="button" name="infoDelete" value="삭제"></td>'
                    html += '</tr>'
                    $("#carDetail").empty();
                    $("#carDetail").append(html);
                    $("#searchList").fadeIn(350);
                    modify(carNumber);
                    carInfoDelete(carNumber);
                }
            },
            error: function(e){
                console.log(e);
            }
        });
}

function appendWork(){
    $("#appendWork").on('click',function(e){
        var html = '<input name="workName" style="" type="text" placeholder="작업 명">\n' +
            '                    <input name="workPrice" style="" type="number" placeholder="가격(반드시 숫자만 입력)">'


        $("#workInfo").append(html);
        $("#workInfo").find('input[name=workName]').last().hide();
        $("#workInfo").find('input[name=workPrice]').last().hide();

        $("#workInfo").find('input[name=workName]').last().fadeIn(1000);
        $("#workInfo").find('input[name=workPrice]').last().fadeIn(1000);
    })
}

function deleteWork(){
    $("#deleteWork").on('click',function(e){
        var workLength = $("#workInfo").children().length;
        if(workLength == 2){
            alert("1개는 필수입니다.");
        }else{
            $("#workInfo").find("input[name=workName]").last().remove();
            $("#workInfo").find("input[name=workPrice]").last().remove();
        }

    })
}

function createInfo(){
    $("#createInfo").on('click',function(e){
        var workDay = $("input[name=workDay]").val();
        var carNumber = $("input[name=carNumber]").val();
        var carName = $("input[name=carName]").val();
        var meter = $("input[name=meter]").val();
        var desc = $("input[name=desc]").val();
        var workList = [];
        var form = new FormData();

        var workListLen = $("#workInfo").children().length;
        workListLen = workListLen/2;
        for(var i=0; i<workListLen; i++){
            var workName = $('input[name=workName]').eq(i).val();
            var workPrice = $('input[name=workPrice]').eq(i).val();
            form = {
                "workName":workName,
                "workPrice":workPrice
            }
            workList.push(form);
        }

        form = {
            "workDay":workDay,
            "carNumber":carNumber,
            "carName":carName,
            "carMeter":meter,
            "workList":workList,
            "description":desc
        }
        console.log(form);
        createInfoRequest(form);
    })
}

function createInfoRequest(form){
    $.ajax({
        url: "/info",
        type: "POST",
        data: JSON.stringify(form),
        contentType : "application/json; charset=UTF-8;",
        dataType:"text",
        async:false,
        success: function(data){
            alert("차량정보 등록완료~!");
            $("input[name=workDay]").val('');
            $("input[name=carNumber]").val('');
            $("input[name=carName]").val('');
            $("input[name=meter]").val('');
            $("input[name=desc]").val('');

            $("#workInfo").empty();
            var html = '<input name="workName" style="" type="text" placeholder="작업 명">\n' +
                '                    <input name="workPrice" style="" type="number" placeholder="가격(반드시 숫자만 입력)">'
            $("#workInfo").append(html);

            location.reload();
        },
        error: function(e){
            console.log(e);
        }
    });
}

function carList(page,size){
    var totalList;

    $.ajax({
        url: "/listAll",
        type: "GET",
        data: {
            page:page,
            size:size,
            sort:'id,desc'
        },
        contentType : "application/json; charset=UTF-8;",
        dataType:"text",
        async:false,
        success: function(data){
            $("#allList").hide();
            data = JSON.parse(data);
            totalList = data['totalCount'];
            console.log(data);
            data = data['carInfoList'];
            $("#carList").empty();
            for(var i=0; i<totalList; i++){
                var html = '<tr>'
                    html += '<td style="width:15% font-size: 30px;" class="searchData">'+data[i]['createAt']+'</td>'
                    html += '<td style="width:50% font-size: 30px; text-decoration: underline; color: blue;" name="listCarNumber" class="searchData">'+data[i]['carNumber']+'</td>'
                    html += '<td style="width:35% font-size: 30px;" class="searchData">'+data[i]['carName']+'</td>'
                html += '</td>'
                $("#carList").append(html);
                $("#allList").fadeIn(350);
                carNumberClick(i);
            }
        },
        error: function(e){
            console.log(e);
        }
    });
    return totalList;
}



function carNumberClick(i){
    $('td[name=listCarNumber]').eq(i).on('click',function(e){
        var carNumber = $(this).text();
        infoRequest(carNumber);
        $('html, body').animate({
            scrollTop : 0
        }, 400)
    })
}

function paging(totalList,contentLength){
    for(var j=0; j<totalList/contentLength; j++){
        var html = '<span class="default" style="margin: 10px;">'+(j+1)+'</span>'
        $('div[name=paging]').append(html);
    }

    $('div[name=paging]').children().on('click',function(e){
        console.log($(this).text());
        var page = $(this).text();
        $('div[name=paging]').children().attr('class','default');
        $(this).attr('class','page');
        carList(page-1,contentLength);
    })
    $('div[name=paging]').children().eq(0).attr('class','page');
    $('#totalCar').text(' 총: '+totalList+'대');

}

function modify(carNumber){
    $('input[name=infoModify]').on('click',function(e){
        var modifyParentSelector = $(this).closest('tr').find('span[name=workName]').parent();
        var len = $(this).closest('tr').find('span[name=workName]').length;
        var workNameList = [];
        var workPriceList = [];
        for(var i=0; i<len; i++){
            var workName = $(this).closest('tr').find('span[name=workName]').eq(i).text();
            var workPrice = $(this).closest('tr').find('span[name=workPrice]').eq(i).text();
            workName = workName.replace(':','');
            workPrice = workPrice.replace('원','');
            workPrice = workPrice.replaceAll(',','');
            workNameList.push(workName);
            workPriceList.push(workPrice);
        }

        modifyParentSelector.empty();

        var html = '<input name="workName" style="" type="text" placeholder="작업 명">\n' +
            '                    <input name="workPrice" style="" type="number" placeholder="가격(반드시 숫자만 입력)">';
        for(var i=0; i<len; i++){
            modifyParentSelector.append(html)
            $(this).closest('tr').find('input[name=workName]').eq(i).val(workNameList[i]);
            $(this).closest('tr').find('input[name=workPrice]').eq(i).val(workPriceList[i]);
        }
        $('input[name=modifyWorkAppend]').show();



        modifyParentSelector.append('<input type="button" name="modifyComplete" value="저장">');
        modifyParentSelector.append('<input style="margin-left: 43%;" type="button", name="modifyWorkAppend" value="작업 추가">');
        modifyParentSelector.append('<input type="button", name="modifyWorkDelete" value="작업 삭제">');
        $('input[name=modifyWorkAppend]').on('click',function (e){
            modifyParentSelector.prepend(html);
        })
        $('input[name=modifyWorkDelete]').on('click',function (e){
            modifyParentSelector.find("input[name=workName]").first().remove();
            modifyParentSelector.find("input[name=workPrice]").first().remove();
        })

        var workList = [];

        $('input[name=modifyComplete]').on('click',function (e){
            var regex= /^[0-9]/g

            len = $(this).parent().find('input[name=workName]').length;
            for(var i=0; i<len; i++){
                var workName = $(this).closest('tr').find('input[name=workName]').eq(i).val();
                var workPrice = $(this).closest('tr').find('input[name=workPrice]').eq(i).val();
                form = {
                    "workName":workName,
                    "workPrice":workPrice
                }
                workList.push(form);
            }
            console.log(workList);
            form = {
                "id": $(this).closest('tr').children().first().text(),
                 "workList":workList
            }
            $.ajax({
                url: "/info",
                type: "PUT",
                data: JSON.stringify(form),
                contentType : "application/json; charset=UTF-8;",
                dataType:"text",
                async:false,
                success: function(data){
                    alert("수정 완료");
                    var page = $('.page').text();
                    setTimeout(function() {
                        infoRequest(carNumber);
                        carList(page-1,10);
                    }, 500);


                },
                error: function(e){
                    console.log(e);
                }
            });

        })
    });





}

function carInfoDelete(carNumber){
    $('input[name=infoDelete]').on('click',function(e){
        var result = confirm("정말 삭제 하시겠습니까?");
        if(result){
            var id = $(this).closest('tr').children().first().text();
            form ={
                "id":id
            }
            $.ajax({
                url: "/info",
                type: "DELETE",
                data: JSON.stringify(form),
                contentType : "application/json; charset=UTF-8;",
                dataType:"text",
                async:false,
                success: function(data){
                    var page = $('.page').text();
                    alert("삭제 완료!");
                    setTimeout(function() {
                        infoRequest(carNumber);
                        carList(page-1,10);
                    }, 500);

                },
                error: function(e){
                    console.log(e);
                }
            });
        }
    })
}

function init(contentLength){
    //차량 조회
    carSearch();
    //작업 내역 추가
    appendWork();
    //작업 내역 삭제
    deleteWork();
    //차량 정보 등록
    createInfo();
    //전체 차량 리스트
    var totalList = carList(0,10);
    paging(totalList,contentLength);

}