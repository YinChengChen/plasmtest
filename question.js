var dataurl = "http://localhost:3000/data";
loadData(dataurl).then(function (response) {
    var data = JSON.parse(response);
    /* initialize */
    // set chapter range
    var chapterList = new Set();
    var repeatList = new Set();
    data.forEach(element => {
        chapterList.has(element.chapter) ? repeatList.add(element.chapter) : chapterList.add(element.chapter);
    });
    // create option
    setChapterList(chapterList);

    /*Event*/
    // go to selection page
    var newGameButton = document.getElementById("new-game");
    newGameButton.addEventListener("click", event => {
        console.log("event", event);
        // close main page and set selection page
        var mainpage = document.getElementById("main-page");
        mainpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center d-none");
        var selectionpage = document.getElementById("selection-page");
        selectionpage.setAttribute("class", "row main-view mt-4 mr-1 ml-1 flex-column jusify-content-center");
    }, false);
    // go to the test page
    var startOption = document.getElementById("start-chapter");
    var endOption = document.getElementById("end-chapter");
    var numberInput = document.getElementById("question-number");
    var testButton = document.getElementById("test-start");
    testButton.addEventListener("click", event => {
        console.log("start ", startOption.value, "end ", endOption.value, numberInput.value);
        setTestList(data, parseInt(startOption.value), parseInt(endOption.value), parseInt(numberInput.value));
    });
});


// get Random list
function setTestList(data, startChapter, endChapter, number) {
    var selectionList = data.filter((element) => {
        return element.chapter >= startChapter && element.chapter <= endChapter;
    });
    var numberList = Object.values(selectionList).map(item => item.number);    
    // get Random number
    var randomList = getArrayItems(numberList, 4);    
}
// Get the chapter list
function setChapterList(data) {
    var startInput = document.getElementById("start-chapter");
    var endInput = document.getElementById("end-chapter");
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        startInput.appendChild(option);
    });
    data.forEach(element => {
        var option = document.createElement("OPTION");
        option.setAttribute("value", element);
        option.textContent = element;
        endInput.appendChild(option);
    });
}
function getArrayItems(arr, num) {
    //新建一個陣列,將傳入的陣列複製過來,用於運算,而不要直接操作傳入的陣列;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的數值項,儲存在此陣列
    var return_array = new Array();
    for (var i = 0; i < num; i++) {
        //判斷如果陣列還有可以取出的元素,以防下標越界
        if (temp_array.length > 0) {
            //在陣列中產生一個隨機索引
            var arrIndex = Math.floor(Math.random() * temp_array.length);
            //將此隨機索引的對應的陣列元素值複製出來
            return_array[i] = temp_array[arrIndex];
            //然後刪掉此索引的陣列元素,這時候temp_array變為新的陣列
            temp_array.splice(arrIndex, 1);
        } else {
            //陣列中資料項取完後,退出迴圈,比如陣列本來只有10項,但要求取出20項.
            break;
        }
    }
    return return_array;
}
// Not sure why this function is complex?
function loadData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(console.error("The data didn't load successfully."));
            }
        };
        xhr.onerror = function () {
            // xhr fails to begin with
            reject(console.error('There was a network error.'));
        };
        xhr.send();
    });
}