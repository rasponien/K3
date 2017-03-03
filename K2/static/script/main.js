$(document).ready(function () {
    $("#filterForm").submit(filterInput);
});

function filterInput(event) {
    event.preventDefault();
    var filterText = $('#filterText').val();
    $.get('/textFiltering', {filterText : filterText})
        .done(function (data) {
            var selectKeywordBox = $("#selectKeywordBox");
            selectKeywordBox.html('');
            data = JSON.parse(data);
            $.each(data, function (index, obj) {
                selectKeywordBox.append($("<option></option>").val(index).html(obj.keyword));
            });
    });


    //
    //var filterText = $('#filterText').val();
    //$.ajax({
    //    type: 'GET',
    //    url: '/textFiltering',
    //    data: { filterText : filterText },
    //    dataType: 'json'
    //}).done(function (data) {
    //    console.log(data[0]);
    //    var selectBox = $("#selectKeywordBox");
    //    addToSelect(1, "tere");
    //    $("ul").append('<li><a href="/user/messages"><span class="tab">Message Center</span></a></li>');
    //    //console.log(selectBox);
    //    //$.each(data, function(val, text) {
    //    //    console.log($("<option></option>").val(val).html(text.keyword));
    //    //    selectBox.append($('<option/>', {
    //    //        value: 1,
    //    //        text : "tere"
    //    //    }));
    //    //})
    //})
}

//Animations - fade effect
$("#fadeInTextBox").click(function () {
    $("#fadeInText").fadeIn(1000, function () {
        $("#fadeInText").fadeOut(1000);
    });
});
//Animations - animate
$("#animationButton").mouseenter(function () {
    $("#animationButton").animate({
        width: "500px",
        height: "100px",
        fontSize: "30px"
    });
});
$("#animationButton").mouseleave(function () {
    $("#animationButton").animate({
        width: "130px",
        height: "100px",
        fontSize: "15px"
    });
});

